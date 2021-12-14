variable "taito_env" {
  type = string
  description = "You project environment, for example 'dev', 'test', or 'prod'."
}

variable "auth0_primary_domain" {
  type = string
  description = "Domain of your Auth0 tenant. For example, 'my-project-dev.eu.auth0.com'"
}

variable "auth0_client_id" {
  type = string
  description = <<EOT
Client id for Terraform.

Note that you need to manually create Auth0 tenant and machine-to-machine
application with all scopes enabled for the use of Terraform, if you have not
done so already.

TIP: You can delete the Default App, Username-Password-Authentication database,
and all social connections (e.g. google-oauth2) that were created on your Auth0
tenant by default.
EOT
}

variable "auth0_client_secret" {
  type = string
  sensitive = true
  description = "Client secret for Terraform."
}
