# UX Flow Map

## 1. Authentication Flow
- **Entry**: User lands at `/login`.
- **States**: 
  - Login Form (Email, Password).
  - "Processing..." (Spinner).
  - Success -> Redirect to Dashboard.
  - Failure -> Shake animation + Toast error.

## 2. Dashboard (Command Center)
- **Start**: `/dashboard`.
- **View**: 
  - Recent Alerts Grid. 
  - System Health Status (Top right).
  - "New Analysis" FAB (Floating Action Button) or Card.
- **Action**: Click "New Analysis" -> Navigate to `/analysis/new`.

## 3. Analysis Flow
- **Step 1: Upload**:
  - Drag & Drop Zone.
  - Interactive Audio Waveform preview.
  - "Analyze" Button (Pulse effect).
- **Step 2: Processing (The "Magic" Moment)**:
  - Transition to Analysis View.
  - Connection indicator turns Green ("Secure Link Established").
  - AI "Thinking" dots appear.
- **Step 3: Live Intelligence**:
  - **Left Panel**: Rolling Transcript with entity highlighting.
  - **Center Panel**: Severity Gauge & Real-time Reasoning Text.
  - **Right Panel**: Action Recommendation Card (Dynamic color based on risk).
- **Step 4: Post-Call**:
  - "Generate Report" button.
  - Summary stats.

## 4. Interaction Design Notes
- Hovering over a chart point should show the reasoning *at that timestamp*.
- Critical alerts (Severity 5) must flash red borders.
- "Next Question" suggestions should slide in from bottom-right.
