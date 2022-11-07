terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
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
