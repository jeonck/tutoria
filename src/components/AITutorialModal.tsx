import React, { useState, useEffect } from 'react';
import { X, Save, Wand2, Settings, Key, Brain, Loader2, AlertCircle, Crown, Zap, DollarSign, Clock } from 'lucide-react';
import { Tutorial } from '../types/tutorial';

interface AITutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  max_tokens: number;
  tier: 'free' | 'paid';
  category: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'basic' | 'good' | 'excellent';
}

const AI_MODELS: OpenRouterModel[] = [
  // Free Models
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B (Free)',
    description: 'Fast, lightweight model perfect for simple tutorials and quick generation',
    pricing: { prompt: 'Free', completion: 'Free' },
    context_length: 131072,
    max_tokens: 2048,
    tier: 'free',
    category: 'General',
    speed: 'fast',
    quality: 'basic'
  },
  {
    id: 'meta-llama/llama-3.2-1b-instruct:free',
    name: 'Llama 3.2 1B (Free)',
    description: 'Ultra-fast model for basic tutorials and simple content',
    pricing: { prompt: 'Free', completion: 'Free' },
    context_length: 131072,
    max_tokens: 2048,
    tier: 'free',
    category: 'General',
    speed: 'fast',
    quality: 'basic'
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B (Free)',
    description: 'Google\'s open model, good for educational content',
    pricing: { prompt: 'Free', completion: 'Free' },
    context_length: 8192,
    max_tokens: 2048,
    tier: 'free',
    category: 'General',
    speed: 'medium',
    quality: 'good'
  },
  {
    id: 'microsoft/phi-3-mini-128k-instruct:free',
    name: 'Phi-3 Mini (Free)',
    description: 'Microsoft\'s efficient model for coding tutorials',
    pricing: { prompt: 'Free', completion: 'Free' },
    context_length: 128000,
    max_tokens: 4096,
    tier: 'free',
    category: 'Coding',
    speed: 'fast',
    quality: 'good'
  },
  {
    id: 'huggingface/zephyr-7b-beta:free',
    name: 'Zephyr 7B (Free)',
    description: 'Community model optimized for helpful responses',
    pricing: { prompt: 'Free', completion: 'Free' },
    context_length: 32768,
    max_tokens: 4096,
    tier: 'free',
    category: 'General',
    speed: 'medium',
    quality: 'good'
  },

  // Paid Models - Premium Tier
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Top-tier model for complex, comprehensive tutorials with excellent reasoning',
    pricing: { prompt: '$3.00', completion: '$15.00' },
    context_length: 200000,
    max_tokens: 8192,
    tier: 'paid',
    category: 'Premium',
    speed: 'medium',
    quality: 'excellent'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI\'s latest model with superior tutorial generation capabilities',
    pricing: { prompt: '$5.00', completion: '$15.00' },
    context_length: 128000,
    max_tokens: 4096,
    tier: 'paid',
    category: 'Premium',
    speed: 'medium',
    quality: 'excellent'
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    description: 'Google\'s advanced model with massive context for detailed tutorials',
    pricing: { prompt: '$3.50', completion: '$10.50' },
    context_length: 1000000,
    max_tokens: 8192,
    tier: 'paid',
    category: 'Premium',
    speed: 'slow',
    quality: 'excellent'
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most capable model for highly detailed, professional tutorials',
    pricing: { prompt: '$15.00', completion: '$75.00' },
    context_length: 200000,
    max_tokens: 4096,
    tier: 'paid',
    category: 'Premium',
    speed: 'slow',
    quality: 'excellent'
  },

  // Paid Models - Balanced Tier
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    description: 'Excellent balance of quality and cost for comprehensive tutorials',
    pricing: { prompt: '$0.88', completion: '$0.88' },
    context_length: 131072,
    max_tokens: 4096,
    tier: 'paid',
    category: 'Balanced',
    speed: 'medium',
    quality: 'good'
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    description: 'High-quality European model for detailed technical content',
    pricing: { prompt: '$4.00', completion: '$12.00' },
    context_length: 128000,
    max_tokens: 8192,
    tier: 'paid',
    category: 'Balanced',
    speed: 'medium',
    quality: 'excellent'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and cost-effective for quick, quality tutorials',
    pricing: { prompt: '$0.25', completion: '$1.25' },
    context_length: 200000,
    max_tokens: 4096,
    tier: 'paid',
    category: 'Balanced',
    speed: 'fast',
    quality: 'good'
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Affordable GPT-4 class model for everyday tutorial generation',
    pricing: { prompt: '$0.15', completion: '$0.60' },
    context_length: 128000,
    max_tokens: 16384,
    tier: 'paid',
    category: 'Balanced',
    speed: 'fast',
    quality: 'good'
  }
];

