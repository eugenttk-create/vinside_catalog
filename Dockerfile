# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_API_TOKEN
ARG VITE_API_IMG_BASE

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_TOKEN=$VITE_API_TOKEN
ENV VITE_API_IMG_BASE=$VITE_API_IMG_BASE

# Build the application
RUN npm run build

# Production stage - serve with nginx
FROM alpine:latest

# Install Nginx and the Lua module
RUN apk add --no-cache nginx-mod-http-lua nginx-mod-http-ndk

# Remove default Nginx config to use your own
RUN rm -r /etc/nginx/conf.d && rm /etc/nginx/nginx.conf

# Create a folder for the PID file
RUN mkdir -p /run/nginx

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8085
EXPOSE 8085

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
