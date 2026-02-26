# ShopDeploy E-Commerce — 40 Interview Questions & Answers + Project Explanation Guide

---

## 📌 How to Explain This Project in an Interview

### 30-Second Elevator Pitch

> "I built **ShopDeploy**, a production-grade, cloud-native e-commerce platform using the **MERN stack** (MongoDB, Express, React, Node.js). The entire project follows **DevOps best practices** — I containerized services with **Docker** multi-stage builds, provisioned AWS infrastructure (VPC, EKS, ECR, IAM) using **Terraform** modules, deployed via **Helm charts** across dev/staging/prod environments, implemented a full **CI/CD pipeline with Jenkins** (15-stage CI + 9-stage CD), adopted **GitOps with ArgoCD** ApplicationSets for automated deployments, and set up **monitoring with Prometheus & Grafana**. Security is baked in at every layer — Trivy image scanning, SonarQube code quality, non-root containers, NetworkPolicies, and Pod Security Standards."

---

### Detailed Explanation Structure (2-3 minutes)

**1. Start with the Problem:**
> "I wanted to build a real-world e-commerce platform that mirrors how production applications are actually deployed and managed in enterprises — not just the code, but the entire delivery pipeline."

**2. Application Layer:**
> "The application is a MERN stack e-commerce store with customer features (product browsing, cart, Stripe checkout, order tracking) and an admin dashboard (product/order management). The backend is a Node.js/Express REST API with MongoDB via Mongoose, JWT authentication, and input validation using Joi and express-validator. The frontend is React 18 with Redux Toolkit for state management, React Router v6, and Tailwind CSS — bundled with Vite."

**3. Containerization:**
> "Both services use Docker multi-stage builds. The backend builds with `npm ci --only=production` and runs as a non-root user (UID 1001). The frontend builds the Vite app, then the production stage uses `nginx-unprivileged` on port 8080 with gzip compression, SPA routing, security headers, and 1-year cache busting for static assets."

**4. Infrastructure as Code:**
> "All AWS infrastructure is provisioned with Terraform — I built custom modules for VPC (3 public + 3 private subnets, NAT gateways), IAM roles, ECR repositories, and an EKS cluster running Kubernetes 1.29 with managed node groups (t3.medium/t3.large, auto-scaling 2-10 nodes). State is managed in S3 with DynamoDB locking."

**5. CI/CD Pipeline:**
> "Jenkins handles CI with a 15-stage pipeline — from checkout and change detection through linting, unit tests, SonarQube analysis, Docker builds, Trivy security scanning, pushing to ECR, and updating GitOps values. The CD pipeline has 9 stages including production approval gates, Helm deployments, rollback capture, and smoke/integration tests."

**6. GitOps & ArgoCD:**
> "I implemented GitOps — Jenkins updates image tags in environment-specific YAML files, and ArgoCD automatically syncs the desired state to EKS. An ApplicationSet with a matrix generator creates 6 applications (3 environments × 2 services). Auto-sync with pruning and self-healing means the cluster always matches the git repo."

**7. Monitoring & Security:**
> "Prometheus scrapes application metrics with 8 custom alert rules (CPU, memory, error rate, response time, HPA capacity). Grafana provides dashboards for cluster health and pod-level metrics. Security includes Trivy scanning, SonarQube quality gates, NetworkPolicies restricting pod-to-pod traffic, PodDisruptionBudgets, ResourceQuotas, and non-root container execution."

---

### Key Numbers to Remember

| Metric | Value |
|--------|-------|
| CI Pipeline Stages | 15 |
| CD Pipeline Stages | 9 |
| GitOps Pipeline Stages | 7 |
| Terraform Modules | 4 (VPC, IAM, ECR, EKS) |
| Helm Charts | 2 (Backend, Frontend) |
| Environments | 3 (Dev, Staging, Prod) |
| ArgoCD Applications | 6 (3 envs × 2 services) |
| Prometheus Alert Rules | 8 |
| EKS Node Scaling | 2-10 nodes |
| HPA Backend | 2-10 pods |
| HPA Frontend | 2-5 pods |
| Docker Base Images | node:18-alpine, nginx-unprivileged:alpine |
| Network Policies | 3 (Backend, Frontend, MongoDB) |

---

## 🔷 SECTION 1: DOCKER & CONTAINERIZATION (Q1–Q5)

---

### Q1. How did you containerize the backend and frontend services?

**Answer:**
Both services use **Docker multi-stage builds** to minimize image size and attack surface.

**Backend Dockerfile:**
- **Stage 1 (Builder):** Uses `node:18-alpine`, copies `package.json` and `package-lock.json`, runs `npm ci --only=production` to get a clean, reproducible install of only production dependencies.
- **Stage 2 (Production):** Fresh `node:18-alpine`, installs `curl` for the health check, creates a non-root user `nodejs` with UID 1001, copies only `node_modules` from the builder stage (not source build artifacts — the source is directly copied), exposes port 5000, sets a `HEALTHCHECK` on `/api/health/health`, and runs `node src/server.js`.

**Frontend Dockerfile:**
- **Stage 1 (Builder):** Uses `node:18-alpine`, accepts `VITE_API_URL` as a build argument (baked into the static bundle at build time), runs `npm ci` and `npm run build`.
- **Stage 2 (Production):** Uses `nginxinc/nginx-unprivileged:alpine` which runs as non-root (UID 101), copies the custom `nginx.conf` and the compiled `/app/dist` to Nginx's HTML directory, exposes port 8080.

**Why multi-stage?** The final images exclude build tools, dev dependencies, and source code (for the frontend), resulting in significantly smaller and more secure images.

---

### Q2. What does your nginx.conf do for the frontend?

**Answer:**
The custom `nginx.conf` is configured for an **unprivileged container** (port 8080) and handles several concerns:

1. **SPA Routing:** `try_files $uri $uri/ /index.html` — ensures all client-side routes fall through to `index.html` so React Router handles them.
2. **Gzip Compression:** Enables gzip for text, CSS, JS, JSON, SVG, and XML — reducing transfer sizes.
3. **Static Asset Caching:** Sets a 1-year Cache-Control with the `immutable` flag for files in `/assets/` — Vite uses content-hash filenames, so this is safe and optimal.
4. **Security Headers:** Adds `X-Frame-Options: SAMEORIGIN` (prevents clickjacking), `X-Content-Type-Options: nosniff` (prevents MIME sniffing), and `X-XSS-Protection: 1; mode=block`.

