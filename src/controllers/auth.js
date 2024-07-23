import Employee from "../models/employee.js";

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, position } = req.body;
            const existingEmployee = await Employee.findByEmail(email);
            if (existingEmployee) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            const newEmployee = await Employee.create({ name, email, password, position });
            res.status(201).json({ message: 'Employee registered successfully', employee: newEmployee });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const employee = await Employee.findByEmail(email);
            if (!employee || !(await employee.verifyPassword(password))) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            res.json({ message: 'Login successful', employee });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {
            res.json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();

