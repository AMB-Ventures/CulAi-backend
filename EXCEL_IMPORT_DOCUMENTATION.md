# Excel Import API for Vendor Products

## Overview

This API allows vendors to import multiple products from an Excel file into the system. Each row in the Excel file represents one product, enabling bulk import of hundreds of products at once.

## Endpoints

### 1. Multipart Form Data Upload

```
POST /api/vendor-products/import-excel
```

### 2. Binary Data Upload

```
POST /api/vendor-products/import-excel-binary
```

## Authentication

Requires authentication token in headers:

```
Authorization: Bearer <token>
```

## Request Format

### Option 1: Multipart Form Data

- **Content-Type**: `multipart/form-data`
- **File Field**: `excelFile`
- **Supported Formats**: `.xlsx`, `.xls`, `.csv`

### Option 2: Binary Data

- **Content-Type**: `application/json`
- **Body**: JSON object with file data

```json
{
  "fileData": "base64_encoded_file_data_or_data_url",
  "fileName": "products.xlsx",
  "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
}
```

## Frontend Implementation Examples

### Multipart Form Data

```javascript
const formData = new FormData();
formData.append("excelFile", file);
fetch("/api/vendor-products/import-excel", {
  method: "POST",
  headers: {
    Authorization: "Bearer YOUR_TOKEN",
  },
  body: formData,
});
```

### Binary Data

```javascript
// Convert file to base64
const fileReader = new FileReader();
fileReader.onload = function () {
  const base64Data = fileReader.result;

  fetch("/api/vendor-products/import-excel-binary", {
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

## Excel File Structure

**Important**: Each row in the Excel file represents one product. You can include hundreds of products in a single file.

### Required Columns:

- `name` - Product name (required)
- `brand` - Brand name (required)
- `category` - Category name (required)
- `taxgroup` - Tax group name (required)

### Optional Columns:

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

### Valid Values:

- `costingmethod`: "fromIngredients", "fromTransactions", "fixed"
- `inventoryuom`: "unit", "kg", "g", "l", "ml", "mg"
- `sellinguom`: "unit", "kg", "g", "l", "ml"
- `status`: "active", "disabled", "outOfStock"
- `isparlevelactive`: "true", "false"
- `issaleable`: "true", "false"

## Example Excel Structure

| name             | brand   | category  | taxgroup    | sku    | costprice | sellingprice | status |
| ---------------- | ------- | --------- | ----------- | ------ | --------- | ------------ | ------ |
| Pizza Margherita | Brand A | Italian   | Tax Group 1 | PIZ001 | 8.50      | 15.99        | active |
| Chicken Burger   | Brand B | Fast Food | Tax Group 2 | BUR002 | 6.00      | 12.50        | active |

## Response Format

### Success Response (200)

```json
{
  "message": "Excel import completed",
  "success": {
    "totalProcessed": 2,
    "created": 2,
    "products": [
      {
        "_id": "product_id_1",
        "name": "Pizza Margherita",
        "brand": "Brand A",
        "category": "Italian"
        // ... other product fields
      }
    ]
  }
}
```

### Error Response (400/500)

```json
{
  "message": "Error message",
  "errors": [
    "Row 1: Missing required fields (name, brand, category, taxgroup)",
    "Row 3: Invalid costing method"
  ]
}
```

## Error Handling

The API provides detailed error reporting:

- **File Validation**: Checks file format and presence
- **Data Validation**: Validates required fields for each row
- **Row-level Errors**: Reports specific errors for each problematic row
- **Partial Success**: Continues processing even if some rows fail
- **Bulk Processing**: Uses bulk insert for better performance, falls back to individual inserts if needed

## Notes

1. **Brand, Category, and Tax Group**: These should be existing names in the system. The API will use the provided names as-is.
2. **File Size**: Large files may take time to process
3. **Real-time Updates**: The API emits socket events for real-time UI updates
4. **File Cleanup**: Uploaded files are automatically cleaned up after processing
5. **Bulk Import**: Optimized for importing hundreds of products efficiently
6. **Performance**: Uses MongoDB bulk operations for faster processing

## Sample cURL Request

```bash
curl -X POST \
  http://localhost:3000/api/vendor-products/import-excel \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'excelFile=@products.xlsx'
```
