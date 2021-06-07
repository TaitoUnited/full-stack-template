terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      // bug in 2.62.0 https://github.com/terraform-providers/terraform-provider-azurerm/issues/12074
      version = ">=2.53.0, <2.62.0"
    }
  }

  required_version = ">= 0.15"
}