const TUTORIAL_TEMPLATES = [
  {
    name: 'Beginner Tutorial',
    prompt: 'Create a beginner-friendly tutorial that includes:\n- Clear introduction and prerequisites\n- Step-by-step instructions with explanations\n- Simple code examples with comments\n- Common mistakes to avoid\n- Summary and next steps',
    icon: '🌱'
  },
  {
    name: 'Advanced Guide',
    prompt: 'Create an advanced technical guide that covers:\n- Complex concepts and patterns\n- Real-world examples and use cases\n- Performance considerations\n- Best practices and optimization\n- Advanced troubleshooting',
    icon: '🚀'
  },
  {
    name: 'Quick Reference',
    prompt: 'Create a concise reference guide with:\n- Key concepts and syntax\n- Code snippets and examples\n- Common patterns and solutions\n- Quick troubleshooting tips\n- Useful resources and links',
    icon: '⚡'
  },
  {
    name: 'Project-Based',
    prompt: 'Create a project-based tutorial that includes:\n- Complete project setup\n- Step-by-step implementation\n- Code explanations and reasoning\n- Testing and debugging\n- Deployment and next steps',
    icon: '🛠️'
  }
];

export const AITutorialModal: React.FC<AITutorialModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [duration, setDuration] = useState(30);
  const [tags, setTags] = useState('');
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [modelTier, setModelTier] = useState<'free' | 'paid'>('free');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    const selectedModelInfo = AI_MODELS.find(model => model.id === selectedModel);
    if (selectedModelInfo) {
      setModelTier(selectedModelInfo.tier);
      
      // Calculate estimated cost for paid models
      if (selectedModelInfo.tier === 'paid' && selectedModelInfo.pricing.prompt !== 'Free') {
        const promptCost = parseFloat(selectedModelInfo.pricing.prompt.replace('$', ''));
        const completionCost = parseFloat(selectedModelInfo.pricing.completion.replace('$', ''));
        const estimatedPromptTokens = Math.ceil(prompt.length / 4); // Rough estimate
        const estimatedCompletionTokens = 2000; // Estimated for tutorial
        
        const totalCost = (estimatedPromptTokens / 1000000 * promptCost) + (estimatedCompletionTokens / 1000000 * completionCost);
        setEstimatedCost(`~$${totalCost.toFixed(4)}`);
      } else {
        setEstimatedCost('Free');
      }
    }
  }, [selectedModel, prompt]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openrouter_api_key', apiKey.trim());
      setError('');
    }
  };

  const applyTemplate = (template: typeof TUTORIAL_TEMPLATES[0]) => {
    setPrompt(template.prompt);
  };

  const generateTutorial = async () => {
    const selectedModelInfo = AI_MODELS.find(model => model.id === selectedModel);
    
    if (!apiKey.trim()) {
      setError('API key is required for OpenRouter. Please enter your API key to continue.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt to generate the tutorial.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Tutorial Generator'
      };

      // Always add Authorization header if API key is available
      if (apiKey.trim()) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const requestBody: any = {
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: `You are an expert technical tutorial writer. Create comprehensive, well-structured tutorials in markdown format. 

IMPORTANT REQUIREMENTS:
1. Write a COMPLETE tutorial, not a partial one
2. Include detailed explanations and step-by-step instructions
3. Add practical code examples with explanations
4. Structure with proper markdown headings (##, ###, etc.)
5. Include introduction, main content, and conclusion
6. Make it educational and engaging
7. Ensure the tutorial is fully complete and ready to use

Format the response as a complete markdown tutorial with:
- Clear headings and subheadings
- Code blocks with proper syntax highlighting
- Explanatory text between code sections
- Practical examples and exercises
- Tips and best practices

Quality level: ${selectedModelInfo?.quality || 'good'} - adjust detail and complexity accordingly.`
          },
          {
            role: 'user',
            content: `Create a detailed, COMPLETE tutorial about: ${prompt}

Please ensure the tutorial is comprehensive and fully finished. Include:
- Introduction explaining what will be learned
- Prerequisites if any
- Step-by-step instructions with explanations
- Code examples with detailed comments
- Common pitfalls and how to avoid them
- Summary and next steps

Target difficulty: ${difficulty}
Estimated duration: ${duration} minutes

Make sure to write the ENTIRE tutorial, not just an outline or partial content.`
          }
        ],
        max_tokens: selectedModelInfo?.max_tokens || 4096,
        temperature: 0.7,
        stream: false
      };

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content generated from the API response');
      }

      setGeneratedContent(content);
      
      // Auto-fill title if not already set
      if (!title.trim()) {
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('#') && !trimmedLine.startsWith('##')) {
            const extractedTitle = trimmedLine.replace(/^#+\s*/, '').trim();
            if (extractedTitle && extractedTitle.length > 0) {
              setTitle(extractedTitle);
              break;
            }
          }
        }
      }

      // Auto-fill description if not set
      if (!description.trim()) {
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.length > 50 && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('```')) {
            setDescription(trimmedLine.substring(0, 200) + (trimmedLine.length > 200 ? '...' : ''));
            break;
          }
        }
      }

    } catch (error) {
      console.error('Error generating tutorial:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate tutorial. Please check your settings and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError('Please provide a title for the tutorial.');
      return;
    }

    if (!generatedContent.trim() && !description.trim()) {
      setError('Please generate content or add a manual description.');
      return;
    }

    const tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || 'AI-generated tutorial',
      category: category.trim() || 'General',
      difficulty: difficulty,
      duration: duration,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      content: generatedContent.trim() || description.trim(),
      isCompleted: false,
      isFavorite: false,
      isImportedFromMarkdown: false
    };

    onSave(tutorialData);
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setDifficulty('Beginner');
    setDuration(30);
    setTags('');
    setPrompt('');
    setGeneratedContent('');
    setError('');
  };

  if (!isOpen) return null;

  const selectedModelInfo = AI_MODELS.find(model => model.id === selectedModel) || AI_MODELS[0];
  const freeModels = AI_MODELS.filter(model => model.tier === 'free');
  const paidModels = AI_MODELS.filter(model => model.tier === 'paid');

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'basic': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return '⚡';
      case 'medium': return '⏱️';
      case 'slow': return '🐌';
      default: return '⏱️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Tutorial Generator</h2>
              <p className="text-gray-600">Create comprehensive tutorials with AI models (API key required)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Tutorial Details */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Tutorial Details</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tutorial Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter tutorial title..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="e.g., React, Node.js..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                        min="5"
                        max="300"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="javascript, tutorial, beginner..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manual Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Add a manual description or use AI generation..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - AI Generation */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Wand2 className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Content Generation</h3>
                </div>

                {/* API Key Section - Always Visible */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Key className="h-4 w-4 text-purple-600" />
                    <label className="text-sm font-medium text-gray-700">
                      OpenRouter API Key (Required for all models)
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your OpenRouter API key..."
                    />
                    <button
                      onClick={handleSaveApiKey}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>
                      Get your API key from{' '}
                      <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        OpenRouter
                      </a>
                      {' '}• Required for both free and paid models
                    </p>
                    {apiKey && (
                      <p className="text-green-600 mt-1">✓ API key saved locally</p>
                    )}
                  </div>
                </div>

                {/* Template Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quick Templates
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TUTORIAL_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => applyTemplate(template)}
                        className="p-3 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-white transition-colors"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{template.icon}</span>
                          <span className="text-sm font-medium text-gray-800">{template.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generation Prompt */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutorial Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Describe what tutorial you want to generate. Be specific about the topic, target audience, and what should be covered..."
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateTutorial}
                  disabled={isGenerating || !apiKey.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating Tutorial...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      <span>Generate Tutorial</span>
                    </>
                  )}
                </button>

                {/* Cost Estimate */}
                {selectedModelInfo.tier === 'paid' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-800">
                        Estimated cost: <strong>{estimatedCost}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Generated Content Preview */}
              {generatedContent && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Generated Content Preview</h4>
                    <span className="text-xs text-gray-500">
                      {generatedContent.length.toLocaleString()} characters
                    </span>
                  </div>
                  <div className="max-h-60 overflow-y-auto text-sm text-gray-700 bg-white p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                      {generatedContent.substring(0, 1000)}
                      {generatedContent.length > 1000 && '\n\n... (content continues)'}
                    </pre>
                  </div>
                  {generatedContent.length < 500 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                      ⚠️ Generated content seems short. Consider using a premium model or more detailed prompt.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Model Selection */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Model Selection</span>
                </h3>

                {/* Free Models Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Free Models</h4>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">API Key Required</span>
                  </div>
                  <div className="space-y-2">
                    {freeModels.map((model) => (
                      <div
                        key={model.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedModel === model.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setSelectedModel(model.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-900">{model.name}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs">{getSpeedIcon(model.speed)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getQualityColor(model.quality)}`}>
                              {model.quality}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Context: {model.context_length.toLocaleString()}</span>
                          <span className="font-medium text-green-600">FREE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paid Models Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium text-purple-800">Premium Models</h4>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">API Key Required</span>
                  </div>
                  
                  {/* Group by category */}
                  {['Premium', 'Balanced'].map((category) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">{category}</h5>
                      <div className="space-y-2">
                        {paidModels.filter(model => model.category === category).map((model) => (
                          <div
                            key={model.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedModel === model.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                            onClick={() => setSelectedModel(model.id)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">{model.name}</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs">{getSpeedIcon(model.speed)}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getQualityColor(model.quality)}`}>
                                  {model.quality}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Context: {model.context_length.toLocaleString()}</span>
                              <span className="font-medium text-purple-600">{model.pricing.prompt}/1M</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Model Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                  <h5 className="font-medium text-gray-800 mb-2">Selected Model</h5>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{selectedModelInfo.name}</p>
                    <p className="text-xs mb-2">{selectedModelInfo.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>Max tokens: {selectedModelInfo.max_tokens.toLocaleString()}</span>
                      <span className={selectedModelInfo.tier === 'free' ? 'text-green-600 font-medium' : 'text-purple-600 font-medium'}>
                        {selectedModelInfo.tier === 'free' ? 'FREE' : selectedModelInfo.pricing.prompt + '/1M'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200/50 bg-gray-50/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Tutorial</span>
          </button>
        </div>
      </div>
    </div>
  );
};