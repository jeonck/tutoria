export interface ParsedMarkdown {
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  tags: string[];
  content: string;
  // New fields for file management
  originalFileName: string;
  originalMarkdownContent: string;
  isImportedFromMarkdown: boolean;
}

export const parseMarkdownToTutorial = (content: string, filename: string): ParsedMarkdown => {
  const lines = content.split('\n');
  let title = '';
  let description = '';
  let category = '';
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
  let duration = 30;
  let tags: string[] = [];
  let mainContent = '';
  
  let inFrontMatter = false;
  let frontMatterEnd = false;
  let contentStartIndex = 0;

  // Check for YAML front matter
  if (lines[0]?.trim() === '---') {
    inFrontMatter = true;
    contentStartIndex = 1;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '---') {
        frontMatterEnd = true;
        contentStartIndex = i + 1;
        break;
      }
      
      // Parse front matter
      if (line.startsWith('title:')) {
        title = line.replace('title:', '').trim().replace(/['"]/g, '');
      } else if (line.startsWith('description:')) {
        description = line.replace('description:', '').trim().replace(/['"]/g, '');
      } else if (line.startsWith('category:')) {
        category = line.replace('category:', '').trim().replace(/['"]/g, '');
      } else if (line.startsWith('difficulty:')) {
        const diff = line.replace('difficulty:', '').trim().replace(/['"]/g, '');
        if (['Beginner', 'Intermediate', 'Advanced'].includes(diff)) {
          difficulty = diff as 'Beginner' | 'Intermediate' | 'Advanced';
        }
      } else if (line.startsWith('duration:')) {
        const dur = parseInt(line.replace('duration:', '').trim());
        if (!isNaN(dur)) duration = dur;
      } else if (line.startsWith('tags:')) {
        const tagString = line.replace('tags:', '').trim();
        if (tagString.startsWith('[') && tagString.endsWith(']')) {
          tags = tagString.slice(1, -1).split(',').map(tag => tag.trim().replace(/['"]/g, ''));
        } else {
          tags = tagString.split(',').map(tag => tag.trim().replace(/['"]/g, ''));
        }
      }
    }
  }

  // Get main content
  mainContent = lines.slice(contentStartIndex).join('\n').trim();

  // If no front matter or missing fields, try to extract from content
  if (!title) {
    const firstHeading = lines.find(line => line.startsWith('# '));
    title = firstHeading ? firstHeading.replace('# ', '').trim() : filename.replace('.md', '');
  }

  if (!description) {
    // Look for the first paragraph after the title
    const contentLines = mainContent.split('\n').filter(line => line.trim());
    for (const line of contentLines) {
      if (!line.startsWith('#') && line.trim().length > 20) {
        description = line.trim().substring(0, 200);
        if (description.length === 200) description += '...';
        break;
      }
    }
  }

  if (!category) {
    // Try to infer category from filename or content
    const filenameLower = filename.toLowerCase();
    if (filenameLower.includes('react')) category = 'React';
    else if (filenameLower.includes('javascript') || filenameLower.includes('js')) category = 'JavaScript';
    else if (filenameLower.includes('typescript') || filenameLower.includes('ts')) category = 'TypeScript';
    else if (filenameLower.includes('css')) category = 'CSS';
    else if (filenameLower.includes('html')) category = 'HTML';
    else if (filenameLower.includes('node')) category = 'Node.js';
    else if (filenameLower.includes('python')) category = 'Python';
    else if (filenameLower.includes('spring')) category = 'Spring Boot';
    else category = 'General';
  }

  if (tags.length === 0) {
    // Try to extract tags from content or filename
    const contentLower = content.toLowerCase();
    const possibleTags = ['react', 'javascript', 'typescript', 'css', 'html', 'node', 'python', 'spring-boot', 'tutorial', 'guide'];
    tags = possibleTags.filter(tag => contentLower.includes(tag));
    
    if (tags.length === 0) {
      tags = [category.toLowerCase()];
    }
  }

  return {
    title,
    description: description || 'Imported from markdown file',
    category,
    difficulty,
    duration,
    tags: tags.filter(tag => tag.length > 0),
    content: mainContent,
    // New file management fields
    originalFileName: filename,
    originalMarkdownContent: content,
    isImportedFromMarkdown: true
  };
};

/**
 * Generate markdown content from tutorial data
 */
export const generateMarkdownFromTutorial = (tutorial: {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  tags: string[];
  content: string;
  originalMarkdownContent?: string;
  isImportedFromMarkdown?: boolean;
}): string => {
  // If we have the original markdown content and it's imported, return it
  if (tutorial.originalMarkdownContent && tutorial.isImportedFromMarkdown) {
    return tutorial.originalMarkdownContent;
  }

  // Otherwise, generate new markdown with front matter
  const frontMatter = [
    '---',
    `title: "${tutorial.title}"`,
    `description: "${tutorial.description}"`,
    `category: "${tutorial.category}"`,
    `difficulty: "${tutorial.difficulty}"`,
    `duration: ${tutorial.duration}`,
    `tags: [${tutorial.tags.map(tag => `"${tag}"`).join(', ')}]`,
    '---',
    '',
    tutorial.content
  ].join('\n');

  return frontMatter;
};

/**
 * Download markdown file
 */
export const downloadMarkdownFile = (
  content: string, 
  filename: string = 'tutorial.md'
): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};