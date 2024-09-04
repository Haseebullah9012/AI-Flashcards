import {NextResponse} from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const systemInstruction = process.env.SYSTEM_INSTRUCTION;

export async function POST(req) {
  const data = await req.json(); //User Prompt
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
    generationConfig: {
      temperature: 1.0,
    },
  });

  const response = await model.generate(data.prompt);
  
  return new Response(JSON.stringify(response));  
}
