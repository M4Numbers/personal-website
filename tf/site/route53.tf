resource "aws_route53_record" "personal_website_endpoint" {
  name    = "${local.dev-env}-personal-website"
  type    = "A"
  zone_id = "${data.aws_route53_zone.hosted_zone.zone_id}"

  alias {
    name                   = "${aws_lb.central_load_balancer.dns_name}"
    zone_id                = "${aws_lb.central_load_balancer.zone_id}"
    evaluate_target_health = true
  }
}
