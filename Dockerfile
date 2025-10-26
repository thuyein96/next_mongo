# --- Stage 1: Build ---
# Use the official Node.js 18 image as the base for building
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build command
RUN npm run build

# --- Stage 2: Production ---
# Use a minimal Node.js 18 image for the final production image
FROM node:18-alpine AS production
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy the standalone output from the builder stage
# This includes the .next/standalone directory
COPY --from=builder /app/.next/standalone ./

# Copy the public assets and static files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose the port Next.js runs on (default 3000)
EXPOSE 3000

# The command to start the app
# This uses the optimized server.js in the standalone output
CMD ["node", "server.js"]
