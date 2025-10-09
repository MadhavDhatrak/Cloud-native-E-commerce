# Production Dockerfile with nginx
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Clean install
RUN npm ci --legacy-peer-deps

COPY . .

# Build for production
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
