#!/usr/bin/env bash
# shellcheck disable=SC2034
# shellcheck disable=SC2154

##########################################################################
# Testing settings
#
# NOTE: Variables are passed to the tests without the test_TARGET_ prefix.
##########################################################################

# Environment specific settings
if [[ $taito_env == "local" ]]; then
  ci_test_base_url=http://full-stack-template-ingress:80
elif [[ $taito_env == "dev" ]] || [[ $taito_env == "f-"* ]]; then
  ci_exec_test=true              # enable this to execute test suites
  ci_exec_test_init=false        # run 'init --clean' before each test suite
  ci_exec_test_init_after=false  # run 'init --clean' after all tests
  if [[ $taito_command == "util-test" ]]; then
    # Constitute test url by combining basic auth secret and domain name
    ci_test_base_url=https://$(taito -q secret show:$taito_env basic-auth | head -1)@$taito_domain
  fi
fi

# Environment
test_all_TEST_ENV=$taito_env
test_all_TEST_ENV_REMOTE=true
if [[ $taito_env == "local" ]]; then
  test_all_TEST_ENV_REMOTE=false
fi

# Database connection
if [[ $taito_mode == "ci" ]] && [[ ${ci_disable_db_proxy} == "true" ]]; then
  test_all_DATABASE_HOST=${database_real_host:-$database_host}
  test_all_DATABASE_SSL_ENABLED=${db_database_ssl_enabled}
  :
else
  test_all_DATABASE_HOST=$taito_project-database-proxy
  test_all_DATABASE_SSL_ENABLED=${db_database_proxy_ssl_enabled}
  :
fi
test_all_DATABASE_PORT=$db_database_real_port
test_all_DATABASE_SSL_CLIENT_CERT_ENABLED=${db_database_ssl_client_cert_enabled}
test_all_DATABASE_SSL_SERVER_CERT_ENABLED=${db_database_ssl_server_cert_enabled}
test_all_DATABASE_NAME=$db_database_name
test_all_DATABASE_USER=${db_database_mgr_username}
if [[ "$taito_target_env" == "local" ]]; then
  # On local env we connect directly to the local database
  test_all_DATABASE_USER=${db_database_app_username}
  test_all_DATABASE_HOST=$taito_project-database
  :
fi

# URLs
test_admin_CYPRESS_baseUrl=$ci_test_base_url/admin
test_client_CYPRESS_baseUrl=$ci_test_base_url
test_graphql_TEST_API_URL=$ci_test_base_url/graphql
test_server_TEST_API_URL=$ci_test_base_url/api
if [[ "$taito_target_env" == "local" ]]; then
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

# Tests disabled on Azure DevOps
# TODO: For some reason Docker Compose volume mounts and networks do not work
if [[ ${taito_ci_provider} == "azure" ]] &&
   [[ ${ci_exec_test} == "true" ]] &&
   [[ ${taito_target_env} != "local" ]]
then
  ci_exec_test=false
fi
