import Employee from "../models/employee.js";
import { successresponse, errorResponse } from "../middlewares/responseformatter.js";

class EmployeeController {
    async getEmployees(req, res) {
        try {
            const employees = await Employee.findAll();
            const employeesWithoutPassword = employees.map(emp => Employee.withoutPassword(emp));
            successresponse(res, 'All Employees Data fetched successfully', {employees:employeesWithoutPassword});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeeById(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return errorResponse(res,'Employee not Found', {});          

            successresponse(res, 'Employee Data fetched successfully', {employee: Employee.withoutPassword(employee)});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createEmployee(req, res) {
        try {
            const { name, email, password, position } = req.body;
            
            if (!name || !email || !password || !position) {
                return errorResponse(res, 'All fields (name, email, password, position) are required');
            } 
            
            if (!Employee.validateName(name)) {
                return errorResponse(res, 'Invalid name');
            }

            if (!Employee.validateEmail(email)) {
                return errorResponse(res, 'Invalid Email format');
            }

            if (!Employee.validatePassword(password)) {
                return errorResponse(res, 'Password must be at least 8 characters long');
            }

            if (!Employee.validatePosition(position)) {
                return errorResponse(res, 'Invalid position');
            }

            const existingEmployee = await Employee.findByEmail(email);
            if (existingEmployee) {
                return errorResponse(res, 'Email already in use');
            }
            const newEmployee = await Employee.create({ name, email, password, position });
            console.log('Employee Registered successfully');
            successresponse(res, 'Employee registered successfully', {employee: Employee.withoutPassword(newEmployee)});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateEmployee(req, res) {
        try {
            const {name, email, password, position} = req.body;

            if (name && !Employee.validateName(name)) {
                return errorResponse(res, 'Invalid name');
            }
            if (email && !Employee.validateEmail(email)) {
                return errorResponse(res, 'Invalid Email format');
            }

            if (password && !Employee.validatePassword(password)) {
                return errorResponse(res, 'Password must be atleast 8 characters long');
            }

            if (position && !Employee.validatePosition(position)) {
                return errorResponse(res, 'Invalid position');
            }

            const updatedEmployee = await Employee.update(req.params.id, { name, email, password, position });
            
            

            successresponse(res, 'Employee Updated Successfully', { employee: Employee.withoutPassword(updatedEmployee) });
        } catch (error) {
            console.error("Status 500:", error);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteEmployee(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                console.log('Error 404 Employee Not Found');
                return errorResponse(res, 'Employee not found');
            }
            await Employee.delete(req.params.id);
            console.log('Employee Deleted successfully');
            successresponse(res, 'Employee Deleted Successfully');
        } catch (error) {
            console.error("Status 500:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new EmployeeController();
