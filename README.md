# Saarthi 🧠

> **Your memory. Your context. Your AI.**  
> A private, local-first personal AI companion that doesn't just answer questions—it understands your life, goals, deadlines, preferences, and struggles.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Ollama](https://img.shields.io/badge/AI-Gemma_3_4B_(Ollama)-orange)](https://ollama.ai/)
[![Database](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com/)

---

## 🌟 Vision & Overview

Most AI assistants treat every conversation as a blank slate, forgetting your goals, habits, and priorities the moment you start a new thread. 

**Saarthi** flips this paradigm:
1. **Local-First & Private**: Powered by **Gemma 3 (4B)** running locally via **Ollama**, ensuring 100% data privacy with zero cloud latency and zero external API fees.
2. **Structured Long-Term Memory**: Automatically extracts, categorizes, and tracks your personal context in **MongoDB** with explicit confidence ratings (`HIGH`, `MEDIUM`, `EXPLICIT`, `INFERRED`).
3. **Human-in-the-Loop Approval**: You stay in control of what Saarthi remembers with instant candidate memory approval before persistence.
4. **Context-Injected Reasoning**: Dynamically retrieves and injects relevant active memories into prompt context to provide personalized daily planning and advice.

```text
User talks naturally
        ↓
Gemma extracts key details & candidate changes
        ↓
User approves candidate memories (Human-in-the-loop)
        ↓
MongoDB stores structured memory & entity relationships
        ↓
Future queries inject relevant context automatically
        ↓
Gemma reasons and prioritizes what actually matters
```

---

## 🚀 Key Features & Core Views

Saarthi organizes your personal context within 4 focused views:

### 1. `/` — Landing & Interactive Extraction Demo
- **Live Memory Extraction Playground**: Test memory extraction in real time (*e.g., "I'm preparing for placements and struggle with Dynamic Programming"*).
- **Architecture & Privacy Comparison**: Interactive breakdown of Cloud Chatbots vs. Saarthi's 100% offline, local-first model.

### 2. `/dashboard` — Personal Command Center
- **Dynamic Greeting & Context Counter**: Tailored greeting adapted to the time of day.
- **Saarthi's Take**: AI priority engine ranking top priorities with clear "Why this?" reasoning.
- **Context Snapshots**: Interactive stat cards for Active Goals, Key Weaknesses, Upcoming Events, and Preferences (with side-drawer inspection).
- **Plan My Day Preview**: AI-generated time-blocked schedule respecting your personal habits (*e.g., night study, workout routines*).
- **Smart Extraction Card**: "Tell Saarthi anything" input with candidate memory review.

### 3. `/memories` — Context Graph & Memory Tracker
- **Interactive Context Graph**: SVG visualization connecting `YOU` to active `GOALS`, `EVENTS`, `PREFERENCES`, and `WEAKNESSES`.
- **Chronological Journey Timeline**: Visual milestone tracker showing memory evolution and completion milestones over time.
- **Filtering & Search**: Category-based filtering across goals, tasks, weaknesses, preferences, and events.
- **Transparency Indicators**: Transparent confidence ratings and extraction source tracking.

### 4. `/ask` — Context-Injected Conversational Reasoning
- **Conversational Chat**: Interactive interface powered by local Gemma 3.
- **Context Drawer**: Inspect exact memories retrieved and injected into the prompt.
- **"Why this answer?" Breakdown**: Gemma's transparent reasoning explaining how personal context shaped the recommendation.

---

## 📐 Architecture & Tech Stack

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

- **Frontend**: Next.js 16 (React 19, TypeScript), Tailwind CSS v4, Framer Motion, Lucide Icons, Radix UI, Sonner notifications.
- **Database**: MongoDB via Mongoose schema tracking `userId`, `content`, `category`, `source`, `confidence`, `importance`, `status`, and timestamps.
- **AI Engine**: Google Gemma 3 (`gemma3:4b`) running locally via Ollama (`http://localhost:11434`).

---

## 🛠️ API Routes Overview

| Route | Method | Description |
|---|---|---|
| `/api/chat` | `POST` | Generates context-injected responses using local Gemma 3. |
| `/api/memories` | `GET`, `POST` | Fetches active memories or manually creates a new memory. |
| `/api/memories/[id]` | `PUT`, `DELETE` | Updates memory status/importance or deletes a memory. |
| `/api/memories/extract` | `POST` | Extracts candidate memories from raw text via Ollama structured output. |
| `/api/plan` | `POST` | Generates a personalized daily schedule based on active user context. |
| `/api/brief` | `GET` | Fetches "Saarthi's Take" AI summary and context counters. |
| `/api/context` | `GET` | Retrieves context graph nodes and relationships. |
| `/api/health` | `GET` | System health check (MongoDB connection & Ollama readiness). |
| `/api/seed` | `POST` | Populates sample initial memories for quick testing. |

---

## ⚡ Getting Started

### 1. Prerequisites

- **Node.js** (v18+) or **Bun** (v1.0+)
- **Ollama** installed locally ([ollama.ai](https://ollama.ai/))
- **MongoDB** running locally or a MongoDB Atlas URI

### 2. Pull Gemma 3 Model

```bash
# Pull Google Gemma 3 4B model
ollama pull gemma3:4b

# Verify Ollama service is running
ollama list
```

### 3. Clone Repository & Install Dependencies

```bash
git clone https://github.com/Abhishek-IITP/Saarthi.git
cd Saarthi

# Using Bun
bun install

# Or using NPM
npm install
```

### 4. Set Up Environment Variables

Create `.env.local` in the project root:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/saarthi

# Local Ollama Service Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:4b
```

### 5. Run Development Server

```bash
# Using Bun
bun dev

# Or using NPM
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Key Testing Scenarios

1. **Natural Memory Extraction (Human-in-the-Loop)**
   - Enter: *"I have a DBMS exam on Friday and I struggle with Dynamic Programming"*
   - Observe Saarthi automatically parsing candidate items:
     - `[EVENT]` DBMS exam on Friday
     - `[WEAKNESS]` Struggles with Dynamic Programming
   - Click **"Remember both"** to persist to MongoDB.

2. **Daily Schedule Planner**
   - Click **"Plan my day"** on `/dashboard`.
   - Gemma builds a tailored schedule balancing exams, weakness focus, and personal preferences (*e.g., workouts*).

3. **Contextual Q&A**
   - Head to `/ask` and prompt: *"What should I focus on today?"*
   - Verify that answers explicitly incorporate active memories from MongoDB.

4. **100% Offline Mode**
   - Turn off Wi-Fi / network access.
   - Run memory extraction, planning, and chat—all features execute locally without external dependencies.

---

## 📁 Folder Structure

```text
saarthi-nextjs/
├── app/                  # Next.js 16 App Router (pages & API routes)
│   ├── api/              # Backend API handlers (chat, memories, plan, etc.)
│   ├── ask/              # Conversational interface page
│   ├── dashboard/        # Main user command center page
│   ├── memories/         # Context graph & memory management page
│   └── page.tsx          # Landing page & live extraction demo
├── components/           # Reusable UI components & modals
├── lib/                  # Database connections & AI provider helpers
├── models/               # Mongoose schemas (Memory, User)
├── public/               # Static assets & graphics
├── types/                # TypeScript interfaces & types
├── .env.example          # Template environment variables
├── LICENSE               # MIT License
└── package.json          # Dependency list & project scripts
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](file:///c:/Users/trade/Downloads/saarthi-nextjs/LICENSE) for more information.
