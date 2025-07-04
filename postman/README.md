# Postman Collection for Culin Backend API

This folder contains Postman collections and environments for testing the Culin Backend API - a comprehensive Cloud Kitchen Management System.

## 📁 Folder Structure

```
postman/
├── collections/
│   └── Culin-Backend-API.postman_collection.json
├── environments/
│   ├── Local.postman_environment.json
│   └── Production.postman_environment.json
└── README.md
```

## 🚀 Getting Started

### 1. Import the Collection

1. Open Postman
2. Click **Import** button
3. Select the `Culin-Backend-API.postman_collection.json` file
4. The collection will be imported with all API endpoints organized by functionality

### 2. Set Up Environments

1. Import the environment files:

   - `Local.postman_environment.json` for local development
   - `Production.postman_environment.json` for production testing

2. Select the appropriate environment from the dropdown in the top-right corner

3. Update the environment variables as needed:
   - `baseUrl`: Your API base URL
   - `authToken`: JWT token for authentication (will be set automatically after login)

## 🔐 Authentication Flow

### Step 1: Login

1. Use the **Login** request in the Authentication folder
2. Update the request body with your credentials:
   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```
3. Send the request
4. Copy the JWT token from the response

### Step 2: Set Auth Token

1. Go to your environment settings
2. Set the `authToken` variable with the JWT token (without "Bearer " prefix)
3. All subsequent requests will automatically include the authorization header

## 📋 API Endpoints Overview

### Authentication

- `POST /auth/login` - User login
- `GET /auth/users` - Get all users (authenticated)
- `GET /auth/users/public` - Get users (public endpoint)

### Users Management

- `POST /user` - Create new user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user

### Vendors

- `GET /vendor` - Get all vendors
- `POST /vendor` - Create new vendor

### Branches

- `GET /branch` - Get all branches
- `POST /branch` - Create new branch

### Categories

- `GET /category` - Get all categories
- `POST /category` - Create new category

### Menu Management

- `GET /menu` - Get all menus
- `POST /menu` - Create new menu

### Products

- `GET /product` - Get all products
- `POST /product` - Create new product

### Orders

- `GET /order` - Get all orders
- `POST /order` - Create new order

### Inventory

- `GET /inventory` - Get all inventory items
- `POST /inventory` - Create new inventory item

### Reports

- `GET /reports/sales` - Get sales reports

## 🔧 Environment Variables

| Variable     | Description              | Example                    |
| ------------ | ------------------------ | -------------------------- |
| `baseUrl`    | API base URL             | `http://localhost:3000`    |
| `authToken`  | JWT authentication token | `eyJhbGciOiJIUzI1NiIs...`  |
| `userId`     | User ID for testing      | `64eb16308dd6c1c54f5ab4e1` |
| `vendorId`   | Vendor ID for testing    | `64eb16308dd6c1c54f5ab4e2` |
| `branchId`   | Branch ID for testing    | `64eb16308dd6c1c54f5ab4e3` |
| `roleId`     | Role ID for testing      | `64eb16308dd6c1c54f5ab4e4` |
| `categoryId` | Category ID for testing  | `64eb16308dd6c1c54f5ab4e5` |
| `menuId`     | Menu ID for testing      | `64eb16308dd6c1c54f5ab4e6` |
| `productId`  | Product ID for testing   | `64eb16308dd6c1c54f5ab4e7` |

## 🧪 Testing Workflow

### 1. Initial Setup

1. Start your local server
2. Import the collection and environment
3. Select the Local environment

### 2. Authentication

1. Execute the Login request
2. Copy the token from the response
3. Set the `authToken` environment variable

### 3. Create Test Data

1. Create a vendor first
2. Create a branch (requires vendor ID)
3. Create a category
4. Create a menu (requires vendor ID)
5. Create a product (requires category and menu IDs)

### 4. Test CRUD Operations

1. Test GET requests to retrieve data
2. Test POST requests to create new records
3. Test PUT requests to update existing records
4. Test DELETE requests to remove records

## 🔄 Automated Testing

### Pre-request Scripts

You can add pre-request scripts to automatically:

- Set dynamic values
- Generate timestamps
- Create unique identifiers

### Test Scripts

Add test scripts to:

- Validate response status codes
- Check response body structure
- Set environment variables from responses
- Log test results

Example test script:

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
  const response = pm.response.json();
  pm.expect(response).to.have.property("users");
  pm.expect(response).to.have.property("pagination");
});
```

## 📊 Response Examples

### Successful Login Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64eb16308dd6c1c54f5ab4e1",
    "name": "Admin User",
    "username": "admin",
    "emailId": "admin@example.com"
  }
}
```

### Users List Response

```json
{
  "users": [
    {
      "_id": "64eb16308dd6c1c54f5ab4e1",
      "name": "John Doe",
      "username": "johndoe",
      "emailId": "john@example.com",
      "status": "active"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "usersPerPage": 10
  }
}
```

## 🚨 Error Handling

### Common Error Responses

#### 401 Unauthorized

```json
{
  "error": "Token is required"
}
```

#### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": "Field 'email' is required"
}
```

#### 500 Internal Server Error

```json
{
  "message": "Internal Server Error",
  "error": "Database connection failed"
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Check if the token is valid
   - Ensure the token is set in the environment
   - Verify the token format (should not include "Bearer " prefix)

2. **CORS Issues**

   - Ensure your server allows requests from Postman
   - Check if the server is running on the correct port

3. **Environment Variables Not Working**

   - Verify the environment is selected
   - Check variable names for typos
   - Ensure variables are enabled

4. **Response Format Issues**
   - Check the Content-Type header
   - Verify the request body format
   - Ensure all required fields are provided

## 📝 Best Practices

1. **Environment Management**

   - Use different environments for different stages
   - Never commit sensitive data to version control
   - Use environment variables for dynamic values

2. **Request Organization**

   - Group related requests in folders
   - Use descriptive names for requests
   - Add descriptions to complex requests

3. **Testing Strategy**

   - Test happy path scenarios first
   - Add negative test cases
   - Validate response schemas
   - Test edge cases and error conditions

4. **Documentation**
   - Keep request descriptions updated
   - Document expected responses
   - Add examples for complex requests

## 🔗 Related Documentation

- [API Documentation](../API_DOCUMENTATION.md)
- [Server Configuration](../server.js)
- [Routes](../routes/)
- [Controllers](../controllers/)

## 🤝 Contributing

When adding new endpoints:

1. Add them to the appropriate folder in the collection
2. Update this README with endpoint documentation
3. Add any new environment variables if needed
4. Test the new endpoints thoroughly

## 📞 Support

For issues with the API or Postman collection:

1. Check the troubleshooting section
2. Review the API documentation
3. Check server logs for detailed error messages
4. Contact the development team
