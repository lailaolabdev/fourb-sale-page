# Use the official Node.js image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 to be accessed outside the container
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]