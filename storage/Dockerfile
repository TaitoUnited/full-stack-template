# Builder, tester and runtime container for local development
FROM minio/minio

# Init /develop for user USER_UID
ARG USER_UID=1001
RUN useradd --system --uid "${USER_UID}" --gid 0 -m developer || :
RUN mkdir -p /develop && \
    chown "${USER_UID}:0" /develop
WORKDIR /develop
USER "${USER_UID}"

ARG SERVICE_DIR=.
COPY --chown="${USER_UID}:0" \
    ${SERVICE_DIR} /develop
CMD server /develop
