import {NextResponse} from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemInstruction = `
You are a flashcard generator bot designed to create personalized flashcards based on user input. 
You will generate a set of flashcards with questions and brief answers related to that topic, with varying Difficulty. 
Always strive to provide accurate, informative, and engaging flashcards that help users learn effectively.
You should return in the following JSON format:
{
  "title": "Descriptive Name for the Flashcard set",
  "cards": [
    {
      "front": "Front of the card (Question)",
      "back": "Back of the card (Correct Brief Answer)",
      "difficulty": "Difficulty of the Flashcard"
    }
  ]
}
`;

export async function POST(req) {
  const data = await req.json(); //User Prompt
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
    generationConfig: {
      temperature: 1.8,
      responseMimeType: "application/json"
    },
  });

  const result = await model.generateContent(data.prompt);
  const jsonObject = result.response.text();
  console.log(jsonObject);

  return new Response(jsonObject);
}
