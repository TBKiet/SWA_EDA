# 🐳 DockerHub Integration Setup

## ⚠️ Current Status
Your CD pipeline is currently building Docker images locally but **NOT pushing to DockerHub** because the required secrets are not configured.

## 🔧 Quick Setup (5 minutes)

### Step 1: Create DockerHub Access Token
1. Go to [DockerHub](https://hub.docker.com/)
2. Sign in to your account
3. Click your avatar → **Account Settings**
4. Go to **Security** tab
5. Click **New Access Token**
6. Name: `GitHub-Actions-SWA-EDA`
7. Permissions: **Read, Write, Delete**
8. Click **Generate** and **copy the token** (you won't see it again!)

### Step 2: Add GitHub Repository Secrets
1. Go to your repository: `https://github.com/TBKiet/SWA_EDA`
2. Click **Settings** tab
3. Go to **Secrets and variables** → **Actions**
4. Click **New repository secret**

Add these two secrets:

#### Secret 1: DOCKERHUB_USERNAME
- **Name**: `DOCKERHUB_USERNAME`
- **Value**: Your DockerHub username (e.g., `tbkiet`)

#### Secret 2: DOCKERHUB_TOKEN
- **Name**: `DOCKERHUB_TOKEN`
- **Value**: The access token you generated in Step 1

### Step 3: Verify Setup
1. Go to **Actions** tab in your repository
2. Click **Re-run all jobs** on the failed workflow
3. Check the logs - you should see:
   ```
   ✅ DockerHub credentials found.
   🐳 Building and pushing Docker image...
   ✅ Successfully pushed: tbkiet/user-service:latest
   ```

## 📋 What Happens After Setup

### ✅ With DockerHub Configured:
- Docker images are built and pushed to your DockerHub account
- Images are tagged with both SHA and `latest`
- Available for deployment to any environment
- Full CD pipeline functionality

### ⚠️ Without DockerHub (Current State):
- Docker images are built locally only
- No artifacts pushed to registry
- Limited deployment options
- CD pipeline runs but with warnings

## 🏷️ Expected Docker Images

After successful setup, these images will be available on DockerHub:

```
tbkiet/user-service:latest
tbkiet/user-service:abc1234...    # SHA tag

tbkiet/event-service:latest
tbkiet/event-service:abc1234...

tbkiet/registration-service:latest
tbkiet/registration-service:abc1234...

tbkiet/notification-service:latest
tbkiet/notification-service:abc1234...

tbkiet/auditlog-service:latest
tbkiet/auditlog-service:abc1234...

tbkiet/gateway:latest
tbkiet/gateway:abc1234...
```

## 🔍 Troubleshooting

### Issue: "Username and password required"
**Solution**: Follow Step 1-2 above to add secrets

### Issue: "Authentication failed"
**Possible causes**:
- Wrong username (case-sensitive)
- Expired or invalid token
- Token doesn't have write permissions

**Solution**:
1. Regenerate DockerHub access token with **Read, Write, Delete** permissions
2. Update `DOCKERHUB_TOKEN` secret in GitHub

### Issue: "Repository does not exist"
**Cause**: DockerHub repository not created automatically
**Solution**:
1. Go to DockerHub
2. Create repositories manually: `user-service`, `event-service`, etc.
3. Or enable auto-create in DockerHub settings

## 🚀 Alternative: Skip DockerHub (Optional)

If you don't want to use DockerHub, you can:

1. **Use GitHub Container Registry (ghcr.io)**:
   ```yaml
   - name: Login to GitHub Container Registry
     uses: docker/login-action@v3
     with:
       registry: ghcr.io
       username: ${{ github.actor }}
       password: ${{ secrets.GITHUB_TOKEN }}
   ```

2. **Deploy locally only**:
   - Current workflow already builds images locally
   - Use `docker-compose` for local deployment
   - Skip the push steps entirely

## ⏱️ Time Estimate
- **Setup time**: 5 minutes
- **Next workflow run**: ~10-15 minutes
- **Total time to resolution**: ~20 minutes

## 📞 Need Help?
If you encounter issues:
1. Check the workflow logs in GitHub Actions
2. Verify secrets are set correctly in repository settings
3. Test DockerHub login locally: `docker login`
4. Regenerate access token if authentication fails

**Ready to set it up? Start with Step 1 above! 🚀**
