# 🤖 LocalAgent v1.0

**Your AI. Your machine. Your rules.**

A complete, privacy-first AI agent platform that runs entirely on your machine via Ollama. Zero cloud calls. Full autonomy. Forever yours.

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm
- **Ollama** (for local LLM)

### One-Command Setup

```bash
chmod +x install.sh
./install.sh
```

This will:
1. ✅ Check all dependencies
2. ✅ Pull llama3.2 model via Ollama
3. ✅ Install backend Python packages
4. ✅ Install frontend npm dependencies
5. ✅ Start both services automatically
6. ✅ Open browser to http://localhost:3002

---

## 📋 Architecture

### Backend (FastAPI)
- **48 REST API endpoints**
- **File-based persistence** (JSON/JSONL in `/backend/data/`)
- **Cross-session memory** system for continuous learning
- **Intelligent context builder** with smart message compression
- **Ollama integration** for local LLM (OpenAI-compatible API)
- **Optional integrations:**
  - ElevenLabs (text-to-speech, multilingual)
  - Twilio (voice calling)

### Frontend (Next.js 15 + React 19)
- **Interactive 3D grid** landing page (Three.js + OrbitControls)
- **⌘K Command Palette** for action search (integrated into Dashboard)
- **Minimizable chat overlay** with voice I/O (integrated into Dashboard)
- **Real-time Monitoring Dashboard** with geographical visualization
- **AI Ads Creation Workflow** for multi-modal ad generation
- **Prompts UI Library** with 500+ pre-defined prompt assets
- **Glassmorphic UI** with dark mode
- **Tailwind CSS** styling

### Key Features
- 🔐 **100% Local** - No cloud required
- 📊 **Real-time Monitoring** - Track Bitcoin, call usage, and events on a live world map
- 🎬 **AI Ads Creation** - Multi-step workflow for generating creative ad variations
- 🧠 **Prompts UI Library** - Access 500+ specialized assets for advanced agent behavior
- 🎮 **Interactive 3D Experience** - Spin the grid while chatting
- 🧠 **9 Prompt Types** - Task, Learn, Roles, Schedule, Time Target, Debate, Interview, Forbidden Words, Read
- 📊 **Session Management** - Archive/restore conversations
- 🔊 **Voice I/O** - Speech recognition + text-to-speech (optional)
- 💾 **Persistent Memory** - Cross-session learning

---

## 📦 Directory Structure

```
LocalAgent/
├── backend/
│   ├── main.py                 # FastAPI server (48 endpoints)
│   ├── prompt_system.py        # Prompt types & session management
│   ├── requirements.txt        # Python dependencies
│   ├── .env.template          # Configuration template
│   ├── data/                  # File-based storage
│   │   ├── sessions/          # Conversation archives
│   │   ├── recordings/        # Voice recordings
│   │   └── memory.jsonl       # Cross-session memory
│   └── venv/                  # Python virtual environment
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Landing page (3D interactive grid)
│   │   └── app/               # Main application hub
│   │       ├── page.tsx       # Dashboard with ⌘K menu
│   │       └── [view]/        # Sub-pages (sessions, prompts, etc.)
│   ├── components/
│   │   ├── Interactive3DGrid.tsx      # Full interactive 3D scene
│   │   ├── Interactive3DGridBg.tsx    # Subtle blurred background
│   │   ├── ActionSearchBar.tsx        # ⌘K command palette
│   │   ├── RemoteChat.tsx             # Chat overlay with 3D toggle
│   │   └── SheepRun.tsx               # Game component (archived)
│   ├── public/                # Assets (icons, logos)
│   ├── package.json           # npm dependencies
│   └── tailwind.config.ts     # Tailwind configuration
│
├── install.sh                 # One-command setup script
├── .claude/launch.json        # Dev server configurations
└── README.md                  # This file
```

---

## 🔧 Configuration

### Backend Setup (`.env`)

Create `/backend/.env`:

```bash
# Optional: Override default Ollama endpoint
OLLAMA_BASE_URL=http://localhost:11434

# Optional: ElevenLabs for text-to-speech
ELEVENLABS_API_KEY=your_key_here

# Optional: Twilio for voice calls
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend Setup (Environment Variables)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 🌐 API Endpoints

### Chat & Sessions
```
POST   /v1/chat              # Send message to AI
GET    /v1/sessions          # List all sessions
GET    /v1/sessions/{id}     # Get session details
DELETE /v1/sessions/{id}     # Archive session
POST   /v1/sessions/{id}/export  # Export session
```

### Models & Memory
```
GET    /v1/models            # List available Ollama models
GET    /v1/memory            # Get cross-session memory
POST   /v1/memory            # Add to memory
DELETE /v1/memory/{id}       # Remove from memory
```

### Prompts & System
```
GET    /v1/prompts           # List all prompt templates
POST   /v1/prompts           # Create prompt
PUT    /v1/prompts/{id}      # Update prompt
DELETE /v1/prompts/{id}      # Delete prompt
GET    /v1/dashboard/stats   # Dashboard statistics
```

### Monitoring & Ads
```
POST   /v1/monitoring/sessions  # Create monitoring session
GET    /v1/monitoring/sessions  # List monitoring sessions
POST   /v1/monitoring/sessions/{id}/stop # Stop monitoring
POST   /v1/ads/campaigns        # Create AI Ads campaign
POST   /v1/ads/campaigns/{id}/generate # Generate variations
```

### Voice (Optional)
```
POST   /v1/voice/record      # Record voice input
POST   /v1/voice/transcribe  # Transcribe audio
GET    /v1/voice/models      # List available TTS voices
```

---

## 🎮 Interactive Features

### Landing Page
- **3D Animated Grid** - Fully rotatable with mouse drag
- **Auto-rotating** - Smooth background animation
- **Animated boxes** - Floating 3D objects moving on grid
- **One-click launch** - "Launch App" button to enter dashboard

### Dashboard (`/app`)
- **⌘K Command Palette** - Type to search 50+ actions
- **Stats at a glance** - Sessions, messages, recordings, prompts
- **Quick actions** - Fast access to main features
- **Action search** - Category-based action discovery
- **Subtle 3D background** - Blurred grid for visual interest

### Chat Overlay
- **Minimizable chat** - Glassmorphic floating panel
- **Voice input/output** - Speech recognition + TTS
- **Model selector** - Choose between available Ollama models
- **3D grid toggle** (✨ button) - Full-screen interactive 3D while chatting
- **Auto-resizing input** - Smart textarea that grows with content

---

## 🚀 Running Locally

### Start Everything
```bash
./install.sh
```

### Or Start Manually

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
python main.py
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3002
```

