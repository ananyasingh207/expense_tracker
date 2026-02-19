# Expense Tracker

A simple expense tracker application built with Node.js and Express. It allows users to add, view, update, and delete expenses. Data is stored in a local JSON file (`expenses.json`).

## Features

- **Add Expense**: Create new expense entries with amount, category, date, and description.
- **View Expenses**: List all expenses, with filtering by category and date.
- **Update Expense**: Edit existing expense details.
- **Delete Expense**: Remove unwanted expenses.
- **REST API**: Backend API endpoints for managing expenses.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Data Storage**: JSON file (`expenses.json`)

## Local Development

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the server**:
    ```bash
    npm start
    ```

4.  **Access the application**:
    Open your browser and navigate to `http://localhost:3000`.

## Deployment to Azure

This project includes a GitHub Actions workflow to automatically deploy the application to Azure Web Apps.

### Prerequisites

- An [Azure Account](https://azure.microsoft.com/free/).
- A GitHub repository with this code.

### Step 1: Create an Azure Web App

1.  Log in to the [Azure Portal](https://portal.azure.com/).
2.  Click **Create a resource** and search for **Web App**.
3.  Click **Create**.
4.  Configure the following settings:
    - **Subscription**: Select your subscription.
    - **Resource Group**: Create a new one or select an existing one.
    - **Name**: Enter a unique name for your app (e.g., `my-expense-tracker-123`).
    - **Publish**: Select **Code**.
    - **Runtime stack**: Select **Node 20 LTS**.
    - **Operating System**: Select **Linux**.
    - **Region**: Choose a region close to you.
    - **Pricing Plan**: Select a plan (e.g., Free F1 or Basic B1 for testing).
5.  Click **Review + create** and then **Create**.

### Step 2: Configure GitHub Secrets

To allow GitHub Actions to deploy to your Azure Web App, you need to set up secrets in your repository.

1.  **Get the Publish Profile**:
    - Go to your newly created Web App in the Azure Portal.
    - In the **Overview** blade, click on **Get publish profile** (top menu).
    - This will download a file (e.g., `my-expense-tracker-123.PublishSettings`). Open it with a text editor and copy the entire XML content.

2.  **Add Secrets to GitHub**:
    - Go to your GitHub repository.
    - Navigate to **Settings** > **Secrets and variables** > **Actions**.
    - Click **New repository secret**.
    - **Name**: `AZURE_WEBAPP_PUBLISH_PROFILE`
    - **Value**: Paste the content of the publish profile file you copied.
    - Click **Add secret**.
    - Click **New repository secret** again.
    - **Name**: `AZURE_WEBAPP_NAME`
    - **Value**: Enter the name of your Azure Web App (e.g., `my-expense-tracker-123`).
    - Click **Add secret**.

### Step 3: Trigger Deployment

The deployment pipeline is configured to run automatically when you push changes to the `main` branch.

1.  Push your code changes to GitHub:
    ```bash
    git push origin main
    ```
2.  Go to the **Actions** tab in your GitHub repository to monitor the deployment progress.

### Step 4: Verify Deployment

Once the workflow completes successfully:

1.  Go to your Azure Web App URL: `https://<your-app-name>.azurewebsites.net`.
2.  You should see the Expense Tracker application running.

## Important Notes

- **Data Persistence**: This application uses a local file (`expenses.json`) to store data. On Azure Web Apps (Linux), the file system is ephemeral, meaning changes to files in the application directory might be lost upon redeployment or restart. For a production-ready application, consider using a database service like Azure Cosmos DB or Azure SQL Database.
- **Port Configuration**: Azure automatically sets the `PORT` environment variable. The `server.js` file is configured to use `process.env.PORT` or default to `3000`.
