#!/usr/bin/env bash
set -eo pipefail

export MIGRATION_PLANNER_API="${MIGRATION_PLANNER_API:-'http://migration-planner:3443'}"

# shellcheck disable=SC2016
envsubst '$MIGRATION_PLANNER_API' < /deploy/nginx.conf > "$NGINX_DEFAULT_CONF_PATH/nginx.conf"

# Link access and error log files to stdout/stderr
# respectively in order to allow logs collection.
# See: https://docs.docker.com/config/containers/logging/
ln -sf /dev/stdout /var/log/nginx/access.log
ln -sf /dev/stderr /var/log/nginx/error.log

exec nginx -g "daemon off; error_log /dev/stderr warn;"
