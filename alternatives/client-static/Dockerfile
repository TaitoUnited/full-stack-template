# Local development runtime
FROM nginx:stable-alpine
ARG SERVICE_DIR=.
RUN mkdir -p /service
WORKDIR /service
RUN chown -R nginx:nginx /service && \
    mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
RUN sed -i '/application\/json/a\    application/wasm wasm;' \
    /etc/nginx/mime.types
COPY ./nginx.conf /etc/nginx
COPY ${SERVICE_DIR}/assets /service/assets
USER nginx
EXPOSE 8080
