#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose certbot nginx
newgrp docker
systemctl enable docker
systemctl start docker

# Setup nginx
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo systemctl reload nginx

sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot \
    --webroot-path /var/www/certbot \
    -d resumai.api.calebnorthcott.com \
    --non-interactive \
    --agree-tos \
    --email crnorthc99@gmail.com

# Run docker-compose
docker-compose up -d