---

### Q3. How does Docker Compose bring up the full stack locally?

**Answer:**
The `docker-compose.yml` defines **3 services** on a custom bridge network (`shopdeploy-network`):

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| **mongodb** | `mongo:7.0` | 27017:27017 | Persistent `mongodb_data` volume, healthcheck via `mongosh --eval 'db.runCommand("ping")'` |
| **backend** | Built from `./shopdeploy-backend` | 5000:5000 | Connects to `mongodb://mongodb:27017/shopdeploy`, depends_on MongoDB `service_healthy` |
| **frontend** | Built from `./shopdeploy-frontend` | 3000:80 | Passes `VITE_API_URL` as build arg, depends_on backend `service_healthy` |

The `depends_on` with `condition: service_healthy` ensures services start in order and only after health checks pass — MongoDB must be responding before the backend starts, and the backend must be healthy before the frontend builds.

---

### Q4. Why do you use non-root users in your Docker containers?

**Answer:**
Running as non-root follows the **principle of least privilege** and is a critical security best practice:

- **Backend:** Creates user `nodejs` with UID 1001. If an attacker exploits a vulnerability in the Node.js app, they cannot modify system files, install packages, or escalate privileges.
- **Frontend:** Uses `nginxinc/nginx-unprivileged` which runs as UID 101 natively — it listens on port 8080 (unprivileged port, no root needed to bind).

This also aligns with Kubernetes `PodSecurityStandards` — our deployments set `runAsNonRoot: true` and `allowPrivilegeEscalation: false`, and drop all Linux capabilities. If the container somehow ran as root, Kubernetes would reject it.

---

### Q5. How do you handle Docker image tagging and layer caching?

**Answer:**
**Image Tagging:** We use **immutable tags** in the format `{BUILD_NUMBER}-{GIT_COMMIT_SHORT}` (e.g., `7-06bc32a`). This ensures:
- Every image is uniquely identifiable and traceable to a specific build + commit.
- We never overwrite tags like `latest` in production — avoiding "it worked yesterday" issues.
- Rollbacks are precise — just redeploy a known tag.

**Layer Caching:** In the CI pipeline, `docker build` uses `--cache-from` with the previous image from ECR. The Dockerfiles are ordered for maximum cache efficiency — `COPY package*.json` and `npm ci` happen before `COPY . .`, so dependency layers are reused unless `package-lock.json` changes.

---

## 🔷 SECTION 2: KUBERNETES & EKS (Q6–Q13)

---

### Q6. Describe your Kubernetes deployment architecture.

**Answer:**
The application runs on **Amazon EKS (Kubernetes 1.29)** with managed node groups:

- **Namespaces:** `shopdeploy-dev`, `shopdeploy-staging`, `shopdeploy-prod` — environment isolation.
- **Backend:** Deployment with 2-3 replicas, pod anti-affinity (spread across nodes), topology spread constraints across availability zones, ClusterIP service on port 5000.
- **Frontend:** Deployment with 2 replicas, ClusterIP service on port 80 (targetPort 8080), served by Nginx.
- **MongoDB:** Deployment with emptyDir for dev/staging; StatefulSet with PersistentVolumeClaims for production.
- **Ingress:** AWS ALB Ingress Controller — routes `/` to frontend, `/api` to backend. SSL termination at ALB.

All pods run as non-root with `securityContext: runAsNonRoot: true, allowPrivilegeEscalation: false, readOnlyRootFilesystem: true (where possible), capabilities: drop: ["ALL"]`.

---

### Q7. How do HPA (Horizontal Pod Autoscaler) and PDB (PodDisruptionBudget) work together?

**Answer:**
They serve complementary purposes:

**HPA** — Scales pods based on demand:
- Backend: 2-10 replicas, scales at 70% CPU / 80% memory utilization.
- Frontend: 2-5 replicas, scales at 70% CPU.
- Uses `autoscaling/v2` with `containerResource` metrics targeting specific containers.

**PDB** — Protects availability during voluntary disruptions (node drains, cluster upgrades):
- Both services: `minAvailable: 1` (dev) / `minAvailable: 2` (prod).
- Kubernetes will never voluntarily evict pods below this threshold.

**Together:** HPA ensures there are enough pods to handle load, while PDB ensures that cluster operations (like scaling down nodes) don't accidentally take all pods offline. For example, during a node drain, if HPA has scaled the backend to 5 pods, PDB ensures at least 1 (or 2 in prod) remain running.

---

### Q8. Explain your NetworkPolicy configuration.

**Answer:**
We implement **3 NetworkPolicies** following a zero-trust, least-privilege networking model:

**1. Backend NetworkPolicy:**
- **Ingress:** Allows traffic only from frontend pods, the ingress-nginx controller, and pods in the same namespace — on port 5000.
- **Egress:** Allows connections to MongoDB on port 27017, kube-dns on port 53 (for DNS resolution), and external HTTPS on port 443 (for Stripe API calls, etc.) — explicitly excluding private IP ranges.

**2. Frontend NetworkPolicy:**
- **Ingress:** Allows traffic only from the ingress-nginx controller and same-namespace pods on port 80.
- **Egress:** Allows only kube-dns on port 53 (it's a static file server — it doesn't call the backend directly at runtime; the browser does).

**3. MongoDB NetworkPolicy:**
- **Ingress:** Allows traffic only from the backend on port 27017 — no one else can access the database.
- **Egress:** Only kube-dns on port 53.

This means even if an attacker compromises the frontend pod, they cannot directly reach MongoDB.

---

### Q9. What are ResourceQuota and LimitRange, and how do you use them?

**Answer:**
Both prevent resource overuse at the namespace level:

**ResourceQuota** — Sets hard limits for the entire namespace:
- Requests: 8 CPU, 16Gi memory
- Limits: 16 CPU, 32Gi memory
- Max objects: 50 pods, 20 services, 50 configmaps, 50 secrets, 10 PVCs

