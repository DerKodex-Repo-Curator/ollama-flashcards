import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Container, 
  Header, 
  Title, 
  TabContainer, 
  TabButtons, 
  TabButton, 
  Button, 
  FlashcardGrid, 
  FlashcardList,
  EmptyState,
  Loader,
  Error,
  SortContainer,
  Select,
  ViewModeSwitcher,
  ViewModeButton,
  ControlsRow
} from '../components/StyledComponents';
import FlashcardItem from '../components/FlashcardItem';
import FlashcardListItem from '../components/FlashcardListItem';
import AddFlashcard from '../components/AddFlashcard';
import { getFlashcards, getReviewDueFlashcards } from '../lib/flashcards';

export default function Home() {
  const [flashcards, setFlashcards] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'due', 'add'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('created-desc');
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'list', 'flashcards'

  useEffect(() => {
    const loadFlashcards = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        if (activeTab === 'all') {
          const cards = await getFlashcards();
          setFlashcards(cards);
        } else if (activeTab === 'due') {
          const dueCards = await getReviewDueFlashcards();
          setFlashcards(dueCards);
        }
      } catch (err) {
        console.error('Error loading flashcards:', err);
        setError('Failed to load flashcards. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFlashcards();
  }, [activeTab, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const sortedFlashcards = React.useMemo(() => {
    if (!flashcards || flashcards.length === 0) return flashcards;

    const sortedCards = [...flashcards];

    switch (sortBy) {
      case 'created-desc':
        return sortedCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'created-asc':
        return sortedCards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'word-asc':
        return sortedCards.sort((a, b) => a.word.localeCompare(b.word, undefined, { sensitivity: 'base' }));
      case 'word-desc':
        return sortedCards.sort((a, b) => b.word.localeCompare(a.word, undefined, { sensitivity: 'base' }));
      case 'reviewed-desc':
        return sortedCards.sort((a, b) => {
          if (!a.lastReviewed && !b.lastReviewed) return 0;
          if (!a.lastReviewed) return 1;
          if (!b.lastReviewed) return -1;
          return new Date(b.lastReviewed) - new Date(a.lastReviewed);
        });
      case 'reviewed-asc':
        return sortedCards.sort((a, b) => {
          if (!a.lastReviewed && !b.lastReviewed) return 0;
          if (!a.lastReviewed) return -1;
          if (!b.lastReviewed) return 1;
          return new Date(a.lastReviewed) - new Date(b.lastReviewed);
        });
      case 'count-desc':
        return sortedCards.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'count-asc':
        return sortedCards.sort((a, b) => (a.reviewCount || 0) - (b.reviewCount || 0));
      case 'random':
        return sortedCards.sort(() => Math.random() - 0.5);
      default:
        return sortedCards;
    }
  }, [flashcards, sortBy]);

  return (
    <Container>
      <Head>
        <title>Ollama Flashcards</title>
        <meta name="description" content="Flashcard app for language learning powered by Ollama" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header>
        <Title>Ollama Flashcards</Title>
      </Header>

      <TabContainer>
        <TabButtons>
          <TabButton 
            $active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            All Flashcards
          </TabButton>
          <TabButton 
            $active={activeTab === 'due'} 
            onClick={() => setActiveTab('due')}
          >
            Due for Review
          </TabButton>
          <TabButton 
            $active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')}
          >
            Add Flashcard
          </TabButton>
        </TabButtons>

        {error && <Error>{error}</Error>}

        {(activeTab === 'all' || activeTab === 'due') && (
          <>
            <ControlsRow>
              <SortContainer>
                <label htmlFor="sort-select">Sort by:</label>
                <Select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created-desc">Created: Newest First</option>
                  <option value="created-asc">Created: Oldest First</option>
                  <option value="word-asc">Word: A-Z</option>
                  <option value="word-desc">Word: Z-A</option>
                  <option value="reviewed-desc">Last Reviewed: Most Recent</option>
                  <option value="reviewed-asc">Last Reviewed: Least Recent</option>
                  <option value="count-desc">Review Count: Highest</option>
                  <option value="count-asc">Review Count: Lowest</option>
                  <option value="random">Random Shuffle</option>
                </Select>
              </SortContainer>

              <ViewModeSwitcher>
                <ViewModeButton 
                  $active={viewMode === 'cards'} 
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </ViewModeButton>
                <ViewModeButton 
                  $active={viewMode === 'list'} 
                  onClick={() => setViewMode('list')}
                >
                  List
                </ViewModeButton>
                <ViewModeButton 
                  $active={viewMode === 'flashcards'} 
                  onClick={() => setViewMode('flashcards')}
                >
                  Flashcards
                </ViewModeButton>
              </ViewModeSwitcher>
            </ControlsRow>

            {isLoading ? (
              <Loader />
            ) : sortedFlashcards.length > 0 ? (
              <>
                {viewMode === 'cards' && (
                  <FlashcardGrid>
                    {sortedFlashcards.map(card => (
                      <FlashcardItem 
                        key={card.id} 
                        card={card} 
                        onUpdate={handleRefresh} 
                      />
                    ))}
                  </FlashcardGrid>
                )}
                {viewMode === 'list' && (
                  <FlashcardList>
                    {sortedFlashcards.map(card => (
                      <FlashcardListItem 
                        key={card.id} 
                        card={card} 
                        onUpdate={handleRefresh} 
                      />
                    ))}
                  </FlashcardList>
                )}
                {viewMode === 'flashcards' && (
                  <FlashcardGrid>
                    {sortedFlashcards.map(card => (
                      <FlashcardItem 
                        key={card.id} 
                        card={card} 
                        onUpdate={handleRefresh} 
                        forceFlashcardMode 
                      />
                    ))}
                  </FlashcardGrid>
                )}
              </>
            ) : (
              <EmptyState>
                {activeTab === 'all' 
                  ? "You don't have any flashcards yet." 
                  : "No flashcards due for review."}
              </EmptyState>
            )}
          </>
        )}

        {activeTab === 'add' && (
          <AddFlashcard onAdd={handleRefresh} />
        )}
      </TabContainer>
    </Container>
  );
} 