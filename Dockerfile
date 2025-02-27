# Use Node.js image to build the Vue.js app
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vue.js application
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine AS production-stage

# Copy built files from the build stage to Nginx's web directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