**LimitRange** — Sets per-container defaults and boundaries:
- Default: 500m CPU / 512Mi memory (limits), 100m / 128Mi (requests)
- Max per container: 2 CPU / 4Gi memory
- Max per pod: 4 CPU / 8Gi memory
- PVC range: 1Gi minimum, 50Gi maximum

**Why both?** ResourceQuota prevents a team from monopolizing cluster resources. LimitRange ensures individual pods are reasonable — if a developer forgets to set resource requests, the defaults kick in, and no single pod can consume excessive resources.

---

### Q10. How do your liveness, readiness, and startup probes work?

**Answer:**
We use all three probe types on the backend:

**Liveness Probe:** `httpGet /api/health/health:5000`
- Checks: "Is the process alive?" If it fails, Kubernetes **restarts** the container.
- Config: `initialDelaySeconds: 30, periodSeconds: 10, failureThreshold: 3`

**Readiness Probe:** `httpGet /api/health/ready:5000`
- Checks: "Can this pod handle traffic?" If it fails, the pod is removed from Service endpoints (no traffic routed to it) but NOT restarted.
- Config: `initialDelaySeconds: 5, periodSeconds: 10, failureThreshold: 3`

**Startup Probe:** `httpGet /api/health/health:5000`
- Checks: "Has the app finished starting?" Until this succeeds, liveness/readiness probes are disabled — prevents slow-starting apps from being killed during initialization.
- Config: `failureThreshold: 30, periodSeconds: 10` = 300s max startup time.

**Frontend probes** hit Nginx on port 8080 — simpler since it's a static file server.

---

### Q11. How does Ingress routing work in your project?

**Answer:**
We use the **AWS ALB Ingress Controller** (Kubernetes Ingress with ALB annotations):

- **Host:** `shopdeploy.example.com` (frontend), `api.shopdeploy.example.com` (backend API)
- **Path-based routing:** `/` → frontend service (port 80), `/api` → backend service (port 5000)
- **SSL:** ALB terminates TLS using ACM certificates, with automatic HTTP→HTTPS redirect via `alb.ingress.kubernetes.io/ssl-redirect: "443"`.
- **ALB Annotations:** `scheme: internet-facing`, `target-type: ip` (for direct pod targeting in VPC), `listen-ports: [{"HTTPS": 443}]`.

The reference manifests also include an **Nginx Ingress** alternative for local development (`shopdeploy.local`).

---

### Q12. How do you manage sensitive data in Kubernetes?

**Answer:**
We use multiple approaches based on the environment:

