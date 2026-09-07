# resource declaration 
# creates an actual K8S cluster
provider "kind" {}

resource "kind_cluster" "this" {
    name        = var.cluster_name
    wait_for_ready = true

    kind_config {
        kind        = "Cluster"
        api_version = "kind.x-k8s.io/v1alpha4"

        node {
            role = "control-plane"
            image = var.node_image
        }

        node {
            role = "worker"
            image = var.node_image
        }
    }
}