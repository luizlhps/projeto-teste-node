# Base image with TypeScript and tsx
FROM node:22.7.0-alpine3.19

# Create and set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY ./package.json ./package-lock.json* ./
RUN npm install

# Copy the app source code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application using tsx
CMD ["npm", "run", "start"]