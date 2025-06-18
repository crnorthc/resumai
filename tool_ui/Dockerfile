# Step 1: Build
FROM node:24 AS builder

WORKDIR /app
COPY ./tool_ui/package*.json ./
RUN npm install
COPY ./tool_ui .
RUN npm run build

# Step 2: Serve
FROM nginx:1-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./tool_ui/nginx.conf /etc/nginx/conf.d/default.conf