**1. Kubernetes Secrets:**
- Created via Helm chart templates (`secret.yaml`), values provided through environment-specific values files or `--set` flags.
- Secrets include: `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `STRIPE_SECRET_KEY`.
- Mounted as environment variables via `envFrom: secretRef`.

**2. AWS Systems Manager Parameter Store:**
- The CI pipeline stores image tags in SSM (`/shopdeploy/{env}/image-tag`) for cross-pipeline communication.

**3. External Secrets (Optional):**
- The Helm chart supports `externalSecrets.enabled` to integrate with AWS Secrets Manager via the External Secrets Operator — pulling secrets dynamically instead of storing them in YAML.

**4. ConfigMaps** for non-sensitive config: `NODE_ENV`, `PORT`, `FRONTEND_URL`, `LOG_LEVEL`.

---

### Q13. What happens during a Kubernetes rolling update of your backend?

**Answer:**
With the default `RollingUpdate` strategy:

1. Kubernetes creates new pods with the updated image tag.
2. **Startup probe** runs — the new pod has up to 300 seconds to start.
3. Once the startup probe passes, the **readiness probe** is evaluated.
4. When the readiness probe succeeds, the pod is added to the Service endpoints and starts receiving traffic.
5. Kubernetes then terminates old pods, respecting the **PDB** (`minAvailable: 1`) — it will never terminate pods if it would violate the budget.
6. The HPA continues monitoring — if CPU/memory thresholds are crossed during the rollout, it can scale up additional pods.
7. Pod **anti-affinity** ensures new pods are spread across different nodes.
8. **Topology spread constraints** ensure pods are distributed across availability zones.

If a new pod fails its probes, the rollout pauses — old pods keep serving traffic. The `kubectl rollout status` command in the CD pipeline detects this and triggers rollback procedures.

---

## 🔷 SECTION 3: TERRAFORM & INFRASTRUCTURE (Q14–Q19)

---

### Q14. Describe your Terraform module structure.

**Answer:**
Terraform is organized into **4 custom modules** in `terraform/modules/`:

| Module | Resources Created |
|--------|-------------------|
| **VPC** | VPC, 3 public subnets, 3 private subnets, Internet Gateway, NAT Gateways (one per AZ or single), route tables, EKS-required tags |
| **IAM** | EKS cluster role, node group role, required AWS managed policies (AmazonEKSClusterPolicy, AmazonEKSWorkerNodePolicy, AmazonEKS_CNI_Policy, AmazonEC2ContainerRegistryReadOnly) |
| **ECR** | Two repositories (backend + frontend), lifecycle policies (retain last 30 images), image scanning on push |
| **EKS** | EKS cluster, managed node group (t3.medium/t3.large), OIDC provider for IRSA, cluster add-ons (cluster_autoscaler, metrics_server, aws_lb_controller) |

The root `main.tf` wires modules together, passing outputs from VPC/IAM into EKS. This separation allows independent modification — e.g., changing ECR retention doesn't risk EKS changes.

---

### Q15. How do you manage Terraform state?

**Answer:**
**State Backend:** S3 with DynamoDB locking (configured but commented out for initial bootstrap):
- **S3 bucket:** `shopdeploy-terraform-state` — stores `terraform.tfstate`
- **DynamoDB table:** `shopdeploy-terraform-locks` — prevents concurrent `terraform apply`
- **Encryption:** S3 server-side encryption enabled
- **Key:** `shopdeploy/prod/terraform.tfstate`

**Bootstrap Problem:** The state backend configuration references the `backend-setup/` module which creates the S3 bucket and DynamoDB table first. You run `terraform apply` locally (local state) to create these resources, then uncomment the S3 backend block and run `terraform init -migrate-state`.

**State Security:** The state file contains sensitive data (EKS CA certificate marked `sensitive` in outputs). The S3 bucket should have versioning enabled for state recovery and restricted IAM access.

---

### Q16. What are the key Terraform variables and how do environments differ?

**Answer:**
Key variables defined in `variables.tf`:

| Variable | Dev | Staging | Prod |
|----------|-----|---------|------|
| `environment` | dev | staging | prod |
| `eks_node_instance_types` | t3.medium | t3.medium, t3.large | t3.medium, t3.large |
| `eks_node_desired_size` | 2 | 2 | 3 |
| `eks_node_min_size` | 1 | 2 | 2 |
| `eks_node_max_size` | 5 | 5 | 10 |
| `enable_nat_gateway` | true | true | true |
| `single_nat_gateway` | true | true | false (HA) |
| `enable_ssl` | false | true | true |

The `environment` variable has a **validation block** ensuring only `dev`, `staging`, or `prod` are accepted. All resources are named with `{project_name}-{environment}` prefix (e.g., `shopdeploy-prod-eks`) for clear identification and multi-environment support in the same AWS account.

---

### Q17. How does Terraform configure the EKS cluster?

**Answer:**
The EKS module creates:

1. **EKS Cluster** (`shopdeploy-prod-eks`) on Kubernetes 1.29, placed in private subnets.
2. **Managed Node Group:** Instance types `t3.medium` and `t3.large`, 50GB disk, scaling 2-10 nodes. EKS handles node AMI updates and draining.
3. **OIDC Provider:** Enables **IAM Roles for Service Accounts (IRSA)** — pods can assume IAM roles without node-level permissions.
4. **Add-ons:** Cluster Autoscaler (scales nodes), Metrics Server (enables HPA), AWS Load Balancer Controller (creates ALBs from Ingress resources).

The `kubernetes` and `helm` providers in `main.tf` are configured using the EKS cluster endpoint and exec-based token authentication (`aws eks get-token`), allowing Terraform to also deploy Kubernetes resources if needed.

---

### Q18. What data sources does your Terraform use and why?

**Answer:**
The `data.tf` file defines 5 data sources:

1. **`aws_caller_identity`** — Gets the current AWS account ID. Used for constructing ECR repo URLs (`{account_id}.dkr.ecr.{region}.amazonaws.com`).
2. **`aws_partition`** — Returns `aws` (or `aws-cn` for China). Used in IAM policy ARNs for portability.
3. **`aws_region`** — Gets the current region name.
4. **`aws_availability_zones`** — Fetches available AZs (filtering opt-in-not-required). Subnets are distributed across these AZs for high availability.
5. **`aws_ami`** — Looks up the latest Amazon Linux 2 and EKS-optimized AMIs by owner and filters.

These data sources make the configuration **dynamic** — it adapts to whichever region/account it's deployed in, rather than hardcoding account-specific values.

---

### Q19. What does your Terraform output and why?

**Answer:**
Key outputs (defined in `outputs.tf`):

- **VPC:** VPC ID, CIDR block, public/private subnet IDs, NAT Gateway IPs — needed by other teams/tools.
- **ECR:** Repository URLs for backend and frontend — used by Jenkins to push images.
- **EKS:** Cluster name, endpoint, CA certificate (marked `sensitive`) — needed to configure kubectl.
- **IAM:** Role ARNs, OIDC provider ARN/URL — needed for IRSA configuration.
- **Convenience commands:** `configure_kubectl` (full `aws eks update-kubeconfig` command) and `ecr_login_command` — copy-paste ready.

The `sensitive = true` flag on the EKS CA certificate prevents it from being displayed in `terraform output` or CI logs, protecting cluster security.

---

## 🔷 SECTION 4: HELM CHARTS (Q20–Q24)

---

### Q20. How are your Helm charts structured?

**Answer:**
We have **2 Helm charts** — `helm/backend/` and `helm/frontend/` — each following the standard structure:

```
helm/backend/
├── Chart.yaml          # Chart metadata (name, version, appVersion)
├── values.yaml         # Default values
├── values-dev.yaml     # Dev overrides
├── values-staging.yaml # Staging overrides
├── values-prod.yaml    # Prod overrides
└── templates/
    ├── _helpers.tpl       # Template helpers (labels, names, selectors)
    ├── deployment.yaml    # Deployment manifest
    ├── service.yaml       # ClusterIP Service
    ├── ingress.yaml       # ALB Ingress
    ├── hpa.yaml           # HorizontalPodAutoscaler
    ├── pdb.yaml           # PodDisruptionBudget
    ├── configmap.yaml     # Non-sensitive config
    ├── secret.yaml        # Sensitive data
    └── serviceaccount.yaml# K8s ServiceAccount
```

The `_helpers.tpl` file defines reusable templates for consistent naming (`{{ include "shopdeploy-backend.fullname" . }}`) and standard Kubernetes labels.

---

### Q21. How do you handle environment-specific Helm values?

**Answer:**
We use a **layered values strategy**:

1. **`values.yaml`** — Base defaults (replicas: 2, resources, probes, etc.)
2. **`values-{env}.yaml`** — Environment overrides (checked into the Helm chart)
3. **`gitops/{env}/backend-values.yaml`** — GitOps overrides (updated by CI pipeline with image tags)

During deployment:
```bash
helm upgrade --install shopdeploy-backend ./helm/backend \
  -f helm/backend/values.yaml \
  -f helm/backend/values-prod.yaml \
  -f gitops/prod/backend-values.yaml \
  --set image.tag=7-06bc32a
