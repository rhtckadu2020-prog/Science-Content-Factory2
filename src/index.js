import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  getSmartNotePrompt,
  getVideoScriptPrompt,
  getHtmlSlidesPrompt,
  getMcqPrompt,
} from "./prompts.js";

// ── Config ─────────────────────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("GEMINI_API_KEY not set!"); process.exit(1); }

const TEXT_MODEL = "gemini-3.1-flash-lite";   // 500 RPD free
const TTS_MODEL  = "gemini-2.5-flash-preview-tts"; // 10 RPD free

const ai = new GoogleGenAI({ apiKey: API_KEY });

// ── PDF Load ───────────────────────────────────────────────────
function loadPdf(filePath) {
  try {
    const buffer = readFileSync(filePath);
    console.log("PDF loaded: " + (buffer.length / 1024).toFixed(1) + " KB");
    return buffer.toString("base64");
  } catch {
    console.error("File not found: " + filePath);
    process.exit(1);
  }
}

// ── Text Generation (PDF + Prompt) ─────────────────────────────
async function callTextModel(prompt, pdfBase64 = null) {
  const contents = [];

  if (pdfBase64) {
    contents.push({
      role: "user",
      parts: [
        { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
        { text: prompt }
      ]
    });
  } else {
    contents.push({ role: "user", parts: [{ text: prompt }] });
  }

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: contents,
  });

  return response.text;
}

// ── TTS: WAV file header හදන function ─────────────────────────
function createWavBuffer(pcmData) {
  const sampleRate = 24000;   // Gemini TTS default
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = pcmData.length;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);
  const ttsScript = script.slice(0, 4000); // First 4000 chars only
  const wavBuffer = await callTtsModel(ttsScript);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  pcmData.copy(buffer, 44);

  return buffer;
}

// ── TTS Generation ─────────────────────────────────────────────
async function callTtsModel(scriptText) {
  const response = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ role: "user", parts: [{ text: scriptText }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Aoede" }
        }
      }
    }
  });

  const audioPart = response.candidates[0].content.parts[0];
  if (!audioPart?.inlineData?.data) {
    throw new Error("TTS response හිස්ය — audio data නැත");
  }

  const pcmBuffer = Buffer.from(audioPart.inlineData.data, "base64");
  return createWavBuffer(pcmBuffer);
  // Step 5 ට ඉහළින් add කරන්න
}

// ── Main Pipeline ──────────────────────────────────────────────
async function main() {
  console.log("Content Factory Starting...");
  console.log("================================");

  const pdfBase64 = loadPdf("input/Grade10_Lesson1.pdf");
  const outputDir = "output";
  mkdirSync(outputDir, { recursive: true });

  // ── Step 1: Smart Note ────────────────────────────────────────
  console.log("\nStep 1/5: Smart Note generating...");
  const smartNote = await callTextModel(
    getSmartNotePrompt("[PDF content above]"), pdfBase64
  );
  writeFileSync(join(outputDir, "1_smart_note.md"), smartNote, "utf-8");
  console.log("  1_smart_note.md saved");

  // ── Step 2: MCQ Assessment ────────────────────────────────────
  console.log("\nStep 2/5: MCQ Assessment generating...");
  const mcq = await callTextModel(
    getMcqPrompt("[PDF content above]"), pdfBase64
  );
  writeFileSync(join(outputDir, "2_assessment.md"), mcq, "utf-8");
  console.log("  2_assessment.md saved");

  // ── Step 3: HTML Slides ───────────────────────────────────────
  console.log("\nStep 3/5: HTML Slides generating...");
  const slides = await callTextModel(
    getHtmlSlidesPrompt("[PDF above]", smartNote, ""), pdfBase64
  );
  writeFileSync(join(outputDir, "3_slides.html"), slides, "utf-8");
  console.log("  3_slides.html saved");

  // ── Step 4: Video Script ──────────────────────────────────────
  console.log("\nStep 4/5: Video Script generating...");
  const script = await callTextModel(
    getVideoScriptPrompt("[PDF above]", smartNote), pdfBase64
  );
  writeFileSync(join(outputDir, "4_video_script.md"), script, "utf-8");
  console.log("  4_video_script.md saved");

  // ── Step 5: TTS Audio ─────────────────────────────────────────
  console.log("\nStep 5/5: TTS Audio generating...");
  console.log("  (Script -> Audio conversion, ටිකක් ඉන්න...)");
  try {
    const wavBuffer = await callTtsModel(script);
    writeFileSync(join(outputDir, "5_audio.wav"), wavBuffer);
    console.log("  5_audio.wav saved (" + (wavBuffer.length / 1024).toFixed(1) + " KB)");
  } catch (ttsErr) {
    console.warn("  TTS warning: " + ttsErr.message);
    console.warn("  Audio skip කළා — අනෙක් files සාර්ථකයි");
  }

  console.log("\n================================");
  console.log("Output files:");
  console.log("  1_smart_note.md");
  console.log("  2_assessment.md");
  console.log("  3_slides.html");
  console.log("  4_video_script.md");
  console.log("  5_audio.wav");
  console.log("All done!");
}

main().catch((err) => {
  console.error("Fatal Error: " + err.message);
  process.exit(1);
});
