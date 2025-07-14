# Use Node.js 22-slim image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package & prisma folder
COPY package.json prisma ./ 

# Install dependencies
RUN npm install  

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app (NestJS -> dist/)
RUN npm run build

# Expose the port that the application listens on.
EXPOSE 5000

# Run the application.
CMD ["npm", "run", "start:prod"]
