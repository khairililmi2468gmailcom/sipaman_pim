import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Buat pool koneksi menggunakan konfigurasi yang benar
const pool = mysql.createPool({
    host: 'localhost',
    user: 'makanan',
    password: 'passwordMakanan',
    database: 'sistem_pemesanan_makanan_pim',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 10000 // 10 seconds
});

// Secret key untuk JWT
const JWT_SECRET = 'PIM_PUPUK_INDONESIA';

export async function POST(req) {
    let connection;

    try {
        connection = await pool.getConnection(); // Get a connection from the pool
        const { email, password } = await req.json();

        // Validasi input
        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Query untuk mendapatkan data user berdasarkan email
        const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid email atau password' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const user = rows[0];
        console.log('User from DB:', user);

        // Cek password menggunakan bcrypt.compare
        const passwordMatch = await bcrypt.compare(password, user.password);
        // console.log('Password match:', passwordMatch);
        // console.log('Password input:', password);

        if (!passwordMatch) {
            return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // token JWT dengan masa berlaku 1 hari (24 jam)
        const token = jwt.sign(
            {
                id: user.id_user,
                email: user.email,
                role: user.role,
                nama: user.nama
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );


        // Kembalikan respons sukses beserta token
        return new Response(JSON.stringify({
            message: 'Login successful',
            token,
            user: {
                id: user.id_user,
                email: user.email,
                role: user.role,
                nama: user.nama
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error during login:', error.message, error.stack);

        // Kembalikan pesan error jika terjadi kegagalan
        return new Response(JSON.stringify({ error: 'Failed to login', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}
