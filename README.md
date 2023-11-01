# Pro-Shop E-Commerce Web App | MERN Stack

This project is a comprehensive e-commerce web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a platform for users to browse and purchase products.

Key features of the application include:

-   User authentication and authorization
-   Product search
-   Shopping cart functionality
-   Order processing and history
-   User profile management
-   Product reviews and ratings

The application also includes an admin panel for managing users, products, and orders.

The project follows a RESTful API design and utilizes Redux for state management. It also includes a test suite for ensuring the reliability and robustness of the application.

Please follow the setup and running instructions provided in the README to get started with the project.

## Setup

1. Clone the repository to your local machine using `git clone https://github.com/AvishkaUmesh/Pro-Shop-MERN.git`.
2. Navigate to the project directory using `cd Pro-Shop-MERN`.
3. Copy the `.env.sample` file and rename it to `.env`. Fill in the necessary environment variables.
4. Install the necessary dependencies using `npm install` `npm install --prefix frontend`
5. Seed dummy data using `npm run data:import` and if needed to destroy dummy data use `npm run data:destroy`

## Running the Project

1. To start the server, use the command `npm run server`.
2. To start the client, use the command `npm run client`.
3. To start both the server and client concurrently, use the command `npm run dev`.

Please ensure that you have Node.js and npm installed on your machine before attempting to run this project.

## Testing

This project uses Jest for testing. To run the tests, use the command `npm test`.
