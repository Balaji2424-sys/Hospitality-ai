# RuralCare AI

Full-stack AI-powered healthcare platform inspired by Practo with multilingual support, voice-assisted diagnosis, medical history, doctor analytics, and smart appointment booking.

## Stack

- `client/`: React + Tailwind CSS
- `server/`: Node.js + Express + MongoDB
- `ai-service/`: FastAPI + scikit-learn + gTTS

## Quick Start

### Server

```bash
cd server
npm install
npm run dev
```

### AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8001
```

### Client

```bash
cd client
npm install
npm run dev
```
