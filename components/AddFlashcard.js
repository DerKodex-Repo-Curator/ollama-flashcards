import React, { useState, useEffect } from 'react';
import { 
  FormGroup, 
  Label, 
  Input, 
  Select, 
  Button, 
  Loader, 
  Error, 
  Success 
} from './StyledComponents';
import { saveFlashcard } from '../lib/flashcards';
import { getWordInfo, listModels } from '../lib/ollama';

const AddFlashcard = ({ onAdd }) => {
  const [word, setWord] = useState('');
  const [language, setLanguage] = useState('German');
  const [model, setModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    // Load available models when component mounts
    const loadModels = async () => {
      try {
        const models = await listModels();
        setAvailableModels(models);
        if (models.length > 0) {
          setModel(models[0]);
        }
      } catch (err) {
        setError('Failed to load models. Make sure Ollama is running.');
      } finally {
        setIsLoadingModels(false);
      }
    };

    loadModels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) {
      setError('Please enter a word');
      return;
    }

    if (!model) {
      setError('Please select a model');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Get word info from Ollama
      const wordInfo = await getWordInfo(word, model, language);
      
      // Save the flashcard
      const newCard = {
        word: word.trim(),
        meaning: wordInfo.meaning,
        examples: wordInfo.examples,
        language,
      };
      
      saveFlashcard(newCard);
      
      // Clear form and show success message
      setWord('');
      setSuccess(`Added "${word}" to your flashcards!`);
      
      // Notify parent component
      if (onAdd) onAdd();
      
    } catch (err) {
      console.error('Error adding flashcard:', err);
      setError('Failed to add flashcard. Make sure Ollama is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Error>{error}</Error>}
      {success && <Success>{success}</Success>}
      
      <FormGroup>
        <Label htmlFor="word">Word</Label>
        <Input
          id="word"
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word to create a flashcard"
          disabled={isLoading}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="language">Language</Label>
        <Input
          id="language"
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Enter the language (e.g., English, Spanish, etc.)"
          disabled={isLoading}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="model">Ollama Model</Label>
        {isLoadingModels ? (
          <div>Loading available models...</div>
        ) : availableModels.length > 0 ? (
          <Select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isLoading || isLoadingModels}
          >
            {availableModels.map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))}
          </Select>
        ) : (
          <div>
            No models available. Make sure Ollama is running and you have models installed.
          </div>
        )}
      </FormGroup>

      <Button 
        primary 
        type="submit" 
        disabled={isLoading || isLoadingModels || availableModels.length === 0}
      >
        {isLoading ? 'Adding...' : 'Add Flashcard'}
      </Button>
      
      {isLoading && <Loader />}
    </form>
  );
};

export default AddFlashcard; 