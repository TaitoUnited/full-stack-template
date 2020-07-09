#!/bin/sh

# Replaces environment variables in **/*.html files. For example,
# if REPLACE_ASSETS_PATH environment variable is defined, string 'ASSETS_PATH' is
# replaced with REPLACE_ASSETS_PATH environment variable value in all html files.
# Note that if the value starts with '-', an empty string is used as value.
for NAME in $(awk "END { for (name in ENVIRON) { print name; }}" < /dev/null)
do
  case $NAME in REPLACE_*)
    VAL="$(awk "END { printf ENVIRON[\"$NAME\"]; }" < /dev/null)"
    case $VAL in -*)
      VAL= # Replace with empty string
    esac
    CONSTANT="${NAME/REPLACE_/}"
    REPLACEMENT="${VAL//\//\\/}"
    TEMPFILE=$(mktemp)

    # Use BASE_HREF as default for ASSETS_PATH
    if [[ $CONSTANT == "ASSETS_PATH" ]] && [[ $REPLACEMENT == "" ]]; then
      REPLACEMENT="${REPLACE_BASE_HREF//\//\\/}"
    fi

    find . -name '*.html' -exec sh -c \
      "sed -e \"s/${CONSTANT}/${REPLACEMENT}/g\" {} > $TEMPFILE && cat $TEMPFILE > {}" \;
  esac
done

exec "$@"
