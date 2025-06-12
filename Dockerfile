# Use official Node.js image as base
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if you have one)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (default Next.js port)
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "start"]
