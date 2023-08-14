# Use the official Node.js image as the base image
FROM node:16

ENV PORT="8000"
ENV MONGODB_URI="mongodb://127.0.0.1:27017/trackify"
ENV EBAY_API_URL="api.ebay.com"
ENV EBAY_APP_ID="mohammad-Trackify-PRD-a4bbf96fd-913596b8"
ENV EBAY_DEV_ID="e2222592-c66d-4a30-bbaa-bd4810dfb073"
ENV EBAY_CLIENT_SECRET="PRD-4bbf96fd07d2-7d34-40ee-9ad3-9b73"
ENV EBAY_RU_NAME="mohammad_bilaal-mohammad-Tracki-eqpoahev"
ENV S3_BUCKET="trackify-images"
ENV S3_KEY="AKIAQ2XG3S2MCLCSKUVK"
ENV S3_SECRET="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"
ENV S3_LOCATION="http://trackify-images.s3.amazonaws.com"
ENV AWS_ACCESS_KEY_ID = "AKIAQ2XG3S2MKK757RIS"
ENV AWS_SECRET_ACCESS_KEY = "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"


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
