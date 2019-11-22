terraform {
  required_providers = "0.11.11"
  backend "s3" {
    key     = "personal-website.tfstate"
    region  = "eu-west-2"
    encrypt = true
  }
}

provider "aws" {
  version = "~> 2.0"
  region  = "eu-west-2"
}
