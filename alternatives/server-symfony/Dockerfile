# Original: https://github.com/dunglas/symfony-docker/blob/380dc902595e0575c07f68f84e3266745e8f8100/Dockerfile

ARG PHP_VERSION=8.1

# "builder" stage
FROM php:${PHP_VERSION}-fpm-alpine AS builder

# persistent / runtime deps
RUN apk add --no-cache \
	acl \
	fcgi \
	file \
	gettext \
	git \
	;

ARG APCU_VERSION=5.1.21
RUN set -eux; \
	apk add --no-cache --virtual .build-deps \
	$PHPIZE_DEPS \
	icu-data-full \
	icu-dev \
	libzip-dev \
	zlib-dev \
	; \
	\
	docker-php-ext-configure zip; \
	docker-php-ext-install -j$(nproc) \
	intl \
	zip \
	; \
	pecl install \
	apcu-${APCU_VERSION} \
	; \
	pecl clear-cache; \
	docker-php-ext-enable \
	apcu \
	opcache \
	; \
	\
	runDeps="$( \
	scanelf --needed --nobanner --format '%n#p' --recursive /usr/local/lib/php/extensions \
	| tr ',' '\n' \
	| sort -u \
	| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
	)"; \
	apk add --no-cache --virtual .phpexts-rundeps $runDeps; \
	\
	apk del .build-deps

COPY docker/php/docker-healthcheck.sh /usr/local/bin/docker-healthcheck
RUN chmod +x /usr/local/bin/docker-healthcheck

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD ["docker-healthcheck"]

RUN ln -s $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini
COPY docker/php/conf.d/symfony.prod.ini $PHP_INI_DIR/conf.d/symfony.ini

COPY docker/php/php-fpm.d/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

COPY docker/php/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

VOLUME /var/run/php

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# https://getcomposer.org/doc/03-cli.md#composer-allow-superuser
ENV COMPOSER_ALLOW_SUPERUSER=1

ENV PATH="${PATH}:/root/.composer/vendor/bin"

WORKDIR /develop

# Allow to choose skeleton
ARG SKELETON="symfony/skeleton"
ENV SKELETON ${SKELETON}

# Allow to use development versions of Symfony
ARG STABILITY="stable"
ENV STABILITY ${STABILITY}

# Allow to select skeleton version
ARG SYMFONY_VERSION=""
ENV SYMFONY_VERSION ${SYMFONY_VERSION}

# Download the Symfony skeleton and leverage Docker cache layers
RUN composer create-project "${SKELETON} ${SYMFONY_VERSION}" . --stability=$STABILITY --prefer-dist --no-dev --no-progress --no-interaction; \
	composer clear-cache

###> recipes ###
###< recipes ###

COPY . .

RUN set -eux; \
	mkdir -p var/cache var/log; \
	composer install --prefer-dist --no-dev --no-progress --no-scripts --no-interaction; \
	composer dump-autoload --classmap-authoritative --no-dev; \
	composer symfony:dump-env prod; \
	composer run-script --no-dev post-install-cmd; \
	chmod +x bin/console; sync
VOLUME /develop/var

ENTRYPOINT ["docker-entrypoint"]
CMD ["php-fpm"]

# "php" stage
FROM builder AS php
RUN mv /develop /service
WORKDIR /service

# "nginx" stage
FROM nginx:stable-alpine AS nginx
ARG BUILD_VERSION
LABEL version=${BUILD_VERSION} \
	company=yellowtab \
	project=yellowtab-admin \
	role=nginx
RUN mkdir -p /service
WORKDIR /service
RUN chown -R nginx:nginx /service && \
	mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
RUN sed -i '/application\/json/a\    application/wasm wasm;' \
	/etc/nginx/mime.types

COPY docker/nginx/nginx.conf /etc/nginx
COPY --from=php /service/public .

USER nginx
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 8080
