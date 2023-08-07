# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the application, if necessary
RUN npm run build

# Expose the port that the Express application is running on
EXPOSE 8000



# Define the command to run your application
CMD ["npm", "start"] 
