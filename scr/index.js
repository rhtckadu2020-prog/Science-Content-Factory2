import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// --- Configuration ---
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable is not set!");
  process.exit(1);
}

// ✅ 2025 වර්ෂයට නිවැරදිම Free Tier Model
// gemini-1.5-flash → වේගවත්, නොමිලේ, ඉහළ rate limit
const MODEL_NAME = "gemini-1.5-flash";

const genAI = new GoogleGenerativeAI(API_KEY);

async function generateContent(lessonText) {
  console.log("🤖 Gemini AI සම්බන්ධ කරනවා...");
  console.log(`📌 Model: ${MODEL_NAME}`);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = `
ඔබ ප්‍රවීණ E-Learning Content Designer කෙනෙකුය.
පහත lesson text එක පදනම් කරගෙන, Sinhala භාෂාවෙන් structured learning content package එකක් සාදන්න.

## Lesson Content:
${lessonText}

## ඔබ සෑදිය යුතු දේ:

### 1. සාරාංශය (Summary)
- ප්‍රධාන කරුණු 5ක් bullet points ලෙස

### 2. MCQ ප්‍රශ්න (Multiple Choice Questions)
- ප්‍රශ්න 5ක් සාදන්න
- සෑම ප්‍රශ්නයකටම පිළිතුරු 4ක් (A, B, C, D)
- නිවැරදි පිළිතුර සහ ඒ ඇයිද යන පැහැදිලි කිරීම

### 3. Flashcards
- Key terms 5ක් සඳහා Term → Definition format එකෙන්

### 4. ව්‍යායාම (Practice Activity)
- Students ට කළ හැකි practical activity එකක්

JSON format නොඅවශ්‍යයි. Clear headings සමඟ readable text format එකෙන් දෙන්න.
`;

  try {
    console.log("⏳ AI content generate කරනවා... (ටිකක් ඉන්න)");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Content සාර්ථකව generate විය!");
    return text;
    
  } catch (error) {
    if (error.message.includes("404")) {
      console.error("❌ 404 දෝෂය: Model name වැරදියි.");
      console.error(`   භාවිතා කළ model: ${MODEL_NAME}`);
      console.error("   විසඳුම: 'gemini-1.5-flash' model name නිවැරදිද?");
    } else if (error.message.includes("403")) {
      console.error("❌ 403 දෝෂය: API Key වලංගු නැත.");
      console.error("   https://aistudio.google.com/app/apikey වෙතින් නව key ගන්න.");
    } else if (error.message.includes("429")) {
      console.error("❌ 429 දෝෂය: Rate limit exceeded.");
      console.error("   ටිකක් රැඳී නැවත උත්සාහ කරන්න.");
    } else {
      console.error("❌ නොදන්නා දෝෂයක්:", error.message);
    }
    throw error;
  }
}

async function main() {
  console.log("🏭 Content Factory Starting...");
  console.log("================================");
  
  // Input file කියවීම
  let lessonText;
  try {
    lessonText = readFileSync("input/lesson.txt", "utf-8");
    console.log(`📖 Lesson file කියෙව්වා (${lessonText.length} characters)`);
  } catch (err) {
    console.error("❌ input/lesson.txt ගොනුව සොයාගත නොහැකිය!");
    process.exit(1);
  }
  
  if (!lessonText.trim()) {
    console.error("❌ lesson.txt ගොනුව හිස්ය!");
    process.exit(1);
  }
  
  // Content generate කිරීම
  const generatedContent = await generateContent(lessonText);
  
  // Output save කිරීම
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputDir = "output";
  
  try {
    mkdirSync(outputDir, { recursive: true });
  } catch (err) {
    // Directory දැනටමත් ඇත
  }
  
  const outputPath = join(outputDir, `content_${timestamp}.md`);
  
  const finalContent = `# Generated E-Learning Content
**Generated at:** ${new Date().toLocaleString("si-LK")}
**Source:** input/lesson.txt
**Model:** ${MODEL_NAME}

---

${generatedContent}
`;

  writeFileSync(outputPath, finalContent, "utf-8");
  
  console.log("================================");
  console.log(`✅ Content සාර්ථකව save විය: ${outputPath}`);
  console.log("🎉 Content Factory සාර්ථකව නිමවිය!");
}

main().catch((error) => {
  console.error("💥 Fatal Error:", error.message);
  process.exit(1);
});
