import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import NodeCache from "node-cache";

dotenv.config();
const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5 min cache time

const HF_API_KEY = process.env.HF_API_KEY;

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // ✅ Pehle cache check karo
    if (cache.has(message)) {
      console.log("Cache hit!");
      return res.json({ reply: cache.get(message) });
    }

    console.log("Fetching from API...");
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", // ✅ Faster model
      {
        inputs: message,
        parameters: {
          max_length: 50, // ✅ Short & precise response
          temperature: 0.3, // ✅ Less randomness
          top_p: 0.8, // ✅ Balanced diversity
          do_sample: false, // ✅ More deterministic output
          return_full_text: false // ✅ Avoid repeating input
        }
      },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` }, timeout: 5000000 } // ✅ Timeout set kiya 5 sec
    );

    let generatedText = response.data[0]?.generated_text || "Sorry, I didn't understand that.";
    generatedText = generatedText.replace(message, "").trim();

    // ✅ Response store in cache
    cache.set(message, generatedText);

    res.json({ reply: generatedText });
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    res.status(500).json({ error: "AI Server Slow, Try Again" });
  }
});

export default router; // ✅ Default export for proper import in index.js
