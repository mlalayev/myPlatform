# 🚀 MyPlatform - Interactive Programming Learning Platform

A comprehensive, multilingual programming education platform that combines interactive tutorials, coding exercises, and real-time code execution across 16+ programming languages.

## 🌟 Features

### 🎯 **Core Learning Features**
- **Interactive Tutorials** - Step-by-step lessons with code examples
- **Coding Exercises** - Algorithmic challenges with real-time evaluation
- **Live Code Editor** - Execute code in 16+ programming languages instantly
- **Progress Tracking** - Monitor your learning journey with detailed analytics
- **Multi-language Support** - Available in Azerbaijani, Russian, and English

### 💻 **Supported Programming Languages**
- **JavaScript & TypeScript** - Full browser-based execution
- **Python & Python3** - Server-side execution with security sandbox
- **C++** - Local compilation with MSYS2/g++ and output limiting
- **Java, Kotlin, Scala** - JVM-based languages
- **C, C#, Go, Rust** - Systems programming languages
- **PHP, Ruby** - Web development languages
- **Swift, Dart** - Mobile development languages

### 🔧 **Advanced Code Execution**
- **Real Compilation** - Actual compilation and execution, not simulation
- **Security Sandbox** - Safe execution environment with timeouts
- **Output Limiting** - Prevents infinite loops and excessive output
- **Error Handling** - Multilingual error messages in user's preferred language
- **WebAssembly Support** - For languages requiring WASM runtime

### 🎓 **Learning Management**
- **User Authentication** - Secure login with NextAuth.js
- **Role-based Access** - User and Admin roles
- **Premium Features** - Subscription-based advanced content
- **Quiz System** - Interactive assessments with scoring
- **Certificate System** - Achievement tracking and badges

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling framework
- **Monaco Editor** - Professional code editor (VS Code's editor)
- **React Icons** - Beautiful icon library

### **Backend & Database**
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication and session management with Google OAuth

### **Code Execution Engine**
- **Python Safe Runner** - Secure Python execution with sandboxing
- **C++ Safe Runner** - Local compilation with MSYS2/g++
- **Web Workers** - Client-side JavaScript execution
- **VM2** - Node.js sandbox for server-side execution

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Docker** - Containerized deployment
- **Prisma Migrations** - Database schema management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Python 3.8+ (for code execution)
- MSYS2 (for C++ compilation on Windows)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd myPlatform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
Configure your `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/myplatform"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application!

## 📚 Learning Content

### **Tutorials Available**
- **JavaScript Fundamentals** - Variables, functions, loops, objects
- **Data Structures** - Arrays, objects, maps, sets
- **Algorithms** - Sorting, searching, recursion
- **Advanced Concepts** - Closures, promises, async/await

### **Exercise Categories**
- **Easy** - Basic programming concepts
- **Medium** - Algorithmic thinking
- **Hard** - Complex problem solving

## 🌍 Internationalization

The platform supports three languages:
- **Azerbaijani (az)** - Primary language
- **Russian (ru)** - Secondary language  
- **English (en)** - International language

Language detection is automatic based on URL path (`/az/`, `/ru/`, `/en/`).

## 🔒 Security Features

### **Code Execution Security**
- **Timeouts** - Prevents infinite loops (3-10 seconds)
- **Memory Limits** - Restricted memory usage
- **Output Limiting** - Maximum 5 console outputs for C++
- **Sandboxed Execution** - Isolated execution environment
- **Input Validation** - Sanitized user inputs

### **Authentication Security**
- **Password Hashing** - bcryptjs for secure password storage
- **Session Management** - Secure session handling
- **CSRF Protection** - Cross-site request forgery prevention
- **OAuth Integration** - Google login with automatic account creation

## 🚀 Deployment

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d --build

# Run database migrations
docker-compose exec app npx prisma migrate deploy
```

### **Production Considerations**
- Set up SSL/HTTPS certificates
- Configure environment variables for production
- Set up automated backups
- Monitor application logs
- Configure reverse proxy (Nginx)

## 📊 Platform Statistics

- **16+ Programming Languages** supported
- **89+ Coding Exercises** available
- **45+ Interview Questions** prepared
- **2,340+ Active Learners** (example data)

## 🎯 Why Choose MyPlatform?

### **For Learners**
- **Real Code Execution** - Not just simulations, actual compilation
- **Multilingual Support** - Learn in your preferred language
- **Interactive Experience** - Hands-on coding practice
- **Progressive Learning** - Structured curriculum from basics to advanced

### **For Educators**
- **Comprehensive Content** - Ready-to-use tutorials and exercises
- **Progress Tracking** - Monitor student advancement
- **Flexible Deployment** - Easy to deploy and customize
- **Scalable Architecture** - Handles multiple concurrent users

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation** - Check our comprehensive guides
- **Issues** - Report bugs and request features
- **Community** - Join our developer community
- **Email** - Contact us directly for support

---

**Built with ❤️ for the programming community**

*Empowering developers to learn, practice, and grow together.*


npx prisma generate - Only updates the client, no database changes
npx prisma migrate dev - Creates and applies migrations safely
npx prisma db push - Pushes schema changes without migrations