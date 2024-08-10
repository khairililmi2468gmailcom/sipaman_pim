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

export async function GET(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return new Response(JSON.stringify({ error: 'ID is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    let connection;

    try {
        connection = await pool.getConnection(); // Ambil koneksi dari pool
        const [rows] = await connection.execute('SELECT * FROM Permintaan_Konsumsi WHERE id_permintaan = ?', [id]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'No data found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const data = rows.map((row) => ({
            id: row.id_permintaan,
            kegiatan: row.kegiatan,
            waktu: row.waktu,
            lokasi: row.lokasi,
            jenis_konsumsi: row.jenis_konsumsi,
            cost_center: row.cost_center,
            status: row.status,
            tanggal_permintaan: row.tanggal_permintaan,
            tanggal_persetujuan: row.tanggal_persetujuan,
            jumlah_box_pesan: row.jumlah_box_pesan,
            jumlah_box_disetujui: row.jumlah_box_disetujui,
            keterangan: row.keterangan,
            catatan: row.catatan,
        }))[0];

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error executing query:', error.message, error.stack);

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
