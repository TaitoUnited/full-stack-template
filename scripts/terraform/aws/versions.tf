terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = ">=5.26.0"
    }
    
    /* SENDGRID
    sendgrid = {
      source  = "Trois-Six/sendgrid"
      version = ">=0.2.1"
    }
    */
  }

  required_version = ">= 1.6.0"
}