```

Later files override earlier ones. The GitOps values files are the ones ArgoCD watches — they contain the image tag and any runtime-specific overrides.

Key differences:

| Setting | Dev | Prod |
|---------|-----|------|
| Replicas | 1 | 3 |
| CPU Request | 100m | 500m |
| Memory Request | 128Mi | 512Mi |
| LOG_LEVEL | debug | warn |
| HPA | disabled | 3-10 replicas |
| PDB minAvailable | 1 | 2 |
| pullPolicy | Always | IfNotPresent |

---

### Q22. How does HPA work inside the Helm chart?

**Answer:**
The `hpa.yaml` template is conditionally rendered:

```yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "shopdeploy-backend.fullname" . }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "shopdeploy-backend.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
{{- end }}
```

In **dev**, `autoscaling.enabled: false` so this resource isn't created (replicas are fixed at 1). In **prod**, it's enabled with `minReplicas: 3, maxReplicas: 10, targetCPU: 60%`. When HPA is enabled, the Deployment's `replicas` field is typically omitted (or ignored) because HPA takes control.

---

### Q23. How does the Helm Ingress template work with ALB?

**Answer:**
The backend `ingress.yaml` creates an AWS ALB via annotations:

```yaml
annotations:
  kubernetes.io/ingress.class: alb
  alb.ingress.kubernetes.io/scheme: internet-facing
  alb.ingress.kubernetes.io/target-type: ip
  alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS": 443}]'
  alb.ingress.kubernetes.io/ssl-redirect: "443"
  alb.ingress.kubernetes.io/certificate-arn: {{ .Values.ingress.certificateArn }}
```

- **`scheme: internet-facing`** — Creates a public ALB (vs. `internal`).
- **`target-type: ip`** — Routes directly to pod IPs (not node ports), more efficient.
- **`ssl-redirect: "443"`** — Automatic HTTP→HTTPS redirect.
- **`certificate-arn`** — References an ACM TLS certificate.

The AWS Load Balancer Controller (installed by Terraform) watches for Ingress resources with these annotations and provisions/configures the actual ALB in AWS.

---

### Q24. What is the role of ServiceAccount in your Helm charts?

**Answer:**
Each chart creates a Kubernetes ServiceAccount:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: backend-sa
  annotations:
    eks.amazonaws.com/role-arn: {{ .Values.serviceAccount.roleArn }}
```

The `eks.amazonaws.com/role-arn` annotation enables **IAM Roles for Service Accounts (IRSA)**. When a pod uses this ServiceAccount, the EKS OIDC provider injects temporary AWS credentials — the pod can then access AWS services (like S3 for file uploads, SES for emails) without needing ACCESS_KEY/SECRET_KEY credentials.

This follows least privilege — each service gets its own IAM role with only the permissions it needs, and credentials rotate automatically.

---

## 🔷 SECTION 5: CI/CD — JENKINS PIPELINES (Q25–Q32)

---

### Q25. Walk through the 15 stages of your CI pipeline.

**Answer:**

| Stage | What It Does | Why |
|-------|-------------|-----|
| 1. **Environment Setup** | Sets env-specific variables (namespace, API URLs, replica counts) | Supports dev/staging/prod from one pipeline |
| 2. **Checkout** | Pulls code, extracts git commit + author | Traceability |
| 3. **Detect Changes** | `git diff` on backend/frontend dirs | Skip unchanged services |
| 4. **Install Dependencies** | Parallel `npm ci` for both services | Clean, reproducible installs |
| 5. **Code Linting** | Parallel ESLint | Catch style/quality issues early |
| 6. **Unit Tests** | Parallel Jest with coverage | Validate functionality |
| 7. **Verify Coverage** | Check `coverage/lcov.info` exists | Ensure tests actually ran |
| 8. **SonarQube Analysis** | Static analysis for bugs, smells, vulnerabilities | Code quality gate |
| 9. **Quality Gate** | `waitForQualityGate abortPipeline: true` | Block bad code from proceeding |
| 10. **Build Docker Images** | Parallel multi-stage builds with `--cache-from` | Create deployable artifacts |
| 11. **Security Scan** | Trivy scans for HIGH/CRITICAL CVEs | Catch vulnerable dependencies |
| 12. **Push to ECR** | Tag + push with `retry(3)` | Store artifacts |
| 13. **Save Image Tag** | Archive `build-info.json`, store in AWS SSM | Cross-pipeline communication |
| 14. **Update GitOps** | `sed` updates image tags in GitOps values, push to git | Trigger ArgoCD sync |
| 15. **Cleanup** | Remove local Docker images | Free disk space |

---

### Q26. How does the CD pipeline handle production deployments safely?

**Answer:**
Several safety mechanisms in the 9-stage CD pipeline:

1. **Manual Approval Gate:** For production, a `timeout(time: 30, unit: 'MINUTES')` `input` step requires approval from `admin` or `devops-team` members. The deployer's name is captured for audit.

2. **Rollback Capture:** Before deployment, the pipeline records current Helm revision numbers:
   ```groovy
   helm history shopdeploy-backend -n shopdeploy-prod --max 1
   ```
   If deployment fails, it can rollback to this exact revision.

3. **Image Verification:** Confirms the image tag exists in ECR before deploying — prevents deploying non-existent images.

4. **Smoke Tests:** After deployment, `kubectl rollout status` verifies pods are running, followed by HTTP health check calls.

5. **Dry Run Mode:** The `DRY_RUN` parameter runs `helm upgrade --dry-run` to show what would change without applying.

6. **Integration Tests:** Run only in non-production environments to validate end-to-end functionality.

---

### Q27. How do CI and CD pipelines communicate?

**Answer:**
Communication happens through **3 mechanisms**:

1. **Jenkins Pipeline Trigger:** The CI pipeline's `post` block triggers the CD job:
   ```groovy
   build job: 'shopdeploy-cd', parameters: [
       string(name: 'ENVIRONMENT', value: "${TARGET_ENVIRONMENT}"),
       string(name: 'IMAGE_TAG', value: "${IMAGE_TAG}")
   ]
   ```

2. **AWS SSM Parameter Store:** CI writes image tags to `/shopdeploy/{env}/image-tag`. If CD is triggered independently (without parameters), it reads the latest tag from SSM:
   ```groovy
   aws ssm get-parameter --name "/shopdeploy/${ENVIRONMENT}/image-tag"
   ```

3. **Archived Artifacts:** CI archives `image-tag.txt` and `build-info.json` as Jenkins artifacts — visible in the build history for audit trails.

4. **Git (GitOps):** CI updates `gitops/{env}/backend-values.yaml` with the new image tag and pushes to the repo — ArgoCD picks this up independently.

---

