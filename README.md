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

# Requirements for Deployment and Code Execution

To run this platform and support all code execution features in the try editor, you must have the following compilers, runtimes, and tools installed on your server:

## Universal Requirements
- **Docker** (for secure sandboxed code execution)
- **Node.js** (see package.json for version)
- **npm** (Node.js package manager)

## Language Runtimes & Compilers

### Python
- **python3** (recommended: Python 3.10+)
- **pip** (Python package manager)

### Java
- **OpenJDK** (recommended: 11+)
- **javac** (Java compiler)

### C & C++
- **gcc** (C compiler)
- **g++** (C++ compiler)
- **build-essential** (Ubuntu meta-package for C/C++ build tools)

### C#
- **.NET SDK** (recommended: 7.0+ or 8.0+)
- **dotnet CLI**

### PHP
- **php** (CLI version, recommended: 8.0+)

### JavaScript & TypeScript
- **Node.js** (already required for the platform)
- **npm** (already required)

### Go (optional, if you want Go support)
- **golang** (recommended: 1.21+)

### Rust (optional, if you want Rust support)
- **rustc** (Rust compiler)

### Docker
- **Docker Engine** (for sandboxed code execution)

---

## Installation Commands (Ubuntu Example)

```sh
# Update system
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io
sudo systemctl enable --now docker

# Install Node.js & npm (example for Node 18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt-get install -y python3 python3-pip

# Install Java (OpenJDK)
sudo apt-get install -y openjdk-11-jdk

# Install C/C++ compilers
sudo apt-get install -y build-essential

# Install PHP
sudo apt-get install -y php php-cli

# Install .NET SDK (C#)
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# (Optional) Install Go
sudo apt-get install -y golang

# (Optional) Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
```

---

## Installation Notes (Windows)
- **Docker Desktop**: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
- **Node.js**: [https://nodejs.org/](https://nodejs.org/)
- **Python**: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- **Java (OpenJDK)**: [https://adoptium.net/](https://adoptium.net/)
- **C/C++ (MinGW or MSYS2 recommended)**: [https://www.msys2.org/](https://www.msys2.org/)
- **PHP**: [https://windows.php.net/download/](https://windows.php.net/download/)
- **.NET SDK**: [https://dotnet.microsoft.com/en-us/download](https://dotnet.microsoft.com/en-us/download)
- **Go**: [https://go.dev/dl/](https://go.dev/dl/)
- **Rust**: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)

---

## Additional Notes
- Make sure all compilers and runtimes are available in the system PATH.
- Docker daemon/service must be running for code execution to work.
- For production, restrict Docker resource usage and never mount sensitive host folders into containers.
- If you add new language support, install the corresponding compiler/runtime and update Docker images if needed.