import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// API endpoint for AI Pharmacy Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, currentMedicineContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format. Must be an array of chat messages." });
    }

    let ai;
    try {
      ai = getAIClient();
    } catch (apiKeyError: any) {
      // Elegant user-facing fallback if Gemini Key is not set up
      return res.json({
        role: "model",
        content: "⚠️ **Developer Note:** The `GEMINI_API_KEY` is not set in your environment variables. Please add your key in the AI Studio Secrets panel. \n\n*In the meantime, here is a simulated pharmacy response:* \n\nBased on your query, paracetamol is a common analgesic and antipyretic. For general storage, keep it in a cool, dry place below 25°C, away from direct sunlight and moisture. Standard dosage for adults is 500mg to 1000mg every 4 to 6 hours as needed, not exceeding 4000mg in 24 hours. Always check with a certified pharmacist or doctor before taking or prescribing medications."
      });
    }

    // Format chat conversation for Gemini
    // We can inject a strict system instruction to guide the model
    const systemInstruction = `You are a helpful, professional, and friendly AI Pharmacy Assistant for MediStock.
Your job is to answer ONLY pharmacy-related, medicine-related, pharmaceutical-store, or healthcare-related questions.
Examples of acceptable topics:
- Explaining a medicine (mechanism of action, active ingredients, generic alternatives).
- Suggesting proper medicine storage conditions.
- Providing patient counselling points (when to take, food interactions).
- Summarizing common side effects.
- Explaining dosage instructions in simple language.
- General pharmacy operations or drug class queries.

CRITICAL INSTRUCTION:
If the user's query is NOT related to pharmacy, medicines, pharmacology, health, store inventory, or pharmacy operations, you MUST politely and friendly decline to answer. For example, say: "I am your MediStock Pharmacy Assistant, so I can only answer pharmacy-related or medical queries. Please feel free to ask me about medicines, dosages, storage, or patient counselling!"

Keep answers concise, clear, and medically accurate. Always include a short, standard medical disclaimer at the very end of clinical advice advising patients to consult their doctor.

Current Medicine Selection Context (if user has opened or is viewing a specific medicine in the UI):
${currentMedicineContext ? JSON.stringify(currentMedicineContext) : "No specific medicine selected."}`;

    // Map conversation array to content parts
    const chatContents = messages.map((m: any) => ({
      role: m.role === "model" ? "model" as const : "user" as const,
      parts: [{ text: m.content }]
    }));

    // Use gemini-2.5-flash for excellent, speedy pharmacy chat assistance
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high precision clinical/pharmaceutical facts
      }
    });

    const replyText = response.text || "I apologize, but I was unable to generate a response. Please try again.";

    res.json({
      role: "model",
      content: replyText
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Failed to communicate with AI Assistant", 
      details: error.message 
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
