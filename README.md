# CodeED - Sandbox Code Editor

A modern, full-featured sandbox code editor built with Next.js, Monaco Editor, and XTerm.js that allows you to create, edit, and run code in a browser-based environment.

## Features

### 🎯 Core Features

- **Multi-language Support**: JavaScript, TypeScript, HTML, CSS, Python, Java, C++, and more
- **Monaco Editor Integration**: VS Code-like editing experience with syntax highlighting, IntelliSense, and code completion
- **Live Code Execution**: Run JavaScript code directly in the browser with sandbox environment
- **Integrated Terminal**: XTerm.js terminal for viewing output and debugging
- **File Management**: Create, edit, save, and download multiple files
- **Project Workspaces**: Organize your code into projects and workspaces
- **Real-time Syntax Validation**: Instant error detection and warnings

### 🚀 Sandbox Features

- **Safe Code Execution**: Sandboxed JavaScript execution environment
- **Console Output Capture**: See console.log, errors, and warnings in the terminal
- **Multiple File Support**: Work with HTML, CSS, and JS files simultaneously
- **Auto-save**: Automatic saving of changes
- **Download Files**: Export your code as individual files

### 🎨 User Interface

- **Dark Theme**: Professional dark theme optimized for coding
- **Split Panes**: Resizable editor and terminal panels
- **File Tree**: Easy navigation between files
- **Status Indicators**: Visual feedback for unsaved changes and execution status
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (for workspace persistence)
- AWS S3 compatible storage (for file storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pandarudra/codeED.git
   cd codeED
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   MONGODB_URI=your-mongodb-connection-string
   B2_BUCKET_NAME=your-s3-bucket-name
   B2_APPLICATION_KEY_ID=your-s3-key-id
   B2_APPLICATION_KEY=your-s3-secret-key
   B2_ENDPOINT=your-s3-endpoint
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### Creating a New Project

1. **Navigate to Dashboard**: Go to `/dashboard` after signing in
2. **Create Workspace**: Click "Create Workspace" and give it a name
3. **Open Editor**: Click "Open Editor" on any workspace
4. **Start Coding**: Begin writing code in the Monaco editor

### Using the Editor

#### File Management

- **New File**: Click the "New File" button in the sidebar
- **Switch Files**: Click on any file in the file tree to open it
- **Save**: Use Ctrl+S or click the Save button
- **Download**: Click the Download button to save files locally

#### Code Execution

- **Run JavaScript**: Click the "Run" button to execute JavaScript code
- **View Output**: Check the terminal panel for console output
- **Error Handling**: Errors and warnings appear in the terminal

#### Editor Features

- **Auto-completion**: IntelliSense suggestions as you type
- **Syntax Highlighting**: Automatic language detection and highlighting
- **Code Folding**: Collapse/expand code blocks
- **Multi-cursor**: Hold Alt and click for multiple cursors
- **Find & Replace**: Use Ctrl+F for search, Ctrl+H for replace

### Supported Languages

#### Fully Supported (with execution)

- **JavaScript**: Full execution support with console output
- **HTML**: Preview and validation
- **CSS**: Syntax validation

#### Syntax Support Only

- TypeScript, Python, Java, C++, C#, PHP, Ruby, Go, Rust, JSON, XML, Markdown, SQL, Shell scripts

## Architecture

### Frontend

- **Next.js 15**: React framework with App Router
- **Monaco Editor**: VS Code editor component
- **XTerm.js**: Terminal emulator
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Backend

- **Next.js API Routes**: RESTful API endpoints
- **MongoDB**: Database for workspace and user data
- **AWS S3**: File storage and management
- **NextAuth.js**: Authentication system

### Key Components

#### Editor Page (`/editor/[projectID]`)

- Main editor interface
- File management sidebar
- Monaco editor integration
- Terminal integration
- Code execution system

#### Dashboard (`/dashboard`)

- Workspace management
- Project overview
- File upload/download
- Project navigation

#### API Routes

- `/api/projects/[projectId]`: Project data management
- `/api/execute`: Code execution endpoint
- `/api/upload`: File upload handling
- `/api/auth`: Authentication endpoints

## Development

### Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard page
│   ├── editor/        # Editor pages
│   └── globals.css    # Global styles
├── components/
│   ├── ui/           # Reusable UI components
│   ├── Editor.tsx    # Monaco editor wrapper
│   ├── Terminal.tsx  # XTerm.js terminal
│   └── Sidebar.tsx   # File navigation
├── lib/              # Utility libraries
├── models/           # Database models
└── public/           # Static assets
```

### Adding New Languages

1. **Update Editor.tsx**: Add language mapping in `getLanguage()` function
2. **Update API**: Add execution logic in `/api/execute/route.ts`
3. **Add Templates**: Include default templates in `getDefaultContent()`

### Custom Themes

Modify the Monaco editor theme in `Editor.tsx`:

```typescript
theme = "vs-dark"; // Change to your preferred theme
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Troubleshooting

### Common Issues

#### Monaco Editor not loading

- Ensure dynamic imports are used for SSR compatibility
- Check console for JavaScript errors

#### Terminal not displaying

- Verify XTerm.js dependencies are installed
- Check terminal container height/width

#### Code execution fails

- Check browser console for errors
- Verify API endpoints are accessible
- Ensure proper sandboxing in execute API

#### File upload issues

- Verify S3 credentials and permissions
- Check network connectivity
- Ensure proper CORS settings

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Monaco Editor by Microsoft
- XTerm.js by SourceForge
- Next.js by Vercel
- Tailwind CSS by Tailwind Labs

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ by the CodeED team
