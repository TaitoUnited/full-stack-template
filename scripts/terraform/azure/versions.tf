terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=2.81.0"
    }
    /* SENDGRID
    sendgrid = {
      source  = "Trois-Six/sendgrid"
      version = ">=0.2.1"
    }
    */
  }

  required_version = ">= 1.3.0"
}
