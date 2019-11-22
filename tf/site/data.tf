data "aws_vpc" "root_vpc" {
  count = 1

  filter {
    name = "tag:Name"
    values = ["dev-vpc"]
  }
}

data "aws_subnet_ids" "root_vpc_subnets" {
  vpc_id = "${data.aws_vpc.root_vpc.id}"
}

data "aws_route53_zone" "hosted_zone" {
  name         = "${var.dns_hosted_zones[local.dev-env]}"
  private_zone = false
}

data "aws_subnet" "personal_website_subnet" {
  filter {
    name = "tag:Name"
    values = ["${var.subnet[local.dev-env]}"]
  }
}
