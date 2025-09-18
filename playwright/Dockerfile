ARG BUILDER_IMAGE='mcr.microsoft.com/playwright:v1.48.2-jammy'

FROM ${BUILDER_IMAGE} as builder

WORKDIR /playwright

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/package.json \
     ${SERVICE_DIR}/package-lock.* \
     ${SERVICE_DIR}/.npmrc \
     /playwright/

ENV NODE_ENV development
RUN npm ci

CMD ["tail", "-f", "/dev/null"]