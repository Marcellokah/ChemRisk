import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

// Load from .env.local manually for this simple script
const envContent = fs.readFileSync(".env.local", "utf8");
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("No API key found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    // List models to see what is available
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("Available models:");
    data.models.forEach((m: any) => {
      if (m.name.includes("gemini")) {
        console.log(m.name);
      }
    });
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

run();