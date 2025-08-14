import { useState, useEffect, useCallback } from 'react';
import initSqlJs from 'sql.js';
import { Tutorial, DatabaseConfig, TechStackCollection, TrashItem } from '../types/tutorial';
import { getAllSampleTutorials, getTutorialStats } from '../data/tutorials';
import { getDefaultTechStackCollections, matchTutorialsToCollections } from '../data/techStackCollections';

interface TutorialFilters {
  searchTerm?: string;
  category?: string;
  difficulty?: string;
  showFavorites?: boolean;
  showCompleted?: boolean;
}

interface PaginatedResult {
  tutorials: Tutorial[];
  total: number;
  hasMore: boolean;
}

interface Stats {
  total: number;
  completed: number;
  favorites: number;
  totalDuration: number;
}

interface CollectionStats {
  total: number;
  completed: number;
  favorites: number;
  totalDuration: number;
}

// Database version for migration management - increment to force refresh
const CURRENT_DB_VERSION = 6; // Incremented for shared markdown storage
const DB_VERSION_KEY = 'tutorialDB_version';

export const useDatabase = () => {
  const [config, setConfig] = useState<DatabaseConfig>({ db: null, initialized: false });
  const [dataVersion, setDataVersion] = useState(0); // For triggering re-renders

  // Force refresh function that updates data version
  const forceDataRefresh = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('🚀 Initializing database system...');
        
        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`
        });

        let db;
        let shouldReinitialize = false;

        // Check if we need to reinitialize based on version
        const savedVersion = localStorage.getItem(DB_VERSION_KEY);
        const currentVersion = CURRENT_DB_VERSION.toString();
        
        if (savedVersion !== currentVersion) {
          console.log(`📦 Database version mismatch. Saved: ${savedVersion}, Current: ${currentVersion}`);
          shouldReinitialize = true;
        }

        // Try to load existing database
        const savedDB = localStorage.getItem('tutorialDB');
        
        if (savedDB && !shouldReinitialize) {
          try {
            const data = new Uint8Array(JSON.parse(savedDB));
            db = new SQL.Database(data);
            
            // Check if we need to add new columns for markdown file management
            const columnsResult = db.exec("PRAGMA table_info(tutorials)");
            const columns = columnsResult.length > 0 ? columnsResult[0].values.map((row: any[]) => row[1]) : [];
            
            const hasMarkdownColumns = columns.includes('originalFileName') && 
                                     columns.includes('originalMarkdownContent') && 
                                     columns.includes('isImportedFromMarkdown') &&
                                     columns.includes('isSharedMarkdown') &&
                                     columns.includes('uploadedBy');
            
            if (!hasMarkdownColumns) {
              console.log('📝 Adding markdown file management columns...');
              if (!columns.includes('originalFileName')) {
                db.run('ALTER TABLE tutorials ADD COLUMN originalFileName TEXT');
              }
              if (!columns.includes('originalMarkdownContent')) {
                db.run('ALTER TABLE tutorials ADD COLUMN originalMarkdownContent TEXT');
              }
              if (!columns.includes('isImportedFromMarkdown')) {
                db.run('ALTER TABLE tutorials ADD COLUMN isImportedFromMarkdown INTEGER DEFAULT 0');
              }
              if (!columns.includes('isSharedMarkdown')) {
                db.run('ALTER TABLE tutorials ADD COLUMN isSharedMarkdown INTEGER DEFAULT 0');
              }
              if (!columns.includes('uploadedBy')) {
                db.run('ALTER TABLE tutorials ADD COLUMN uploadedBy TEXT');
              }
              saveDatabase(db);
              console.log('✅ Markdown columns added successfully');
            }
            
            // Check if shared_markdown_files table exists
            const tablesResult = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
            const tableNames = tablesResult.length > 0 ? tablesResult[0].values.flat() : [];
            
            if (!tableNames.includes('shared_markdown_files')) {
              console.log('📁 Creating shared markdown files table...');
              db.run(`
                CREATE TABLE shared_markdown_files (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  filename TEXT NOT NULL,
                  originalContent TEXT NOT NULL,
                  parsedTutorialId INTEGER,
                  uploadedBy TEXT,
                  uploadedAt TEXT NOT NULL,
                  downloadCount INTEGER DEFAULT 0,
                  isActive INTEGER DEFAULT 1,
                  FOREIGN KEY (parsedTutorialId) REFERENCES tutorials(id)
                )
              `);
              
              // Create index for better performance
              db.run('CREATE INDEX IF NOT EXISTS idx_shared_markdown_active ON shared_markdown_files(isActive)');
              db.run('CREATE INDEX IF NOT EXISTS idx_shared_markdown_uploaded_at ON shared_markdown_files(uploadedAt)');
              
              saveDatabase(db);
              console.log('✅ Shared markdown files table created');
            }
            
            // Verify database integrity
            const hasRequiredTables = tableNames.includes('tutorials') && 
                                    tableNames.includes('tech_stack_collections') &&
                                    tableNames.includes('trash_items') &&
                                    tableNames.includes('shared_markdown_files');
            
            if (hasRequiredTables) {
              // Check if we have the expected number of tutorials and collections
              const expectedTutorials = getAllSampleTutorials();
              const expectedCollections = getDefaultTechStackCollections();
              
              const tutorialCountResult = db.exec('SELECT COUNT(*) as total FROM tutorials');
              const collectionCountResult = db.exec('SELECT COUNT(*) as total FROM tech_stack_collections');
              
              const actualTutorialCount = tutorialCountResult.length > 0 ? tutorialCountResult[0].values[0][0] : 0;
              const actualCollectionCount = collectionCountResult.length > 0 ? collectionCountResult[0].values[0][0] : 0;
              
              console.log(`📊 Expected: ${expectedTutorials.length} tutorials, ${expectedCollections.length} collections`);
              console.log(`📊 Actual: ${actualTutorialCount} tutorials, ${actualCollectionCount} collections`);
              
              // If counts match, use existing database
              if (actualTutorialCount >= expectedTutorials.length && actualCollectionCount >= expectedCollections.length) {
                console.log('✅ Using existing database with valid data');
                setConfig({ db, initialized: true });
                return;
              } else {
                console.log('⚠️ Data count mismatch, reinitializing...');
                shouldReinitialize = true;
              }
            } else {
              console.log('⚠️ Missing required tables, reinitializing...');
              shouldReinitialize = true;
            }
          } catch (loadError) {
            console.warn('❌ Failed to load saved database:', loadError);
            shouldReinitialize = true;
          }
        } else {
          shouldReinitialize = true;
        }

        // Create fresh database if needed
        if (shouldReinitialize) {
          console.log('🔄 Creating fresh database...');
          db = new SQL.Database();
          
          // Create tables
          await createTables(db);
          
          // Populate with sample data
          await populateSampleData(db);
          
          // Save version and database
          localStorage.setItem(DB_VERSION_KEY, currentVersion);
          saveDatabase(db);
          
          console.log('✅ Fresh database created and saved');
        }

        setConfig({ db, initialized: true });
        forceDataRefresh(); // Trigger initial data refresh
        
      } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        setConfig({ db: null, initialized: true });
      }
    };

    const createTables = async (db: any) => {
      console.log('📋 Creating database tables...');
      
      // Create tutorials table with markdown file management columns
      db.run(`
        CREATE TABLE IF NOT EXISTS tutorials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          difficulty TEXT NOT NULL,
          duration INTEGER NOT NULL,
          tags TEXT NOT NULL,
          content TEXT NOT NULL,
          isCompleted INTEGER DEFAULT 0,
          isFavorite INTEGER DEFAULT 0,
          originalFileName TEXT,
          originalMarkdownContent TEXT,
          isImportedFromMarkdown INTEGER DEFAULT 0,
          isSharedMarkdown INTEGER DEFAULT 0,
          uploadedBy TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);

      // Create tech stack collections table
      db.run(`
        CREATE TABLE IF NOT EXISTS tech_stack_collections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          color TEXT NOT NULL,
          tutorialIds TEXT NOT NULL,
          estimatedDuration INTEGER NOT NULL,
          difficulty TEXT NOT NULL,
          tags TEXT NOT NULL,
          isCompleted INTEGER DEFAULT 0,
          isFavorite INTEGER DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);

      // Create trash items table
      db.run(`
        CREATE TABLE IF NOT EXISTS trash_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          originalId INTEGER NOT NULL,
          data TEXT NOT NULL,
          deletedAt TEXT NOT NULL,
          deletedBy TEXT
        )
      `);

      // Create shared markdown files table
      db.run(`
        CREATE TABLE IF NOT EXISTS shared_markdown_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL,
          originalContent TEXT NOT NULL,
          parsedTutorialId INTEGER,
          uploadedBy TEXT,
          uploadedAt TEXT NOT NULL,
          downloadCount INTEGER DEFAULT 0,
          isActive INTEGER DEFAULT 1,
          FOREIGN KEY (parsedTutorialId) REFERENCES tutorials(id)
        )
      `);

      // Create indexes for better performance
      db.run('CREATE INDEX IF NOT EXISTS idx_tutorials_category ON tutorials(category)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty ON tutorials(difficulty)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tutorials_completed ON tutorials(isCompleted)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tutorials_favorite ON tutorials(isFavorite)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tutorials_markdown ON tutorials(isImportedFromMarkdown)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tutorials_shared ON tutorials(isSharedMarkdown)');
      db.run('CREATE INDEX IF NOT EXISTS idx_trash_type ON trash_items(type)');
      db.run('CREATE INDEX IF NOT EXISTS idx_trash_deleted_at ON trash_items(deletedAt)');
      db.run('CREATE INDEX IF NOT EXISTS idx_shared_markdown_active ON shared_markdown_files(isActive)');
      db.run('CREATE INDEX IF NOT EXISTS idx_shared_markdown_uploaded_at ON shared_markdown_files(uploadedAt)');
    };

    const populateSampleData = async (db: any) => {
      console.log('📚 Populating sample tutorials...');
      
      const sampleTutorials = getAllSampleTutorials();
      const stats = getTutorialStats();
      
      console.log(`📊 Loading ${sampleTutorials.length} tutorials across ${stats.byCategory.length} categories`);
      console.log('📊 Categories:', stats.byCategory.map(c => `${c.name} (${c.count})`).join(', '));
      
      // Clear existing data to ensure fresh start
      db.run('DELETE FROM tutorials');
      db.run('DELETE FROM tech_stack_collections');
      db.run('DELETE FROM trash_items');
      db.run('DELETE FROM shared_markdown_files');
      
      // Insert tutorials in batches for better performance
      const batchSize = 50;
      const now = new Date().toISOString();
      
      db.run('BEGIN TRANSACTION');
      
      try {
        const insertStmt = db.prepare(`
          INSERT INTO tutorials (title, description, category, difficulty, duration, tags, content, isImportedFromMarkdown, isSharedMarkdown, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (let i = 0; i < sampleTutorials.length; i += batchSize) {
          const batch = sampleTutorials.slice(i, i + batchSize);
          
          batch.forEach((tutorial) => {
            insertStmt.run([
              tutorial.title,
              tutorial.description,
              tutorial.category,
              tutorial.difficulty,
              tutorial.duration,
              JSON.stringify(tutorial.tags),
              tutorial.content,
              0, // isImportedFromMarkdown = false for sample tutorials
              0, // isSharedMarkdown = false for sample tutorials
              now,
              now
            ]);
          });
          
          console.log(`📝 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleTutorials.length / batchSize)}`);
        }
        
        insertStmt.free();
        
        // Populate tech stack collections
        await populateCollections(db);
        
        db.run('COMMIT');
        
        // Verify insertion
        const tutorialCountResult = db.exec('SELECT COUNT(*) as total FROM tutorials');
        const collectionCountResult = db.exec('SELECT COUNT(*) as total FROM tech_stack_collections');
        
        const totalTutorials = tutorialCountResult.length > 0 ? tutorialCountResult[0].values[0][0] : 0;
        const totalCollections = collectionCountResult.length > 0 ? collectionCountResult[0].values[0][0] : 0;
        
        console.log(`✅ Successfully inserted ${totalTutorials} tutorials and ${totalCollections} collections`);
        
        // Log collection details for debugging
        const collectionsResult = db.exec('SELECT name, tutorialIds FROM tech_stack_collections');
        if (collectionsResult.length > 0) {
          console.log('📋 Created collections:');
          collectionsResult[0].values.forEach((row: any[]) => {
            const tutorialIds = JSON.parse(row[1]);
            console.log(`  - ${row[0]}: ${tutorialIds.length} tutorials`);
          });
        }
        
      } catch (error) {
        db.run('ROLLBACK');
        console.error('❌ Error inserting tutorials:', error);
        throw error;
      }
    };

    const populateCollections = async (db: any) => {
      console.log('🏗️ Creating tech stack collections...');
      
      // Get all tutorials for matching
      const tutorialsResult = db.exec('SELECT id, category, tags, duration, title FROM tutorials');
      if (tutorialsResult.length === 0) {
        console.warn('⚠️ No tutorials found for collection matching');
        return;
      }

      const tutorials = tutorialsResult[0].values.map((row: any[]) => ({
        id: row[0],
        category: row[1],
        tags: JSON.parse(row[2]),
        duration: row[3],
        title: row[4]
      }));

      console.log(`📊 Found ${tutorials.length} tutorials for matching`);
      console.log('📊 Tutorial categories:', [...new Set(tutorials.map(t => t.category))].join(', '));

      const defaultCollections = getDefaultTechStackCollections();
      console.log(`📊 Creating ${defaultCollections.length} collections`);
      
      const matchedCollections = matchTutorialsToCollections(defaultCollections, tutorials);

      const insertCollectionStmt = db.prepare(`
        INSERT INTO tech_stack_collections (name, description, icon, color, tutorialIds, estimatedDuration, difficulty, tags, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();

      matchedCollections.forEach((collection, index) => {
        console.log(`📝 Creating collection ${index + 1}/${matchedCollections.length}: ${collection.name} (${collection.tutorialIds.length} tutorials)`);
        
        insertCollectionStmt.run([
          collection.name,
          collection.description,
          collection.icon,
          collection.color,
          JSON.stringify(collection.tutorialIds),
          collection.estimatedDuration,
          collection.difficulty,
          JSON.stringify(collection.tags),
          now,
          now
        ]);
      });

      insertCollectionStmt.free();
      console.log(`✅ Created ${matchedCollections.length} tech stack collections`);
    };

    initDB();
  }, []); // Only run once on mount

  const saveDatabase = useCallback((db: any) => {
    try {
      const dbData = db.export();
      localStorage.setItem('tutorialDB', JSON.stringify(Array.from(dbData)));
      console.log('💾 Database saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save database:', error);
    }
  }, []);

  // Shared markdown file management functions
  const saveSharedMarkdownFile = useCallback((filename: string, content: string, tutorialId?: number, uploadedBy?: string) => {
    if (!config.db) return null;
    
    try {
      const now = new Date().toISOString();
      const result = config.db.run(`
        INSERT INTO shared_markdown_files (filename, originalContent, parsedTutorialId, uploadedBy, uploadedAt)
        VALUES (?, ?, ?, ?, ?)
      `, [filename, content, tutorialId || null, uploadedBy || 'Anonymous', now]);
      
      saveDatabase(config.db);
      console.log(`📁 Saved shared markdown file: ${filename}`);
      return result.lastInsertRowid;
    } catch (error) {
      console.error('❌ Error saving shared markdown file:', error);
      return null;
    }
  }, [config.db, saveDatabase]);

  const getSharedMarkdownFiles = useCallback(() => {
    if (!config.db) return [];
    
    try {
      const result = config.db.exec(`
        SELECT smf.*, t.title as tutorialTitle 
        FROM shared_markdown_files smf 
        LEFT JOIN tutorials t ON smf.parsedTutorialId = t.id 
        WHERE smf.isActive = 1 
        ORDER BY smf.uploadedAt DESC
      `);
      
      if (result.length === 0) return [];
      
      return result[0].values.map((row: any[]) => ({
        id: row[0],
        filename: row[1],
        originalContent: row[2],
        parsedTutorialId: row[3],
        uploadedBy: row[4],
        uploadedAt: row[5],
        downloadCount: row[6],
        isActive: Boolean(row[7]),
        tutorialTitle: row[8]
      }));
    } catch (error) {
      console.error('❌ Error fetching shared markdown files:', error);
      return [];
    }
  }, [config.db, dataVersion]);

  const downloadSharedMarkdownFile = useCallback((fileId: number) => {
    if (!config.db) return null;
    
    try {
      // Get file content
      const result = config.db.exec('SELECT filename, originalContent FROM shared_markdown_files WHERE id = ? AND isActive = 1', [fileId]);
      if (result.length === 0 || result[0].values.length === 0) {
        return null;
      }
      
      const [filename, content] = result[0].values[0];
      
      // Increment download count
      config.db.run('UPDATE shared_markdown_files SET downloadCount = downloadCount + 1 WHERE id = ?', [fileId]);
      saveDatabase(config.db);
      
      return { filename, content };
    } catch (error) {
      console.error('❌ Error downloading shared markdown file:', error);
      return null;
    }
  }, [config.db, saveDatabase]);

  // Trash management functions
  const moveToTrash = useCallback((type: 'tutorial' | 'collection', originalId: number, data: Tutorial | TechStackCollection) => {
    if (!config.db) return;
    
    try {
      const now = new Date().toISOString();
      config.db.run(`
        INSERT INTO trash_items (type, originalId, data, deletedAt)
        VALUES (?, ?, ?, ?)
      `, [type, originalId, JSON.stringify(data), now]);
      
      saveDatabase(config.db);
      console.log(`🗑️ Moved ${type} to trash: ${data.title || (data as TechStackCollection).name}`);
    } catch (error) {
      console.error('❌ Error moving item to trash:', error);
    }
  }, [config.db, saveDatabase]);

  const getTrashItems = useCallback((): TrashItem[] => {
    if (!config.db) return [];
    
    try {
      const result = config.db.exec('SELECT * FROM trash_items ORDER BY deletedAt DESC');
      if (result.length === 0) return [];
      
      return result[0].values.map((row: any[]) => ({
        id: row[0],
        type: row[1],
        originalId: row[2],
        data: JSON.parse(row[3]),
        deletedAt: row[4],
        deletedBy: row[5]
      }));
    } catch (error) {
      console.error('❌ Error fetching trash items:', error);
      return [];
    }
  }, [config.db, dataVersion]);

  const restoreFromTrash = useCallback((trashId: number) => {
    if (!config.db) return false;
    
    try {
      // Get the trash item
      const trashResult = config.db.exec('SELECT * FROM trash_items WHERE id = ?', [trashId]);
      if (trashResult.length === 0 || trashResult[0].values.length === 0) {
        console.error('❌ Trash item not found');
        return false;
      }
      
      const trashItem = trashResult[0].values[0];
      const type = trashItem[1];
      const data = JSON.parse(trashItem[3]);
      
      const now = new Date().toISOString();
      
      if (type === 'tutorial') {
        // Restore tutorial with all markdown file management fields
        config.db.run(`
          INSERT INTO tutorials (title, description, category, difficulty, duration, tags, content, isCompleted, isFavorite, originalFileName, originalMarkdownContent, isImportedFromMarkdown, isSharedMarkdown, uploadedBy, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          data.title,
          data.description,
          data.category,
          data.difficulty,
          data.duration,
          JSON.stringify(data.tags),
          data.content,
          data.isCompleted ? 1 : 0,
          data.isFavorite ? 1 : 0,
          data.originalFileName || null,
          data.originalMarkdownContent || null,
          data.isImportedFromMarkdown ? 1 : 0,
          data.isSharedMarkdown ? 1 : 0,
          data.uploadedBy || null,
          data.createdAt,
          now
        ]);
      } else if (type === 'collection') {
        // Restore collection
        config.db.run(`
          INSERT INTO tech_stack_collections (name, description, icon, color, tutorialIds, estimatedDuration, difficulty, tags, isCompleted, isFavorite, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          data.name,
          data.description,
          data.icon,
          data.color,
          JSON.stringify(data.tutorialIds),
          data.estimatedDuration,
          data.difficulty,
          JSON.stringify(data.tags),
          data.isCompleted ? 1 : 0,
          data.isFavorite ? 1 : 0,
          data.createdAt,
          now
        ]);
      }
      
      // Remove from trash
      config.db.run('DELETE FROM trash_items WHERE id = ?', [trashId]);
      
      saveDatabase(config.db);
      forceDataRefresh();
      
      console.log(`♻️ Restored ${type} from trash: ${data.title || data.name}`);
      return true;
    } catch (error) {
      console.error('❌ Error restoring from trash:', error);
      return false;
    }
  }, [config.db, saveDatabase, forceDataRefresh]);

  const permanentlyDelete = useCallback((trashId: number) => {
    if (!config.db) return false;
    
    try {
      config.db.run('DELETE FROM trash_items WHERE id = ?', [trashId]);
      saveDatabase(config.db);
      forceDataRefresh();
      
      console.log(`🗑️ Permanently deleted trash item: ${trashId}`);
      return true;
    } catch (error) {
      console.error('❌ Error permanently deleting item:', error);
      return false;
    }
  }, [config.db, saveDatabase, forceDataRefresh]);

  const emptyTrash = useCallback(() => {
    if (!config.db) return false;
    
    try {
      config.db.run('DELETE FROM trash_items');
      saveDatabase(config.db);
      forceDataRefresh();
      
      console.log('🗑️ Trash emptied');
      return true;
    } catch (error) {
      console.error('❌ Error emptying trash:', error);
      return false;
    }
  }, [config.db, saveDatabase, forceDataRefresh]);

  const buildWhereClause = (filters: TutorialFilters) => {
    const conditions = [];
    const params = [];

    if (filters.searchTerm) {
      conditions.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
      const searchPattern = `%${filters.searchTerm}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (filters.category) {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    if (filters.difficulty) {
      conditions.push('difficulty = ?');
      params.push(filters.difficulty);
    }

    if (filters.showFavorites) {
      conditions.push('isFavorite = 1');
    }

    if (filters.showCompleted) {
      conditions.push('isCompleted = 1');
    }

    return {
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  };

  const getTutorials = useCallback((page: number = 1, limit: number = 18, filters: TutorialFilters = {}): PaginatedResult => {
    if (!config.db) return { tutorials: [], total: 0, hasMore: false };
    
    try {
      const { whereClause, params } = buildWhereClause(filters);
      
      // Get total count
      const countResult = config.db.exec(`SELECT COUNT(*) as total FROM tutorials ${whereClause}`, params);
      const total = countResult.length > 0 ? countResult[0].values[0][0] : 0;
      
      // Get paginated results
      const offset = (page - 1) * limit;
      const result = config.db.exec(
        `SELECT * FROM tutorials ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );
      
      const tutorials = result.length > 0 ? result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        description: row[2],
        category: row[3],
        difficulty: row[4],
        duration: row[5],
        tags: JSON.parse(row[6]),
        content: row[7],
        isCompleted: Boolean(row[8]),
        isFavorite: Boolean(row[9]),
        originalFileName: row[10],
        originalMarkdownContent: row[11],
        isImportedFromMarkdown: Boolean(row[12]),
        isSharedMarkdown: Boolean(row[13]),
        uploadedBy: row[14],
        createdAt: row[15],
        updatedAt: row[16]
      })) : [];

      return {
        tutorials,
        total,
        hasMore: offset + tutorials.length < total
      };
    } catch (error) {
      console.error('❌ Error fetching tutorials:', error);
      return { tutorials: [], total: 0, hasMore: false };
    }
  }, [config.db, dataVersion]); // Include dataVersion as dependency

  const getAllTutorials = useCallback((): Tutorial[] => {
    if (!config.db) return [];
    
    try {
      const result = config.db.exec('SELECT * FROM tutorials ORDER BY createdAt DESC');
      if (result.length === 0) return [];
      
      return result[0].values.map((row: any[]) => ({
        id: row[0],
        title: row[1],
        description: row[2],
        category: row[3],
        difficulty: row[4],
        duration: row[5],
        tags: JSON.parse(row[6]),
        content: row[7],
        isCompleted: Boolean(row[8]),
        isFavorite: Boolean(row[9]),
        originalFileName: row[10],
        originalMarkdownContent: row[11],
        isImportedFromMarkdown: Boolean(row[12]),
        isSharedMarkdown: Boolean(row[13]),
        uploadedBy: row[14],
        createdAt: row[15],
        updatedAt: row[16]
      }));
    } catch (error) {
      console.error('❌ Error fetching all tutorials:', error);
      return [];
    }
  }, [config.db, dataVersion]); // Include dataVersion as dependency

  // Tech Stack Collections methods
  const getTechStackCollections = useCallback((): TechStackCollection[] => {
    if (!config.db) return [];
    
    try {
      const result = config.db.exec('SELECT * FROM tech_stack_collections ORDER BY createdAt DESC');
      if (result.length === 0) return [];
      
      const collections = result[0].values.map((row: any[]) => ({
        id: row[0],
        name: row[1],
        description: row[2],
        icon: row[3],
        color: row[4],
        tutorialIds: JSON.parse(row[5]),
        estimatedDuration: row[6],
        difficulty: row[7],
        tags: JSON.parse(row[8]),
        isCompleted: Boolean(row[9]),
        isFavorite: Boolean(row[10]),
        createdAt: row[11],
        updatedAt: row[12]
      }));
      
      console.log(`📊 Retrieved ${collections.length} tech stack collections`);
      return collections;
    } catch (error) {
      console.error('❌ Error fetching tech stack collections:', error);
      return [];
    }
  }, [config.db, dataVersion]); // Include dataVersion as dependency

  const addTechStackCollection = useCallback((collection: Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!config.db) return;
    
    try {
      const now = new Date().toISOString();
      config.db.run(`
        INSERT INTO tech_stack_collections (name, description, icon, color, tutorialIds, estimatedDuration, difficulty, tags, isCompleted, isFavorite, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        collection.name,
        collection.description,
        collection.icon,
        collection.color,
        JSON.stringify(collection.tutorialIds),
        collection.estimatedDuration,
        collection.difficulty,
        JSON.stringify(collection.tags),
        collection.isCompleted ? 1 : 0,
        collection.isFavorite ? 1 : 0,
        now,
        now
      ]);
      
      saveDatabase(config.db);
      forceDataRefresh(); // Trigger refresh
      console.log('✅ Tech stack collection added successfully');
    } catch (error) {
      console.error('❌ Error adding tech stack collection:', error);
    }
  }, [config.db, saveDatabase, forceDataRefresh]);

  const updateTechStackCollection = useCallback((id: number, collection: Partial<TechStackCollection>) => {
    if (!config.db) return;
    
    try {
      const now = new Date().toISOString();
      const fields = [];
      const values = [];
      
      Object.entries(collection).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          fields.push(`${key} = ?`);
          if (key === 'tutorialIds' || key === 'tags') {
            values.push(JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });
      
      fields.push('updatedAt = ?');
      values.push(now);
      values.push(id);
      
      const query = `UPDATE tech_stack_collections SET ${fields.join(', ')} WHERE id = ?`;
      config.db.run(query, values);
      saveDatabase(config.db);
      forceDataRefresh(); // Trigger refresh
      console.log('✅ Tech stack collection updated successfully');
    } catch (error) {
      console.error('❌ Error updating tech stack collection:', error);
    }
  }, [config.db, saveDatabase, forceDataRefresh]);

  const deleteTechStackCollection = useCallback((id: number) => {
    if (!config.db) return;
    
    try {
      // Get the collection data before deleting
      const result = config.db.exec('SELECT * FROM tech_stack_collections WHERE id = ?', [id]);
      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        const collectionData: TechStackCollection = {
          id: row[0],
          name: row[1],
          description: row[2],
          icon: row[3],
          color: row[4],
          tutorialIds: JSON.parse(row[5]),
          estimatedDuration: row[6],
          difficulty: row[7],
          tags: JSON.parse(row[8]),
          isCompleted: Boolean(row[9]),
          isFavorite: Boolean(row[10]),
          createdAt: row[11],
          updatedAt: row[12]
        };
        
        // Move to trash before deleting
        moveToTrash('collection', id, collectionData);
      }
      
      config.db.run('DELETE FROM tech_stack_collections WHERE id = ?', [id]);
      saveDatabase(config.db);
      forceDataRefresh(); // Trigger refresh
      console.log('✅ Tech stack collection deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting tech stack collection:', error);
    }
  }, [config.db, saveDatabase, forceDataRefresh, moveToTrash]);

  const getCollectionStats = useCallback((): CollectionStats => {
    if (!config.db) return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    
    try {
      const result = config.db.exec(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN isFavorite = 1 THEN 1 ELSE 0 END) as favorites,
          SUM(estimatedDuration) as totalDuration
        FROM tech_stack_collections
      `);
      
      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        return {
          total: row[0] || 0,
          completed: row[1] || 0,
          favorites: row[2] || 0,
          totalDuration: row[3] || 0
        };
      }
      
      return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    } catch (error) {
      console.error('❌ Error fetching collection stats:', error);
      return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    }
  }, [config.db, dataVersion]); // Include dataVersion as dependency

  // Existing methods with refresh triggers
  const getCategories = useCallback((): string[] => {
    if (!config.db) return [];
    
    try {
      const result = config.db.exec('SELECT DISTINCT category FROM tutorials ORDER BY category');
      return result.length > 0 ? result[0].values.map((row: any[]) => row[0]) : [];
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      return [];
    }
  }, [config.db, dataVersion]); // Include dataVersion as dependency

  const getStats = useCallback((): Stats => {
    if (!config.db) return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    
    try {
      const result = config.db.exec(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN isFavorite = 1 THEN 1 ELSE 0 END) as favorites,
          SUM(duration) as totalDuration
        FROM tutorials
      `);
      
      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        return {
          total: row[0] || 0,
          completed: row[1] || 0,
          favorites: row[2] || 0,
          totalDuration: row[3] || 0
        };
      }
      
      return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    }
  }, [config.db, dataVersion]); // Include dataVersion as dependency

  const addTutorial = useCallback((tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!config.db) return null;
    
    try {
      const now = new Date().toISOString();
      const result = config.db.run(`
        INSERT INTO tutorials (title, description, category, difficulty, duration, tags, content, isCompleted, isFavorite, originalFileName, originalMarkdownContent, isImportedFromMarkdown, isSharedMarkdown, uploadedBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        tutorial.title,
        tutorial.description,
        tutorial.category,
        tutorial.difficulty,
        tutorial.duration,
        JSON.stringify(tutorial.tags),
        tutorial.content,
        tutorial.isCompleted ? 1 : 0,
        tutorial.isFavorite ? 1 : 0,
        tutorial.originalFileName || null,
        tutorial.originalMarkdownContent || null,
        tutorial.isImportedFromMarkdown ? 1 : 0,
        tutorial.isSharedMarkdown ? 1 : 0,
        tutorial.uploadedBy || null,
        now,
        now
      ]);
      
      const tutorialId = result.lastInsertRowid;
      
      // If this is a shared markdown tutorial, save the file to shared storage
      if (tutorial.isSharedMarkdown && tutorial.originalMarkdownContent && tutorial.originalFileName) {
        saveSharedMarkdownFile(
          tutorial.originalFileName,
          tutorial.originalMarkdownContent,
          tutorialId as number,
          tutorial.uploadedBy
        );
      }
      
      saveDatabase(config.db);
      forceDataRefresh(); // Trigger refresh
      console.log('✅ Tutorial added successfully');
      return tutorialId;
    } catch (error) {
      console.error('❌ Error adding tutorial:', error);
      return null;
    }
  }, [config.db, saveDatabase, forceDataRefresh, saveSharedMarkdownFile]);

  const updateTutorial = useCallback((id: number, tutorial: Partial<Tutorial>) => {
    if (!config.db) return;
    
    try {
      const now = new Date().toISOString();
      const fields = [];
      const values = [];
      
      Object.entries(tutorial).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          fields.push(`${key} = ?`);
          if (key === 'tags') {
            values.push(JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });
      
      fields.push('updatedAt = ?');
      values.push(now);
      values.push(id);
      
      const query = `UPDATE tutorials SET ${fields.join(', ')} WHERE id = ?`;
      config.db.run(query, values);
      saveDatabase(config.db);
      forceDataRefresh(); // Trigger refresh
      console.log('✅ Tutorial updated successfully');
    } catch (error) {
      console.error('❌ Error updating tutorial:', error);
    }
  }, [config.db, saveDatabase, forceDataRefresh]);

  const deleteTutorial = useCallback((id: number) => {
    if (!config.db) return;
    
    try {
      // Get the tutorial data before deleting
      const result = config.db.exec('SELECT * FROM tutorials WHERE id = ?', [id]);
      if (result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        const tutorialData: Tutorial = {
          id: row[0],
          title: row[1],
          description: row[2],
          category: row[3],
          difficulty: row[4],
          duration: row[5],
          tags: JSON.parse(row[6]),
          content: row[7],
          isCompleted: Boolean(row[8]),
          isFavorite: Boolean(row[9]),
          originalFileName: row[10],
          originalMarkdownContent: row[11],
          isImportedFromMarkdown: Boolean(row[12]),
          isSharedMarkdown: Boolean(row[13]),
          uploadedBy: row[14],
          createdAt: row[15],
          updatedAt: row[16]
        };
        
        // Move to trash before deleting
        moveToTrash('tutorial', id, tutorialData);
      }
      
      config.db.run('DELETE FROM tutorials WHERE id = ?', [id]);
      saveDatabase(config.db);
      forceDataRefresh(); // Trigger refresh
      console.log('✅ Tutorial deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting tutorial:', error);
    }
  }, [config.db, saveDatabase, forceDataRefresh, moveToTrash]);

  return {
    initialized: config.initialized,
    // Tutorial methods
    getTutorials,
    getAllTutorials,
    getCategories,
    getStats,
    addTutorial,
    updateTutorial,
    deleteTutorial,
    // Tech Stack Collection methods
    getTechStackCollections,
    addTechStackCollection,
    updateTechStackCollection,
    deleteTechStackCollection,
    getCollectionStats,
    // Shared markdown file methods
    saveSharedMarkdownFile,
    getSharedMarkdownFiles,
    downloadSharedMarkdownFile,
    // Trash management methods
    getTrashItems,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
    // Utility methods
    forceRefresh: forceDataRefresh
  };
};