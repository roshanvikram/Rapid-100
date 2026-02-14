# API & WebSocket Schema

## WebSocket Events (Socket.io)

### Client -> Server

1. **`session:start`**
   - **Payload**: `{ userId: string, sessionType: 'live' | 'upload' }`
   - **Description**: Initializes a new analysis session. Server resets state for this socket ID.

2. **`audio:stream_chunk`**
   - **Payload**: 
     ```json
     {
       "chunkId": "uuid-v4",
       "timestamp": 1234567890,
       "data": "base64_encoded_audio_or_text_transcript",
       "isFinal": boolean
     }
     ```
   - **Description**: Sends a 2-3s audio segment (or pre-transcribed text for simulation) to be processed.

3. **`analysis:pause`** / **`analysis:resume`**
   - **Payload**: None.
   - **Description**: Pauses/Resumes the AI processing stream.

### Server -> Client

1. **`analysis:update`**
   - **Payload**:
     ```json
     {
       "transcript_segment": "There is a fire in the kitc...",
       "full_transcript": "Help! There is a fire in the kitchen...",
       "metrics": {
         "severity_score": 4.2, // 1-5 float
         "panic_index": 85,    // 0-100 int
         "fake_call_prob": 0.05, // 0-1 float
         "uncertainty": 0.15     // 0-1 float
       },
       "ai_reasoning": {
         "detected_incidents": ["Fire", "Structural Danger"],
         "primary_threat": "Fire",
         "reasoning_text": "Keywords 'fire', 'kitchen' indicate immediate residential fire threat.",
         "safety_override_active": true // if > 80% risk
       },
       "recommendations": {
         "action": "Dispatch Fire & Rescue",
         "next_question": "Are you alone in the house?",
         "urgency": "CRITICAL"
       }
     }
     ```

2. **`system:error`**
   - **Payload**: `{ code: "ERR_AUDIO_FORMAT", message: "Unsupported file type." }`

## REST API (Express)

- **POST /api/auth/login**
- **POST /api/auth/register**
- **GET /api/history** (Fetch past call analyses)
- **GET /api/system/status** (Health check)
