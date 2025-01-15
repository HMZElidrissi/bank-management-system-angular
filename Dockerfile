# Stage 1: Build the Angular application
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy custom nginx config (if needed)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app to nginx directory
COPY --from=build /app/dist/bank-management-system /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
