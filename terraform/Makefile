#==============================================================================
# ShopDeploy - Terraform Makefile
# Convenient commands for infrastructure management
#==============================================================================

# Default environment
ENV ?= dev

# Terraform variables file
TFVARS := environments/$(ENV).tfvars

.PHONY: help init plan apply destroy fmt validate clean output

help: ## Show this help message
	@echo "ShopDeploy Terraform Infrastructure"
	@echo ""
	@echo "Usage: make [target] ENV=[dev|staging|prod]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'
	@echo ""
	@echo "Examples:"
	@echo "  make init ENV=dev        # Initialize for dev environment"
	@echo "  make plan ENV=prod       # Plan changes for production"
	@echo "  make apply ENV=staging   # Apply changes to staging"

init: ## Initialize Terraform
	terraform init -upgrade

plan: ## Plan infrastructure changes
	terraform plan -var-file=$(TFVARS) -out=tfplan

apply: ## Apply infrastructure changes
	terraform apply -var-file=$(TFVARS) -auto-approve

apply-plan: ## Apply from saved plan
	terraform apply tfplan

destroy: ## Destroy infrastructure (use with caution!)
	@echo "⚠️  WARNING: This will destroy all $(ENV) infrastructure!"
	@read -p "Type 'yes' to confirm: " confirm && [ "$$confirm" = "yes" ] || exit 1
	terraform destroy -var-file=$(TFVARS) -auto-approve

fmt: ## Format Terraform files
	terraform fmt -recursive

validate: ## Validate Terraform configuration
	terraform validate

clean: ## Clean Terraform cache
	rm -rf .terraform
	rm -f .terraform.lock.hcl
	rm -f tfplan
	rm -f *.tfstate.backup

output: ## Show Terraform outputs
	terraform output

refresh: ## Refresh Terraform state
	terraform refresh -var-file=$(TFVARS)

state-list: ## List resources in state
	terraform state list

console: ## Open Terraform console
	terraform console -var-file=$(TFVARS)

graph: ## Generate resource graph (requires graphviz)
	terraform graph | dot -Tpng > graph.png

#------------------------------------------------------------------------------
# Backend Setup Commands
#------------------------------------------------------------------------------
backend-init: ## Initialize backend infrastructure
	cd backend-setup && terraform init

backend-apply: ## Create S3 bucket and DynamoDB for remote state
	cd backend-setup && terraform apply -auto-approve

backend-destroy: ## Destroy backend infrastructure
	cd backend-setup && terraform destroy -auto-approve

#------------------------------------------------------------------------------
# Environment-specific shortcuts
#------------------------------------------------------------------------------
dev-plan: ## Plan for dev environment
	$(MAKE) plan ENV=dev

dev-apply: ## Apply to dev environment
	$(MAKE) apply ENV=dev

staging-plan: ## Plan for staging environment
	$(MAKE) plan ENV=staging

staging-apply: ## Apply to staging environment
	$(MAKE) apply ENV=staging

prod-plan: ## Plan for production environment
	$(MAKE) plan ENV=prod

prod-apply: ## Apply to production environment
	$(MAKE) apply ENV=prod
