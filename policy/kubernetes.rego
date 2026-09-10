package main

import rego.v1

workload_kinds := {"Deployment", "StatefulSet", "Job"}

approved_images := {"postgres", "grafana/grafana", "aquasec/trivy"}

# Both regular and init containers have to satisfy every rule below
all_containers contains c if {
	some c in input.spec.template.spec.containers
}

all_containers contains c if {
	some c in input.spec.template.spec.initContainers
}

image_repository(image) := repo if {
	parts := split(image, ":")
	repo := parts[0]
}

# The network policies select pods by their app label. A workload without one
# is not covered by any policy, and nothing warns you about it.
deny contains msg if {
	input.kind in workload_kinds
	not input.spec.template.metadata.labels.app
	msg := sprintf("%s/%s has no app label on its pod template, no network policy can match it", [input.kind, input.metadata.name])
}

# Only images from sources we have reviewed may be deployed.
deny contains msg if {
	input.kind in workload_kinds
	some c in all_containers
	repo := image_repository(c.image)
	not repo in approved_images
	msg := sprintf("%s/%s container %s uses %s, which is not an approved image", [input.kind, input.metadata.name, c.name, c.image])
}

# A finished job that is never removed leaves pods behind for good.
deny contains msg if {
	input.kind == "Job"
	not input.spec.ttlSecondsAfterFinished
	not deleted_by_helm_hook
	msg := sprintf("Job/%s sets neither ttlSecondsAfterFinished nor a hook-succeeded delete policy, its pods will pile up", [input.metadata.name])
}

deleted_by_helm_hook if {
	policy := input.metadata.annotations["helm.sh/hook-delete-policy"]
	contains(policy, "hook-succeeded")
}