### Q28. What is the difference between Jenkinsfile-cd and Jenkinsfile-gitops?

**Answer:**

| Aspect | Jenkinsfile-cd | Jenkinsfile-gitops |
|--------|---------------|-------------------|
| **Deployment method** | Direct `helm upgrade --install` to EKS | Updates git repo, ArgoCD deploys |
| **Needs kubectl?** | Yes — Jenkins needs EKS access | No — Jenkins only needs git access |
| **Stages** | 9 (including deploy + smoke tests) | 7 (update git + verify ArgoCD) |
| **Rollback** | `helm rollback` via captured revision | Git revert + ArgoCD auto-sync |
| **Production approval** | In Jenkins (`input` step) | In Jenkins AND/OR ArgoCD UI |
| **Who does the deploy?** | Jenkins | ArgoCD |
| **Audit trail** | Jenkins build logs | Git commit history |
| **Drift detection** | None — manual | ArgoCD self-healing |

**When to use what:**
- **CD pipeline:** When you need direct control, don't have ArgoCD, or want Jenkins to own the full lifecycle.
- **GitOps pipeline:** When you want full GitOps — git as the single source of truth, automatic drift correction, and clear audit trails.

---

### Q29. How does the CI pipeline handle change detection?

**Answer:**
Stage 3 uses `git diff` to determine which services changed:

```groovy
BACKEND_CHANGED = sh(script: "git diff --name-only HEAD~1 HEAD -- shopdeploy-backend/", returnStdout: true).trim()
FRONTEND_CHANGED = sh(script: "git diff --name-only HEAD~1 HEAD -- shopdeploy-frontend/", returnStdout: true).trim()
```

Subsequent stages use `when` conditions:
```groovy
when { expression { return env.BACKEND_CHANGED != '' } }
```

**Benefits:**
- If only the frontend changed, backend Docker build/push/scan is skipped — saving 3-5 minutes.
- If only docs or CI config changed, both builds may be skipped.
- Reduces ECR storage costs (no redundant images).

**Limitation:** The pipeline still builds both if shared files (like `docker-compose.yml`) change, or for the first build.

---

### Q30. How does the pipeline ensure Docker image security?

**Answer:**
Security is enforced at **3 levels** in the CI pipeline:

**1. SonarQube (Stage 8-9):** Static code analysis catches:
- Security vulnerabilities (SQL injection, XSS, hardcoded credentials)
- Code smells and bugs
- `waitForQualityGate abortPipeline: true` — fails the build if quality gate isn't met

**2. Docker Build Security (Stage 10):**
- Multi-stage builds exclude dev dependencies and build tools
- Non-root users in all containers
- Minimal base images (`alpine` variants)

**3. Trivy Scan (Stage 11):**
```groovy
trivy image --severity HIGH,CRITICAL --exit-code 1 ${IMAGE}
```
- Scans for known CVEs in OS packages and application dependencies
- `--exit-code 1` fails the build if HIGH or CRITICAL vulnerabilities are found
- Gracefully skips if Trivy isn't installed (with a warning)

**4. ECR Image Scanning:** Enabled via Terraform's ECR module — AWS scans images on push as an additional layer.

---

### Q31. How does the CI pipeline handle failure and retry?

**Answer:**
Multiple resilience patterns:

**1. Retry:** ECR push uses `retry(3)` — network glitches during push are transient:
```groovy
retry(3) {
    sh "docker push ${ECR_REPO}:${IMAGE_TAG}"
}
```

**2. Graceful Degradation:** Non-critical stages have try-catch:
```groovy
try {
    // SonarQube analysis
} catch (Exception e) {
    echo "SonarQube skipped: ${e.message}"
    currentBuild.result = 'UNSTABLE'
}
```
The build becomes `UNSTABLE` (yellow) but continues rather than failing completely.

**3. Post-failure Actions:** The `post { failure {} }` block:
- Sends Slack notifications with build details
- Runs `cleanWs()` to avoid corrupted workspace state

**4. Production Guard:** The CI pipeline blocks skipping tests in production:
```groovy
if (params.TARGET_ENVIRONMENT == 'prod') {
    error("Cannot skip tests for production!")
}
```

---

### Q32. What Jenkins parameters does each pipeline accept?

**Answer:**

**CI Pipeline (Jenkinsfile-ci):**
| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `TARGET_ENVIRONMENT` | Choice | dev | dev / staging / prod |
| `TRIGGER_CD` | Boolean | true | Auto-trigger CD after success |

**CD Pipeline (Jenkinsfile-cd):**
| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `ENVIRONMENT` | Choice | dev | Target environment |
| `IMAGE_TAG` | String | (empty) | Specific image tag (or reads from SSM) |
| `SKIP_SMOKE_TESTS` | Boolean | false | Skip post-deploy verification |
| `DRY_RUN` | Boolean | false | Preview changes without deploying |

**GitOps Pipeline (Jenkinsfile-gitops):**
| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `ENVIRONMENT` | Choice | dev | Target environment |
| `BACKEND_IMAGE_TAG` | String | (empty) | Backend image tag |
| `FRONTEND_IMAGE_TAG` | String | (empty) | Frontend image tag |

---

## 🔷 SECTION 6: ARGOCD & GITOPS (Q33–Q36)

---

### Q33. How does your ArgoCD ApplicationSet work?

**Answer:**
The `all-environments.yaml` uses a **Matrix generator** that creates the Cartesian product of two lists:

**Generator 1 — Environments:**
```yaml
- env: dev, namespace: shopdeploy-dev
- env: staging, namespace: shopdeploy-staging
- env: prod, namespace: shopdeploy-prod
```

**Generator 2 — Components:**
```yaml
- component: backend, path: helm/backend
- component: frontend, path: helm/frontend
```

**Result: 6 ArgoCD Applications:**
| Application Name | Chart | Values File |
|-----------------|-------|-------------|
| `shopdeploy-dev-backend` | helm/backend | gitops/dev/backend-values.yaml |
| `shopdeploy-dev-frontend` | helm/frontend | gitops/dev/frontend-values.yaml |
| `shopdeploy-staging-backend` | helm/backend | gitops/staging/backend-values.yaml |
| `shopdeploy-staging-frontend` | helm/frontend | gitops/staging/frontend-values.yaml |
| `shopdeploy-prod-backend` | helm/backend | gitops/prod/backend-values.yaml |
| `shopdeploy-prod-frontend` | helm/frontend | gitops/prod/frontend-values.yaml |

