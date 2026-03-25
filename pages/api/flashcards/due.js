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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the days threshold from query params, default to 1 day
    const daysThreshold = parseInt(req.query.days || '1', 10);
    
    // Calculate the date threshold (now - daysThreshold)
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - (daysThreshold * 24 * 60 * 60 * 1000));
    
    // Get flashcards that are either never reviewed or last reviewed before threshold
    const dueFlashcards = await prisma.flashcard.findMany({
      where: {
        OR: [
          { lastReviewed: null },
          { lastReviewed: { lt: thresholdDate } },
        ],
      },
      orderBy: {
        lastReviewed: 'asc',
      },
    });

    // Format the flashcards data
    const formattedFlashcards = dueFlashcards.map(card => {
      let examples = [];
      try {
        examples = JSON.parse(card.examples);
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
    console.error('Error fetching due flashcards:', error);
    return res.status(500).json({ error: 'Failed to fetch due flashcards' });
  }
} 