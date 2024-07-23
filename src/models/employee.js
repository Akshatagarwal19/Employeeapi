import bcrypt from 'bcryptjs';
import db from '../../server.js';

class Employee {
    constructor(id, name, email, password, position, updated_at) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.position = position;
        this.updated_at = updated_at;
    }

    async setPassword(password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt);
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM employees WHERE email = $1', [email]);
        const employee = result.rows[0];
        if (employee) {
            return new Employee(employee.id, employee.name, employee.email, employee.password, employee.position, employee.updated_at);
        }
        return null;
    }

    static async create({ name, email, password, position }) {
        const employee = new Employee(null, name, email, password, position, null);
        await employee.setPassword(password);

        const result = await db.query(
            'INSERT INTO employees (name, email, password, position) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, employee.password, position]
        );

        const newEmployee = result.rows[0];
        return new Employee(newEmployee.id, newEmployee.name, newEmployee.email, newEmployee.password, newEmployee.position, newEmployee.updated_at);
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
        const employee = result.rows[0];
        if (employee) {
            return new Employee(employee.id, employee.name, employee.email, employee.password, employee.position, employee.updated_at);
        }
        return null;
    }

    static async update(id, { name, email, password, position }) {
        let updatedPassword = password;
        if (password) {
            const employee = new Employee(id, name, email, password, position, null);
            await employee.setPassword(password);
            updatedPassword = employee.password;
        }

        const result = await db.query(
            'UPDATE employees SET name = $1, email = $2, password = $3, position = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [name, email, updatedPassword, position, id]
        );

        const updatedEmployee = result.rows[0];
        return new Employee(updatedEmployee.id, updatedEmployee.name, updatedEmployee.email, updatedEmployee.password, updatedEmployee.position, updatedEmployee.updated_at);
    }

    static async delete(id) {
        await db.query('DELETE FROM employees WHERE id = $1', [id]);
    }

    static async findAll() {
        const result = await db.query('SELECT * FROM employees');
        return result.rows.map(employee => new Employee(employee.id, employee.name, employee.email, employee.password, employee.position, employee.updated_at));
    }
}

export default Employee;
