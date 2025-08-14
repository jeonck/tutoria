# TUTORIA - AI-Powered Tutorial Management Platform

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository or navigate to the project directory**
   ```bash
   cd /Users/1102680/ws/claude-project/tutoria
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (default Vite port)
   - The application should load automatically

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |
| `npm run deploy` | Deploy to GitHub Pages |

### 🚀 Deployment

For detailed deployment instructions to GitHub Pages, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Database**: SQL.js (SQLite in browser)
- **Icons**: Lucide React
- **AI Integration**: OpenRouter API

### Project Structure
```
src/
├── components/          # React components
├── data/               # Tutorial and tech stack data
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── main.tsx            # Application entry point
```

---

## About TUTORIA

### Inspiration
The inspiration for TUTORIA came from the frustration of managing scattered learning resources across multiple platforms. As developers, we constantly learn new technologies, but our tutorials, notes, and progress tracking are often fragmented across bookmarks, note-taking apps, and various learning platforms. We envisioned a unified platform that could not only organize learning materials but also leverage AI to generate comprehensive tutorials and foster community knowledge sharing.

### What it does
TUTORIA is an intelligent tutorial management platform that transforms how developers organize and accelerate their learning journey. The platform offers:

🎯 **Smart Organization**: Effortlessly manage tutorials across multiple tech stacks with intelligent categorization, progress tracking, and visual dashboards that show completion rates and time invested.

🤖 **AI-Powered Generation**: Create comprehensive tutorials instantly using advanced AI models from OpenRouter, supporting both free models (Llama, Gemma, Phi-3) and premium options (Claude 3.5 Sonnet, GPT-4o, Gemini Pro) with real-time cost estimation.

🌐 **Community-Driven Learning**: Share and discover high-quality tutorials through a collaborative markdown library where users can upload, browse, and import community-contributed content.

📊 **Progress Analytics**: Visual dashboards track learning progress with completion rates, time invested, skill progression, and personalized learning paths through tech stack collections.

🔧 **Tech Stack Collections**: Curated learning paths that group related tutorials for structured skill development, with automatic tutorial matching and progress tracking.

💾 **Seamless Import/Export**: Native markdown support with one-click import/export, preserving original formatting and enabling easy content migration.

### How we built it
TUTORIA was built using modern web technologies with a focus on performance and user experience:

**Frontend Architecture:**
- React 18 with TypeScript for type-safe component development
- Tailwind CSS for beautiful, responsive design with custom gradients and animations
- Lucide React for consistent, beautiful iconography
- React Window for virtualized rendering of large tutorial lists (50+ items)
- SQL.js for client-side database management with full SQL capabilities

**Database Design:**
- SQLite running in the browser via SQL.js for offline-first functionality
- Comprehensive schema with tutorials, tech stack collections, shared markdown files, and trash management
- Advanced indexing for fast search and filtering across categories, difficulty levels, and completion status
- Automatic database versioning and migration system

**AI Integration:**
- OpenRouter API integration supporting 15+ AI models from multiple providers
- Intelligent prompt engineering with customizable templates for different tutorial types
- Real-time cost estimation for paid models with transparent pricing
- Support for both free community models and premium AI services

### Key Features
- **Markdown Parser**: Custom parser supporting YAML frontmatter, code blocks, tables, and rich formatting
- **Virtualized Rendering**: Performance optimization for large datasets using react-window
- **Progressive Enhancement**: Graceful degradation from premium AI models to free alternatives
- **Local Storage**: All data stored locally with export/import capabilities for data portability

### Performance Optimizations
- Lazy loading and code splitting for faster initial load times
- Debounced search with intelligent filtering algorithms
- Batch database operations for improved write performance
- Memory-efficient virtualization for handling thousands of tutorials

---

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please file an issue on our GitHub repository.

---

**Built with ❤️ for the developer community**
