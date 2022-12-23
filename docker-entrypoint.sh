#!/bin/bash

set -eo pipefail

if [[ ! -e prototype ]]; then
  mkdir prototype
  cd prototype
  npx govuk-prototype-kit create
  mkdir sessions
else
  cd prototype
fi

exec "$@"
