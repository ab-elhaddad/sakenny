<p align="center">
  <br>
  <img width="400" src="https://github.com/ab-elhaddad/Sakkeny/assets/113056556/e077b7e6-60fc-4270-a3af-93be07acc49f">
  <br>
  <br>
</p>
<h1 align="center">Sakenny Server</h1>
<br>

 > Sakenny is my Graduation Project which I passed with an **A+**.

## 🔍 Description

The project aims to help mainly students studying abroad to find a place to stay in by offering them a variety of options. The project allows users to search for places to stay in, and it also allows users to post ads for places they want to rent out.

## 💡 Used Tools & Technologies

- **Node.js** (Runtime environment)
- **TypeScript** (Development language)
- **JavaScript** (Deployment language)
- **MVC** (Design pattern)
- **Express.js** (Backend framework)
- **JWT** (Authentication)
- **Bcrypt** (Password hashing)
- **PostgreSQL** (Database management system)
- **db-migrate** (Database migrations)
- **Cloudinairy** (Image storage)
- **Swagger** (APIs documentation)
- **Jasmine.js** (Testing)

## ☁️ Deployment

- **Render** (Development stage hosting)
![Render](https://github.com/ab-elhaddad/Sakkeny/assets/113056556/7e68c330-4bb6-4769-a00b-7cb81b423696)
- **Microsoft Azure <sub>[Azure App Service]</sub>** (Production stage hosting)
![node azure](https://github.com/ab-elhaddad/Sakkeny/assets/113056556/ce0d8d8e-cc7d-490e-8e18-9734ab93392c)
- **Microsoft Azure <sub>[Azure Database for PostgreSQL flexible server]</sub>**  (Container for DB)
![db azure E](https://github.com/ab-elhaddad/Sakkeny/assets/113056556/c9ae6c63-37ea-4b9c-bf4f-b62de47d5561)

## 🐘 Database Schema

![ERD](https://github.com/ab-elhaddad/Sakkeny/assets/113056556/18414587-b064-49ed-bbdd-6c8caee2550f)

## 📁 Project Overview

![Overview F](https://github.com/ab-elhaddad/Sakkeny/assets/113056556/9812d8b3-cbd1-4663-bf17-1cd1777acb8a)

## 📂 Server Architecture

![Backend Architecture](https://github.com/ab-elhaddad/Sakkeny/assets/113056556/62606c8d-97bb-4801-bc1d-00918b462db5)

- **Controllers** (Handle the requests and responses integrating with the models)
- **Models** (Handle the database operations)
- **Routes** (Handle the routes)
- **Middlewares** (Handle the requests before they reach the controllers)

## 🔧 Pre-requisites

- `Node.js` installed on your machine.

- Have a `Cloudinairy` account.

## 📦 Installation

- Install the dependencies and devDependencies and start the server.

```sh
npm i 
```

- Create a `.env` file in the root directory and add the following variables.

```js
DATABASE_PROD // The RDBMS name for the production environment)
HOST_PROD // The host name for the production environment
USER_PROD // The username for the production environment
PASSWORD_PROD // The password for the production environment
DB_PORT_PROD // The port number for the production environment

DATABASE_TEST // The RDBMS name for the testing environment
HOST_TEST // The host name for the testing environment
USER_TEST // The username for the testing environment
PASSWORD_TEST // The password for the testing environment
DB_PORT_TEST // The port number for the testing environment

DATABASE_DEV // The RDBMS name for the development environment
HOST_DEV // The host name for the development environment
USER_DEV // The username for the development environment
PASSWORD_DEV // The password for the development environment
DB_PORT_DEV // The port number for the development environment

CLOUDINAIRY_CLOUD_NAME // The cloud name for the cloudinairy account
CLOUDINAIRY_API_KEY // The API key for the cloudinairy account
CLOUDINAIRY_API_SECRET // The API secret for the cloudinairy account

PORT // The port number for the server
SALT // The salt number for the password hashing algorithm
PEPPER // The pepper string for the password hashing algorithm
SECRET_KEY // The secret key for the JWT algorithm
ENV // The environment variable (dev, prod, test)
```

- Run the database migrations.

```sh
npm run migrate
```

- Run the tests.

```sh
npm test
```

- Run the server.

```sh
npm start
```

## ✨ How to use the APIs

- Postman collection for the APIs [Postman Collection](https://www.getpostman.com/sakenny-apis/collection/24252566-a2aff24e-edac-41d9-b40d-22ca83708d25?action=share&creator=24252566).

- The APIs are documented using [Swagger](localhost:3000/api-docs/). *Use the link to see the documentation locally after you start the project*
