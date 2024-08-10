// pages/api/deleteRequest.js
import mysql from 'mysql2/promise';

// Buat pool koneksi menggunakan konfigurasi yang benar
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

export async function DELETE(req) {
    let connection;
    try {
        connection = await pool.getConnection(); // Ambil koneksi dari pool
        const { id } = await req.json(); // Get the ID from the request body

        // Coba jalankan query untuk menghapus data pada tabel Permintaan_Konsumsi
        const [result] = await connection.execute('DELETE FROM Permintaan_Konsumsi WHERE id_permintaan = ?', [id]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'ID not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Kembalikan pesan sukses jika query berhasil
        return new Response(JSON.stringify({ message: 'Data deleted successfully' }), {
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
