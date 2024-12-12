FROM node:alpine

WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 5998

CMD ["npm", "start"]