# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

ENV MONGODB_URI="mongodb://trackify:billy159@trackifycluster.cluster-cmroyitbsjhb.eu-west-2.docdb.amazonaws.com:27017/trackify?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
ENV PORT="8000"
ENV AWS_ACCESS_KEY_ID="AKIAQ2XG3S2MAPVXJUPI"
ENV AWS_SECRET_ACCESS_KEY="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"

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
