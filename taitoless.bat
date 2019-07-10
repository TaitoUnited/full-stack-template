# Env
SET taito_env="local"
SET taito_project="full-stack-template"
SET taito_host_uname="WINDOWS_NT"

# Docker
SET dockerfile="Dockerfile"
SET DC_PATH='/rsync'
SET DC_COMMAND='sh -c \"cp -rf /rsync/service/. /service; (while true; do rsync -rtq /rsync/service/. /service; sleep 2; done) &\" '

# Database
SET db_database_name="full_stack_template_local"
SET db_database_app_username="full_stack_template_local_app"
SET db_database_app_secret="full-stack-template-local-db-app.password"
