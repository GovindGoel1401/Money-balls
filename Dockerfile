# Use Node.js LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Quasar app for production
RUN npm run build

# Serve with a lightweight static server
RUN npm install -g serve

# Expose port (Quasar apps typically run on 3000 or 4173 if using Vite)
EXPOSE 8000

# Start the app
CMD ["serve", "dist/spa"]
