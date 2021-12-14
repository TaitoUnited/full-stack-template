// TODO: set backend dynamically on 'taito env apply:ENV'?

# FOR GCP (dev, test)
terraform {
  backend "gcs" {
  }
  required_version = ">= 1.0.7"
}

/*
# FOR AWS (stag, prod)
terraform {
  backend "s3" {
  }
  required_version = ">= 0.13"
}
*/

provider "auth0" {
  domain        = var.auth0_primary_domain
  client_id     = var.auth0_client_id
  client_secret = var.auth0_client_secret
}

locals {
  settings = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["settings"]
}

module "auth" {
  source        = "TaitoUnited/auth/auth0"
  version       = "1.1.1"
  configuration = local.settings.auth
}
