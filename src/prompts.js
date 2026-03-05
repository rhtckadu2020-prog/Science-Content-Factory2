// src/prompts.js

// ═══════════════════════════════════════════════════════════════
// 📝 PROMPT 1: Smart Note Generation
// ═══════════════════════════════════════════════════════════════
const getSmartNotePrompt = (content) => `
ඔබ ශ්‍රී ලංකාවේ Grade 10 සිසුන් සඳහා විශේෂඥ E-Learning Content Designer කෙනෙකි.
පහත PDF content එක හොඳින් කියවා, සිසුන්ට ඉතාමත් ප්‍රයෝජනවත් SMART NOTE එකක් සාදන්න.

## INPUT DATA:
${content}

## ඔබ සෑදිය යුතු SMART NOTE FORMAT:

---

# 📚 [පාඩමේ නම - PDF එකෙන් ලබාගන්න]
**ශ්‍රේණිය:** Grade 10 | **විෂය:** [PDF එකෙන් ලබාගන්න]

---

## 🎯 ඉගෙනුම් අරමුණු (Learning Objectives)
සිසුන් මෙම පාඩමෙන් ඉගෙනගන්නා ප්‍රධාන දේවල් 4-5ක් bullet points ලෙස:
- ...

---

## 💡 ප්‍රධාන සංකල්ප (Key Concepts)
**සෑම concept එකක්ම පහත format එකෙන් ලබා දෙන්න:**

### Concept 1: [නම]
**පැහැදිලි කිරීම:** [සරල සිංහල භාෂාවෙන්]
**නිදර්ශනය:** [දෛනික ජීවිතයේ සිදුවන real-world example එකක්]
**මතක රැකීමට:** [Memory trick හෝ mnemonic]

### Concept 2: [නම]
[ඉහත format ම]

[... සියලු ප්‍රධාන concepts ආවරණය කරන්න ...]

---

## 🔑 Key Terms & Definitions (Glossary)
| වදන (Term) | අර්ථය (Definition) | සිංහල නම |
|------------|-------------------|-----------|
| [term] | [definition] | [sinhala] |
[... minimum 8 terms ...]

---

## 📊 සංසන්දනාත්මක වගුව (Comparison Table)
[PDF content එකේ සංසන්දනය කළ හැකි items 2-3ක් ඇත්නම් table එකක් සාදන්න]

---

## 🧠 Mind Map Structure
**Central Topic:** [පාඩමේ ප්‍රධාන මාතෘකාව]
- Branch 1: [Sub-topic] → [details]
- Branch 2: [Sub-topic] → [details]  
- Branch 3: [Sub-topic] → [details]

---

## ⚠️ වැදගත් කරුණු (Important Points to Remember)
> 💎 [ඉතාමත් වැදගත් fact 1]
> 💎 [ඉතාමත් වැදගත් fact 2]
> 💎 [ඉතාමත් වැදගත් fact 3]

---

## 🔗 සම්බන්ධිත පාඩම් (Connections)
- මෙම පාඩම සම්බන්ධ Grade 10 වෙනත් topics: [...]
- ඉදිරි exam වල expect කළ හැකි question types: [...]

---

**Note:** සියලු පැහැදිලි කිරීම් Grade 10 සිසුන්ට සරලව තේරෙන සිංහල භාෂාවෙන් ලියන්න.
Technical terms ඇංග්‍රීසියෙන්ම තබා, සිංහල පැහැදිලි කිරීම් ලබා දෙන්න.
`;

