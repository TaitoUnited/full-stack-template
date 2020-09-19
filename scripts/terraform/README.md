# Terraform

This folder contains [Terraform](https://www.terraform.io/) modules for your application. These files are updated automatically on 'taito project upgrade' and there is rarely need to modify them manually. All application specific configurations are located in `../terraform*.yaml` files.

You can add additional Terraform modules here, if you like:

- All `project-*` modules will be run on `taito project apply`
- All `env-*` modules will be run on `taito env apply:ENV`
- All `deploy-*` modules will be run on `taito deployment deploy:ENV`.

Do not forget to define backend for your modules. For example:

```
# Store state to AWS S3 bucket
terraform {
  backend "s3" {
  }
}

# Store state to Azure storage bucket
terraform {
  backend "azurerm" {
  }
}

# Store state to Google Cloud storage bucket
terraform {
  backend "gcs" {
  }
}
```
