terraform {
  required_providers {
    auth0 = {
      source  = "alexkappa/auth0"
      version = ">=0.21.0"
    }
  }

  required_version = ">= 1.0.7"
  experiments = [module_variable_optional_attrs]
}
