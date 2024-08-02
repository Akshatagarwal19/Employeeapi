import Employee from "../models/employee.js";
import { successresponse, errorResponse } from "../middlewares/responseformatter.js";


class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, position } = req.body;

            if (!name || !email || !password || !position) {
                console.log('Validation failed: null string fields');
                return res.status(400).json({ message: 'All fields (name, email, password, position) are required' });
            }

            if (name.trim() === '' || email.trim() === '' || password.trim() === '' || position.trim() === '') {
                console.log('Validation failed: empty string fields');
                return res.status(400).json({ message: 'Fields cannot be empty strings' });
            }

            if (!Employee.validateName(name)) {
                return errorResponse(res, 'Invalid name');
            }

            if (!Employee.validateEmail(email)) {
                return errorResponse(res, 'Invalid Email format');
            }

            if (!Employee.validatePassword(password)) {
                return errorResponse(res, 'Password must be at least 8 characters long ');
            }

            if (!Employee.validatePosition(position)) {
                return errorResponse(res, 'Invalid position');
            }

            const existingEmployee = await Employee.findByEmail(email);
            if (existingEmployee) {
                return errorResponse(res, 'Email already in use');
            }
            const newEmployee = await Employee.create({ name, email, password, position });
            successresponse(res, 'Employee registered successfully', {employee: Employee.withoutPassword(newEmployee)});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const employee = await Employee.findByEmail(email);
            if (!employee || !(await employee.verifyPassword(password))) {
                return errorResponse(res, 'Invalid  Email or Password');
            }
            successresponse(res, 'Login Successfull', {employee: Employee.withoutPassword(employee)})
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {
            successresponse(res, 'Logout Successfull')
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();