import { GoogleGenAI } from "@google/genai";

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: any, res: any) {
  // Handle CORS if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, currentMedicineContext } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format. Must be an array of chat messages." });
    }

    let ai: GoogleGenAI;
    try {
      ai = getAIClient();
    } catch (apiKeyError: any) {
      // User-facing guidance if Gemini Key is not configured
      return res.status(200).json({
        role: "model",
        content: "⚠️ **GEMINI_API_KEY Required**\n\nThe `GEMINI_API_KEY` environment variable is not set.\n\n### How to configure API Key in Vercel:\n\n1. Open your project dashboard on **Vercel** → **Settings** → **Environment Variables**.\n2. Add a new variable:\n   - **Key:** `GEMINI_API_KEY` \n   - **Value:** Your Google Gemini API Key\n3. Save and **Redeploy** your project.\n\n---\n*In the meantime, here is a general pharmacy clinical summary:* \n\nParacetamol (Acetaminophen) is a widely used OTC analgesic and antipyretic. Store in a cool, dry place below 25°C. Standard adult dosage is 500mg to 1000mg every 4 to 6 hours as needed (maximum 4000mg per 24 hours). Always consult a certified pharmacist or physician before taking medications."
      });
    }

    // Format chat conversation for Gemini
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
If the user's query is NOT related to pharmacy, medicines, pharmacology, health, store inventory, or pharmacy operations, you MUST politely decline to answer. Say: "I am your MediStock Pharmacy Assistant, so I can only answer pharmacy-related or medical queries. Please feel free to ask me about medicines, dosages, storage, or patient counselling!"

Keep answers concise, clear, and medically accurate. Always include a short, standard medical disclaimer at the very end of clinical advice advising patients to consult their doctor.

Current Medicine Selection Context (if user has opened or is viewing a specific medicine in the UI):
${currentMedicineContext ? JSON.stringify(currentMedicineContext) : "No specific medicine selected."}`;

    // Map conversation array to content parts
    const chatContents = messages.map((m: any) => ({
      role: m.role === "model" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }]
    }));

    // Use gemini-3.6-flash for fast, accurate pharmacy assistance
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    const replyText = response.text || "I apologize, but I was unable to generate a response. Please try again.";

    return res.status(200).json({
      role: "model",
      content: replyText
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with AI Assistant", 
      details: error.message || String(error)
    });
  }
}
