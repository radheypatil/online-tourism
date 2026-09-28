# 🚀 Live Deployment Guide - Desidwar Online Tourism Platform

This guide walks you through deploying your **Desidwar Online Tourism Platform** (`tourism-site` + `tourism-backend`) live to the web for free using **GitHub + Render + Free Cloud MySQL**, exactly as done previously.

---

## 🏗️ Architecture & What We Prepared

Your project has been upgraded into a unified, production-ready full-stack application:

1. **Static Frontend (`tourism-site`)**:
   - 50+ rich destination pages, smart travel planner, weather widget, and responsive layout.
   - Video assets have been optimized and compressed to standard 1080p web bitrate, bringing all files well under GitHub's 100MB limit.
   - `script.js` now dynamically connects to the backend in both local and live production environments.

2. **Backend API (`tourism-backend`)**:
   - Express server configured to serve both the API (`/api/newsletter/subscribe`, `/api/health`) and the complete static frontend.
   - Upgraded `db.js` with connection pooling, cloud SSL support, custom ports, and auto-creation of the `newsletter` table.
   - Safe Nodemailer email handling with timeouts to prevent deployment hangs.

3. **Single Web Service**:
   - Both frontend and backend deploy together as **one single free service** on Render!
   - No CORS errors, no separate hosting needed, and zero configuration for users.

---

## 🛠️ Step 1: Create a Free Cloud MySQL Database

Your backend needs a MySQL database to store newsletter subscribers. You can get a free cloud MySQL database in 2 minutes:

### Option A: TiDB Cloud (Recommended - Free Forever, No Credit Card)
1. Go to [tidbcloud.com](https://tidbcloud.com) and sign up with Google or GitHub.
2. Click **Create Cluster** -> Select **Serverless** (Free 5GB tier).
3. Once created, click **Connect**:
   - Select **Connection Type: General**.
   - Note down:
     - **Host** (e.g., `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
     - **Port** (usually `4000`)
     - **User** (e.g., `xxxxxx.root`)
     - **Password** (the password you created)
     - **Database**: `test` or create `tourism_db`

### Option B: Aiven.io
1. Go to [aiven.io](https://aiven.io) and create a free MySQL service.
2. Note down: **Host**, **Port**, **User**, **Password**, and **Database Name**.

> 💡 **Auto-Migration Note**: You do **not** need to manually create the `newsletter` table! When your backend starts up, `db.js` automatically executes:
> ```sql
> CREATE TABLE IF NOT EXISTS newsletter (
>   id INT AUTO_INCREMENT PRIMARY KEY,
>   email VARCHAR(255) NOT NULL UNIQUE,
>   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> );
> ```

---

## 🛠️ Step 2: Push Your Code to GitHub

1. Open PowerShell in this project directory:
   ```powershell
   cd "C:\Users\radhe\OneDrive\Desktop - Copy\Desktop\Online Tourism"
   ```

2. Go to [github.com/new](https://github.com/new) and create a new repository:
   - **Repository Name**: `online-tourism` (or `desidwar-tourism`)
   - **Visibility**: Public or Private
   - Do **NOT** initialize with a README, .gitignore, or license (we already created them locally).

3. Link and push your local repository:
   ```powershell
   git remote add origin https://github.com/radheypatil/online-tourism.git
   git push -u origin main
   ```
   *(Replace with your actual repository URL if different).*

> 🔒 **Security Notice**: Your local `.env` file with private passwords is automatically ignored by `.gitignore` and will never be exposed on GitHub.

---

## 🛠️ Step 3: Deploy on Render.com (Free)

1. Go to [render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository (`online-tourism`).
4. Configure the deployment settings:
   - **Name**: `desidwar-tourism`
   - **Region**: Singapore or Frankfurt (closest to your visitors)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `cd tourism-backend && npm install`
   - **Start Command**: `node tourism-backend/server.js`
   - **Instance Type**: `Free`

5. Scroll down to **Environment Variables** and add the following keys:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `DB_HOST` | *(Your cloud MySQL host)* | e.g. `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` |
| `DB_PORT` | `4000` (or `3306`) | Port of your cloud database |
| `DB_USER` | *(Your cloud MySQL user)* | |
| `DB_PASSWORD` | *(Your cloud MySQL password)* | |
| `DB_NAME` | `tourism_db` (or `test`) | |
| `DB_SSL` | `true` | Required for TiDB Cloud & Aiven |
| `EMAIL_USER` | `radheypatil2005@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `xxxx xxxx xxxx xxxx` | 16-character Google App Password |

6. Click **Deploy Web Service**!
7. Render will build and launch your application. Within 2–3 minutes, your live URL will be active (e.g., `https://desidwar-tourism.onrender.com`)!

---

## ✉️ Gmail App Password Setup (For Newsletter Confirmation)

To allow the server to send confirmation emails via Gmail:
1. Go to your [Google Account Security](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is enabled.
3. Search for **App passwords** (or go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
4. Create an App password named **Desidwar Tourism**.
5. Copy the 16-character generated code and set it as `EMAIL_PASS` in your Render Environment Variables.

---

## 🌟 Alternative: Deploy on Railway.app

If you prefer Railway:
1. Go to [railway.app](https://railway.app) -> **New Project**.
2. Click **Provision MySQL** (creates an instant cloud MySQL database).
3. In the same project, click **New** -> **GitHub Repo** -> select `online-tourism`.
4. In the Web service variables, connect the Railway MySQL variables (`MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`).
5. Railway will automatically detect Node.js, run `Procfile`, and deploy!

---

## ✅ Live Site Verification Checklist

Once your deployment is live:
1. **Homepage**: Visit your live URL and confirm hero banners, navigation, and fonts display smoothly.
2. **Weather Widget**: Check if temperature and city weather load automatically.
3. **Destinations**: Click destination links (e.g., `/goa.html`, `/rajasthan.html`, `/kerala.html`) and check background video streaming.
4. **AI Recommendation & Budget Estimator**: Test the trip duration and hotel cost calculations.
5. **Newsletter**: Scroll to the footer, enter an email, and submit:
   - Confirm the success message: `✅ Subscribed successfully! Welcome to Desidwar.`
   - Check your inbox for the welcome email.
   - Verify the subscriber was added to your cloud MySQL table!
