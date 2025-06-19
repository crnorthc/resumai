#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y docker.io docker-compose certbot nginx unzip curl
sudo systemctl enable docker
sudo systemctl start docker

# Setup nginx
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp nginx/pre_ssl.conf /etc/nginx/sites-enabled/nginx
sudo systemctl reload nginx

sudo mkdir -p /var/www/certbot
sudo certbot certonly --webroot \
    --webroot-path /var/www/certbot \
    -d resumai.api.calebnorthcott.com \
    --non-interactive \
    --agree-tos \
    --email crnorthc99@gmail.com

sudo cp nginx/resumai.conf /etc/nginx/sites-enabled/nginx
sudo systemctl reload nginx

VALUE=$(aws ssm get-parameter \
  --name "KEY_ENCRYPTION_SEED" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)

echo "KEY_ENCRYPTION_SEED=$VALUE" > worker_app/.env
echo "KEY_ENCRYPTION_SEED=$VALUE" > server_app/.env

# Run docker-compose
docker-compose up -d