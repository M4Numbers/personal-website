resource "aws_security_group" "personal_website" {
  name = "personal-website-${local.dev-env}-sg"
  description = "Security group settings for the personal website"
  vpc_id = "${data.aws_vpc.root_vpc.id}"

  tags {
    Name = "personal-website-${local.dev-env}-sg"
  }
}

resource "aws_security_group_rule" "allow_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.personal_website.id}"
}

resource "aws_security_group_rule" "standard_traffic" {
  type              = "ingress"
  from_port         = "${var.application_port}"
  to_port           = "${var.application_port}"
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.personal_website.id}"
}

resource "aws_security_group_rule" "outgoing_traffic" {
  type              = "egress"
  from_port         = 0
  to_port           = 65535
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]

  security_group_id = "${aws_security_group.personal_website.id}"
}
