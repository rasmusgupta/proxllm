# ProxLLM

A modern web-based LLM chat platform with Claude AI-inspired UI and support for multiple AI providers.

## Features

- 🤖 **Multiple LLM Support**: OpenAI (GPT-4, GPT-3.5), Anthropic (Claude-3), and more
- 🔐 **Secure API Key Management**: Encrypted storage of your API keys
- 💬 **Real-time Streaming**: Get responses as they're generated
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, Claude-inspired interface built with shadcn/ui
- 🔒 **Authentication**: Secure login with NextAuth.js
- 📊 **Conversation Management**: Save, organize, and revisit your chats

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- API keys from LLM providers (OpenAI, Anthropic, etc.)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/proxllm"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Encryption Key for API Keys (32 characters)
   ENCRYPTION_KEY="your-32-character-encryption-key-here"

   # OAuth Providers (Optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations (when you have a database set up)
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Setting up API Keys

1. Sign in to your account
2. Navigate to Settings → API Keys  
3. Click "Add API Key"
4. Select your provider (OpenAI, Anthropic, etc.)
5. Give your key a name and paste your API key
6. Click "Add Key" - the system will validate and encrypt your key

### Starting a Conversation

1. From the main chat interface, click "New Chat" or use one of the example prompts
2. Type your message and press Enter
3. Watch as the AI responds in real-time
4. Your conversations are automatically saved

## Supported LLM Providers

### OpenAI
- GPT-4o, GPT-4o-mini
- GPT-4 Turbo, GPT-4
- GPT-3.5 Turbo

### Anthropic
- Claude-3.5 Sonnet
- Claude-3.5 Haiku  
- Claude-3 Opus, Sonnet, Haiku

### Coming Soon
- Google Gemini
- Cohere Command
- Hugging Face models

## Security Features

- 🔐 **Encrypted API Keys**: All API keys are encrypted using AES-256
- 🛡️ **Secure Sessions**: JWT-based authentication with NextAuth.js
- 🔒 **Protected Routes**: Authentication required for all chat functionality
- 🚨 **Input Validation**: All API inputs are validated and sanitized

## Project Structure

```
src/
├── app/                 # Next.js app router pages and API routes
├── components/          # React components
│   ├── chat/           # Chat interface components
│   ├── sidebar/        # Sidebar and navigation
│   ├── settings/       # Settings and configuration
│   └── ui/             # Reusable UI components (shadcn/ui)
├── lib/                # Utility libraries
│   ├── auth/           # Authentication configuration
│   ├── database/       # Database connection and utilities
│   ├── llm-providers/  # LLM provider integrations
│   ├── stores/         # Zustand state management
│   └── crypto/         # Encryption utilities
└── types/              # TypeScript type definitions
```

## License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, React, and modern web technologies.
