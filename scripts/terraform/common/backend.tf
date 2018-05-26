terraform {
  backend "local" {
    path = "./${var.taito_env}/terraform.tfstate"
  }
}
