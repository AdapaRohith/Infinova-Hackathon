# Infinova Hiring Trust Engine

Infinova is a recruiter-focused candidate analysis platform that reviews candidate claims and produces evidence-backed hiring reports.

It combines resume intelligence, identity cross-checks, and GitHub evidence review in one workflow.

## Why This Project

Most hiring tools optimize for collection and ranking. Infinova optimizes for trust.

The platform helps teams answer:

- Is this candidate identity consistent across submitted sources?
- Do listed skills have public evidence?
- Can the final hiring report be verified later without tampering?

## Core Capabilities

- AI-assisted resume analysis (summary, strengths, risks, score)
- 3-way identity verification across form input, resume, and GitHub/profile data
- Claim consistency checks and mismatch alerts
- Recruiter-friendly verdicting (`Trusted`, `Needs Review`, `High Risk`)

## How It Works

1. Recruiter submits candidate profile, resume, and GitHub/portfolio link.
2. The app extracts and normalizes resume information.
3. Identity and claim checks run across all available sources.
4. A final evidence-backed report and verdict are generated.

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- React Router
- Framer Motion
- PDF.js (`pdfjs-dist`)
- Browser persistence via `localStorage`
- Gemini API (`gemini-3.8-flash`) for candidate reports and GitHub evidence review

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Modern browser (Chrome/Edge/Firefox)

### Install

```bash
npm install
```

Create a `.env.local` file in the project root and add your Gemini key:

```bash
VITE_GEMINI_API_KEY=your-gemini-api-key
```

The Vite client sends Gemini requests directly from the browser. Restrict the key in Google AI Studio to the Gemini API and your app origins, and use a server-side proxy for production deployments where the key must remain private.

### Run Development Server

```bash
npm run dev
```

The app starts on the local Vite URL shown in your terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint checks
- `npm run deploy` - publish `dist/` with GitHub Pages

## Project Structure

```text
src/
	components/     Reusable UI and feature components
	pages/          Route-level pages (dashboard, analysis, verification)
	utils/          Candidate analysis, identity, and extraction logic
public/           Static assets
```

## Deployment (GitHub Pages)

```bash
npm run build
npm run deploy
```

The configured `homepage` in `package.json` is used for the published route.

## Recommended Demo Narrative

"Infinova evaluates more than resumes. It cross-checks identity and skill evidence to produce useful hiring reports."
