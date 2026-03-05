import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// --- Configuration ---
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable is not set!");
  process.exit(1);
}

const MODEL_NAME = "gemini-1.5-flash";
// ✅ PDF කියවීමට gemini-1.5-flash හෝ pro දෙකම OK

const genAI = new GoogleGenerativeAI(API_KEY);

// ─────────────────────────────────────────
// PDF file → Base64 convert කිරීම
// ─────────────────────────────────────────
function loadPdfAsBase64(filePath) {
  try {
    const pdfBuffer = readFileSync(filePath);
    const base64Data = pdfBuffer.toString("base64");
    console.log(`📄 PDF loaded: ${filePath}`);
    console.log(`   Size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
    return base64Data;
  } catch (err) {
    console.error(`❌ PDF file සොයාගත නොහැකිය: ${filePath}`);
    console.error("   input/ folder එකේ Grade10_Lesson1.pdf ඇතිදැයි පරීක්ෂා කරන්න.");
    process.exit(1);
  }
}

// ─────────────────────────────────────────
// Gemini API → PDF + Prompt එකට යවන්න
// ─────────────────────────────────────────
async function generateContentFromPdf(pdfBase64) {
  console.log("🤖 Gemini AI සම්බන්ධ කරනවා...");
  console.log(`📌 Model: ${MODEL_NAME}`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // ✅ PDF document + text prompt එකට යවයි
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "application/pdf",
        data: pdfBase64,
      },
    },
    {
      text: `
ඔබ ප්‍රවීණ E-Learning Content Designer කෙනෙකුය.
මෙම PDF document එකේ ඇති Grade 10 Lesson එක විශ්ලේෂණය කර,
Sinhala භාෂාවෙන් structured learning content package එකක් සාදන්න.

## ඔබ සෑදිය යුතු දේ:

### 1. පාඩමේ සාරාංශය (Lesson Summary)
- ප්‍රධාන concepts 5-7ක් bullet points ලෙස
- සරල, Grade 10 සිසුන්ට තේරෙන භාෂාවෙන්

### 2. MCQ ප්‍රශ්න (Multiple Choice Questions)
- ප්‍රශ්න 5ක් සාදන්න
- සෑම ප්‍රශ්නයකටම options 4ක් (A, B, C, D)
- නිවැරදි පිළිතුර සහ ඇයිද යන කෙටි පැහැදිලි කිරීම

### 3. Flashcards
- Key terms 5ක් → Term : Definition format

### 4. කෙටි ලිවීමේ ප්‍රශ්න (Short Answer Questions)
- ප්‍රශ්න 3ක් (3-4 lines බැගින් පිළිතුරු)

### 5. ව්‍යායාමය (Activity)
- Students ට classroom / home දී කළ හැකි practical activity 1ක්

Clear headings සමඟ readable format එකෙන් ලබා දෙන්න.
`,
    },
  ]);

  const response = await result.response;
  return response.text();
}

// ─────────────────────────────────────────
// Main Function
// ─────────────────────────────────────────
async function main() {
  console.log("🏭 Content Factory Starting...");
  console.log("================================");

  // ✅ PDF file path — input/Grade10_Lesson1.pdf
  const PDF_PATH = "input/Grade10_Lesson1.pdf";

  // PDF → Base64
  const pdfBase64 = loadPdfAsBase64(PDF_PATH);

  // Content Generate
  console.log("⏳ PDF විශ්ලේෂණය කරනවා + Content generate කරනවා...");
  let generatedContent;
  try {
    generatedContent = await generateContentFromPdf(pdfBase64);
    console.log("✅ Content සාර්ථකව generate විය!");
  } catch (error) {
    if (error.message.includes("404")) {
      console.error("❌ 404: Model name වැරදියි → gemini-1.5-flash නිවැරදිදැයි බලන්න");
    } else if (error.message.includes("403")) {
      console.error("❌ 403: API Key වලංගු නැත");
    } else if (error.message.includes("429")) {
      console.error("❌ 429: Rate limit — ටිකක් රැඳී නැවත try කරන්න");
    } else {
      console.error("❌ Error:", error.message);
    }
    process.exit(1);
  }

  // Output Save
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputDir = "output";
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, `Grade10_Lesson1_${timestamp}.md`);
  const finalContent = `# Grade 10 - Lesson 1 | Generated Content
**Generated at:** ${new Date().toLocaleString("si-LK")}
**Source:** ${PDF_PATH}
**Model:** ${MODEL_NAME}

---

${generatedContent}
`;

  writeFileSync(outputPath, finalContent, "utf-8");

  console.log("================================");
  console.log(`✅ Output saved: ${outputPath}`);
  console.log("🎉 Content Factory සාර්ථකව නිමවිය!");
}

main().catch((err) => {
  console.error("💥 Fatal Error:", err.message);
  process.exit(1);
});
