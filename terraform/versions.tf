# a provider is a plugin that knows how to talk to a specific system
terraform{
    required_version = ">= 1.5.0"

    required_providers{
        kind = {
            source = "tehcyx/kind"
            version = "0.6.0"
        }
    }
}