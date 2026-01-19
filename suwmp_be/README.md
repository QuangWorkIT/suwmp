# suwmp_be

This is the backend for the Smart urban waste management platform.

## Prerequisites

- Java 21 or higher
- Maven
- Docker and Docker Compose

## Getting Started

### 1. Create a `.env` file

Add a `.env` file in the root of the project with the following content. This file will be used by `docker-compose` to set up the PostgreSQL database.

```
POSTGRES_USER=suwmp_user
POSTGRES_PASSWORD=suwmp_password
POSTGRES_DB=suwmp_db
```


The `application.yaml` is already configured to use the `dev` profile. The properties will be read from the `.env` file thanks to a feature of Spring Boot.

### 2. Start the PostgreSQL database

Run the following command to start a PostgreSQL database in a Docker container using `docker-compose`:

```bash
docker-compose up -d
```

This will start a PostgreSQL container with the database name, username, and password specified in the `.env` file. It is assumed your `docker-compose.yml` file is configured to expose port 5432 and to use the environment variables from the `.env` file. It is also assumed that the `postgres-init` script is mounted and run.

### 3. Run the application

You can run the application using the Maven wrapper:

```bash
./mvnw spring-boot:run
```

The application will be running on `http://localhost:8080`.