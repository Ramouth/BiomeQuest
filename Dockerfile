# Stage 1: Build React frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the React frontend
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S biomequest -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server code
COPY server ./server

# Create database directory with proper permissions
RUN mkdir -p /app/db && chown -R biomequest:nodejs /app/db

# Switch to non-root user
USER biomequest

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the server
CMD ["node", "server/index.js"]
