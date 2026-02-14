# RAPID-100 Enterprise Architecture

## 1. Technology Stack & Strategy
- **Frontend**: React (Vite), Tailwind CSS (Enterprise/Neon Theme), Framer Motion, Recharts.
- **Backend**: Node.js, Express, Socket.io (Real-time duplex).
- **AI Core**: Modular "Reasoning Engine" with Bayesian state updates.
- **State Management**: In-memory `CallIntelligenceState` (simulated persistence).

## 2. Directory Structure Strategy
We will strictly adhere to Domain-Driven Design (DDD) principles where applicable.

```text
/rapid-100
├── /design                # Architectural documentation
├── /backend
│   ├── /src
│   │   ├── /core          # Core business logic (AI Engine)
│   │   │   ├── reasoning.js
│   │   │   ├── safety.js
│   │   │   └── temporal.js
│   │   ├── /models        # Data models & schemas
│   │   ├── /services      # External services (Audio processing, Simulators)
│   │   ├── /events        # Socket.io event handlers
│   │   └── server.js      # Entry point
│   └── package.json
├── /frontend
│   ├── /src
│   │   ├── /assets        # Static assets
│   │   ├── /components    # Shared UI components (Buttons, Cards, Inputs)
│   │   │   ├── /ui        # Primitives (GlassPanel, NeoButton)
│   │   │   └── /viz       # Data utilizations (Waveform, Charts)
│   │   ├── /features      # Feature-based modules
│   │   │   ├── /auth      # Login/Signup
│   │   │   ├── /dashboard # Operation Center
│   │   │   └── /analysis  # Deep Dive Analysis
│   │   ├── /hooks         # Custom React Hooks
│   │   ├── /layouts       # Page Layouts (AuthLayout, DashboardLayout)
│   │   ├── /pages         # Route views
│   │   └── App.jsx
│   └── tailwind.config.js
└── README.md
```

## 3. Core Data Flow
1. **Input**: User uploads Audio File (WAV/MP3) -> Frontend.
2. **Buffering**: Frontend slices audio into 3s chunks.
3. **Transmission**: Chunks streamed via Socket.io (`audio:stream_chunk`).
4. **Processing**:
   - Backend receives chunk.
   - **Speech-to-Text (STT)**: Transcribes chunk.
   - **Reasoning Engine**: 
     - Updates `transcript`.
     - Recalculates `risk_score` (Bayesian).
     - Checks `safety_overrides`.
     - Generates `next_best_question`.
5. **Output**: Backend emits `analysis:update` -> Frontend listens and renders.
