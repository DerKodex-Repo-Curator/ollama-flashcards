/**
 * Flashcard utility functions for storing and retrieving flashcards
 * Uses API endpoints that connect to the database
 */

import axios from 'axios';

const API_BASE_URL = '/api/flashcards';

/**
 * Get all flashcards
 * @returns {Promise<Array>} A promise that resolves to an array of flashcard objects
 */
export async function getFlashcards() {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error getting flashcards:', error);
    return [];
  }
}

/**
 * Save a new flashcard
 * @param {Object} card - The flashcard to save
 * @returns {Promise<Object>} A promise that resolves to the saved flashcard
 */
export async function saveFlashcard(card) {
  try {
    const response = await axios.post(API_BASE_URL, card);
    return response.data;
  } catch (error) {
    console.error('Error saving flashcard:', error);
    throw new Error('Failed to save flashcard');
  }
}

/**
 * Update an existing flashcard
 * @param {string} id - The id of the flashcard to update
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object|null>} A promise that resolves to the updated flashcard or null if not found
 */
export async function updateFlashcard(id, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating flashcard:', error);
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error('Failed to update flashcard');
  }
}

/**
 * Delete a flashcard
 * @param {string} id - The id of the flashcard to delete
 * @returns {Promise<boolean>} A promise that resolves to whether the deletion was successful
 */
export async function deleteFlashcard(id) {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    if (error.response && error.response.status === 404) {
      return false;
    }
    throw new Error('Failed to delete flashcard');
  }
}

/**
 * Record a review for a flashcard
 * @param {string} id - The id of the reviewed flashcard
 * @returns {Promise<Object|null>} A promise that resolves to the updated flashcard or null if not found
 */
export async function reviewFlashcard(id) {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}`, { action: 'review' });
    return response.data;
  } catch (error) {
    console.error('Error recording flashcard review:', error);
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error('Failed to record review');
  }
}

/**
 * Get flashcards due for review
 * @param {number} daysThreshold - Days after which a flashcard is due for review
 * @returns {Promise<Array>} A promise that resolves to flashcards due for review
 */
export async function getReviewDueFlashcards(daysThreshold = 1) {
  try {
    const response = await axios.get(`${API_BASE_URL}/due?days=${daysThreshold}`);
    return response.data;
  } catch (error) {
    console.error('Error getting due flashcards:', error);
    return [];
  }
} 