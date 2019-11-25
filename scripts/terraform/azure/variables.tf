variable "taito_resource_namespace_id" {
  type = string
}

variable "taito_project" {
  type = string
}

variable "taito_env" {
  type = string
}

variable "taito_storages" {
  type = string  # whitespace delimited strings
  default = ""
}