**Sync Policy:** `automated` with `prune: true` (removes orphaned resources), `selfHeal: true` (reverts manual cluster changes), retry with exponential backoff (5 retries, 5s→3m).

---

### Q34. What is the complete GitOps deployment flow?

**Answer:**
End-to-end flow:

```
Developer pushes code → GitHub → Jenkins CI triggers
    ↓
Jenkins runs: lint → test → SonarQube → Docker build → Trivy scan → Push to ECR
    ↓
Jenkins updates gitops/dev/backend-values.yaml with new image tag
    ↓
Jenkins commits & pushes to Git with [skip ci] message
    ↓
ArgoCD detects git change (polls every 3 minutes or webhook)
    ↓
ArgoCD compares desired state (git) vs. live state (cluster)
    ↓
ArgoCD performs Helm template + kubectl apply
    ↓
Kubernetes rolling update with probes and PDB
    ↓
ArgoCD verifies health status → Application shows "Synced + Healthy"
```

**Key principle:** Jenkins never touches the cluster. It only updates git. ArgoCD is the only entity with cluster access. This creates a clear audit trail (every deployment is a git commit) and enables drift detection.

---

### Q35. How does ArgoCD handle drift detection and self-healing?

**Answer:**
With `selfHeal: true` in the sync policy:

1. ArgoCD continuously compares the **desired state** (rendered Helm templates from git) against the **live state** (actual Kubernetes resources).
2. If someone manually changes something in the cluster (`kubectl edit`, `kubectl scale`), ArgoCD detects the drift within its poll interval.
3. ArgoCD automatically **reverts** the change to match git — this is self-healing.

**Example:** If someone runs `kubectl scale deployment backend --replicas=1` in prod, ArgoCD will detect this doesn't match the `replicas: 3` in `gitops/prod/backend-values.yaml` and scale it back to 3.

**With `prune: true`:** If someone creates an extra resource in the namespace that isn't defined in git, ArgoCD removes it.

This ensures the **git repository is the single source of truth** — no configuration drift between what's in git and what's running.

---

### Q36. How do ArgoCD notifications work in your project?

**Answer:**
Configured via `notifications-cm.yaml` ConfigMap with Slack integration:

**3 notification templates:**
1. **`app-deployed`** — Sent when sync succeeds. Shows app name, environment, image tag, revision, and a link to ArgoCD UI.
2. **`app-sync-failed`** — Sent when sync fails. Includes the error message.
3. **`app-health-degraded`** — Sent when app health degrades (e.g., CrashLoopBackOff).

**3 triggers:**
1. `on-deployed` — `app.status.operationState.phase in ['Succeeded']`
2. `on-sync-failed` — `app.status.operationState.phase in ['Error', 'Failed']`
3. `on-health-degraded` — `app.status.health.status == 'Degraded'`

**Default subscription:** All apps send all notifications to `slack:deployments` channel.

The Slack webhook token is stored in `notifications-secret.yaml` as a Kubernetes Secret.

---

## 🔷 SECTION 7: MONITORING & OBSERVABILITY (Q37–Q38)

---

### Q37. How is Prometheus monitoring configured?

**Answer:**
Prometheus is installed via Helm (kube-prometheus-stack) with custom configuration:

**Storage:** 50Gi persistent volume, 15-day retention.

**Scrape Configuration:** Custom job `shopdeploy-backend` uses `kubernetes_sd_configs` with annotation-based discovery:
```yaml
relabel_configs:
  - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
    action: keep
    regex: true
```
Pods with `prometheus.io/scrape: "true"` annotations are automatically discovered.

**8 Custom Alert Rules:**

| Alert | Condition | Severity |
|-------|-----------|----------|
| HighCPUUsage | >80% for 5 min | Warning |
| HighMemoryUsage | >85% for 5 min | Warning |
| PodNotReady | Pod not ready for 5 min | Critical |
| HighPodRestartCount | >5 restarts/hr | Warning |
| HighResponseTime | p95 > 2s for 5 min | Warning |
| HighErrorRate | >5% 5xx for 5 min | Critical |
| LowDiskSpace | <15% free | Warning |
| HPAAtMaxCapacity | Current = max for 10 min | Warning |

**Alertmanager:** Routes alerts to Slack — `#devops-alerts` for warnings, `#devops-critical` for critical (with 5-min repeat interval).

---

### Q38. How is Grafana configured and what dashboards do you use?

**Answer:**
Grafana is deployed via Helm with:

**Data Sources:**
- **Prometheus** (default) — For cluster and application metrics
- **CloudWatch** — For AWS-level metrics (EKS, ALB, ECR)

**Dashboards:**
1. **Kubernetes Cluster** (Grafana ID: 7249) — Overall cluster health
2. **Node Exporter** (Grafana ID: 1860) — Node-level CPU, memory, disk, network
3. **Kubernetes Pods** (Grafana ID: 6417) — Pod-level resource usage
4. **ShopDeploy Custom Dashboard** — Application-specific metrics loaded via ConfigMap with the `grafana_dashboard=1` label (sidecar auto-loads it)

**Access:**
- Exposed via LoadBalancer service
- ALB Ingress at `grafana.shopdeploy.example.com`
- Admin password auto-generated (retrieved via `kubectl get secret`)

**Plugins:** Pie chart, clock panel, worldmap panel for extended visualization options.

---

## 🔷 SECTION 8: SECURITY & POLICIES (Q39–Q40)

---

### Q39. What is your rollback strategy?

**Answer:**
Defined in `policies/rollback-strategy.md` with a priority-based decision matrix:

**Automatic Triggers:**
- Smoke test failure after deployment
- Deployment timeout (>10 minutes to become healthy)
- Error rate exceeds 5% (detected by Prometheus/Alertmanager)

**3 Rollback Methods:**

