#!/bin/bash

# Configuration
DOMAIN="sitemitraa.com"
PORT=3006
NGINX_AVAILABLE="/etc/nginx/sites-available/$DOMAIN.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/$DOMAIN.conf"

echo "Setting up Nginx reverse proxy for $DOMAIN on port $PORT..."

# Create the Nginx configuration file
cat <<EOF > $NGINX_AVAILABLE
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "Configuration file created at $NGINX_AVAILABLE"

# Enable the site by creating a symbolic link
if [ -L "$NGINX_ENABLED" ]; then
    echo "Symlink already exists in sites-enabled, skipping..."
else
    ln -s $NGINX_AVAILABLE $NGINX_ENABLED
    echo "Symlink created."
fi

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is OK. Restarting Nginx..."
    systemctl restart nginx
    echo "Nginx restarted successfully. Your site should now be accessible at http://$DOMAIN"
else
    echo "Nginx configuration test failed. Please check the errors above."
    exit 1
fi
