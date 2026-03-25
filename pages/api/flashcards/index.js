import { prisma } from '../../../lib/prisma';

// Helper function to normalize examples to ensure they're strings
const normalizeExamples = (examples) => {
  if (!Array.isArray(examples)) return [];
  
  return examples.map(example => {
    if (typeof example === 'string') {
      return example;
    }
    if (example && typeof example === 'object') {
      if (example.sentence) {
        return example.translation 
          ? `${example.sentence} - ${example.translation}` 
          : example.sentence;
      }
      return JSON.stringify(example);
    }
    return '';
  });
};

export default async function handler(req, res) {
  // Handle GET request to fetch all flashcards
  if (req.method === 'GET') {
    try {
      const flashcards = await prisma.flashcard.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Parse the examples string back to array for each flashcard
      const formattedFlashcards = flashcards.map(card => {
        let examples = [];
        try {
          examples = JSON.parse(card.examples);
          // Normalize examples to ensure they're strings
          examples = normalizeExamples(examples);
        } catch (e) {
          console.error('Error parsing examples:', e);
        }
        
        return {
          ...card,
          examples,
          createdAt: card.createdAt.toISOString(),
          lastReviewed: card.lastReviewed ? card.lastReviewed.toISOString() : null,
        };
      });

      return res.status(200).json(formattedFlashcards);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      return res.status(500).json({ error: 'Failed to fetch flashcards' });
    }
  }

  // Handle POST request to create a new flashcard
  if (req.method === 'POST') {
    try {
      const { word, meaning, examples, language } = req.body;

      // Validate required fields
      if (!word || !meaning) {
        return res.status(400).json({ error: 'Word and meaning are required' });
      }

      // Normalize examples to ensure they're strings
      const normalizedExamples = normalizeExamples(examples);

      const createdFlashcard = await prisma.flashcard.create({
        data: {
          word,
          meaning,
          examples: JSON.stringify(normalizedExamples), // Store examples as a JSON string
          language: language || 'German',
        },
      });

      // Format the response data
      const formattedCard = {
        ...createdFlashcard,
        examples: normalizedExamples,
        createdAt: createdFlashcard.createdAt.toISOString(),
        lastReviewed: null,
      };

      return res.status(201).json(formattedCard);
    } catch (error) {
      console.error('Error creating flashcard:', error);
      return res.status(500).json({ error: 'Failed to create flashcard' });
    }
  }

  // Return 405 Method Not Allowed for other methods
  return res.status(405).json({ error: 'Method not allowed' });
} 