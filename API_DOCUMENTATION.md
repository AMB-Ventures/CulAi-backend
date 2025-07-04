# Users API Documentation

## Get All Users

### Endpoint

```
GET /auth/users
```

### Authentication

Requires a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Query Parameters

| Parameter | Type   | Description                             | Default |
| --------- | ------ | --------------------------------------- | ------- |
| `page`    | number | Page number for pagination              | 1       |
| `limit`   | number | Number of users per page                | 10      |
| `status`  | string | Filter by user status (active/disabled) | -       |
| `role`    | string | Filter by role ID                       | -       |
| `vendor`  | string | Filter by vendor ID (Super Admin only)  | -       |
| `branch`  | string | Filter by branch ID                     | -       |
| `search`  | string | Search in name, username, or email      | -       |

### Response Format

```json
{
  "users": [
    {
      "_id": "user_id",
      "name": "User Name",
      "username": "username",
      "emailId": "user@example.com",
      "phone": 1234567890,
      "status": "active",
      "role": {
        "_id": "role_id",
        "name": "Role Name"
      },
      "vendor": {
        "_id": "vendor_id",
        "name": "Vendor Name"
      },
      "branch": {
        "_id": "branch_id",
        "name": "Branch Name"
      },
      "station": {
        "_id": "station_id",
        "name": "Station Name"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "usersPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Example Requests

#### Get all users (first page)

```
GET /auth/users
```

#### Get users with pagination

```
GET /auth/users?page=2&limit=20
```

#### Search for users

```
GET /auth/users?search=john
```

#### Filter by status

```
GET /auth/users?status=active
```

#### Filter by role

```
GET /auth/users?role=64eb16308dd6c1c54f5ab4e1
```

#### Combined filters

```
GET /auth/users?status=active&search=admin&page=1&limit=15
```

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Token is required"
}
```

#### 500 Internal Server Error

```json
{
  "message": "Internal Server Error",
  "error": "Error details"
}
```

### Role-Based Access Control

- **Super Admins**: Can view all users across all vendors
- **Other Users**: Can only view users from their own vendor
- **Vendor Filter**: Only available to Super Admins

### Testing Endpoint

For testing purposes, you can also use:

```
GET /auth/users/public
```

This endpoint doesn't require authentication but still applies role-based filtering if a token is provided.

### Notes

- Users marked as deleted (`isDeleted: true`) are automatically excluded
- The API includes populated references for role, vendor, branch, and station
- Search is case-insensitive and works across name, username, and email fields
- Pagination is handled on the application level for better performance

# API Documentation

## Product Import Endpoints

### 1. Import Products from Excel/CSV (Multipart Form Data)

**POST** `/api/products/vendor-products/import-excel`

Upload an Excel or CSV file using multipart form data.

**Request:**

- Content-Type: `multipart/form-data`
- Body: Form data with field name `excelFile` containing the file

**Example:**

```javascript
const formData = new FormData();
formData.append("excelFile", file);
fetch("/api/products/vendor-products/import-excel", {
  method: "POST",
  body: formData,
});
```

### 2. Import Products from Excel/CSV (Binary Data)

**POST** `/api/products/vendor-products/import-excel-binary`

Upload an Excel or CSV file as binary data in the request body.

**Request:**

- Content-Type: `application/json`
- Body: JSON object with file data

**Example:**

```javascript
// Convert file to base64
const fileReader = new FileReader();
fileReader.onload = function () {
  const base64Data = fileReader.result;

  fetch("/api/products/vendor-products/import-excel-binary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_TOKEN",
    },
    body: JSON.stringify({
      fileData: base64Data,
      fileName: "products.xlsx",
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  });
};
fileReader.readAsDataURL(file);
```

**Request Body:**

```json
{
  "fileData": "base64_encoded_file_data_or_data_url",
  "fileName": "products.xlsx",
  "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
```

**Response:**

```json
{
  "message": "Import completed",
  "success": {
    "totalProcessed": 10,
    "created": 8,
    "products": [...]
  },
  "errors": [
    "Row 3: Missing required fields (name, brand, category, taxgroup)",
    "Row 7: Invalid cost price format"
  ]
}
```

**Supported File Formats:**

- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma Separated Values)

**Required Columns in Excel/CSV:**

- `name` - Product name
- `brand` - Brand name (will be created if doesn't exist)
- `category` - Category name (will be created if doesn't exist)
- `taxgroup` - Tax group name (will be created if doesn't exist)

**Optional Columns:**

- `sku` - Stock Keeping Unit
- `costingmethod` - Costing method (default: "fixed")
- `costprice` - Cost price (default: 0)
- `preparationtime` - Preparation time in minutes (default: 0)
- `barcode` - Product barcode
- `inventoryuom` - Inventory unit of measure (default: "unit")
- `isparlevelactive` - Whether par level is active (default: false)
- `issaleable` - Whether product is saleable (default: true)
- `sellinguom` - Selling unit of measure (default: "unit")
- `sellingprice` - Default selling price (default: 0)
- `minimumparlevel` - Minimum par level (default: 0)
- `maximumparlevel` - Maximum par level (default: 0)
- `status` - Product status (default: "active")
