# MongoDB Setup Guide for BiomeQuest

This guide will help you set up MongoDB for local development and connect it to your BiomeQuest backend.

## Table of Contents
1. [Local MongoDB Setup](#local-mongodb-setup)
2. [MongoDB Atlas (Cloud)](#mongodb-atlas-cloud-alternative)
3. [Connecting to Your Backend](#connecting-to-your-backend)
4. [Verifying the Connection](#verifying-the-connection)

---

## Local MongoDB Setup

### Option 1: Windows

#### Step 1: Download MongoDB Community Server
1. Go to [MongoDB Community Edition Downloads](https://www.mongodb.com/try/download/community)
2. Select:
   - **Version**: Latest (e.g., 7.0.x)
   - **OS**: Windows
   - **Package**: MSI
3. Click **Download**

#### Step 2: Run the Installer
1. Double-click the downloaded `.msi` file
2. Click **Next** through the setup wizard
3. Accept the License Agreement
4. Choose **Complete** installation
5. For "Service Configuration":
   - Check **Install MongoDB as a Service**
   - Leave the default settings
6. Click **Install**
7. Click **Finish**

#### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

You should see the version number output.

#### Step 4: Start MongoDB
MongoDB should automatically start as a service. To verify it's running:
```powershell
Get-Service MongoDB
```

You should see `Status: Running`

#### Step 5: Access MongoDB Shell
```powershell
mongosh
```

You should see a `>` prompt. Type `exit` to quit.

---

### Option 2: macOS

#### Step 1: Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Step 2: Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Step 3: Start MongoDB Service
```bash
brew services start mongodb-community
```

#### Step 4: Verify Installation
```bash
mongosh
```

You should see a `>` prompt.

#### Step 5: Stop MongoDB (when needed)
```bash
brew services stop mongodb-community
```

---

### Option 3: Linux (Ubuntu/Debian)

#### Step 1: Import MongoDB Repository Key
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
```

#### Step 2: Add MongoDB Repository
```bash
echo "deb http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

#### Step 3: Install MongoDB
```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### Step 4: Start MongoDB Service
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 5: Verify Installation
```bash
mongosh
```

---

## MongoDB Atlas (Cloud Alternative)

If you prefer not to set up MongoDB locally, use MongoDB Atlas (free tier available).

### Step 1: Create Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up**
3. Create an account with your email
4. Verify your email address

### Step 2: Create a Cluster
1. Click **Create** on the "Create a Deployment" section
2. Choose **Free** (M0 tier - perfect for development)
3. Select your region (choose closest to you)
4. Click **Create Deployment**
5. Wait for the cluster to be created (2-3 minutes)

### Step 3: Create Database User
1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Enter username (e.g., `biomequest_user`)
4. Enter password (save this!)
5. Click **Add User**

### Step 4: Allow Network Access
1. Click **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (for development only!)
4. Click **Confirm**

### Step 5: Get Connection String
1. Click **Databases** in the left sidebar
2. Click **Connect** button on your cluster
3. Select **Drivers**
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/biomequest?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your credentials

---

## Connecting to Your Backend

### Step 1: Create `.env` File in Server Directory

In `server/.env`, add:

**For Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/biomequest
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/biomequest?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

Replace:
- `username` - your database user username
- `password` - your database user password
- `cluster0.xxxxx` - your cluster connection string

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Start MongoDB (Local Only)

**Windows (PowerShell):**
```powershell
# MongoDB should already be running as a service
# Verify with:
Get-Service MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 4: Start Your Backend Server
```bash
# From the server directory
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running on port 5000
```

---

## Verifying the Connection

### Option 1: Using MongoDB Shell

**For Local MongoDB:**
```bash
mongosh
```

In the shell, run:
```javascript
use biomequest
db.users.find()
```

### Option 2: Test via API

Once your server is running, test the connection:

```bash
# Windows PowerShell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/health"
$response.Content | ConvertFrom-Json

# macOS/Linux
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### Option 3: Check Database in Your App

Once you register a user in the app, verify the data was saved:

```bash
mongosh
use biomequest
db.users.find()
```

You should see your registered user document.

---

## Common Issues & Solutions

### Issue: "MongoDB Connection Error"
**Solution:**
- Ensure MongoDB is running: `Get-Service MongoDB` (Windows) or `brew services list` (macOS)
- Check `.env` file has correct `MONGODB_URI`
- Verify port 27017 is not blocked by firewall

### Issue: "Error: connect ECONNREFUSED 127.0.0.1:27017"
**Solution:**
- MongoDB service is not running
- Start it: `sudo systemctl start mongod` (Linux) or `brew services start mongodb-community` (macOS)

### Issue: "Authentication failed" (Atlas)
**Solution:**
- Verify username and password in connection string
- Check IP whitelist includes your address
- Ensure database user was created in "Database Access"

### Issue: "MONGODB_URI not defined"
**Solution:**
- Create `.env` file in `server/` directory
- Ensure it has `MONGODB_URI=...` variable
- Server must be restarted after creating `.env`

---

## Best Practices

### Development
✅ Use local MongoDB for quick iteration
✅ Keep `MONGODB_URI` in `.env` (never in code)
✅ Use strong JWT_SECRET in production

### Production
✅ Use MongoDB Atlas with proper backups
✅ Enable IP whitelist with specific IPs only
✅ Use strong database passwords
✅ Enable encryption at rest
✅ Enable audit logging

---

## Next Steps

1. **Choose your MongoDB setup** (Local or Atlas)
2. **Configure `.env` file** in `server/` directory
3. **Install backend dependencies**: `npm install` in `server/` folder
4. **Start backend**: `npm run dev`
5. **Start frontend**: `npm run dev` (from root directory)
6. **Navigate to localhost:5173** and test registration/login

---

## Useful MongoDB Commands

```bash
# Start MongoDB shell
mongosh

# Inside mongosh:
# Switch to database
use biomequest

# See all collections
show collections

# View all documents in a collection
db.users.find().pretty()

# Count documents
db.users.countDocuments()

# Delete all data (WARNING: irreversible!)
db.users.deleteMany({})

# Drop entire database
db.dropDatabase()

# Exit
exit
```

---

## Resources

- [MongoDB Community Edition Docs](https://docs.mongodb.com/manual/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [MongoDB Shell (mongosh) Docs](https://docs.mongodb.com/mongosh/)
- [Mongoose ODM Docs](https://mongoosejs.com/)

Happy questing! 🚀
