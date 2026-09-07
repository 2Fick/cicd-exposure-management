output "cluster_name" {
    description = "Name of the kind cluster that was created"
    value       = kind_cluster.this.name
}

output "kubeconfig_path" {
    description = "Path to the kubeconfig file for the cluster"
    value       = kind_cluster.this.kubeconfig_path
}

output "client_certificate" {
    description = "Client certificate for the cluster"
    value       = kind_cluster.this.client_certificate
    sensitive = true
}