# Deployment Guide: EduERP on Hostinger

This guide explains how to deploy the **EduERP** (React Frontend + Node.js Backend + MySQL Database) on Hostinger.

---

## Option 1: Hostinger Shared/Cloud Hosting (Node.js App Manager)

Hostinger Shared and Cloud hosting plans support running Node.js applications directly using their dashboard.

### Step 1: Set up the MySQL Database on Hostinger
1. Log in to your Hostinger **hPanel**.
2. Go to **Databases** > **MySQL Databases**.
3. Create a new database and database user:
   - **Database Name**: `u123456789_eduerp`
   - **Username**: `u123456789_eduerp_user`
   - **Password**: Create a secure password.
4. Open **phpMyAdmin** for your new database.
5. Import the SQL schema and seed data:
   - Click **Import** and upload `database/schema.sql`.
   - Click **Import** again and upload `database/seed.sql`.

### Step 2: Prepare the Node.js Backend
1. In your local backend project (`server/`), make sure your `.env` is configured with the production values:
   ```env
   PORT=5000
   DB_HOST=127.0.0.1 (or mysql.hostinger.com)
   DB_USER=u123456789_eduerp_user
   DB_PASSWORD=YourPassword
   DB_NAME=u123456789_eduerp
   JWT_SECRET=production_super_secret_key
   ```
2. Upload the `server/` directory content (excluding `node_modules`) to a folder on your Hostinger account using the **File Manager** (e.g., in `/home/u123456789/eduerp-backend`).
3. In hPanel, go to **Advanced** > **Node.js**.
4. Set up the Node.js application:
   - **App Directory**: Pointer to where you uploaded backend files (e.g., `eduerp-backend`).
   - **App URL**: `api.yourdomain.com` or `yourdomain.com/api`.
   - **Application Startup File**: `index.js`.
5. Click **Save** and then click **Run npm install** inside hPanel's Node.js terminal or dashboard button.
6. Start/Restart the application.

### Step 3: Build and Upload the React Frontend
1. In your local client directory (`client/src/App.js`), update the `API_BASE_URL` to point to your live backend domain:
   ```javascript
   const API_BASE_URL = 'https://api.yourdomain.com/api'; // or 'https://yourdomain.com/api'
   ```
2. In the `client` directory, run:
   ```bash
   npm run build
   ```
3. This creates a `client/build` folder containing optimized HTML, CSS, and JS.
4. Open Hostinger **File Manager** and upload the contents of the `client/build` directory to your main domain's folder (usually `/public_html`).
5. Open your website in the browser. The frontend will load and connect to your Node.js backend.

---

## Option 2: Hostinger VPS Hosting (Recommended for Production)

If you are using a VPS (Ubuntu/Debian), you have full command-line access.

### Step 1: Install Node.js, MySQL, and Nginx
Connect to your VPS via SSH and install the dependencies:
```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server nginx
```

### Step 2: Set up the MySQL Database
1. Access MySQL:
   ```bash
   sudo mysql
   ```
2. Create the database and user:
   ```sql
   CREATE DATABASE eduerp_db;
   CREATE USER 'eduerp_user'@'localhost' IDENTIFIED BY 'YourSecurePassword';
   GRANT ALL PRIVILEGES ON eduerp_db.* TO 'eduerp_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```
3. Import the database tables using the command line:
   ```bash
   mysql -u eduerp_user -p eduerp_db < /path/to/database/schema.sql
   mysql -u eduerp_user -p eduerp_db < /path/to/database/seed.sql
   ```

### Step 3: Configure and Run Backend with PM2
1. Install **PM2** globally to keep your Node.js process running:
   ```bash
   sudo npm install -g pm2
   ```
2. Navigate to your backend directory, install packages, and start the app:
   ```bash
   cd /var/www/eduerp-backend
   npm install --production
   pm2 start index.js --name "eduerp-api"
   pm2 save
   pm2 startup
   ```

### Step 4: Build and Serve React Frontend
1. Build the React project locally (`npm run build`).
2. Upload the `build/` files to `/var/www/eduerp-frontend`.
3. Configure Nginx to serve the frontend and reverse-proxy the API requests:
   Create a site config `/etc/nginx/sites-available/eduerp`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Frontend
       location / {
           root /var/www/eduerp-frontend;
           try_files $uri $uri/ /index.html;
       }

       # Backend API proxy
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
4. Enable the config and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/eduerp /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```
