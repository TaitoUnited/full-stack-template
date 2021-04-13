#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Testing settings
#
# NOTE: Variables are passed to the tests without the test_TARGET_ prefix.
##########################################################################

# Enable CI/CD tests only for dev and feature environments
if [[ $taito_target_env == "dev" ]] || [[ $taito_target_env == "f-"* ]]; then
  ci_exec_test=true              # enable this to execute test suites
  ci_exec_test_init=false        # enable to run 'init --clean' before each test suite
  ci_exec_test_init_after=false  # enable to run 'init --clean' after all tests
fi

# Environment specific settings
test_all_TEST_ENV=$taito_target_env
if [[ $taito_target_env == "local" ]]; then
  test_all_TEST_ENV_REMOTE=false
  ci_test_base_url=http://full-stack-template-ingress:80
else
  test_all_TEST_ENV_REMOTE=true
  if [[ $taito_command == "util-test" ]]; then
    # Constitute test url by combining basic auth secret and domain name
    ci_test_base_url=https://$(cat tmp/secrets/dev/acme-azureware-dev-basic-auth.auth | sed 's/:{PLAIN}/:/')@$taito_domain
  fi
fi

# URLs for tests
test_admin_CYPRESS_baseUrl=$ci_test_base_url/admin
test_client_CYPRESS_baseUrl=$ci_test_base_url
test_graphql_TEST_API_URL=$ci_test_base_url/graphql
test_server_TEST_API_URL=$ci_test_base_url/api

# URLs for running Cypress on local host outside Docker
if [[ $taito_target_env == "local" ]]; then
  CYPRESS_baseUrl=$taito_app_url
  if [[ $taito_target == "admin" ]]; then
    CYPRESS_baseUrl=$taito_app_url/admin
    :
  fi
  :
else
  CYPRESS_baseUrl=$ci_test_base_url
  if [[ $taito_target == "admin" ]]; then
    CYPRESS_baseUrl=$ci_test_base_url/admin
    :
  fi
  :
fi

# Database connection for tests
if [[ $taito_mode == "ci" ]] && [[ ${ci_disable_db_proxy} == "true" ]]; then
  test_all_DATABASE_HOST=${database_real_host:-$database_host}
  test_all_DATABASE_SSL_ENABLED=${db_database_ssl_enabled}
  :
else
  test_all_DATABASE_HOST=${taito_project}-database-proxy
  test_all_DATABASE_SSL_ENABLED=${db_database_proxy_ssl_enabled}
  :
fi
test_all_DATABASE_PORT=$db_database_real_port
test_all_DATABASE_SSL_CLIENT_CERT_ENABLED=${db_database_ssl_client_cert_enabled}
test_all_DATABASE_SSL_SERVER_CERT_ENABLED=${db_database_ssl_server_cert_enabled}
test_all_DATABASE_NAME=$db_database_name
test_all_DATABASE_USER=${db_database_mgr_username}
if [[ $taito_target_env == "local" ]]; then
  # On local env we connect directly to the local database
  test_all_DATABASE_USER=${db_database_app_username}
  test_all_DATABASE_HOST=$taito_project-database
  :
fi

# Tests disabled on Azure DevOps and GitHub Actions for now
# TODO: For some reason Docker Compose volume mounts and networks do not work
if [[ ${taito_target_env} != "local" ]] &&
   ([[ ${taito_ci_provider} == "azure" ]] || [[ ${taito_ci_provider} == "github" ]]); then
  ci_exec_test=false
fi
