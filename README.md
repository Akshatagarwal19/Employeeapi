# Employeeapi
Employee Management System API Documentation
Base URL: httpemployeeapi-production.up.railway.app
Authentication Endpoints
Register a New Employee
•	Endpoint: /auth/register
•	Method: POST
•	Request Body:
json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "position": "Manager"
}
•	Response:
json
{
  "message": "Employee registered successfully",
  "employee": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "<hashed_password>",
    "position": "Manager"
  }
}
Login
•	Endpoint: /auth/login
•	Method: POST
•	Request Body:
json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
•	Response:
json
{
  "message": "Login successful",
}
Logout
•	Endpoint: /auth/logout
•	Method: POST
•	Response:
json
{
  "message": "Logout successful"
}
Employee Endpoints
Get All Employees
•	Endpoint: /employees
•	Method: GET
•	Response:
json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "position": "Manager"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "position": "Developer"
  }
]
Get Employee by ID
•	Endpoint: /employees/:id
•	Method: GET
•	Response:
json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "position": "Manager"
}
Create a New Employee
•	Endpoint: /employees
•	Method: POST
•	Request Body:
json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "password123",
  "position": "Developer"
}
•	Response:
json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "position": "Developer"
}
Update an Employee
•	Endpoint: /employees/:id
•	Method: PUT
•	Request Body:
json
{
  "name": "Jane Doe Updated",
  "email": "jane.doe@example.com",
  "position": "Senior Developer"
}
•	Response:
json
{
  "id": 2,
  "name": "Jane Doe Updated",
  "email": "jane.doe@example.com",
  "position": "Senior Developer"
}
Delete an Employee
•	Endpoint: /employees/:id
•	Method: DELETE
•	Response:
json
{
  "message": "Employee deleted"
}

