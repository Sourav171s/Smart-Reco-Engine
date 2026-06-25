// src/services/aiExplainer.js
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildFallback(recommendedProduct, tags) {
  const strengths = tags.length > 0 ? tags.join(", ").toLowerCase() : "a strong overall match";
  return `${recommendedProduct.productName} is a good alternative because it offers ${strengths}.`;
}

export async function generateExplanation(sourceProduct, recommendedProduct, tags = []) {
  if (!process.env.GEMINI_API_KEY) {
    return buildFallback(recommendedProduct, tags);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a helpful product recommendation assistant.
Explain in ONE sentence (max 25 words) why the recommended product is a good alternative.
Be specific, natural, and friendly. Do not start with "I".

Selected product: ${sourceProduct.productName} (₹${sourceProduct.price}, rating: ${sourceProduct.rating})
Recommended product: ${recommendedProduct.productName} (₹${recommendedProduct.price}, rating: ${recommendedProduct.rating})
Reasons: ${tags.join(", ")}

Respond with ONLY the explanation sentence.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim() || buildFallback(recommendedProduct, tags);
  } catch (error) {
    console.error("Gemini explanation failed; using fallback:", error.message);
    return buildFallback(recommendedProduct, tags);
  }
}

export default generateExplanation;
