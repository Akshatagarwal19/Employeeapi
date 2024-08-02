import bcrypt from 'bcryptjs';
import db from '../../server.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

class Employee {
    constructor(id, name, email, password, position, updatd_at) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.position = position;
        this.updatd_at = updatd_at;
    }

    async setPassword(password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt);
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    static validateEmail(email) {
        return validator.isEmail(email);
    }

    static validateName(name) {
        return typeof name === 'string' && name.trim().length > 0;
    }

    static validatePassword(password) {
        return typeof password === 'string' && password.length >=8
    }

    static validatePosition(position) {
        return typeof position === 'string' && position.trim().length > 0;
    }

    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM employees WHERE email = $1', [email]);
        const employee = result.rows[0];
        if (employee) {
            return new Employee(employee.id, employee.name, employee.email, employee.password, employee.position, employee.updatd_at);
        }
        return null;
    }

    static async create({ name, email, password, position }) {
        if (!this.validateEmail(email)) {
            throw new Error('Invalid Email format');
        }
        
        if (!this.validatePassword(password)){
            throw new Error('Password should be atleast 8 characters long');
        }

        if (!this.validateName(name)){
            throw new Error('Invalid Name');
        }
        
        if (!this.validatePosition(position)){
            throw new Error('Invalid Position');
        }
        const id = uuidv4();
        const employee = new Employee(id, name, email, password, position, null);
        await employee.setPassword(password);

        const result = await db.query(
            'INSERT INTO employees (id, name, email, password, position) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id, name, email, employee.password, position]
        );

        const newEmployee = result.rows[0];
        return new Employee(newEmployee.id, newEmployee.name, newEmployee.email, newEmployee.password, newEmployee.position, newEmployee.updatd_at);
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
        const employee = result.rows[0];
        if (employee) {
            return new Employee(employee.id, employee.name, employee.email, employee.password, employee.position, employee.updatd_at);
        }
        return null;
    }

    static async update(id, { name, email, password, position }) {

        const existingEmployeeResult = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
        const existingEmployee = existingEmployeeResult.rows[0];

        if (!existingEmployee) {
            throw new Error('Employee not found');
        }

        if (email && !this.validateEmail(email)) {
            throw new Error('Invalid email format');
        }
        if (name && !this.validateName(name)) {
            throw new Error('Invalid name');
        }
        if (password && !this.validatePassword(password)) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (position && !this.validatePosition(position)) {
            throw new Error('Invalid position');
        }

        const updatedName = name !== undefined ? name : existingEmployee.name;
        const updatedEmail = email !== undefined ? email : existingEmployee.email;
        const updatedPosition = position !== undefined ? position : existingEmployee.position;

        let updatedPassword = existingEmployee.password;
        if (password) {
            const employee = new Employee(id, updatedName, updatedEmail, password, updatedPosition, null);
            await employee.setPassword(password);
            updatedPassword = employee.password;
        }

        const result = await db.query(
            'UPDATE employees SET name = $1, email = $2, password = $3, position = $4, updatd_at = NOW() WHERE id = $5 RETURNING *',
            [updatedName, updatedEmail, updatedPassword, updatedPosition, id]
        );

        const updatedEmployee = result.rows[0];
        return new Employee(updatedEmployee.id, updatedEmployee.name, updatedEmployee.email, updatedEmployee.password, updatedEmployee.position, updatedEmployee.updatd_at);
    }

    static async delete(id) {
        await db.query('DELETE FROM employees WHERE id = $1', [id]);
    }

    static async findAll() {
        const result = await db.query('SELECT * FROM employees');
        return result.rows.map(employee => new Employee(employee.id, employee.name, employee.email, employee.password, employee.position, employee.updatd_at));
    }

    // New method to return employee data without password
    static withoutPassword(employee) {
        const { password, ...employeeWithoutPassword } = employee;
        return employeeWithoutPassword;
    }
}

export default Employee;
