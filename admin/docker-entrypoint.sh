#!/bin/sh

# Replaces environment variables in **/*.html files. For example,
# if REPLACE_CDN_PATH environment variable is defined, string 'CDN_PATH' is
# replaced with REPLACE_CDN_PATH environment variable value in all html files.
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
    find . -name '*.html' -exec sh -c \
      "sed -e \"s/${CONSTANT}/${REPLACEMENT}/g\" {} > $TEMPFILE && cat $TEMPFILE > {}" \;
  esac
done

exec "$@"
