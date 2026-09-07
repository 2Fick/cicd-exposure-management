variable "cluster_name" {
    description = "Name of the local kind cluster"
    type        = string 
    default     = "cicd-exposure"
}

variable "node_image" {
    description = "Kind node image to use for control plane and worker nodes"
    type        = string
    default     = "kindest/node:v1.29.2"   
}

