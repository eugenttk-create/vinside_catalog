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
ARG VITE_BASE_URL
ARG VITE_API_URL
ARG VITE_API_TOKEN
ARG VITE_API_IMG_BASE
ARG GENERATE_SOURCEMAP

# Set environment variables for build
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_TOKEN=$VITE_API_TOKEN
ENV VITE_API_IMG_BASE=$VITE_API_IMG_BASE
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP

# DEBUG: prove what the build actually received
RUN echo "DEBUG VITE_BASE_URL=[$VITE_BASE_URL]"

# Patch placeholders in public/embed.js with build-time env values
RUN chmod +x ./embed_env_patch.sh && ./embed_env_patch.sh && \
    echo "DEBUG embed.js after patch:" && grep BASE ./public/embed.js

# Build the application (Vite copies the patched public/embed.js into dist/)
RUN npm run build

# Production stage - serve with nginx
FROM alpine:3.20

# Enable Alpine main+community repositories
RUN echo "https://dl-cdn.alpinelinux.org/alpine/v3.20/main" > /etc/apk/repositories \
	&& echo "https://dl-cdn.alpinelinux.org/alpine/v3.20/community" >> /etc/apk/repositories \
		&& apk add --no-cache ca-certificates nginx nginx-mod-http-lua luarocks5.1 \
		&& luarocks-5.1 install lua-resty-redis

# Remove default Nginx config to use your own
RUN rm /etc/nginx/nginx.conf

# Create a folder for the PID file
RUN mkdir -p /run/nginx

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8085
EXPOSE 8085

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
