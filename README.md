<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎓 Certifier - AI-Powered Certificate Management System

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀%20Ghost--Acedmia-blue?style=for-the-badge&logo=netlify)](https://ghost-acedmia.netlify.app)
[![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-🤖%20Preview-green?style=for-the-badge&logo=google)](https://aistudio.google.com/app/apps/drive/1XlFMxEOPeTwLvCJ7cUrPmAqdDxMGbYAs?showPreview=true&showAssistant=true)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

## 🌟 Overview

**Certifier** is a cutting-edge certificate management system that leverages AI and blockchain technology to create, verify, and manage digital certificates with advanced security features including steganography and cryptographic verification.

## 🚀 Live Demos

<div align="center">

| 🌐 **Production Deployment** | 🤖 **AI Studio Integration** |
|:-----------------------------:|:-----------------------------:|
| **[View Live App](https://ghost-acedmia.netlify.app)** | **[AI Studio Preview](https://aistudio.google.com/app/apps/drive/1XlFMxEOPeTwLvCJ7cUrPmAqdDxMGbYAs?showPreview=true&showAssistant=true)** |
| Deployed on Netlify with global CDN | Interactive preview with Google AI Studio |

</div>

## 🏗️ Architecture

### Frontend Stack
- **React 19.2.3** - Modern UI library with concurrent features
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool and dev server
- **React Router DOM 7.10.1** - Client-side routing

### Security & Verification
- **Steganography** - Hidden data embedding in certificates
- **Cryptographic Verification** - Secure certificate validation
- **Blockchain Integration** - Smart contract-based certificate registry

### Deployment
- **Netlify** - Global CDN deployment with automatic HTTPS
- **Continuous Integration** - Automated builds and deployments

## 🎯 Key Features

### 📊 Dashboard Components
- **Issuer Dashboard** - Certificate creation and management
- **Exam Taker Interface** - Interactive examination system
- **Verifier Portal** - Certificate authenticity verification
- **Navigation System** - Seamless user experience

### 🔐 Security Features
- **Digital Signatures** - Cryptographic certificate validation
- **Steganographic Embedding** - Hidden security markers
- **Blockchain Verification** - Immutable certificate records
- **Smart Contract Integration** - Automated certificate lifecycle

## 🛠️ Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git** (for version control)

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd certifier

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 🚀 Deployment

### Netlify Deployment (Recommended)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider

## 🔗 Integration Links

<div align="center">

### 🌐 Production Environment
**[https://ghost-acedmia.netlify.app](https://ghost-acedmia.netlify.app)**

- Global CDN with edge locations worldwide
- Automatic HTTPS and SSL certificates
- Continuous deployment from Git
- Built-in form handling and serverless functions

### 🤖 AI Studio Integration
**[Google AI Studio Preview](https://aistudio.google.com/app/apps/drive/1XlFMxEOPeTwLvCJ7cUrPmAqdDxMGbYAs?showPreview=true&showAssistant=true)**

- Interactive AI-powered certificate generation
- Real-time preview and testing
- Integration with Google's AI capabilities
- Collaborative development environment

</div>

## 📁 Project Structure

```
certifier/
├── components/          # React components
│   ├── ExamTaker.tsx   # Examination interface
│   ├── IssuerDashboard.tsx # Certificate management
│   ├── Verifier.tsx    # Verification portal
│   └── NavBar.tsx      # Navigation component
├── contracts/          # Smart contracts
│   └── CertificateRegistry.sol # Blockchain integration
├── utils/              # Utility functions
│   ├── crypto.ts       # Cryptographic functions
│   └── steganography.ts # Data embedding
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
└── vite.config.ts     # Build configuration
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
GEMINI_API_KEY=your_api_key_here
```

### Vite Configuration
The project uses Vite with React plugin, configured for:
- Development server on port 3000
- TypeScript support
- Path aliases (@ for root directory)
- Environment variable injection

## 🧪 Testing

Run the development server and navigate to:
- **Home**: `http://localhost:3000`
- **Issuer Dashboard**: Certificate creation interface
- **Exam Taker**: Interactive examination system
- **Verifier**: Certificate verification portal

## 📈 Performance

- **Build Time**: ~1.3 seconds
- **Bundle Size**: 256.73 kB (81.31 kB gzipped)
- **Loading Time**: Sub-second with Netlify CDN
- **SEO Optimized**: Server-side rendering ready

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI Studio** for AI integration capabilities
- **Netlify** for seamless deployment and hosting
- **React Team** for the amazing React framework
- **Vite Team** for the blazing-fast build tool

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**[⬆ Back to Top](#-certifier---ai-powered-certificate-management-system)**

</div>
