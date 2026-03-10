# DermaBridge

> A dual-screen clinical communication tool enabling dermatologists with speech impairments to communicate seamlessly with patients.

A dermatologist types on a private **Doctor's View**. The patient reads the output in real time on a dedicated **Patient's View** displayed on a second monitor. Sync happens entirely in the browser using the native BroadcastChannel API. AI features (translation, diagnosis autocomplete, TTS) use the Anthropic Claude API and Web Speech API.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
- [Features](#features)
- [Git Workflow](#git-workflow)
- [Feature Roadmap](#feature-roadmap)

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 19 + React Compiler | Component-based, automatic memoization |
| Build Tool | Vite 7 | Instant hot reload, fast builds |
| Styling | Tailwind CSS 4 | Utility-first, no CSS files to manage |
| Routing | React Router v7 | Two routes: `/doctor` and `/patient` |
| Screen Sync | BroadcastChannel API | Browser-native, zero latency, no server needed |
| State Persistence | localStorage via custom hook | Phrase library, shorthands, font prefs, draft recovery |
| TTS | Web Speech API | Free, browser-native, works offline |
| AI Translation | Claude API (Anthropic) | EN → Hindi translation for patient display |
| AI Autocomplete | Claude API (Anthropic) | Keyword → full clinical sentence expansion |

---

## Project Structure

```
dermabridge/
├── public/
├── src/
│   ├── pages/
│   │   ├── DoctorView.jsx          # Private screen facing the doctor
│   │   └── PatientView.jsx         # Full-screen display facing the patient
│   ├── components/
│   │   ├── doctor/
│   │   │   ├── TopBar.jsx          # Logo, session timer, font controls, language toggle, new patient
│   │   │   ├── PhraseLibrary.jsx   # Categorised quick-send phrase sidebar (add/edit/delete)
│   │   │   ├── ComposeArea.jsx     # Text input, autocomplete, shorthand expansion, AI suggest
│   │   │   ├── DiagnosisPopup.jsx  # AI suggestion panel with accept/dismiss
│   │   │   ├── ShorthandPanel.jsx  # Collapsible shorthand management (add/delete/reset)
│   │   │   └── HistoryPanel.jsx    # Last N sent messages with reuse
│   │   └── patient/
│   │       ├── MessageDisplay.jsx  # Large message display with history fade
│   │       └── TypingIndicator.jsx # "Doctor is composing..." bouncing dots
│   ├── hooks/
│   │   ├── useBroadcastChannel.js  # Cross-window sync via BroadcastChannel
│   │   ├── useLocalStorage.js      # Generic localStorage-backed state hook
│   │   ├── usePhrases.js           # Phrase library CRUD with persistence
│   │   └── useShorthands.js        # Shorthand mappings CRUD with persistence
│   ├── services/
│   │   ├── diagnose.js             # Claude API — keyword → clinical sentence autocomplete
│   │   ├── translate.js            # Claude API — EN → Hindi translation
│   │   └── tts.js                  # Web Speech API text-to-speech (en-IN / hi-IN)
│   ├── data/
│   │   └── phrases.js              # Default phrases, categories, shorthands, autocomplete terms
│   ├── main.jsx                    # App entry point + router setup
│   └── index.css                   # Tailwind base styles
├── samples/
├── index.html
├── vite.config.js
└── package.json
```

---

## Architecture

### How the two screens communicate

Both views run as separate browser windows opened to the same Vite dev server (`localhost:5173`). They are connected via the browser's native **BroadcastChannel API** — a named channel called `dermabridge` that both windows subscribe to.

```
Doctor's View (localhost:5173/doctor)
        │
        │  channel.postMessage({ type: 'composing' })
        │  channel.postMessage({ type: 'message', text, lang })
        │  channel.postMessage({ type: 'font', size })
        │  channel.postMessage({ type: 'clear' })
        │
        ▼
  BroadcastChannel('dermabridge')
        │
        ▼
Patient's View (localhost:5173/patient)
```

No internet connection required for core functionality — just two browser windows on the same machine talking to each other natively. AI features (translation, diagnosis suggest) require an Anthropic API key.

### Message types

| Type | Payload | Triggered when |
|---|---|---|
| `composing` | — | Doctor starts typing |
| `message` | `{ text, lang }` | Doctor clicks Send or presses Enter |
| `clear` | — | Doctor clicks New Patient |
| `font` | `{ size }` | Doctor adjusts patient font size |
| `lang` | `{ lang }` | Doctor toggles EN / हिंदी |

---

## Getting Started

### Prerequisites

- Node.js v20+
- npm
- Chrome (recommended — best BroadcastChannel DevTools support)
- Anthropic API key (for AI features)

### Installation

```bash
# Clone the repo
git clone git@github-personal:theAverageArchit/DermaBridge.git
cd DermaBridge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Anthropic API key to .env:
# VITE_ANTHROPIC_API_KEY=your-key-here
```

---

## Running the App

```bash
npm run dev
```

This starts the Vite dev server at `http://localhost:5173`.

Then open **two browser windows**:

| Window | URL | Display |
|---|---|---|
| Laptop screen | `http://localhost:5173/doctor` | Faces the doctor |
| Patient monitor | `http://localhost:5173/patient` | Faces the patient (run fullscreen with F11) |

Both windows sync in real time via BroadcastChannel — no refresh needed.

### Build for production

```bash
npm run build
npm run preview
```

---

## Features

### Doctor's View

| Feature | Details |
|---|---|
| **Compose Area** | Full text editor with Enter to send, Shift+Enter for newline, Esc to clear |
| **Phrase Library** | Categorised quick-send phrases (Greetings, Exam, Diagnosis, Instructions, Follow-up) with add/edit/delete and localStorage persistence |
| **Shorthand Expansion** | Type `ec` + Space → auto-expands to full eczema sentence. Custom shorthands supported |
| **Autocomplete** | Dermatology term suggestions as you type, accept with Tab |
| **AI Diagnosis Suggest** | Ctrl+Space → Claude API expands keywords into a full clinical sentence |
| **Font Size Control** | A−/A+ buttons adjust patient screen font (32–80px) |
| **Language Toggle** | Switch between EN and हिंदी with Claude-powered translation |
| **Message History** | Last 10 sent messages with click-to-reuse |
| **New Patient** | Clears all messages and resets the patient screen |

### Patient's View

| Feature | Details |
|---|---|
| **Large Message Display** | Current message prominently displayed at configurable font size |
| **Message History** | Previous messages fade behind the current one |
| **Typing Indicator** | Bouncing dots when the doctor is composing |
| **Text-to-Speech** | Messages read aloud via Web Speech API (en-IN / hi-IN) |
| **Hindi Translation** | Messages auto-translated via Claude API when language is set to Hindi |

### Keyboard Shortcuts (Doctor's View)

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift+Enter` | New line |
| `Esc` | Clear draft |
| `Tab` | Accept autocomplete suggestion |
| `Space` | Expand shorthand (when applicable) |
| `Ctrl+Space` | Trigger AI diagnosis suggestion |

---

## Git Workflow

Direct pushes to `main` are protected. All changes go through feature branches.

```bash
# Start a new feature
git checkout -b feature/your-feature-name

# Make your changes, then commit
git add .
git commit -m "feat: describe what you built"

# Push your branch
git push origin feature/your-feature-name

# Open a Pull Request on GitHub → merge into main
```

### Commit message conventions

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI / styling changes |
| `refactor:` | Code restructure, no behaviour change |
| `chore:` | Config, deps, tooling |

---

## Feature Roadmap

### Phase 1 — MVP ✅
- Dual-screen layout with React Router
- Real-time sync via BroadcastChannel
- Composing indicator on Patient Screen
- Phrase library with category filters
- Adjustable font size
- Message history
- Keyboard shortcuts (Enter to send, Shift+Enter for newline, Esc to clear)
- New Patient / clear session flow

### Phase 2 — Communication Enhancements ✅
- Shorthand expansion engine (e.g. `ec` → full eczema sentence)
- Dermatology autocomplete dictionary with Tab to accept
- Custom phrase management (add, edit, delete)
- Custom shorthand management (add, delete, reset)
- All user data persisted in localStorage

### Phase 3 — AI & Language ✅
- Hindi / English toggle with Claude API translation
- Text-to-Speech via Web Speech API (`hi-IN` / `en-IN`)
- AI Diagnosis Autocomplete — keyword → full clinical sentence via Claude API (Ctrl+Space)

### Phase 4 — Polish & Packaging
- Electron.js desktop app wrapping the same React frontend
- Auto-launch on system startup
- Session summary — Claude API formats message history into a visit note PDF
- Image display — push a skin diagram to the Patient Screen
- Multi-device support — Patient View as a PWA over local Wi-Fi
