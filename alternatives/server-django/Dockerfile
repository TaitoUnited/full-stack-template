# Builder, tester and runtime container for local development
FROM python:3.8-alpine
ENV NODE_ENV development
ENV DJANGO_ENV development
ENV DJANGO_APP src
ENV PYTHONPATH /usr/local/lib/python3.8/site-packages

RUN apk add --update-cache \
  g++ \
  libffi-dev \
  postgresql-dev \
  python3-dev

RUN mkdir -p /service
WORKDIR /service

ARG SERVICE_DIR=.
COPY ${SERVICE_DIR}/requirements-dev.txt \
     ${SERVICE_DIR}/src/manage.py \
     /service/
# COPY . /service/
# COPY ${SERVICE_DIR}/src/manage.py /service/src/
# RUN pip3 install --upgrade pip && pip3 install -r requirements-dev.txt && pip3 install ptvsd
RUN pip3 install --upgrade pip && pip3 install -r requirements-dev.txt
# COPY ${SERVICE_DIR} /service/

EXPOSE 8080
# CMD ["python", "src/manage.py", "runserver", "0.0.0.0:9229"]
# CMD python -m ptvsd --host 0.0.0.0 --port 9229 -m $DJANGO_APP run --host $API_BINDADDR --port $API_PORT --no-debugger
CMD python3.8 manage.py runserver 0.0.0.0:9229
# ENTRYPOINT [ "/service/src/manage.py" ]
# ENTRYPOINT [ "tail", "-f", "/dev/null" ]
# CMD [""]

