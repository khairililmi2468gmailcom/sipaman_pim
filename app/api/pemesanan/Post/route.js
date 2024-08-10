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

export async function POST(req) {
    let connection;
    try {
        connection = await pool.getConnection(); // Get a connection from the pool

        const {
            kegiatan,
            waktu,
            lokasi,
            jenis_konsumsi,
            cost_center,
            status,
            tanggal_permintaan,
            tanggal_persetujuan,
            jumlah_box_pesan,
            jumlah_box_disetujui,
            keterangan,
            catatan,
            id_user
        } = await req.json();

        // Log request body untuk debugging
        // console.log('Request body:', {
        //     kegiatan,
        //     waktu,
        //     lokasi,
        //     jenis_konsumsi,
        //     cost_center,
        //     status,
        //     tanggal_permintaan,
        //     tanggal_persetujuan,
        //     jumlah_box_pesan,
        //     jumlah_box_disetujui,
        //     keterangan,
        //     catatan
        // });

        // Periksa apakah kolom yang tidak boleh null sudah diisi
        if (!kegiatan || !lokasi || !jenis_konsumsi || !cost_center || !tanggal_permintaan || !jumlah_box_pesan) {
            console.error('Missing required fields');
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Buat array untuk menyimpan kolom dan nilai yang sesuai
        const columns = [];
        const placeholders = [];
        const values = [];

        // Tambahkan kolom dan nilai ke array
        columns.push('kegiatan', 'waktu', 'lokasi', 'jenis_konsumsi', 'cost_center', 'status', 'tanggal_permintaan', 'tanggal_persetujuan', 'jumlah_box_pesan', 'jumlah_box_disetujui', 'keterangan', 'catatan', 'id_user');
        placeholders.push('?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?', '?');
        values.push(kegiatan, waktu || null, lokasi, jenis_konsumsi, cost_center, status || null, tanggal_permintaan, tanggal_persetujuan || null, jumlah_box_pesan, jumlah_box_disetujui || null, keterangan || null, catatan || null, id_user || null);

        // Buat query untuk menyisipkan data
        const query = `
            INSERT INTO Permintaan_Konsumsi (${columns.join(', ')})
            VALUES (${placeholders.join(', ')})
        `;

        // Log query dan values untuk debugging
        // console.log('Query:', query);
        // console.log('Values:', values);

        // Jalankan query dengan parameter yang diberikan
        const [result] = await connection.execute(query, values);

        // Log hasil query untuk debugging
        console.log('Query result:', result);

        // Kembalikan respons sukses
        return new Response(JSON.stringify({ message: 'Data inserted successfully', id: result.insertId }), {
            status: 201,
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
            connection.release(); // Return the connection to the pool
        }
    }
}
