const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add last field
  result.push(current.trim());
  
  return result;
}

async function importCSV() {
  try {
    console.log('Reading CSV file...');
    const csvPath = path.join(process.cwd(), 'duo_cards_de_export.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('Parsing CSV...');
    const lines = csvContent.split('\n');
    const headers = parseCSVLine(lines[0]);
    console.log('Headers:', headers);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Skip lines that might be continuation of previous malformed line
      if (line.startsWith('"') && !line.includes(',')) continue;
      
      const fields = parseCSVLine(line);
      
      // Ensure we have at least 2 fields (front and back)
      if (fields.length < 2) {
        console.log(`Skipping malformed line ${i}: insufficient fields`);
        skipped++;
        continue;
      }
      
      const word = fields[0]?.replace(/^"|"$/g, '').trim();
      const meaning = fields[1]?.replace(/^"|"$/g, '').trim();
      const hint = fields[2]?.replace(/^"|"$/g, '').trim();
      const publishedAt = fields[3]?.replace(/^"|"$/g, '').trim();
      
      if (!word || !meaning) {
        console.log(`Skipping line ${i} - missing word or meaning`);
        skipped++;
        continue;
      }
      
      try {
        // Check if flashcard already exists
        const existing = await prisma.flashcard.findFirst({
          where: { word: word }
        });
        
        if (existing) {
          console.log(`Skipping duplicate: ${word}`);
          skipped++;
          continue;
        }
        
        // Prepare examples array
        const examples = [];
        if (hint) {
          examples.push(hint);
        }
        
        // Parse the published date or use current date
        let createdAt = new Date();
        if (publishedAt) {
          try {
            const parsedDate = new Date(publishedAt);
            if (!isNaN(parsedDate.getTime())) {
              createdAt = parsedDate;
            }
          } catch (e) {
            console.log(`Invalid date for ${word}, using current date`);
          }
        }
        
        // Create flashcard
        await prisma.flashcard.create({
          data: {
            word,
            meaning,
            examples: JSON.stringify(examples),
            language: 'German',
            createdAt,
            lastReviewed: null,
            reviewCount: 0
          }
        });
        
        imported++;
        
        if (imported % 100 === 0) {
          console.log(`Imported ${imported} flashcards...`);
        }
      } catch (error) {
        console.error(`Error importing line ${i} (${word}):`, error.message);
        errors++;
      }
    }
    
    console.log(`\nImport complete!`);
    console.log(`Imported: ${imported} flashcards`);
    console.log(`Skipped: ${skipped} flashcards`);
    console.log(`Errors: ${errors} flashcards`);
    
  } catch (error) {
    console.error('Error importing CSV:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importCSV();
