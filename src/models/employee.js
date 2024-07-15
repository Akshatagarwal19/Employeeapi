import bcrypt from 'bcryptjs';
import db from '../../server.js';

class Employee {
    constructor(id ,name ,email ,password ,position) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.position = position;
    }

    async setpassword(password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(password, salt);
    }

    async verifypassword(password) {
        return await bcrypt.compare(password ,this.password);
    }

    static async findbyemail(email){
        const result = await db.query('SELECT * FROM employees WHERE email = $1', [email]);
        const employee = result.rows[0];
        if (employee) {
            return new Employee(employee.id, employee.name, employee.email, employee.password, employee.position);
        }
        return null;
    }

    static async create({ name, email, password, position }) {
        const employee = new Employee(null, name, email, password, position);
        await employee.setpassword(password);

        const result = await db.query('INSERT INTO employees (name, email, password, position) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, employee.password, position]
        );

        const newEmployee = result.rows[0];
        return new Employee(newEmployee.id , newEmployee.name, newEmployee.email, newEmployee.password, newEmployee.position);
    }

    static async findbyid(id){
        const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
        const employee = result.rows[0];
        if (employee) {
            return new Employee(employee.id, employee.name, employee.email, employee.password, employee.position);
        }
        return null;
    }
    
    static async update(id, {name, email, password, position}) {
        let updatedpassword = password;
        if (password) {
            const employee = new Employee(id, name, email, password, position);
            await employee.setpassword(password);
            updatedpassword = employee.password;
        }

        const result = await db.query('UPDATE employees SET name = $1, email = $2, password = $3, position = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [name, email, updatedpassword, position, id]
        );

        const updatedemployee = result.rows[0];
        return new Employee(updatedemployee.id, updatedemployee.name, updatedemployee.email, updatedemployee.password, updatedemployee.position);
    }

    static async delete(id){
        await db.query('DELETE FROM employees WHERE id = $1', [id]);
    }

    static async findall() {
        const result = await db.query('SELECT * FROM employees');
        return result.rows.map(employee => new Employee(employee.id, employee.name, employee.email, employee.password, employee.position));
    }
}
export default Employee;