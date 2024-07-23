import Employee from "../models/employee.js";

class EmployeeController {
    async getEmployees(req, res) {
        try {
            const employees = await Employee.findAll();
            res.json(employees);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getEmployeeById(req, res) {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) return res.status(404).json({ message: 'Employee not found' });
            res.json(employee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createEmployee(req, res) {
        try {
            const { name, email, password, position } = req.body;
            const existingEmployee = await Employee.findByEmail(email);
            if (existingEmployee) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            const newEmployee = await Employee.create({ name, email, password, position });
            res.status(201).json(newEmployee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateEmployee(req, res) {
        try {
            const updatedEmployee = await Employee.update(req.params.id, req.body);
            res.json(updatedEmployee);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteEmployee(req, res) {
        try {
            await Employee.delete(req.params.id);
            res.send('Employee deleted');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new EmployeeController();