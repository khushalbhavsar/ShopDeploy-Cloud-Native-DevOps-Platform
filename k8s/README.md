# ShopDeploy Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the ShopDeploy application.

## Prerequisites

- Kubernetes cluster (minikube, Docker Desktop, EKS, GKE, AKS, etc.)
- kubectl configured to connect to your cluster
- Docker images built and pushed to a registry

## Quick Start

### 1. Build and Push Docker Images

```bash
# Build images
docker build -t shopdeploy-backend:latest ./shopdeploy-backend
docker build -t shopdeploy-frontend:latest ./shopdeploy-frontend

# Tag for your registry (example with Docker Hub)
docker tag shopdeploy-backend:latest yourusername/shopdeploy-backend:latest
docker tag shopdeploy-frontend:latest yourusername/shopdeploy-frontend:latest

# Push to registry
docker push yourusername/shopdeploy-backend:latest
docker push yourusername/shopdeploy-frontend:latest
```

### 2. Update Image References

Update the image names in deployment files:
- `backend-deployment.yaml`
- `frontend-deployment.yaml`

### 3. Configure Secrets

Edit `backend-secret.yaml` with your actual values:

```yaml
stringData:
  MONGODB_URI: "your-mongodb-connection-string"
  JWT_ACCESS_SECRET: "your-secure-secret"
  JWT_REFRESH_SECRET: "your-secure-secret"
```

**For production**, create secrets using kubectl:

```bash
kubectl create secret generic backend-secrets \
  --namespace=shopdeploy \
  --from-literal=MONGODB_URI='mongodb://...' \
  --from-literal=JWT_ACCESS_SECRET='your-secret' \
  --from-literal=JWT_REFRESH_SECRET='your-secret'
```

### 4. Deploy to Kubernetes

**Using Kustomize (Recommended):**

```bash
# Preview what will be deployed
kubectl kustomize k8s/

# Apply all resources
kubectl apply -k k8s/
```

**Or apply individually:**

```bash
# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Apply all resources
kubectl apply -f k8s/
```

## Directory Structure

```
k8s/
├── namespace.yaml           # Kubernetes namespace
├── backend-configmap.yaml   # Backend configuration
├── backend-secret.yaml      # Backend secrets (edit before use!)
├── backend-deployment.yaml  # Backend deployment
├── backend-service.yaml     # Backend service
├── frontend-configmap.yaml  # Frontend configuration
├── frontend-deployment.yaml # Frontend deployment
├── frontend-service.yaml    # Frontend service
├── mongodb-statefulset.yaml # MongoDB StatefulSet with PVC
├── ingress.yaml             # Ingress configuration
├── hpa.yaml                 # Horizontal Pod Autoscaler
└── kustomization.yaml       # Kustomize configuration
```

## Useful Commands

```bash
# Check deployment status
kubectl get all -n shopdeploy

# View pods
kubectl get pods -n shopdeploy

# View logs
kubectl logs -f deployment/backend -n shopdeploy
kubectl logs -f deployment/frontend -n shopdeploy

# Describe resources
kubectl describe deployment backend -n shopdeploy
kubectl describe pod <pod-name> -n shopdeploy

# Port forward for local testing
kubectl port-forward svc/backend-service 5000:5000 -n shopdeploy
kubectl port-forward svc/frontend-service 3000:80 -n shopdeploy

# Scale deployments
kubectl scale deployment backend --replicas=3 -n shopdeploy

# Check HPA status
kubectl get hpa -n shopdeploy

# Delete all resources
kubectl delete -k k8s/
# OR
kubectl delete namespace shopdeploy
```

## Local Development with Minikube

```bash
# Start minikube
minikube start

# Enable ingress addon
minikube addons enable ingress

# Use minikube's Docker daemon (to use local images)
eval $(minikube docker-env)

# Build images in minikube's Docker
docker build -t shopdeploy-backend:latest ./shopdeploy-backend
docker build -t shopdeploy-frontend:latest ./shopdeploy-frontend

# Deploy
kubectl apply -k k8s/

# Get minikube IP
minikube ip

# Add to /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
# <minikube-ip> shopdeploy.local

# Access the application
# http://shopdeploy.local
```

## Production Considerations

1. **Secrets Management**: Use external secret managers (AWS Secrets Manager, HashiCorp Vault)
2. **TLS/SSL**: Enable TLS in ingress with cert-manager
3. **Resource Limits**: Adjust CPU/memory limits based on actual usage
4. **MongoDB**: Use managed MongoDB (Atlas) instead of in-cluster for production
5. **Monitoring**: Add Prometheus/Grafana for monitoring
6. **Logging**: Configure centralized logging (ELK, Loki)

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name> -n shopdeploy
kubectl logs <pod-name> -n shopdeploy
```

### MongoDB connection issues

```bash
# Check MongoDB pod
kubectl logs statefulset/mongodb -n shopdeploy

# Test connection from backend pod
kubectl exec -it deployment/backend -n shopdeploy -- sh
# Inside pod: 
# curl mongo-service:27017
```

### Ingress not working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Check ingress status
kubectl describe ingress shopdeploy-ingress -n shopdeploy
```
