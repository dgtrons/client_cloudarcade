# Use a Node.js image for building the React app
FROM node:18 AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Serve the build with an nginx server
FROM nginx:1.23
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]