# 🚀 Deployment Guide - Eduvia LMS

Complete guide for deploying Eduvia to production.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env` file with production values:

```env
# Server Configuration
NODE_ENV=production
PORT=8080

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database (if using external DB)
DATABASE_URL=your-database-url

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email[gmail.com](cci:4://file://gmail.com:0:0-0:0)
SMTP_PASS=your-app-password

# Client URL
CLIENT_URL=[https://your-domain.com](https://your-domain.com)

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads