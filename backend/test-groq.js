require('dotenv').config();
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

async function testGroq() {
    console.log("--- GROQ CONNECTION TEST ---");
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("❌ NO API KEY FOUND in .env");
        return;
    }

    console.log(`✅ API Key detected: ${apiKey.substring(0, 10)}...`);

    const client = new Groq({ apiKey });

    try {
        console.log("Attempting to list models...");
        const models = await client.models.list();
        console.log("✅ API Connection Successful!");

        const whisperModels = models.data.filter(m => m.id.includes('whisper')).map(m => m.id);
        console.log("Available Whisper Models:", whisperModels);

        if (whisperModels.includes('whisper-large-v3-turbo')) {
            console.log("✅ whisper-large-v3-turbo is AVAILABLE");
        } else {
            console.error("❌ whisper-large-v3-turbo is MISSING/RESTRICTED");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ API CONNECTION FAILED:");
        console.error(error);
        if (error.status === 401) {
            console.error(">>> CAUSE: INVALID API KEY. Please check your .env file.");
        }
    }
    console.log("----------------------------");
}

testGroq();
