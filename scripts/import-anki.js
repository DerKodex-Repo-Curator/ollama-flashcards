const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();

const prisma = new PrismaClient();

// Field separator used in Anki (ASCII 31 - Unit Separator)
const FIELD_SEPARATOR = '\x1F';

async function importAnkiAPKG(apkgPath) {
  try {
    console.log(`Importing Anki deck from: ${apkgPath}`);
    
    // Check if file exists
    if (!fs.existsSync(apkgPath)) {
      console.error(`File not found: ${apkgPath}`);
      return;
    }
    
    // Create temp directory
    const tempDir = path.join('/tmp', `anki_import_${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Extract APKG (it's a ZIP file)
    console.log('Extracting APKG file...');
    const { execSync } = require('child_process');
    execSync(`unzip -q "${apkgPath}" -d "${tempDir}"`);
    
    // Determine which database to use (anki21 is newer format)
    const dbPath = fs.existsSync(path.join(tempDir, 'collection.anki21'))
      ? path.join(tempDir, 'collection.anki21')
      : path.join(tempDir, 'collection.anki2');
    
    if (!fs.existsSync(dbPath)) {
      console.error('No Anki database found in APKG');
      return;
    }
    
    console.log('Reading Anki database...');
    
    // Read notes from Anki database
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);
    
    const notes = await new Promise((resolve, reject) => {
      db.all('SELECT id, flds, tags FROM notes', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    db.close();
    
    console.log(`Found ${notes.length} notes in Anki deck`);
    
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const note of notes) {
      try {
        // Parse fields (separated by unit separator)
        const fields = note.flds.split(FIELD_SEPARATOR);
        
        // Skip if not enough fields
        if (fields.length < 2) {
          console.log(`Skipping note with insufficient fields`);
          skipped++;
          continue;
        }
        
        // Extract word and meaning
        let word = fields[0]?.trim();
        let meaning = fields[1]?.trim();
        
        // Clean up HTML tags from meaning
        meaning = meaning.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        
        // Skip if empty
        if (!word || !meaning) {
          skipped++;
          continue;
        }
        
        // Check for duplicates
        const existing = await prisma.flashcard.findFirst({
          where: { word: word }
        });
        
        if (existing) {
          console.log(`Skipping duplicate: ${word.substring(0, 50)}...`);
          skipped++;
          continue;
        }
        
        // Create flashcard
        await prisma.flashcard.create({
          data: {
            word,
            meaning,
            examples: JSON.stringify([]), // Anki cards often don't have examples in the same format
            language: 'German',
            createdAt: new Date(),
            lastReviewed: null,
            reviewCount: 0
          }
        });
        
        imported++;
        
        if (imported % 100 === 0) {
          console.log(`Imported ${imported} flashcards...`);
        }
      } catch (error) {
        console.error(`Error importing note:`, error.message);
        errors++;
      }
    }
    
    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log(`\nAnki import complete!`);
    console.log(`Imported: ${imported} flashcards`);
    console.log(`Skipped: ${skipped} flashcards`);
    console.log(`Errors: ${errors} flashcards`);
    
  } catch (error) {
    console.error('Error importing Anki deck:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get APKG path from command line or use default
const apkgPath = process.argv[2] || '/Users/rishubbhatia/Downloads/Uni_Sicher_B2C1_Akademischer_Wortschatz_fr_TestDaF_DEDE.apkg';

importAnkiAPKG(apkgPath);
