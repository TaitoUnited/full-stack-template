# Local development runtime
FROM nginx:stable-alpine

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN adduser -u "${USER_UID}" -G root -S developer || : 
RUN mkdir -p /develop && \
    chown "${USER_UID}:0" /develop
WORKDIR /develop
USER "${USER_UID}"

RUN chown -R nginx:nginx /develop && \
    mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
RUN sed -i '/application\/json/a\    application/wasm wasm;' \
    /etc/nginx/mime.types
COPY ./nginx.conf /etc/nginx

RUN sed -i "s|/service|/develop|g" /etc/nginx/nginx.conf

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/assets /develop/assets

USER nginx
EXPOSE 8080
