# Ollama Flashcards

A flashcard application for language learning powered by Ollama AI models. This app automatically generates meanings and example sentences for words you add to your collection.

## Features

- Add words to your flashcard collection
- Automatically get word definitions and example sentences using Ollama models
- Review flashcards with a spaced repetition approach
- Track your learning progress
- Filter flashcards due for review
- Works offline once flashcards are created

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Ollama](https://ollama.ai/) installed and running on your machine
- At least one language model pulled in Ollama (e.g., llama2, mistral, etc.)

## Setup

1. Clone this repository:
   ```
   git clone <repository-url>
   cd ollama-flashcards
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Make sure Ollama is running:
   ```
   ollama serve
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## How to Use

1. **Add Flashcards**: 
   - Click on the "Add Flashcard" tab
   - Enter a word you want to learn
   - Select the language (defaults to English)
   - Choose an Ollama model to generate the content
   - Click "Add Flashcard" to save it

2. **Review Flashcards**:
   - Go to "All Flashcards" to see your entire collection
   - Check "Due for Review" to focus on cards that need review
   - Click "Show Answer" to reveal the meaning and examples
   - Mark cards as reviewed after testing yourself

## Ollama Models

The app works with any text generation model available in Ollama. For best results:

1. Pull language-specific models if you're learning a specific language
2. Larger models generally provide better definitions and examples
3. Recommended models:
   - Mistral (general purpose)
   - Llama2 (good all-around performance)
   - Phi-2 (lighter weight option)

To pull a model in Ollama:
```
ollama pull mistral
```

## Data Storage

All flashcards are stored in your browser's localStorage. To backup your data:

1. Open browser developer tools
2. Go to Application tab > Storage > Local Storage
3. Find the data with key 'ollama-flashcards'
4. Copy the JSON data to a backup file

## License

MIT License

## Contributing

Contributions welcome! Please feel free to submit a Pull Request. 