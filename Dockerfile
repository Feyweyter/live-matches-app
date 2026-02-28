# Build stage
FROM node:20-alpine AS builder

ARG VITE_API_URL
ARG VITE_API_USERNAME
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_USERNAME=$VITE_API_USERNAME

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install a simple HTTP server to serve the built files
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the server
CMD ["serve", "-s", "dist", "-l", "3000"]