const Groq = require('groq-sdk');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const os = require('os');

// Indian languages supported by Whisper
const SUPPORTED_LANGUAGES = [
    'ta', // Tamil
    'hi', // Hindi
    'te', // Telugu
    'kn', // Kannada
    'ml', // Malayalam
    'bn', // Bengali
    'mr', // Marathi
    'gu', // Gujarati
    'pa', // Punjabi
    'ur', // Urdu
    'en', // English
];

class LLMService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.client = this.apiKey ? new Groq({ apiKey: this.apiKey }) : null;

        if (this.client) {
            console.log("✅ REAL AI ENGINE: ACTIVE (Groq LLaMA 3 + Whisper Connected)");
            console.log("   ► Multilingual: Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Urdu, English");
        } else {
            console.log("🔸 REAL AI ENGINE: OFF (Simulated Fallback Active)");
        }
    }

    isActive() {
        return !!this.client;
    }

    async analyze(transcript, state) {
        if (!this.client) return null;

        try {
            const systemPrompt = `
            You are the AI Core of the RAPID-100 Emergency System deployed in India.
            You MUST handle transcripts in ANY Indian language (Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Urdu) as well as English.

            IMPORTANT MULTILINGUAL RULES:
            - The transcript may be in ANY Indian language or a mix of languages (code-switching is common in India)
            - You MUST understand the meaning regardless of language
            - ALL your output fields (emergencyType, intent, recommended_action, explanation, summary, dispatcherSummary) MUST be in ENGLISH only
            - If transcript is in Tamil/Hindi/Telugu etc., translate and understand it internally, but output in English

            TRANSCRIPT: "${transcript}"
            PREVIOUS STATE: ${JSON.stringify(state.currentAnalysis)}

            RULES:
            1. **Emergency Type**: Classify as Medical, Fire, Police, Accident, or Other.
            2. **Intent**: Determine if caller is Asking for Help, Reporting, Panicking, or Unclear.
            3. **Severity (1-5)**:
               - NEVER lower severity unless you are 100% sure the situation is resolved.
               - If previous severity was > 1, default to keeping it or increasing it.
            4. **Routing**: Select primary service (Ambulance, Fire, Police).
            5. **Summary**: Extract key details (Who, What, Where).
               - "who": Extract caller's name if mentioned in ANY language.
                 Examples: "என் பெயர் ராஜ்" (Tamil = My name is Raj), "मेरा नाम राहुल है" (Hindi = My name is Rahul), "My name is Priya"
                 If no name, identify as "Male Caller" or "Female Caller" from context clues in any language.
                 Tamil clues: "என் கணவர்" (my husband) = Female, "என் மனைவி" (my wife) = Male, "அக்கா/தங்கை" = Female, "அண்ணா/தம்பி" = Male
                 Hindi clues: "मेरे पति" (my husband) = Female, "मेरी पत्नी" (my wife) = Male
               - "where": Extract location from any language. Indian locations, landmarks, area names.
               - "what": Describe the incident in English regardless of transcript language.

            Output STRICT JSON:
            {
                "emergencyType": "String (in English)",
                "intent": "String (in English)",
                "severity": Integer (1-5),
                "panic_level": Integer (0-100),
                "fake_call_probability": Float (0.0-1.0),
                "recommended_action": "Action string (in English)",
                "explanation": "Rationale (in English)",
                "detectedLanguage": "Language name (e.g. Tamil, Hindi, English, Telugu)",
                "routing": {
                    "primary": "Service Name",
                    "secondary": ["Service Name"],
                    "reason": "Why this service?"
                },
                "summary": {
                    "who": "Caller name or Male/Female Caller",
                    "what": "Incident description in English",
                    "where": "Location extracted from transcript",
                    "condition": "Current status in English",
                    "confidence": Float (0.0-1.0)
                },
                "dispatcherSummary": "One-line actionable summary in English"
            }
            `;

            const completion = await this.client.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are RAPID-100 AI deployed in India. You understand all Indian languages. Output strict JSON with all fields in English." },
                    { role: "user", content: systemPrompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.1
            });

            return JSON.parse(completion.choices[0].message.content);

        } catch (error) {
            console.error("LLM Error:", error.message);
            return null;
        }
    }

    async transcribeAudio(fileObj, language = null) {
        if (!this.client) return null;

        const ext = path.extname(fileObj.originalname) || ".wav";
        const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}${ext}`);

        try {
            fs.writeFileSync(tempFilePath, fileObj.buffer);

            const langLabel = language || 'auto-detect';
            console.log(`[LLMService] Transcribing ${fileObj.originalname} (${fileObj.size} bytes) [lang: ${langLabel}]...`);

            // Use whisper-large-v3 (NOT turbo) - much better for Indian languages
            const options = {
                file: fs.createReadStream(tempFilePath),
                model: "whisper-large-v3",
                response_format: "verbose_json",
                prompt: "This is an emergency call in India. The caller may speak in Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Urdu, or English.",
            };

            // If user selected a specific language, pass it to Whisper for much better accuracy
            if (language && language !== 'auto') {
                options.language = language;
            }

            const transcription = await this.client.audio.transcriptions.create(options);

            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

            const detectedLang = transcription.language || 'unknown';
            console.log(`[LLMService] Detected: ${detectedLang} | Text: "${(transcription.text || '').substring(0, 100)}..."`);

            // Return both text and detected language
            return { text: transcription.text, language: detectedLang };

        } catch (error) {
            console.error("Transcribe Error:", error?.error?.error?.message || error.message);
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            return null;
        }
    }
}

// Singleton
module.exports = new LLMService();
