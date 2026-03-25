import React, { useState } from 'react';
import { 
  ListItem as StyledListItem,
  ListItemWord,
  ListItemMeaning,
  ListItemMeta,
  ListItemActions,
  ListItemExpanded,
  ListItemMeaningFull,
  ListItemExamples,
  ListItemExample,
  ListItemCollapsed,
  Button
} from './StyledComponents';
import { deleteFlashcard, reviewFlashcard } from '../lib/flashcards';

const FlashcardListItem = ({ card, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    setIsExpanded(!isExpanded);
  };

  const handleReview = (e) => {
    e.stopPropagation();
    reviewFlashcard(card.id);
    onUpdate();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the flashcard for "${card.word}"?`)) {
      deleteFlashcard(card.id);
      onUpdate();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatExample = (example) => {
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
  };

  return (
    <StyledListItem onClick={handleToggle}>
      <ListItemWord>{card.word}</ListItemWord>
      {isExpanded ? (
        <ListItemExpanded onClick={(e) => e.stopPropagation()}>
          <ListItemMeaningFull>{card.meaning}</ListItemMeaningFull>
          {card.examples && card.examples.length > 0 && (
            <>
              <strong>Examples:</strong>
              <ListItemExamples>
                {card.examples.map((example, index) => (
                  <ListItemExample key={index}>
                    {formatExample(example)}
                  </ListItemExample>
                ))}
              </ListItemExamples>
            </>
          )}
          <ListItemMeta>
            Language: {card.language || 'Not specified'} · Created: {formatDate(card.createdAt)} · Last reviewed: {formatDate(card.lastReviewed)} · {card.reviewCount || 0} reviews
          </ListItemMeta>
          <ListItemActions>
            <Button margin="0" onClick={handleReview}>Review</Button>
            <Button margin="0" onClick={handleDelete}>Delete</Button>
          </ListItemActions>
        </ListItemExpanded>
      ) : (
        <>
          <ListItemCollapsed title={card.meaning}>{card.meaning}</ListItemCollapsed>
          <ListItemMeta>
            {formatDate(card.lastReviewed)} · {card.reviewCount || 0} reviews
          </ListItemMeta>
          <ListItemActions onClick={(e) => e.stopPropagation()}>
            <Button margin="0" onClick={handleReview}>Review</Button>
            <Button margin="0" onClick={handleDelete}>Delete</Button>
          </ListItemActions>
        </>
      )}
    </StyledListItem>
  );
};

export default FlashcardListItem;