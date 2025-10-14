# Multi-stage build for React application

# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for building)
RUN npm install --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install serve globally and wget for health checks
RUN npm install -g serve && \
    apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S itda && \
    adduser -S itda -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership
RUN chown -R itda:itda /app

# Switch to non-root user
USER itda

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173 || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]