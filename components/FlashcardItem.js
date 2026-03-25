import React from 'react';
import { 
  Flashcard, 
  FlashcardWord, 
  FlashcardMeaning, 
  FlashcardExamples, 
  FlashcardExample,
  FlashcardControls,
  FlashcardMeta,
  Button
} from './StyledComponents';
import { deleteFlashcard, reviewFlashcard } from '../lib/flashcards';

const FlashcardItem = ({ card, onUpdate }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleReview = () => {
    reviewFlashcard(card.id);
    onUpdate();
  };
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the flashcard for "${card.word}"?`)) {
      deleteFlashcard(card.id);
      onUpdate();
    }
  };
  
  // Format the date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Format example to display correctly whether it's a string or an object
  const formatExample = (example) => {
    if (typeof example === 'string') {
      return example;
    }
    
    // Handle the case where example is an object with type, sentence, translation
    if (example && typeof example === 'object') {
      if (example.sentence) {
        return example.translation 
          ? `${example.sentence} - ${example.translation}` 
          : example.sentence;
      }
      // If the object structure is different, try to convert it to string
      return JSON.stringify(example);
    }
    
    // Fallback for any other case
    return '';
  };
  
  return (
    <Flashcard>
      <FlashcardWord>{card.word}</FlashcardWord>
      
      {isFlipped ? (
        <>
          <FlashcardMeaning>{card.meaning}</FlashcardMeaning>
          
          {card.examples && card.examples.length > 0 && (
            <>
              <strong>Examples:</strong>
              <FlashcardExamples>
                {card.examples.map((example, index) => (
                  <FlashcardExample key={index}>
                    {formatExample(example)}
                  </FlashcardExample>
                ))}
              </FlashcardExamples>
            </>
          )}
          
          <FlashcardMeta>
            Language: {card.language || 'Not specified'}<br />
            Created: {formatDate(card.createdAt)}<br />
            Last reviewed: {formatDate(card.lastReviewed)}<br />
            Review count: {card.reviewCount || 0}
          </FlashcardMeta>
        </>
      ) : (
        <FlashcardMeta>
          Click "Show Answer" to see the meaning and examples
        </FlashcardMeta>
      )}
      
      <FlashcardControls>
        <Button onClick={handleFlip}>
          {isFlipped ? 'Hide Answer' : 'Show Answer'}
        </Button>
        <div>
          <Button margin="0 0.5rem 0 0" onClick={handleReview}>
            Mark as Reviewed
          </Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </FlashcardControls>
    </Flashcard>
  );
};

export default FlashcardItem; 