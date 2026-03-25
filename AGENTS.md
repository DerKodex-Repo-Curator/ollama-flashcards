# AGENTS.md - Development Guidelines for Ollama Flashcards

## Project Overview
A Next.js flashcard app for language learning using Ollama AI models. Features automatic word definition generation and spaced repetition review system.

**Tech Stack**: Next.js 13, React 18, Styled Components, Prisma ORM, SQLite, Axios

---

## Build & Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Production server
npm start

# Lint (Next.js built-in ESLint)
npm run lint

# Prisma commands (if modifying schema)
npx prisma generate    # Regenerate client after schema changes
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open Prisma Studio for data management
```

**Note**: No test framework is currently configured. Add Jest + React Testing Library if implementing tests.

---

## Code Style Guidelines

### General JavaScript/React
- **Language**: JavaScript (ES6+), JSX for components
- **Semicolons**: Required
- **Quotes**: Single quotes for strings
- **Indentation**: 2 spaces
- **Line endings**: Unix-style (LF)
- **Trailing commas**: Not required but acceptable

### Naming Conventions
- **Components**: PascalCase (e.g., `FlashcardItem.js`, `AddFlashcard`)
- **Functions**: camelCase (e.g., `getFlashcards`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `OLLAMA_API_URL`)
- **Variables**: camelCase (e.g., `isLoading`, `flashcards`)
- **Styled Components**: PascalCase (e.g., `FlashcardGrid`, `TabButton`)
- **Props with special meaning**: Use `$` prefix for transient props (e.g., `$active` in styled-components)
- **Files**: PascalCase for components, camelCase for utilities

### Imports Order
1. React and Next.js imports
2. Third-party libraries (axios, styled-components)
3. Internal components
4. Utility functions
5. Styles (if any)

Example:
```javascript
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import FlashcardItem from '../components/FlashcardItem';
import { getFlashcards } from '../lib/flashcards';
```

### Component Structure
- Use functional components with hooks
- Destructure props in function parameters
- Place styled-components imports at the top
- Use JSDoc for function documentation

Example:
```javascript
/**
 * Generate word definition and examples using Ollama
 * @param {string} word - The word to get information for
 * @param {string} model - The Ollama model to use
 * @returns {Promise<{meaning: string, examples: string[]}>}
 */
export async function getWordInfo(word, model = 'llama2') {
  // Implementation
}
```

### Error Handling Best Practices
**ALWAYS initialize data before accessing it.** This prevents undefined destructuring errors.

```javascript
// WRONG - Will crash if cardProgress is undefined
const { easeFactor } = cardProgress;

// CORRECT - Initialize before use
if (!progress.cards[cardId]) {
  progress.cards[cardId] = initCardProgress();
}
const { easeFactor } = progress.cards[cardId];
```

**Debugging Protocol:**
1. **Check console first** - Look for JavaScript errors (TypeError, ReferenceError, etc.)
2. **Trace the error** - Find the exact line causing the issue
3. **Verify data flow** - Ensure data is initialized before accessing nested properties
4. **Don't symptom-chase** - Fix root causes, not downstream effects

### Styled Components Guidelines
- Export styled components from `StyledComponents.js`
- Use transient props (prefixed with `$`) for styling logic that shouldn't reach DOM
- Keep styles co-located or in dedicated styled-components file
- Use theme colors consistently (primary: `#4a6eb5`)

### State Management
- Use React hooks (useState, useEffect) for local state
- Lift state up when needed
- Use loading and error states for async operations

### Async Patterns
```javascript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');

try {
  setIsLoading(true);
  setError('');
  const result = await fetchData();
  setData(result);
} catch (err) {
  console.error('Descriptive error message:', err);
  setError('User-friendly error message');
} finally {
  setIsLoading(false);
}
```

### API Route Patterns
- Use standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Return appropriate status codes (200, 201, 400, 404, 405, 500)
- Normalize data in API layer (e.g., `normalizeExamples()`)
- Parse JSON strings from database before sending to client

### Prisma Best Practices
- Use global Prisma client singleton pattern (see `lib/prisma.js`)
- Store complex objects as JSON strings in database
- Parse JSON on retrieval, stringify on storage
- Use ISO strings for dates in API responses

---

## Database Schema

**Flashcard Model**:
- id: String (CUID)
- word: String
- meaning: String
- examples: String (JSON serialized array)
- language: String (default: "German")
- createdAt: DateTime
- lastReviewed: DateTime?
- reviewCount: Int (default: 0)

## Importing Data from CSV

The app supports importing flashcards from CSV files (e.g., DuoCards exports):

```bash
# Run the import script
node scripts/import-csv.js
```

**CSV Format Expected**:
- `front`: German word/phrase
- `back`: English translation
- `hint`: Example sentence in German
- `publishedAt`: ISO date string

The import script handles:
- Duplicate detection (skips cards with existing words)
- Malformed CSV lines (skips lines that can't be parsed)
- Date parsing from the CSV or defaults to current date
- JSON serialization of examples array

## Importing Data from Anki

The app supports importing flashcards from Anki deck files (.apkg):

```bash
# Run the import script with default path
node scripts/import-anki.js

# Or specify a custom path
node scripts/import-anki.js /path/to/your/deck.apkg
```

**Anki Import Features**:
- Extracts and parses Anki's SQLite database (supports both .anki2 and .anki21 formats)
- Maps Anki fields to flashcard structure:
  - First field → `word` (German word/phrase)
  - Second field → `meaning` (definition/explanation)
- Strips HTML tags from content
- Duplicate detection (skips existing words)
- Handles special field separators used by Anki

**Note**: The script expects the APKG file to be accessible at the specified path.

---

## Environment Requirements
- **Ollama**: Must be running locally on port 11434
- **Database**: SQLite (DATABASE_URL in .env)
- **Node**: v14 or later

---

## Critical Debugging Reminders

1. **When something "doesn't work", always check the browser console first** (F12)
2. **Follow error messages, not symptoms** - The stack trace tells you exactly where it broke
3. **Initialize before you destruct** - Never assume nested data exists
4. **Trace data flow** - Follow the path from source to consumption
5. **Use console.error for debugging** - Include descriptive context

Example error trace:
```
TypeError: Cannot destructure property 'easeFactor' of 'cardProgress' as it is undefined
  → Check where cardProgress is assigned
  → Verify it's initialized before use
  → Add initialization if missing
```
