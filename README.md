
# Lab 6 – Containerization using Docker

This repository contains the implementation of *Lab 6: Containerization using Docker*. The project demonstrates how to containerize a full-stack application (frontend + backend) using Docker, build custom Docker images, and run them locally with Docker.

## ✅ Project Overview

The purpose of this lab is to:

- Create a Dockerfile for your application (frontend and/or backend) to define how the image should be built.
- Build and tag Docker images.
- Run containers locally to verify the application functions as expected.
- Optionally, demonstrate using `docker-compose` or multi-stage builds (if applicable).
- Provide a reproducible environment for your app — anyone with Docker installed can run it.

## 🚀 Getting Started

To run this project locally, follow these steps:

### Prerequisites

- Docker — ensure you have Docker CE/EE installed and running on your machine.
- (Optional) docker-compose if you use a `docker-compose.yml`.

### Build and Run

1. Open a terminal in the repository root (where the `Dockerfile` is located).

2. Build the Docker image:

   docker build -t lab6-containerization .

3. Run the container:

   docker run -d --name lab6-app -p 3000:3000 -p 3001:3001 lab6-containerization

4. Access the app:

   - Frontend → http://localhost:3000  
   - Backend API → http://localhost:3001/formData

## Stopping & Cleaning Up

docker stop lab6-app
docker rm lab6-app
docker rmi lab6-containerization

## 📁 Project Structure

/
├── Dockerfile
├── src/
│   ├── App.js
│   └── …
├── db.json
├── docker-compose.yml
└── README.md

## 🧪 How It Works

- The Dockerfile specifies the base image (e.g., `node:16-alpine`), copies the source code, installs dependencies, and sets the startup command.
- `docker run` launches a container from that image.
- Port mappings allow access to frontend and backend from your browser.

## 📝 License

This project is for academic/lab use. Feel free to modify or reuse as needed.

## 🧑‍💻 Author

Created by **Oseme E. Oghon**  
GitHub: @osemeedeoghon
