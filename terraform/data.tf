#==============================================================================
# ShopDeploy - Data Sources
# External data lookups for infrastructure configuration
#==============================================================================

#------------------------------------------------------------------------------
# AWS Account Information
#------------------------------------------------------------------------------
data "aws_caller_identity" "current" {}

data "aws_partition" "current" {}

data "aws_region" "current" {}

#------------------------------------------------------------------------------
# Availability Zones
#------------------------------------------------------------------------------
data "aws_availability_zones" "available" {
  state = "available"

  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

#------------------------------------------------------------------------------
# Latest Amazon Linux 2 AMI (for reference)
#------------------------------------------------------------------------------
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

#------------------------------------------------------------------------------
# EKS Optimized AMI
#------------------------------------------------------------------------------
data "aws_ami" "eks_optimized" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amazon-eks-node-${var.eks_cluster_version}-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
