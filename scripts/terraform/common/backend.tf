terraform {
  backend "local" {
    path = "${var.taito_env}.tfstate"
  }
}