// ═══════════════════════════════════════════════════════════════
// 🎬 PROMPT 2: Video Script Generation (TTS-Ready)
// ═══════════════════════════════════════════════════════════════
const getVideoScriptPrompt = (content, smartNote) => `
ඔබ ශ්‍රී ලංකාවේ ප්‍රසිද්ධ Educational YouTube Channel එකක් සඳහා video script ලියන Expert Script Writer කෙනෙකි.
පහත Smart Note සහ PDF content භාවිතා කර, **Text-to-Speech (TTS) සඳහා optimize කළ** video script එකක් ලියන්න.

## INPUT DATA:
**PDF Content:** ${content}
**Smart Note:** ${smartNote}

## VIDEO SCRIPT FORMAT:

---

# 🎬 VIDEO SCRIPT: [පාඩමේ නම]
**Duration:** ~8-12 minutes | **Target:** Grade 10 Students

---

## [INTRO - 0:00 to 0:45]
**[TTS Voice]:**
"ආයුබෝවන්! අද අපි [විෂය] වල [පාඩමේ නම] ගැන කතා කරමු.
[Engaging opening question or interesting fact related to the lesson]
ඒ ගැන දැනගන්න ඕනෙනම්, video එක අවසාන දක්වා බලන්න!"

**[Screen Direction]:** [Title animation, topic text display]

---

## [SECTION 1 - Concept Introduction - 0:45 to 3:00]
**[TTS Voice]:**
"[Main concept 1 ගැන සරල, engaging explanation]
[Real-life example සමඟ]
[ඉතා කෙටි, clear sentences - TTS reads naturally]"

**[Screen Direction]:** [Diagram/image to show on screen]

**[PAUSE POINT]:** "ඉතින්, [concept 1] කියන්නේ... [quick recap]"

---

## [SECTION 2 - Deep Dive - 3:00 to 6:00]
**[TTS Voice]:**
"[Main concept 2 සහ 3 ගැන detailed explanation]
[Step-by-step breakdown]
[Examples සහ comparisons]"

**[Screen Direction]:** [Tables, diagrams, animations]

---

## [SECTION 3 - Key Points Summary - 6:00 to 9:00]
**[TTS Voice]:**
"හරි, දැන් අපි ඉගෙනගත් ප්‍රධාන කරුණු නැවත බලමු.
[Bullet point by point recap - slow and clear]
[Exam-focused tips]"

**[Screen Direction]:** [Bullet point list animation]

---

## [EXAM TIPS - 9:00 to 10:30]
**[TTS Voice]:**
"⭐ Exam එකට ගන්න! ⭐
[3-4 specific exam tips]
[Common mistakes to avoid]
[Formula/definition to memorize]"

**[Screen Direction]:** [Highlighted important points]

---

## [OUTRO - 10:30 to 11:00]
**[TTS Voice]:**
"ඉතින් අද අපි [recap in 2 sentences].
ඔබට ප්‍රශ්නයක් ඇත්නම් comment section එකේ ලියන්න.
Like කරන්න, Subscribe කරන්න. ඊළඟ video එකෙන් හමුවෙමු!"

**[Screen Direction]:** [Subscribe animation, next video preview]

---

## 📋 TTS GUIDELINES (Script Writer Notes):
- සෑම වාක්‍යයක්ම කෙටිව ලියා ඇත (TTS pause ලබා ගැනීමට)
- Technical terms ඊළඟ line එකේ සිංහලෙන් explain කර ඇත
- Numbers words ලෙස ලියා ඇත (5 → "පහ" ලෙස)
- "..." භාවිතා කර natural pauses ලබා ඇත
`;

// ═══════════════════════════════════════════════════════════════
// 💻 PROMPT 3: Interactive HTML Slides Generation
// ═══════════════════════════════════════════════════════════════
const getHtmlSlidesPrompt = (content, smartNote, script) => `
ඔබ Expert Web Developer සහ UI/UX Designer කෙනෙකි.
පහත content භාවිතා කර, Grade 10 සිසුන් සඳහා **interactive, visually beautiful HTML presentation** එකක් සාදන්න.

## INPUT DATA:
**PDF Content:** ${content}
**Smart Note:** ${smartNote}  
**Video Script:** ${script}

## HTML SLIDES REQUIREMENTS:

සම්පූර්ණ **single HTML file** එකක් ලියන්න. External libraries වලට CDN links භාවිතා කරන්න.

### Design Requirements:
- Modern, colorful, student-friendly design
- Sinhala Unicode fonts (Noto Sans Sinhala - Google Fonts)
- Smooth slide transitions (CSS animations)
- Mobile responsive
- Dark/Light mode toggle button

### Technical Requirements:
- Keyboard navigation (Arrow keys)
- Click navigation (Previous/Next buttons)
- Slide counter (e.g., "3 / 10")
- Progress bar at top
- Full-screen button

### Slide Structure (minimum 10 slides):

**Slide 1 - Title Slide:**
- Subject, Grade, Chapter name
- Beautiful gradient background
- Animated title entrance

**Slide 2 - Learning Objectives:**
- Animated bullet points (appear one by one)
- Icon for each objective

**Slides 3-7 - Content Slides:**
- Key concepts with clear headings
- Visual diagrams or tables where needed
- Highlighted important terms (colored boxes)
- Real-world examples in separate callout boxes

**Slide 8 - Summary / Mind Map:**
- Visual summary of all concepts
- Color-coded categories

**Slide 9 - Exam Tips:**
- ⭐ Star-highlighted important points
- Red boxes for "common mistakes"
- Green boxes for "must remember"

**Slide 10 - Quick Quiz Teaser:**
- 2-3 preview questions (answers hidden, reveal on click)

### Color Scheme:
\`\`\`
Primary: #667eea (Purple-Blue gradient)
Secondary: #764ba2
Accent: #f093fb
Success: #4CAF50
Warning: #FF9800
Background: #f0f2f5
Card: #ffffff
\`\`\`

### HTML Template Structure:
\`\`\`html
<!DOCTYPE html>
<html lang="si">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Lesson Name] - Grade 10</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    /* Complete CSS here */
  </style>
</head>
<body>
  <!-- Progress Bar -->
  <!-- Slides Container -->
  <!-- Navigation Controls -->
  <script>
    /* Complete JavaScript here */
  </script>
</body>
</html>
\`\`\`

**ඉතා වැදගත්:** සම්පූර්ණ, ක්‍රියාත්මක HTML file එකක් ලබා දෙන්න. Placeholder text නොතිබිය යුතුය.
`;

