variable "application_port" {
  description = "The open port of the application for all TCP requests"
  default     = 8080
}

variable "dns_hosted_zones" {
  description = "A collection of all the hosted zones the application can be deployed on"
  type        = "map"
}

variable "subnet" {
  description = "The subnet collection that the applications will be deployed into"
  type        = "map"
}
