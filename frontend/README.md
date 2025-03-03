# PDF Manager Frontend

This is the frontend service for the PDF Manager application.

## Setup

### Install and Run using Docker

1. Build the Docker image:
    ```sh
    docker build -t pdf-manager-frontend .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 3000:80 pdf-manager-frontend
    ```

### Manualy Install and Run the Backend

1. Install Java (required for OpenAPI Generator):
    ```sh
    sudo apt install default-jre
    ```

2. Install Node Version Manager (NVM):
    ```sh
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    ```

3. Install Node.js using NVM:
    ```sh
    nvm install node
    ```
4. Install dependencies:
    ```sh
    npm install
    ```

5. Start the development server:
    ```sh
    npm run dev

## API

If you want to update the API code you will need to install OpenAPI Generator CLI:

1. Install OpenAPI Generator CLI:
    ```sh
    npm install -g @openapitools/openapi-generator-cli
    ```

2. Auto-generate API code from OpenAPI specification:
    ```sh
    openapi-generator-cli generate -i ../openapi/openapi.json -g typescript-axios -o src/api
    ```
