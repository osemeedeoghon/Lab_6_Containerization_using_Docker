# Use Node.js LTS Alpine
FROM node:lts-alpine

WORKDIR /app

# Copy package.json only (no yarn.lock)
COPY package.json ./

# Install dependencies
RUN yarn install --production

# Copy rest of the app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
