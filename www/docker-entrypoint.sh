#!/bin/sh

function replace() {
  TEMPFILE=$(mktemp)
  find . -name "${1}" -exec sh -c \
    "sed -e \"s/${2}/${3}/g\" {} > $TEMPFILE && cat $TEMPFILE > {}" \;
}

function remove() {
  TEMPFILE=$(mktemp)
  find . -name "${1}" -exec sh -c \
    "sed -e \"/${2}/d\" {} > $TEMPFILE && cat $TEMPFILE > {}" \;
}

# Replaces environment variables in **/*.html files. For example,
# if REPLACE_ASSETS_PATH environment variable is defined, string 'ASSETS_PATH' is
# replaced with REPLACE_ASSETS_PATH environment variable value in all html files.
# Note that if the value starts with '-', an empty string is used as value.
if [ "$REPLACEMENT_DISABLED" != "true" ]; then
  for NAME in $(awk "END { for (name in ENVIRON) { print name; }}" < /dev/null)
  do
    case $NAME in REPLACE_*)
      VAL="$(awk "END { printf ENVIRON[\"$NAME\"]; }" < /dev/null)"
      case $VAL in -*)
        VAL= # Replace with empty string
      esac

      # Use BASE_PATH as default value for ASSETS_PATH
      if [ "$NAME" = "REPLACE_ASSETS_PATH" ] && [ -z "$VAL" ]; then
        VAL="${REPLACE_BASE_PATH}"
      fi

      CONSTANT=$(echo "${NAME}" | sed -e 's@REPLACE_@@')
      REPLACEMENT=$(echo "${VAL}" | sed -e 's@/@\\/@g')
      replace "*.html" "${CONSTANT}" "${REPLACEMENT}"

      # Replace ASSETS_PATH also in runtime.*.js and manifest.json
      if [ "$NAME" = "REPLACE_ASSETS_PATH" ] && [ -z "$VAL" ]; then
        replace "runtime.*.js" "${CONSTANT}" "${REPLACEMENT}"
        replace "manifest.json" "${CONSTANT}" "${REPLACEMENT}"
        remove "manifest.json" "start_url"
      fi
    esac
  done
fi

exec "$@"
