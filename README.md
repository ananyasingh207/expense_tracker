# Expense Tracker – CI/CD & DevOps Pipeline

This repository demonstrates a complete **CI/CD pipeline implementation using GitHub Actions and Azure Web Apps** for deploying a Node.js application.

While the application itself is a simple Expense Tracker built with Node.js and Express, the primary goal of this project is to showcase:

- Continuous Integration (CI)
- Continuous Deployment (CD)
- Secure secret management
- Automated cloud deployment
- DevOps best practices using Azure

---

## 🚀 Project Overview

This project implements an automated deployment pipeline where:

- Code is pushed to the `main` branch
- GitHub Actions automatically builds the application
- Dependencies are installed using `npm ci`
- A deployment package is prepared
- The app is deployed automatically to Azure Web Apps

No manual deployment steps are required after initial configuration.

---

## 🛠 Tech Stack

### Application
- Node.js
- Express.js
- HTML, CSS, JavaScript

### DevOps & Cloud
- GitHub Actions
- Azure Web Apps (Linux)
- Azure Publish Profile authentication
- GitHub Repository Secrets

---

## 🔄 CI/CD Workflow

The pipeline is defined in:

```
.github/workflows/azure-deploy.yml
```

---

### Continuous Integration (CI)

The CI stage performs:

1. Repository checkout  
2. Node.js LTS setup (Node 20)  
3. Clean dependency installation using:

```
npm ci
```

4. Application packaging for deployment  

#### Why `npm ci`?

- Ensures deterministic builds  
- Uses `package-lock.json`  
- Faster and more reliable for CI environments  
- Prevents dependency inconsistencies  

---

### Continuous Deployment (CD)

The CD stage:

- Authenticates securely using Azure Publish Profile  
- Deploys the packaged application to Azure Web App  
- Automatically updates the live production app  

Deployment is triggered automatically on every push to `main`.

---

## 🔐 Secure Secret Management

Sensitive credentials are not stored in the codebase.

The following secrets must be configured in GitHub:

Navigate to:

```
Repository → Settings → Secrets and variables → Actions
```

Add:

### 1. `AZURE_WEBAPP_PUBLISH_PROFILE`

- Download from Azure Portal → Web App → Get Publish Profile  
- Copy entire XML content  
- Paste as secret value  

### 2. `AZURE_WEBAPP_NAME`

- Enter your Azure Web App name  

This ensures:

- No credentials are exposed in code  
- Secure authentication during deployment  
- Production-safe pipeline configuration  

---

## ☁ Azure Web App Setup

### Step 1: Create Azure Web App

In Azure Portal:

- Create → Web App  
- Publish: Code  
- Runtime Stack: Node 20 LTS  
- Operating System: Linux  
- Pricing Plan: Free F1 (for testing)  

Deploy the resource.

---

### Step 2: Push Code

Once secrets are configured:

```
git push origin main
```

Go to:

```
GitHub → Actions
```

Monitor workflow execution.

After successful deployment:

```
https://<your-app-name>.azurewebsites.net
```

---

## 📦 Deployment Strategy

Current deployment model:

- Pre-provisioned Azure Web App  
- Direct publish profile authentication  
- Self-contained deployment artifact  
- Automatic deployment on branch push  

---

## 📊 DevOps Practices Implemented

- Automated CI/CD pipeline  
- Deterministic dependency installation  
- Secure secret handling  
- Cloud-based deployment  
- LTS runtime usage  
- Environment-based configuration  
- No hardcoded credentials  
