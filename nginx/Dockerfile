FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir /var/nginx_cache

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]