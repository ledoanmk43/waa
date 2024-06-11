# Use an official Node.js runtime as the base image
FROM node:current

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Add the script to check and create the database
COPY check-and-create-db.sh /usr/local/bin/check-and-create-db.sh

# Expose port 3001 for the application
EXPOSE 3001

# Start the application
CMD [ "yarn", "start" ]