// ═══════════════════════════════════════════════════════════════
// 📊 PROMPT 4: Assessment / MCQ Generation
// ═══════════════════════════════════════════════════════════════
const getMcqPrompt = (content) => `
ඔබ Sri Lanka Examinations Department හි ප්‍රවීණ Question Paper Setter කෙනෙකි.
Grade 10 O/L exam format අනුව, පහත content ආශ්‍රයෙන් comprehensive assessment paper එකක් සාදන්න.

## INPUT DATA:
${content}

## ASSESSMENT FORMAT:

---

# 📝 ASSESSMENT PAPER
**Grade 10 | [Subject] | [Lesson Name]**
**Total Marks: 50 | Time: 45 minutes**

---

## PART A: Multiple Choice Questions (MCQ) — 20 Marks
**(සෑම ප්‍රශ්නයකටම 2 marks. නිවැරදි පිළිතුර ➤ ලකුණෙන් සලකුණු කරන්න.)**

**[Knowledge Level - 5 questions]**

Q1. [Straightforward fact-based question]
A) [option]  B) [option]  C) [option]  D) [option]
✅ Answer: [X] | Explanation: [Why this is correct - 1 sentence]

Q2. [Definition or term identification question]
A) [option]  B) [option]  C) [option]  D) [option]
✅ Answer: [X] | Explanation: [...]

**[Comprehension Level - 3 questions]**

Q6. [Understanding and application question]
A) [option]  B) [option]  C) [option]  D) [option]
✅ Answer: [X] | Explanation: [...]

**[Application Level - 2 questions]**

Q9. [Scenario-based application question]
A) [option]  B) [option]  C) [option]  D) [option]
✅ Answer: [X] | Explanation: [...]

---

## PART B: Short Answer Questions — 20 Marks
**(සෑම ප්‍රශ්නයකටම 4 marks. 3-5 sentences ලෙස පිළිතුරු ලියන්න.)**

Q11. [Explain a key concept]
**Model Answer:** [3-5 sentence ideal answer]
**Marking Scheme:** [How marks are allocated]

Q12. [Compare two concepts]
**Model Answer:** [...]
**Marking Scheme:** [...]

Q13. [Give examples and explain]
**Model Answer:** [...]
**Marking Scheme:** [...]

Q14. [Cause and effect question]
**Model Answer:** [...]
**Marking Scheme:** [...]

Q15. [Real-world application question]
**Model Answer:** [...]
**Marking Scheme:** [...]

---

## PART C: Structured Essay Question — 10 Marks

Q16. [Comprehensive question covering main concepts]
**(a) [Sub-question 1] - 3 marks**
**(b) [Sub-question 2] - 3 marks**
**(c) [Sub-question 3] - 4 marks**

**Model Answer:**
**(a)** [Detailed answer...]
**(b)** [Detailed answer...]
**(c)** [Detailed answer...]

**Marking Scheme:**
- [Point 1] — 1 mark
- [Point 2] — 1 mark
[...]

---

## 📊 DIFFICULTY ANALYSIS:
| Level | Questions | Marks |
|-------|-----------|-------|
| Knowledge (දැනීම) | 5 | 10 |
| Comprehension (අවබෝධය) | 6 | 15 |
| Application (යෙදීම) | 5 | 25 |
| **Total** | **16** | **50** |

---

## 🎯 COMMON MISTAKES TO AVOID:
1. [Typical mistake students make on this topic]
2. [Another common error]
3. [Third common misconception]

---

**Note:** සියලු ප්‍රශ්න Sri Lanka O/L exam style අනුව සාදා ඇත.
Model answers Grade 10 level knowledge සඳහා නිවැරදිව ලියා ඇත.
`;

// ✅ ES Module export (module.exports නොවේ!)
export {
  getSmartNotePrompt,
  getVideoScriptPrompt,
  getHtmlSlidesPrompt,
  getMcqPrompt,
};
```

---

## Output Structure
```
output/
├── 1_smart_note.md      ← සම්පූර්ණ study notes
├── 2_assessment.md      ← MCQ + exam paper
├── 3_slides.html        ← Browser presentation
├── 4_video_script.md    ← TTS-ready script
└── 5_audio.wav          ← Auto-generated audio
