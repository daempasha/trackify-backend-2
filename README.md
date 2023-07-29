# Trackify Backend

This is the backend service for the Trackify application, built with Node.js.

## Prerequisites

- Node.js (v16+)
- Docker

## Local Setup

Before you can run this project, you need to setup a `.env` file with the necessary environment variables. 

### Setting Up Environment Variables

1. Create a new file in the root directory of this project and name it `.env`.
2. Open the `.env` file and add your environment variables. Please look at .env.example file

### Installing Dependencies

1. Navigate to the project's directory
2. Run `npm install` to install the necessary dependencies


### Building and Running the Docker Image

1. Build the Docker image using the following command: `docker build -t my-node-app .`
2. Run the Docker container using the newly created image: `docker run --env-file ./.env -p 8000:8000 -d my-node-app`



This command will start a Docker container with your Node.js application running inside it. The `--env-file ./.env` option tells Docker to set the environment variables from the `.env` file in the running container. `-p 8000:8000` maps the exposed port in your Docker container to a port on your host machine.

## Deployment

The next steps involve setting up a CI/CD pipeline to deploy the Dockerized application to AWS ECS using GitHub Actions.

API IS RUNNING LOCALLY ON LOCALHOST:8000
d