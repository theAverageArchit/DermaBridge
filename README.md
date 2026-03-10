# DermaBridge

> A dual-screen clinical communication tool enabling dermatologists with speech impairments to communicate seamlessly with patients.

A dermatologist types on a private **Doctor's View**. The patient reads the output in real time on a dedicated **Patient's View** displayed on a second monitor. No internet required — sync happens entirely in the browser using the native BroadcastChannel API.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Running the App](#running-the-app)
- [Git Workflow](#git-workflow)
- [Feature Roadmap](#feature-roadmap)

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 18 | Component-based, fast to develop |
| Build Tool | Vite | Instant hot reload, fast builds |
| Styling | Tailwind CSS | Utility-first, no CSS files to manage |
| Routing | React Router v6 | Two routes: `/doctor` and `/patient` |
| Screen Sync | BroadcastChannel API | Browser-native, zero latency, no server needed |
| State Management | React useState / useContext | Sufficient for this app's complexity |
| Storage | localStorage | Phrase library, font preferences, draft recovery |
| TTS | Web Speech API → ElevenLabs (Phase 3) | Free, browser-native, works offline |
| AI Features | Claude API (Anthropic) | Translation, diagnosis assist (Phase 3) |
| Desktop Wrapper | Electron.js (Phase 4) | Auto-launch, offline packaging |

---

## Project Structure

```
dermabridge/
├── public/
├── src/
│   ├── pages/
│   │   ├── DoctorView.jsx        # Private screen facing the doctor
│   │   └── PatientView.jsx       # Full-screen display facing the patient
│   ├── components/
│   │   ├── doctor/
│   │   │   ├── TopBar.jsx        # Session timer, font controls, language toggle
│   │   │   ├── PhraseLibrary.jsx # Categorised quick-send phrase sidebar
│   │   │   ├── ComposeArea.jsx   # Text input, autocomplete, shorthand expansion
│   │   │   └── HistoryPanel.jsx  # Last N sent messages for reference
│   │   └── patient/
│   │       ├── MessageDisplay.jsx  # Large message display with history fade
│   │       └── TypingIndicator.jsx # "Doctor is composing..." indicator
│   ├── hooks/
│   │   └── useBroadcastChannel.js  # Handles all cross-window sync logic
│   ├── data/
│   │   └── phrases.js            # Starter phrase library + shorthands + autocomplete terms
│   ├── main.jsx                  # App entry point + router setup
│   └── index.css                 # Tailwind base styles
├── index.html
├── vite.config.js
└── package.json
```

---

## Architecture

### How the two screens communicate

Both views run as separate browser windows opened to the same local Vite dev server (`localhost:5173`). They are connected via the browser's native **BroadcastChannel API** — a named channel called `dermabridge` that both windows subscribe to.

```
Doctor's View (localhost:5173/doctor)
        │
        │  channel.postMessage({ type: 'composing' })
        │  channel.postMessage({ type: 'message', text, lang })
        │  channel.postMessage({ type: 'clear' })
        │
        ▼
  BroadcastChannel('dermabridge')
        │
        ▼
Patient's View (localhost:5173/patient)
```

No internet connection, no WebSocket server, no backend — just two browser windows on the same machine talking to each other natively.

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

### Installation

```bash
# Clone the repo
git clone git@github-personal:theAverageArchit/DermaBridge.git
cd DermaBridge

# Install dependencies
npm install
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

Both windows will sync in real time via BroadcastChannel — no refresh needed.

### Build for production

```bash
npm run build
npm run preview
```

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

### Phase 1 — MVP ✅ (current)
- Dual-screen layout with React Router
- Real-time sync via BroadcastChannel
- Composing indicator on Patient Screen
- Phrase library with category filters
- Adjustable font size
- Message history
- Keyboard shortcuts (Enter to send, Shift+Enter for newline, Esc to clear)
- New Patient / clear session flow

### Phase 2 — Communication Enhancements
- Shorthand expansion engine (e.g. `ec` → full eczema sentence)
- Dermatology autocomplete dictionary
- Custom phrase management (add, edit, delete)
- Phrases stored in localStorage as JSON

### Phase 3 — AI & Language
- Hindi / English toggle with Claude API translation
- Text-to-Speech via Web Speech API (`hi-IN` / `en-IN`)
- AI Diagnosis Assistant — keyword → full clinical sentence via Claude API
- ElevenLabs API fallback for higher quality TTS

### Phase 4 — Polish & Packaging
- Electron.js desktop app wrapping the same React frontend
- Auto-launch on system startup
- Session summary — Claude API formats message history into a visit note PDF
- Image display — push a skin diagram to the Patient Screen
- Multi-device support — Patient View as a PWA over local Wi-Fi



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
