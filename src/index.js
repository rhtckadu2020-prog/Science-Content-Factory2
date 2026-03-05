import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getSmartNotePrompt, getVideoScriptPrompt, getHtmlSlidesPrompt, getMcqPrompt } from "./prompts.js";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("GEMINI_API_KEY not set!"); process.exit(1); }

const TEXT_MODEL = "gemini-2.5-flash";
const TTS_MODEL  = "gemini-2.5-flash-preview-tts";
const ai = new GoogleGenAI({ apiKey: API_KEY });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadPdf(filePath) {
  const buffer = readFileSync(filePath);
  console.log("PDF: " + (buffer.length / 1024).toFixed(1) + " KB");
  return buffer.toString("base64");
}

function createWav(pcm) {
  const sr = 24000, ch = 1, bps = 16;
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20);
  h.writeUInt16LE(ch, 22); h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * ch * bps / 8, 28); h.writeUInt16LE(ch * bps / 8, 32);
  h.writeUInt16LE(bps, 34); h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

async function textGen(prompt, pdf) {
  const parts = [];
  if (pdf) parts.push({ inlineData: { mimeType: "application/pdf", data: pdf } });
  parts.push({ text: prompt });
  const res = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts }]
  });
  return res.text;
}

async function ttsGen(text) {
  const res = await ai.models.generateContent({
    model: TTS_MODEL,
    contents: [{ role: "user", parts: [{ text: text.slice(0, 4000) }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } }
    }
  });
  const part = res.candidates[0].content.parts[0];
  if (!part?.inlineData?.data) throw new Error("No audio data");
  return createWav(Buffer.from(part.inlineData.data, "base64"));
}

async function main() {
  console.log("=== Content Factory Starting ===");

  const pdf = loadPdf("input/Grade10_Lesson1.pdf");
  mkdirSync("output", { recursive: true });

  // Step 1
  console.log("\n[1/5] Smart Note...");
  const smartNote = await textGen(getSmartNotePrompt("[PDF above]"), pdf);
  writeFileSync(join("output", "1_smart_note.md"), smartNote, "utf-8");
  console.log("  saved: 1_smart_note.md");
  console.log("  waiting 40s...");
  await sleep(40000);

  // Step 2
  console.log("\n[2/5] MCQ Assessment...");
  const mcq = await textGen(getMcqPrompt("[PDF above]"), pdf);
  writeFileSync(join("output", "2_assessment.md"), mcq, "utf-8");
  console.log("  saved: 2_assessment.md");
  console.log("  waiting 40s...");
  await sleep(40000);

  // Step 3
  console.log("\n[3/5] HTML Slides...");
  const slides = await textGen(getHtmlSlidesPrompt("[PDF above]", smartNote, ""), pdf);
  writeFileSync(join("output", "3_slides.html"), slides, "utf-8");
  console.log("  saved: 3_slides.html");
  console.log("  waiting 40s...");
  await sleep(40000);

  // Step 4
  console.log("\n[4/5] Video Script...");
  const script = await textGen(getVideoScriptPrompt("[PDF above]", smartNote), pdf);
  writeFileSync(join("output", "4_video_script.md"), script, "utf-8");
  console.log("  saved: 4_video_script.md");
  console.log("  waiting 40s...");
  await sleep(40000);

  // Step 5
  console.log("\n[5/5] TTS Audio...");
  try {
    const wav = await ttsGen(script);
    writeFileSync(join("output", "5_audio.wav"), wav);
    console.log("  saved: 5_audio.wav (" + (wav.length / 1024).toFixed(1) + " KB)");
  } catch (e) {
    console.warn("  TTS skipped: " + e.message);
  }

  console.log("\n=== All Done! ===");
}

main().catch(e => { console.error("Fatal: " + e.message); process.exit(1); });
