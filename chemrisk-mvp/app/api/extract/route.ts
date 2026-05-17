import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType, Schema } from "@google/generative-ai";
import { ExtractedData } from "../../types";
import { parseToken, canUpload, recordUpload } from "../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const token = request.cookies.get("auth_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Bejelentkezés szükséges a dokumentumok feltöltéséhez" },
        { status: 401 }
      );
    }

    const parsed = parseToken(token);
    const userId = parsed?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Érvénytelen bejelentkezés" },
        { status: 401 }
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const { allowed } = canUpload(userId, ipAddress);
    if (!allowed) {
      return NextResponse.json(
        { error: "A napi feltöltési limit eléri. Próbálkozz holnap." },
        { status: 429 }
      );
    }

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
    const schema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        productName: { 
          type: SchemaType.STRING, 
          description: "A termék neve (Product name)" 
        },
        manufacturerDistributor: {
          type: SchemaType.STRING,
          description: "Gyártó vagy forgalmazó neve"
        },
        physicalState: {
          type: SchemaType.STRING,
          description: "Halmazállapot (pl. folyadék, szilárd, gáz)"
        },
        ingredients: {
          type: SchemaType.ARRAY,
          description: "A veszélyes összetevők (Hazardous ingredients)",
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
        clpLabeling: {
          type: SchemaType.STRING,
          description: "CLP jelölés (pl. GHS 02, GHS 07)"
        },
        limitAK: {
          type: SchemaType.STRING,
          description: "ÁK határérték, ha szerepel"
        },
        limitCK: {
          type: SchemaType.STRING,
          description: "CK határérték, ha szerepel"
        },
        mutagenic: {
          type: SchemaType.STRING,
          description: "Mutagén-e (1A vagy 1B): Igen/Nem/Nincs"
        },
        carcinogenic: {
          type: SchemaType.STRING,
          description: "Rákkeltő-e (1A vagy 1B): Igen/Nem/Nincs"
        },
        reprotox: {
          type: SchemaType.STRING,
          description: "Reprotox-e (1A vagy 1B): Igen/Nem/Nincs"
        },
        endocrineDisruptor: {
          type: SchemaType.STRING,
          description: "Endokrin károsító-e: Igen/Nem/Nincs"
        },
        ppeBodyProtection: {
          type: SchemaType.STRING,
          description: "Egyéni védőeszköz: egész test védelem"
        },
        ppeRespiratory: {
          type: SchemaType.STRING,
          description: "Egyéni védőeszköz: légzésvédő"
        },
        ppeGloves: {
          type: SchemaType.STRING,
          description: "Egyéni védőeszköz: védőkesztyű specifikáció"
        },
        ppeFaceProtection: {
          type: SchemaType.STRING,
          description: "Egyéni védőeszköz: arcvédelem"
        },
        ppeEyeProtection: {
          type: SchemaType.STRING,
          description: "Egyéni védőeszköz: szemvédelem specifikáció"
        },
      },
      required: [
        "productName",
        "manufacturerDistributor",
        "physicalState",
        "ingredients",
        "hazardClasses",
        "hStatements",
        "pStatements",
        "clpLabeling",
        "limitAK",
        "limitCK",
        "mutagenic",
        "carcinogenic",
        "reprotox",
        "endocrineDisruptor",
        "ppeBodyProtection",
        "ppeRespiratory",
        "ppeGloves",
        "ppeFaceProtection",
        "ppeEyeProtection"
      ],
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

    const prompt = `Kérlek elemezd a mellékelt biztonsági adatlapot (PDF) és nyerd ki az alábbi adatokat pontosan a JSON sémának megfelelően.

  Kötelező szabályok:
  - Csak a dokumentumban található információt használd.
  - Ha egy mező nem található vagy nem alkalmazható, írj "N/A" vagy "Nincs".
  - A mutagenic/carcinogenic/reprotox/endocrineDisruptor mezők értéke legyen: "Igen", "Nem" vagy "Nincs".
  - A hStatements és pStatements mezőkben a kód és a szöveg együtt szerepeljen (pl. "H225: ...", "P210: ...").

  Kinyerendő adatok:
  - productName: termék / keverék neve.
  - manufacturerDistributor: gyártó vagy forgalmazó.
  - physicalState: halmazállapot.
  - ingredients: veszélyes összetevők név, CAS, koncentráció.
  - hazardClasses: veszélyességi osztályok.
  - hStatements: H-mondatok kóddal.
  - pStatements: P-mondatok kóddal.
  - clpLabeling: CLP/GHS jelölés.
  - limitAK és limitCK: határérték adatok, ha vannak.
  - mutagenic, carcinogenic, reprotox, endocrineDisruptor.
  - ppeBodyProtection, ppeRespiratory, ppeGloves, ppeFaceProtection, ppeEyeProtection.

  A válaszod kizárólag a kért JSON legyen.`;

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

    // Record the upload after successful extraction
    recordUpload(userId, ipAddress);

    return NextResponse.json({ data: extractedData });
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { error: "Szerverhiba a feldolgozás során." },
      { status: 500 }
    );
  }
}
