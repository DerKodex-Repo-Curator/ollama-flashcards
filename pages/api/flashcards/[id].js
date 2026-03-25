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
  const { id } = req.query;

  // Check if ID exists
  if (!id) {
    return res.status(400).json({ error: 'Flashcard ID is required' });
  }

  // Handle GET request to fetch a single flashcard
  if (req.method === 'GET') {
    try {
      const flashcard = await prisma.flashcard.findUnique({
        where: { id },
      });

      if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }

      // Format the flashcard data
      let examples = [];
      try {
        examples = JSON.parse(flashcard.examples);
        examples = normalizeExamples(examples);
      } catch (e) {
        console.error('Error parsing examples:', e);
      }

      const formattedCard = {
        ...flashcard,
        examples,
        createdAt: flashcard.createdAt.toISOString(),
        lastReviewed: flashcard.lastReviewed ? flashcard.lastReviewed.toISOString() : null,
      };

      return res.status(200).json(formattedCard);
    } catch (error) {
      console.error('Error fetching flashcard:', error);
      return res.status(500).json({ error: 'Failed to fetch flashcard' });
    }
  }

  // Handle PUT request to update a flashcard
  if (req.method === 'PUT') {
    try {
      const { word, meaning, examples, language, lastReviewed, reviewCount } = req.body;

      const updateData = {};
      
      // Only update fields that are provided
      if (word !== undefined) updateData.word = word;
      if (meaning !== undefined) updateData.meaning = meaning;
      if (examples !== undefined) {
        const normalizedExamples = normalizeExamples(examples);
        updateData.examples = JSON.stringify(normalizedExamples);
      }
      if (language !== undefined) updateData.language = language;
      if (lastReviewed !== undefined) updateData.lastReviewed = new Date(lastReviewed);
      if (reviewCount !== undefined) updateData.reviewCount = reviewCount;

      const updatedFlashcard = await prisma.flashcard.update({
        where: { id },
        data: updateData,
      });

      // Format the response data
      let formattedExamples = [];
      try {
        formattedExamples = JSON.parse(updatedFlashcard.examples);
        formattedExamples = normalizeExamples(formattedExamples);
      } catch (e) {
        console.error('Error parsing examples:', e);
      }

      const formattedCard = {
        ...updatedFlashcard,
        examples: formattedExamples,
        createdAt: updatedFlashcard.createdAt.toISOString(),
        lastReviewed: updatedFlashcard.lastReviewed ? updatedFlashcard.lastReviewed.toISOString() : null,
      };

      return res.status(200).json(formattedCard);
    } catch (error) {
      console.error('Error updating flashcard:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
      return res.status(500).json({ error: 'Failed to update flashcard' });
    }
  }

  // Handle DELETE request to delete a flashcard
  if (req.method === 'DELETE') {
    try {
      await prisma.flashcard.delete({
        where: { id },
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Flashcard not found' });
      }
      return res.status(500).json({ error: 'Failed to delete flashcard' });
    }
  }

  // Handle PATCH request to mark as reviewed
  if (req.method === 'PATCH' && req.body.action === 'review') {
    try {
      const flashcard = await prisma.flashcard.findUnique({
        where: { id },
      });

      if (!flashcard) {
        return res.status(404).json({ error: 'Flashcard not found' });
      }

      const updatedFlashcard = await prisma.flashcard.update({
        where: { id },
        data: {
          lastReviewed: new Date(),
          reviewCount: (flashcard.reviewCount || 0) + 1,
        },
      });

      // Format the response data
      let formattedExamples = [];
      try {
        formattedExamples = JSON.parse(updatedFlashcard.examples);
        formattedExamples = normalizeExamples(formattedExamples);
      } catch (e) {
        console.error('Error parsing examples:', e);
      }

      const formattedCard = {
        ...updatedFlashcard,
        examples: formattedExamples,
        createdAt: updatedFlashcard.createdAt.toISOString(),
        lastReviewed: updatedFlashcard.lastReviewed.toISOString(),
      };

      return res.status(200).json(formattedCard);
    } catch (error) {
      console.error('Error updating review status:', error);
      return res.status(500).json({ error: 'Failed to update review status' });
    }
  }

  // Return 405 Method Not Allowed for other methods
  return res.status(405).json({ error: 'Method not allowed' });
} 