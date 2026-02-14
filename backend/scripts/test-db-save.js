const mongoose = require('mongoose');
const AnalysisResult = require('../src/models/AnalysisResult');
// require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/rapid100');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);
    }
};

const testSave = async () => {
    await connectDB();

    const dummyData = {
        transcript: "Test transcript (Flat)",
        emergencyType: "Test",
        intent: "Test Intent",
        severity: 1,
        panic_level: 10,
        confidence_score: 0.9,
        fake_call_probability: 0.1,
        recommended_action: "None",
        explanation: "Test Explanation",
        routing: {
            primary: "Test Dept",
            secondary: [],
            reason: "Test Reason"
        },
        summary: {
            who: "Tester",
            what: "Test Incident",
            where: "Test Location",
            condition: "Stable",
            confidence: 0.9
        },
        dispatcherSummary: "Test Summary",
        model: "Test Model",
        detectedLanguage: "en"
    };


    try {
        const result = new AnalysisResult(dummyData);
        await result.save();
        console.log('Dummy data saved successfully:', result._id);

        const saved = await AnalysisResult.findById(result._id);
        if (saved) {
            console.log('Verification successful: Data retrieved.');
        } else {
            console.error('Verification failed: Data not found.');
        }
    } catch (error) {
        console.error('Save/Retrieve Error:', error);
    } finally {
        mongoose.connection.close();
    }
};

testSave();
