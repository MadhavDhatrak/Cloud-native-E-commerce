# Development-focused Dockerfile for Vite
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create .env file to configure Vite for API proxy
RUN echo 'VITE_API_URL=http://api-gateway:3000' > .env

EXPOSE 5173

CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
