# Express Mongo Transactions

This project is an Express.js application that connects to a MongoDB database to manage transactions. Each transaction includes the following fields: id, amount, sender, and receiver.

## Project Structure

```
express-mongo-transactions
├── src
│   ├── server.js               # Entry point of the application
│   ├── app.js                  # Express app configuration
│   ├── config
│   │   └── db.js               # MongoDB connection configuration
│   ├── models
│   │   └── transaction.model.js  # Mongoose model for transactions
│   ├── controllers
│   │   └── transaction.controller.js # CRUD operations for transactions
│   ├── routes
│   │   └── transactions.js      # Routes for transaction-related endpoints
│   ├── middleware
│   │   └── errorHandler.js      # Error handling middleware
│   └── utils
│       └── validateTransaction.js # Utility for validating transaction data
├── package.json                 # NPM configuration file
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd express-mongo-transactions
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   ```

4. **Run the application:**
   ```
   npm start
   ```

## Usage

- The application exposes RESTful API endpoints for managing transactions. You can create, retrieve, update, and delete transactions using the defined routes.

## License

This project is licensed under the MIT License.