import { GoogleGenAI, Schema, Type } from "@google/genai";
import { ContentFramework } from '../types';

const API_KEY = process.env.API_KEY || '';

// Helper to ensure API key exists
const getAIClient = () => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const SYSTEM_INSTRUCTION_CORE = `
You are an elite LinkedIn Personal Brand Manager & Growth Strategist. 
Your goal is to manage the user's professional presence, facilitate high-value networking, and generate viral-quality content.
Tone: Authoritative, humble yet confident, "Insider" energy. 
Format Rules: Short sentences. Frequent line breaks. Use arrows (→) and bullets (•). No walls of text.
`;

export const analyzeUserProfile = async (input: string | { inlineData: { data: string, mimeType: string } }): Promise<string> => {
  const ai = getAIClient();
  const basePrompt = `
  Analyze the following LinkedIn profile data. 
  Identify the user's skills, unique value proposition (UVP), and implied target audience.
  Confirm you are now trained as their "Digital Twin".
  If the input is a document (Resume/CV), extract the key professional experience and summary into the analysis so it can be used for future context.
  `;

  let contents;

  if (typeof input === 'string') {
    contents = `
    ${basePrompt}
    
    Profile Data:
    ${input}
    `;
  } else {
    // Multimodal input for Files
    contents = {
      parts: [
        input,
        { text: basePrompt }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_CORE,
    }
  });

  return response.text || "Analysis failed.";
};

export const generateNetworkingStrategy = async (
  userProfileContext: string, 
  connectionProfile: string | { inlineData: { data: string, mimeType: string } }
): Promise<any> => {
  const ai = getAIClient();
  
  // Note: We cannot use responseSchema with tools (googleSearch), so we prompt for JSON text.
  const basePrompt = `
  My Profile Context: ${userProfileContext}
  
  Target Connection Profile Data:
  `;

  const jsonInstruction = `
  First, use Google Search to find recent news, company updates, or public activity related to this person or their current company to enhance the strategy with real-time relevance.

  Then, Generate a Relationship Roadmap in strictly valid JSON format. 
  Do not include markdown code blocks (like \`\`\`json). Just return the raw JSON object.
  
  JSON Structure:
  {
    "context": "Analysis of the connection's psychology, needs, and relevant recent news found via search.",
    "icebreaker": "A personalized, non-salesy 1st message (max 300 chars). Mention a specific detail or recent event.",
    "followUp": "A value-add message for 3 days later.",
    "trustBuilder": "One specific topic to discuss to prove authority."
  }
  `;

  let contents;

  if (typeof connectionProfile === 'string') {
    contents = `
      ${basePrompt}
      ${connectionProfile}

      ${jsonInstruction}
    `;
  } else {
     contents = {
      parts: [
        { text: basePrompt },
        connectionProfile, // The inline data
        { text: jsonInstruction }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_CORE,
      tools: [{ googleSearch: {} }], // Enable Search Grounding
    }
  });

  // Extract grounding sources
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .map((chunk: any) => chunk.web?.uri)
    .filter((uri: string) => uri);

  // Parse JSON manually since strict schema is disabled for tools
  let text = response.text || "{}";
  text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

  try {
    const data = JSON.parse(text);
    return { ...data, sources };
  } catch (e) {
    console.error("JSON Parse Error in Networking Strategy", e);
    // Fallback if model fails to output valid JSON
    return {
      context: text.substring(0, 200) + "...",
      icebreaker: "Error generating structured data. Please try again.",
      followUp: "Error.",
      trustBuilder: "Error.",
      sources
    };
  }
};

export const auditProfile = async (currentProfile: string): Promise<string> => {
  const ai = getAIClient();
  const prompt = `
  Audit this profile against top 1% creators.
  Provide specific rewrites for the Headline and About Section to maximize conversion.
  
  Current Profile:
  ${currentProfile}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_CORE,
    }
  });

  return response.text || "Audit failed.";
};

export const generateContentPost = async (
  userProfileContext: string, 
  framework: ContentFramework, 
  topic: string
): Promise<any> => {
  const ai = getAIClient();

  let frameworkInstructions = "";
  
  switch (framework) {
    case ContentFramework.SYSTEM_REVEAL:
      frameworkInstructions = `
      FRAMEWORK: THE SYSTEM REVEAL (Case Study)
      Structure: Hook (Time/Effort spent) → The Problem (What most do wrong) → The Solution (What you built/found) → The Breakdown (Bulleted list of features/steps) → Who this is for → Call to Action (CTA).
      Vibe: "I spent 2 days breaking down X... Here is the workflow."
      `;
      break;
    case ContentFramework.REALITY_CHECK:
      frameworkInstructions = `
      FRAMEWORK: THE REALITY CHECK (Behind the Scenes)
      Structure: The Myth ("Most people think X") → The Reality ("But the magic happens here") → The Process (Step-by-step narrative of the real work) → The Psychology (Why this works) → Question for engagement.
      Vibe: "Design isn't just about pretty pixels. It's about structure first."
      `;
      break;
    case ContentFramework.MINDSET_SHIFT:
      frameworkInstructions = `
      FRAMEWORK: THE MINDSET SHIFT (The 1% vs 99%)
      Structure: Controversial Hook ("Get ahead of 99%") → The Honest Truth (Admit a past failure) → The Shift (What the top 1% do differently) → The List (5 specific questions or steps to level up) → CTA.
      Vibe: "Most designers fail because they don't think. Here are 5 questions that changed my career."
      `;
      break;
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      postBody: { type: Type.STRING, description: "The LinkedIn post content." },
      visualDescription: { type: Type.STRING, description: "Description of the image/overlay OR a video script with [Visual] and [Audio] columns." },
    },
    required: ["postBody", "visualDescription"],
  };

  const prompt = `
  My Profile Context: ${userProfileContext}
  Topic: ${topic}
  
  ${frameworkInstructions}
  
  Strictly adhere to the formatting rules: Short sentences. Frequent line breaks. Use arrows (→) and bullets (•).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_CORE,
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text || "{}");
};