| Method | When | Command |
|--------|------|---------|
| **Helm Rollback** (recommended) | Standard rollback | `helm rollback shopdeploy-backend {revision} -n shopdeploy-prod` |
| **CD Pipeline** | Controlled, audited rollback | Run CD pipeline with the previous stable `IMAGE_TAG` |
| **kubectl rollout undo** | Emergency only | `kubectl rollout undo deployment/backend -n shopdeploy-prod` |

**Priority Matrix:**

| Priority | Severity | Response Time | Method |
|----------|----------|---------------|--------|
| P1 | Critical (site down) | <5 minutes | Automatic rollback |
| P2 | High (major feature broken) | <15 minutes | CD pipeline |
| P3 | Medium (minor feature broken) | <1 hour | Helm rollback |
| P4 | Low (cosmetic issue) | Next release | Fix forward |

**4-Step Procedure:**
1. **Detect:** Alert fires or team reports issue
2. **Execute:** Run appropriate rollback method
3. **Verify:** Confirm service is restored (health checks, error rates)
4. **Document:** Post-mortem with root cause and prevention plan

**Known Limitations:** Cannot auto-rollback database migrations, data corruption, third-party API changes, or ConfigMap-only changes.

---

### Q40. How do you handle security across the entire pipeline?

**Answer:**
Security is layered across every stage:

**1. Code Level:**
- ESLint catches potential issues during linting
- SonarQube detects security vulnerabilities, hardcoded secrets, injection flaws
- Quality gate blocks deployment if thresholds aren't met
- Input validation via Joi and express-validator in the backend

**2. Container Level:**
- Multi-stage Docker builds exclude unnecessary tools
- Non-root containers (UID 1001 for backend, UID 101 for frontend)
- `npm ci --only=production` excludes dev dependencies (no test tools in production)
- Alpine-based minimal images reduce attack surface
- Trivy scans for HIGH/CRITICAL known CVEs before push

**3. Registry Level:**
- ECR image scanning on push (additional to Trivy)
- Lifecycle policies retain only last 30 images
- IAM-based access control

**4. Cluster Level:**
- `runAsNonRoot: true, allowPrivilegeEscalation: false, drop: ["ALL"]`
- NetworkPolicies restrict pod-to-pod communication
- PodDisruptionBudgets prevent accidental downtime
- ResourceQuotas and LimitRanges prevent resource abuse
- IRSA (IAM Roles for Service Accounts) for least-privilege AWS access
- Kubernetes Secrets (with option for External Secrets Manager)

**5. Infrastructure Level:**
- Private subnets for EKS nodes (no direct internet access)
- NAT Gateways for controlled outbound access
- ALB with SSL termination (ACM certificates)
- Terraform state encryption in S3
- DynamoDB state locking prevents concurrent modifications

**6. Pipeline Level:**
- Jenkins credentials store for secrets (not in code)
- Production manual approval gates with limited approvers
- `[skip ci]` on GitOps commits to prevent infinite loops
- Audit trails via Jenkins logs + git commit history

---

## 🎯 Quick Reference: Project Architecture Diagram (for whiteboard interviews)

```
                    ┌──────────────┐
                    │   Developer  │
                    └──────┬───────┘
                           │ git push
                    ┌──────▼───────┐
                    │    GitHub    │
                    └──────┬───────┘
                           │ webhook
                    ┌──────▼───────┐
                    │   Jenkins CI │ ── SonarQube
                    │  (15 stages) │ ── Trivy
                    └──┬────┬──────┘
                       │    │
            ┌──────────┘    └──────────┐
            ▼                          ▼
    ┌───────────┐              ┌──────────────┐
    │  AWS ECR  │              │  Git (GitOps) │
    │  (Images) │              │  values.yaml  │
    └───────────┘              └──────┬────────┘
                                      │ auto-sync
                               ┌──────▼───────┐
                               │    ArgoCD    │
                               │  (6 apps)    │
                               └──────┬───────┘
                                      │ helm install
                    ┌─────────────────▼──────────────────┐
                    │          Amazon EKS Cluster         │
                    │  ┌─────────┐  ┌──────────────────┐ │
                    │  │Frontend │  │    Backend        │ │
                    │  │(Nginx)  │  │  (Node.js/Express)│ │
                    │  └────┬────┘  └────────┬─────────┘ │
                    │       │                │            │
                    │       │         ┌──────▼──────┐    │
                    │       │         │   MongoDB   │    │
                    │       │         └─────────────┘    │
                    │  ┌────▼────────────────────────┐   │
                    │  │    AWS ALB (Ingress)        │   │
                    │  └────────────────────────────-┘   │
                    │  ┌────────────────────────────┐    │
                    │  │  Prometheus + Grafana       │    │
                    │  └────────────────────────────┘    │
                    └────────────────────────────────────┘
                    ┌────────────────────────────────────┐
                    │  Terraform (VPC, IAM, ECR, EKS)   │
                    └────────────────────────────────────┘
```

---

## 💡 Tips for Interview Delivery

1. **Start with "Why"** — Don't just list tools. Explain why you chose each: "I used ArgoCD because GitOps gives us drift detection and a git-based audit trail."

2. **Use Numbers** — "15-stage CI pipeline", "6 ArgoCD applications via matrix generator", "8 custom Prometheus alerts" — specifics show depth.

3. **Show Trade-offs** — "We have both a direct CD pipeline and a GitOps pipeline. The CD pipeline gives us direct control but requires Jenkins to have cluster access. The GitOps approach is more secure since only ArgoCD needs kubectl."

4. **Connect Concepts** — "The immutable image tags (BUILD_NUMBER-COMMIT_HASH) flow from ECR through the GitOps values file into the ArgoCD ApplicationSet, which renders the Helm chart and deploys to the correct namespace."

5. **Mention Failure Scenarios** — "If a deployment fails, the PDB ensures minimum pods stay running, the rollback strategy kicks in within 5 minutes for P1 issues, and Prometheus alerts fire to Slack."

6. **Be Ready for "What Would You Improve?"** — Good answers: "Add service mesh (Istio) for mTLS between services", "Implement progressive delivery with Argo Rollouts (canary/blue-green)", "Add OpenTelemetry for distributed tracing", "Move from polling to webhooks for ArgoCD", "Add HashiCorp Vault for secrets management".
