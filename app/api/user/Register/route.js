import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'makanan',
    password: 'passwordMakanan',
    database: 'sistem_pemesanan_makanan_pim',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function POST(req) {
    let connection;
    try {
        const { nama, email, password, role } = await req.json();

        // Validate the required fields
        if (!nama || !email || !password || !role) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Create the query to insert the new user into the database
        const query = `
            INSERT INTO User (nama, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

        // Execute the query with the provided values
        const [result] = await connection.execute(query, [nama, email, hashedPassword, role]);

        // Return a success response
        return new Response(JSON.stringify({ message: 'User registered successfully', id: result.insertId }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error executing query:', error.message, error.stack);

        // Return an error response if the query fails
        return new Response(JSON.stringify({ error: 'Ada kesalahan di server', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        if (connection) connection.release(); // Always release the connection back to the pool
    }
}
