resource "aws_ecr_repository" "image" {
  count = "${var.taito_env == "dev" && var.taito_container_registry_provider == "aws" ? length(var.taito_targets) : 0}"
  name = "${var.taito_vc_repository}/${element(var.taito_targets, count.index)}"
}

resource "aws_ecr_repository" "builder" {
  count = "${var.taito_env == "dev" && var.taito_container_registry_provider == "aws" ? length(var.taito_targets) : 0}"
  name = "${var.taito_vc_repository}/${element(var.taito_targets, count.index)}-builder"
}
