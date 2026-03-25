import axios from 'axios';

// Default Ollama API URL - modify this if your Ollama instance is running elsewhere
const OLLAMA_API_URL = 'http://localhost:11434/api';

/**
 * Generate word definition and examples using Ollama
 * @param {string} word - The word to get information for
 * @param {string} model - The Ollama model to use (e.g., 'llama2', 'mistral', etc.)
 * @param {string} targetLanguage - The language being learned
 * @returns {Promise<{meaning: string, examples: string[]}>}
 */
export async function getWordInfo(word, model = 'llama2', targetLanguage = 'German') {
  try {
    const prompt = `
I'm learning ${targetLanguage}. 
For the word "${word}":
1. Provide a clear and concise definition
2. Provide 3 example sentences using this word in different contexts
3. Format the response as JSON with "meaning" and "examples" fields, where examples is an array of strings
`;
    
    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model,
      prompt,
      stream: false,
      format: 'json'
    });
    
    // Parse the response to extract the JSON
    const text = response.data.response;
    try {
      // Try to parse as JSON directly
      const data = JSON.parse(text);
      
      // Ensure examples are properly formatted as an array of strings
      let processedExamples = [];
      if (Array.isArray(data.examples)) {
        processedExamples = data.examples.map(example => {
          if (typeof example === 'string') {
            return example;
          } else if (example && typeof example === 'object') {
            // If example is an object with sentence/translation, convert to string
            if (example.sentence) {
              return example.translation 
                ? `${example.sentence} - ${example.translation}` 
                : example.sentence;
            }
            // Otherwise stringify the object
            return JSON.stringify(example);
          }
          return '';
        });
      }
      
      return {
        meaning: data.meaning || '',
        examples: processedExamples
      };
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[0]);
          // Apply the same processing to examples
          let processedExamples = [];
          if (Array.isArray(data.examples)) {
            processedExamples = data.examples.map(example => {
              if (typeof example === 'string') {
                return example;
              } else if (example && typeof example === 'object') {
                if (example.sentence) {
                  return example.translation 
                    ? `${example.sentence} - ${example.translation}` 
                    : example.sentence;
                }
                return JSON.stringify(example);
              }
              return '';
            });
          }
          
          return {
            meaning: data.meaning || '',
            examples: processedExamples
          };
        } catch (e) {
          console.error('Failed to parse JSON from response:', e);
        }
      }
      
      // Fallback to manual extraction if JSON parsing fails
      const lines = text.split('\n');
      const meaning = lines.find(line => line.trim() && !line.includes('example'))?.trim() || '';
      const examples = lines
        .filter(line => line.includes(word))
        .map(line => line.trim())
        .slice(0, 3);
      
      return { meaning, examples };
    }
  } catch (error) {
    console.error('Error fetching word info from Ollama:', error);
    throw new Error('Failed to get word information');
  }
}

/**
 * List available models from Ollama
 * @returns {Promise<string[]>} List of model names
 */
export async function listModels() {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/tags`);
    return response.data.models.map(model => model.name);
  } catch (error) {
    console.error('Error fetching models from Ollama:', error);
    return [];
  }
} 