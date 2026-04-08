# Stage 1: Install dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone build and static files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by Next.js in standalone mode
CMD ["node", "server.js"]



#old setup
# Use official Node.js image as base
# FROM node:18-alpine

# # Set working directory in container
# WORKDIR /app

# # Copy package.json and package-lock.json (if you have one)
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the app code
# COPY . .

# # Build the Next.js app
# RUN npm run build

# # Expose port 3000 (default Next.js port)
# EXPOSE 3000

# # Start the app in production mode
# CMD ["npm", "start"]
