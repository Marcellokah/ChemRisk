import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ExtractedData } from "../../types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nincs fájl feltöltve." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY környezeti változó hiányzik.");
      return NextResponse.json(
        { error: "Rendszerkonfigurációs hiba: API kulcs hiányzik." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Schema definition for structured JSON output
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        productName: { 
          type: SchemaType.STRING, 
          description: "A termék neve (Product name)" 
        },
        ingredients: {
          type: SchemaType.ARRAY,
          description: "Az összetevők (Ingredients)",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING, description: "Anyagnév" },
              casNumber: { type: SchemaType.STRING, description: "CAS szám (CAS number)" },
              concentration: { type: SchemaType.STRING, description: "Koncentráció (Concentration)" },
            },
            required: ["name", "casNumber", "concentration"],
          },
        },
        hazardClasses: {
          type: SchemaType.ARRAY,
          description: "Veszélyességi osztályok (Hazard classes, e.g. Flam. Liq. 2)",
          items: { type: SchemaType.STRING },
        },
        hStatements: {
          type: SchemaType.ARRAY,
          description: "H-mondatok a kódjukkal (Hazard statements with code, e.g. H225: Fokozottan tűzveszélyes...)",
          items: { type: SchemaType.STRING },
        },
        pStatements: {
          type: SchemaType.ARRAY,
          description: "P-mondatok a kódjukkal (Precautionary statements with code, e.g. P210: Hőtől távol tartandó...)",
          items: { type: SchemaType.STRING },
        },
      },
      required: ["productName", "ingredients", "hazardClasses", "hStatements", "pStatements"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Convert uploaded File to Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const prompt = `Kérlek elemezd a mellékelt biztonsági adatlapot (PDF) és nyerd ki az alábbi adatokat:
- A termék teljes nevét.
- Az összetevők listáját, CAS számukat és koncentrációjukat. Ha nincs CAS szám, hagyd üresen vagy írd, hogy "N/A".
- A veszélyességi osztályokat.
- A H-mondatokat (veszélyt jelző mondatok) a kódjukkal együtt.
- A P-mondatokat (óvintézkedésre vonatkozó mondatok) a kódjukkal együtt.
A válaszod formátuma pontosan egyezzen meg a kért JSON sémával.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
    ]);

    const responseText = result.response.text();
    let extractedData: ExtractedData;
    
    try {
      extractedData = JSON.parse(responseText);
    } catch (e) {
      console.error("JSON parse error from Gemini:", e, "Response:", responseText);
      throw new Error("Érvénytelen JSON válasz a modelltől.");
    }

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Szerverhiba a feldolgozás során." },
      { status: 500 }
    );
  }
}
