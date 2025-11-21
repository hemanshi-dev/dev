FROM node:18-slim

# Install FFmpeg
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create HLS directory
RUN mkdir -p hls

# Expose port (Render will override with PORT env var)
EXPOSE 8082

# Start server
CMD ["node", "dist/server.js"]