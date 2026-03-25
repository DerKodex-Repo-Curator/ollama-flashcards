import axios from 'axios';

// Default Ollama API URL
const OLLAMA_API_URL = 'http://localhost:11434/api';

export default async function handler(req, res) {
  try {
    // Try to ping Ollama by listing available models
    const response = await axios.get(`${OLLAMA_API_URL}/tags`, { 
      timeout: 5000 
    });
    
    // If successful, return the list of models
    res.status(200).json({ 
      status: 'ok',
      models: response.data.models 
    });
  } catch (error) {
    console.error('Error connecting to Ollama:', error);
    
    // Return specific error information
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to connect to Ollama server',
      details: error.message,
      suggestions: [
        'Make sure Ollama is running on your machine',
        'Check that it\'s running on the default port (11434)',
        'Ensure no firewall is blocking the connection'
      ]
    });
  }
} 