FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs

# Install PHP
RUN apt-get update && apt-get install -y php php-cli

# Install Ruby
RUN apt-get update && apt-get install -y ruby ruby-dev

# Install Java
RUN apt-get update && apt-get install -y openjdk-11-jdk

# Install Go
RUN wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz \
    && rm go1.21.0.linux-amd64.tar.gz
ENV PATH=$PATH:/usr/local/go/bin

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH=$PATH:/root/.cargo/bin

# Install C/C++ compilers (already included in build-essential)

# Install Kotlin
RUN curl -s "https://get.sdkman.io" | bash
RUN bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install kotlin"

# Install Scala
RUN bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install scala"

# Install Dart
RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -fsSL https://storage.googleapis.com/dart-archive/channels/stable/release/3.8.1/linux_packages/dart_3.8.1-1_amd64.deb -o dart.deb \
 && dpkg -i dart.deb || apt-get install -f -y


# Install Swift (if available for Ubuntu)
RUN apt-get update && apt-get install -y \
    clang \
    libicu-dev \
    libpython3-dev \
    libsqlite3-dev \
    libxml2-dev \
    libz-dev \
    pkg-config \
    tzdata \
    unzip \
    zlib1g-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 