import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import {
  getSmartNotePrompt,
  getVideoScriptPrompt,
  getHtmlSlidesPrompt,
  getMcqPrompt,
} from "./prompts.js";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error("❌ GEMINI_API_KEY not set!"); process.exit(1); }

const MODEL_NAME = "gemini-1.5-flash";
const genAI = new GoogleGenerativeAI(API_KEY);

function loadPdf(filePath) {
  try {
    const buffer = readFileSync(filePath);
    console.log(`📄 PDF loaded: ${(buffer.length / 1024).toFixed(1)} KB`);
    return buffer.toString("base64");
  } catch {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
}

async function callGemini(prompt, pdfBase64 = null) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const parts = [];
  if (pdfBase64) {
    parts.push({ inlineData: { mimeType: "application/pdf", data: pdfBase64 } });
  }
  parts.push({ text: prompt });
  const result = await model.generateContent(parts);
  return result.response.text();
}

async function main() {
  console.log("🏭 Content Factory Starting...\n");

  const pdfBase64 = loadPdf("input/Grade10_Lesson1.pdf");
  const outputDir = "output";
  mkdirSync(outputDir, { recursive: true });

  console.log("📝 Step 1/4: Smart Note generate කරනවා...");
  const smartNote = await callGemini(getSmartNotePrompt("[PDF content above]"), pdfBase64);
  writeFileSync(join(outputDir, "1_smart_note.md"), smartNote, "utf-8");
  console.log("   ✅ 1_smart_note.md saved\n");

  console.log("🎬 Step 2/4: Video Script generate කරනවා...");
  const script = await callGemini(getVideoScriptPrompt("[PDF above]", smartNote), pdfBase64);
  writeFileSync(join(outputDir, "2_video_script.md"), script, "utf-8");
  console.log("   ✅ 2_video_script.md saved\n");

  console.log("💻 Step 3/4: HTML Slides generate කරනවා...");
  const slides = await callGemini(getHtmlSlidesPrompt("[PDF above]", smartNote, script), pdfBase64);
  writeFileSync(join(outputDir, "3_slides.html"), slides, "utf-8");
  console.log("   ✅ 3_slides.html saved\n");

  console.log("📊 Step 4/4: MCQ Assessment generate කරනවා...");
  const mcq = await callGemini(getMcqPrompt("[PDF content above]"), pdfBase64);
  writeFileSync(join(outputDir, "4_assessment.md"), mcq, "utf-8");
  console.log("   ✅ 4_assessment.md saved\n");

  console.log("════════════════════════════════");
  console.log("🎉 සියලු files සාර්ථකව generate විය!");
}

main().catch((err) => { console.error("💥", err.message); process.exit(1); });
```

---

### පියවර 2: Repository Structure Verify කරන්න

GitHub Repo එකේ මෙම files **සියල්ල** ඇතිදැයි බලන්න:
```
✅ අනිවාර්ය files:
├── src/
│   ├── index.js          ← දැන් හදන්න
│   └── prompts.js        ← දැනටමත් ඇතිද?
├── input/
│   └── Grade10_Lesson1.pdf  ← PDF ඇතිද?
├── package.json
└── .github/workflows/content-factory.yml