**Terminal 3 - Ollama (if not auto-started):**
```bash
ollama serve
# Listens on http://localhost:11434
```

---

## 📊 Prompt Types

### 1. **TASK** - Action-oriented
```
Execute specific tasks with clear outcomes
Example: "Write a blog post about AI"
```

### 2. **LEARN** - Knowledge acquisition
```
Explain concepts and deep dive
Example: "Teach me about quantum computing"
```

### 3. **ROLES** - Role-based responses
```
Adopt persona for specialized output
Example: "As a Python expert, review my code"
```

### 4. **SCHEDULE** - Time-based planning
```
Create schedules and timelines
Example: "Plan a 2-week project schedule"
```

### 5. **TIME_TARGET** - Deadline-driven
```
Work backward from deadline
Example: "I have 1 hour to prepare presentation"
```

### 6. **DEBATE** - Multi-perspective analysis
```
Argue multiple sides of an issue
Example: "Pros and cons of remote work"
```

### 7. **INTERVIEW** - Q&A format
```
Interview-style conversation
Example: "Interview me for a job"
```

### 8. **FORBIDDEN_WORDS** - Constrained output
```
Avoid certain words/phrases
Example: "Explain AI without using the word 'intelligent'"
```

### 9. **READ** - Document analysis
```
Analyze and extract from documents
Example: "Summarize this research paper"
```

---

## 💾 Data Storage

### `/backend/data/` Directory

```
data/
├── sessions/
│   ├── session_UUID_1.json      # Individual session file
│   ├── session_UUID_2.json
│   └── ...
├── recordings/
│   ├── recording_UUID_1.wav     # Voice recordings
│   └── ...
└── memory.jsonl                 # Cross-session memory (line-delimited JSON)
```

### Session File Format
```json
{
  "id": "session-123",
  "created_at": "2025-02-22T10:00:00Z",
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Hello",
      "timestamp": "2025-02-22T10:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Hi! How can I help?",
      "timestamp": "2025-02-22T10:00:05Z"
    }
  ],
  "metadata": {
    "model": "llama3.2",
    "prompt_type": "TASK"
  }
}
```

---

## 🔐 Privacy & Security

✅ **Zero telemetry** - No data ever leaves your machine
✅ **No account required** - Run completely offline
✅ **Local LLM** - Via Ollama (not using OpenAI/proprietary APIs)
✅ **File-based storage** - You own all your data
✅ **Full autonomy** - Complete control over system behavior

**Important:** Keep your `/backend/data/` directory private - it contains all your conversations and memories.

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 8000 or 3002
lsof -ti:8000 | xargs kill -9
lsof -ti:3002 | xargs kill -9
```

### Ollama Model Issues
```bash
# List available models
ollama list

# Pull a specific model
ollama pull llama3.2

# Check Ollama status
curl http://localhost:11434/api/tags
```

### Build Cache Corruption
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Backend Errors
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt --upgrade
python main.py
```

---

## 📈 Performance Tips

1. **Choose appropriate model size** - Larger models (70B+) require more VRAM
2. **Limit chat history** - Memory system automatically compresses to last 24 messages
3. **Disable auto-rotate 3D grid** - On low-spec machines, simplify the scene
4. **Use local Ollama** - Always run Ollama on same machine for best performance
5. **Archive old sessions** - Reduces memory footprint of active sessions

---

## 🎯 Roadmap

- [ ] Multi-turn reasoning with extended context
- [ ] Custom fine-tuning of local models
- [ ] Plugin system for custom tools
- [ ] Real-time collaboration (local network)
- [ ] Advanced memory indexing and retrieval
- [ ] GUI model management
- [ ] Batch processing capabilities
- [ ] Analytics dashboard

---

## 💬 Support

For issues or questions:
1. Check `/backend/main.py` comments for endpoint details
2. Review `/backend/prompt_system.py` for prompt configuration
3. Check browser console for frontend errors
4. Review server logs: `tail -f /backend/data/activity.log`

---

## 📄 License

**LocalAgent v1.0** - Open source, fully yours to run locally.

No cloud. No tracking. No limits.

**Your AI. Your machine. Your rules.** 🔐

---

## 🚀 One-Time Payment Model

LocalAgent is distributed as a **one-time payment** with QR code access. Once installed, it's yours forever:

- No subscriptions
- No SaaS costs
- No recurring fees
- Full source code access
- Run as many instances as you want

**Coming soon to a machine near you!**

