resource "aws_lb" "central_load_balancer" {
  name = "${local.dev-env}-central-alb"
  internal = false
  load_balancer_type = "application"
  security_groups = ["${aws_security_group.personal_website.id}"]
  subnets = ["${data.aws_subnet_ids.root_vpc_subnets.ids}"]

  enable_deletion_protection = false
  enable_http2 = true

  tags {
    Environment = "${local.dev-env}"
  }
}

resource "aws_lb_target_group" "central_lb_targets" {
  name = "${local.dev-env}-personal-website"
  port = "${var.application_port}"
  protocol = "TCP"
  vpc_id = "${data.aws_subnet.personal_website_subnet.0.vpc_id}"
  deregistration_delay = 60

  health_check {
    healthy_threshold = 2
    unhealthy_threshold = 2
    interval = 10
    port = "${var.application_port}"
    protocol = "TCP"
  }
}

resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = "${aws_lb.central_load_balancer.arn}"
  port = 8080
  protocol = "HTTPS"

  default_action {
    type = "forward"
    target_group_arn = "${aws_lb_target_group.central_lb_targets.arn}"
  }
}
