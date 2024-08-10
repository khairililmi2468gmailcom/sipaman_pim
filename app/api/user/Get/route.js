import mysql from 'mysql2/promise'

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

export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection(); // Ambil koneksi dari pool
        const [rows] = await connection.execute('SELECT * FROM User');
        const data = rows.map((row) => ({
            id: row.id_user,
            nama: row.nama,
            email: row.email,
            password: row.password,
            role: row.role,
        }));
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error executing query:', error.message, error.stack);

        // Kembalikan pesan error jika query gagal
        return new Response(JSON.stringify({ error: 'Failed to execute query', details: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        if (connection) {
            connection.release(); // Kembalikan koneksi ke pool
        }
    }
}