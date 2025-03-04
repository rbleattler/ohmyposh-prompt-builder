FROM nginx:alpine

# Copy application files
COPY src/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Default command starts nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
