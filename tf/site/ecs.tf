resource "aws_ecs_cluster" "personal_website_cluster" {
  name = "${local.dev-env}-personal-website"
}

resource "aws_ecs_task_definition" "personal_website_task" {
  container_definitions = "${file("./assets/ecs/personal-website.json")}"

  family       = "service"
  network_mode = "host"
}

resource "aws_ecs_service" "personal_website_image" {
  name            = "personal-website"
  cluster         = "${aws_ecs_cluster.personal_website_cluster.id}"
  task_definition = "${aws_ecs_task_definition.personal_website_task.arn}"

  desired_count = 1

  load_balancer {
    target_group_arn = "${aws_lb_target_group.central_lb_targets.arn}"
    container_name   = "personal-website"
    container_port   = "${var.application_port}"
  }
}
