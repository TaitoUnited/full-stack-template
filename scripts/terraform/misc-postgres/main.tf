terraform {
  backend "gcs" {
  }
  required_version = ">= 0.13"
}

locals {
  resources = (
    fileexists("${path.root}/../../terraform-${var.taito_env}-merged.yaml")
      ? yamldecode(file("${path.root}/../../terraform-${var.taito_env}-merged.yaml"))
      : jsondecode(file("${path.root}/../../terraform-merged.json.tmp"))
  )["settings"]
}

module "postgres" {
  source  = "TaitoUnited/databases/postgresql"
  version = "1.0.0"

  resources                  = local.resources
}
