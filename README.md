# Saarthi

> **Your memory. Your context. Your AI.**
> A private, local-first personal AI companion that doesn't just answer questions—it understands your life, goals, deadlines, preferences, and struggles.

---

## The Vision

Most AI assistants treat every conversation as a blank slate. Saarthi turns this upside down:

```text
User talks naturally
        ↓
Gemma extracts key details & changes
        ↓
User approves candidate memories (Human-in-the-loop)
        ↓
MongoDB stores structured memory & relationships
        ↓
Future queries inject relevant context automatically
        ↓
Gemma reasons and prioritizes what actually matters
```

---

## 4 Core Views (Zero Extra Routes)

Everything in Saarthi is purposefully contained within exactly 4 routes, with deeper inspection powered by slide-over drawers, modals, and popovers:

1. **`/` — Landing & Interactive Extraction Demo**
   - Hero test card where anyone can type an update (e.g. *"I'm preparing for placements and struggle with Dynamic Programming"*) and test real-time memory extraction and approval.
   - Interactive comparison: Cloud Chatbots vs. Saarthi.
   - 100% Offline architecture explanation.

2. **`/dashboard` — Command Center**
   - **Dynamic Greeting & Context Counter**: Tailored to time of day.
   - **Saarthi's Take**: AI priority engine ranking the user's top priorities with clear "Why this?" explanations.
   - **Context Snapshot**: Quick stat cards for Active Goals, Key Weaknesses, Upcoming Events, and Preferences (each opening an interactive inspection drawer).
   - **Plan My Day Preview**: AI-generated time-blocked schedule respecting the user's habits (night study, workouts).
   - **Smart Extraction Card**: "Tell Saarthi anything" input card with instant candidate memory review.
   - **Ask Saarthi Box**: Quick conversational prompt jumping directly into context-injected reasoning.

3. **`/memories` — Memory Management & Visualization**
   - **Interactive Context Graph**: SVG visualization connecting `YOU` to active `GOALS`, `EVENTS`, `PREFERENCES`, and `WEAKNESSES`. Click any node for an instant inspection modal.
   - **Chronological Journey Timeline**: Visual milestone tracker showing memory evolution and completion milestones over time.
   - **Category Filters & Search**: Real-time filtering across goals, tasks, weaknesses, preferences, and events.
   - **Confidence & Source Badges**: Transparent indicators (`HIGH`, `MEDIUM`, `EXPLICIT`, `INFERRED`).

4. **`/ask` — Context-Injected Conversational Reasoning**
   - Natural chat interface powered by local Gemma 3.
   - **Expandable Context Drawer**: View the exact memories retrieved and injected into the prompt.
   - **"Why this answer?" Breakdown**: Gemma's transparent reasoning explaining how personal context shaped the recommendation.

---

## Architecture & Tech Stack

```text
                        SAARTHI ARCHITECTURE
                     
                     ┌───────────────────────────┐
                     │    Next.js 16 Front-End   │
                     │  (App Router + Tailwind)  │
                     └─────────────┬─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │   MongoDB / Mongoose   │    │   Ollama Local Engine  │
       │                        │    │                        │
       │ • Structured Memories  │    │ • Gemma 3 (gemma3:4b)  │
       │ • Confidence & Source  │    │ • Native JSON Schema   │
       │ • Status & Milestones  │    │ • Context Reasoning    │
       └────────────────────────┘    └────────────────────────┘
                    ▲                             ▲
                    └──────────────┬──────────────┘
                                   ▼
                       100% OFFLINE CAPABLE
```

- **Frontend**: Next.js 16 (React 19, TypeScript), Tailwind CSS, Framer Motion, Lucide Icons, Sonner notifications.
- **Database**: MongoDB via Mongoose schema with `userId`, `content`, `category`, `source`, `confidence`, `importance`, `status`, and timestamps.
- **AI Inference Engine**: Google Gemma 3 (`gemma3:4b`) running entirely locally via Ollama (`http://localhost:11434`).

---

## Getting Started

### 1. Prerequisites

- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.ai/)
- [MongoDB](https://www.mongodb.com/) (Local Community Edition or MongoDB Atlas URI)

### 2. Pull the Gemma 3 Model

```bash
# Pull Gemma 3 4B
ollama pull gemma3:4b

# Verify Ollama is running
ollama list
```

### 3. Clone and Install Dependencies

```bash
git clone https://github.com/your-repo/saarthi.git
cd saarthi
bun install
```

### 4. Configure Environment Variables

Create or edit `.env.local`:

```env
# MongoDB Connection String (Local or Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/saarthi

# Local Ollama Inference Engine
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:4b
```

### 5. Run the Application

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key Scenarios to Test

### 1. Natural Memory Extraction (Human-in-the-Loop)
- Enter: *"I have a DBMS exam on Friday and I struggle with Dynamic Programming"*
- Notice Saarthi automatically breaks it down into:
  - `[EVENT]` DBMS exam on Friday (Importance: 5, Confidence: High)
  - `[WEAKNESS]` Struggles with Dynamic Programming (Importance: 4)
- Click **"Remember both"** to instantly store them in MongoDB.

### 2. Daily Schedule Planner
- Click **"Plan my day"** on the Dashboard.
- Gemma generates a personalized, time-blocked schedule that accounts for:
  - 7:00 PM Workout routine
  - Night study preference
  - Urgent preparation for the DBMS exam

### 3. Contextual Question Answering
- Navigate to `/ask` and prompt: *"What should I focus on today?"*
- Observe how Gemma does not give generic advice—it references your specific upcoming DBMS exam, reminds you to tackle Dynamic Programming, and aligns with your evening study habits.
- Click **"✦ Based on 4 memories"** to see the exact context used.
- Click **"Why this answer?"** to inspect Gemma's reasoning breakdown.

### 4. Offline Privacy Proof
1. Turn off your machine's Wi-Fi / disconnect network.
2. Ask questions, extract new memories, or generate daily plans.
3. Every operation succeeds with zero cloud latency, zero external API costs, and total data privacy.

