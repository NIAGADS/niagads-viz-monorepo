# Use the official Node.js 18 image as the base image
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json lerna.json ./


# Install dependencies
RUN npm install

# Copy only the /apps/genomicsdb project and any shared dependencies
COPY apps/genomicsdb ./apps/genomicsdb
COPY packages ./packages

# Copy the .env.local file for the /apps/genomicsdb project
COPY apps/genomicsdb/.env.local ./apps/genomicsdb/.env.local

# Install dependencies for the /apps/genomicsdb project
RUN npm install

# Run the Lerna build command to build all packages in the monorepo
RUN npm run build

# Build the Next.js application - not now running in dev
# RUN npm run build

# Use a lightweight Node.js image for the production environment
# can't do 2-stage b/c we're not running build
# FROM node:18-alpine AS runner

# Copy the built application from the builder stage
# COPY --from=builder /app/apps/genomicsdb/.next ./.next
# COPY --from=builder /app/apps/genomicsdb/public ./public
# COPY --from=builder /app/apps/genomicsdb/package.json ./package.json
# COPY --from=builder /app/apps/genomicsdb/.env.local ./.env.local

# Install only production dependencies
# RUN npm install --production

# again doing dev for now
# RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
# running dev for now b/c too broken to build production
CMD ["npm", "run", "genomicsdb"]
