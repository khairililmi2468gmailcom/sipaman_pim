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

export async function PUT(req) {
    let connection;

    try {
        connection = await pool.getConnection(); // Get a connection from the pool

        const {
            id_permintaan,
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
            catatan
        } = await req.json();

        // Log request body untuk debugging
        console.log('Request body:', {
            id_permintaan,
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
            catatan
        });

        // Periksa apakah kolom yang tidak boleh null sudah diisi
        if (!id_permintaan || !kegiatan || !lokasi || !jenis_konsumsi || !cost_center || !tanggal_permintaan || !jumlah_box_pesan) {
            console.error('Missing required fields');
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Buat array untuk menyimpan kolom yang akan diperbarui dan nilai yang sesuai
        const updates = [];
        const values = [];

        // Tambahkan kolom yang ada dalam permintaan
        updates.push('kegiatan = ?', 'lokasi = ?', 'jenis_konsumsi = ?', 'cost_center = ?', 'tanggal_permintaan = ?', 'jumlah_box_pesan = ?');
        values.push(kegiatan, lokasi, jenis_konsumsi, cost_center, tanggal_permintaan, jumlah_box_pesan);

        if (waktu !== undefined && waktu !== '') {
            updates.push('waktu = ?');
            values.push(waktu);
        } else {
            updates.push('waktu = NULL');
        }

        if (status !== undefined && status !== '') {
            updates.push('status = ?');
            values.push(status);
        } else {
            updates.push('status = NULL');
        }

        if (tanggal_persetujuan !== undefined && tanggal_persetujuan !== '') {
            updates.push('tanggal_persetujuan = ?');
            values.push(tanggal_persetujuan);
        } else {
            updates.push('tanggal_persetujuan = NULL');
        }

        if (jumlah_box_disetujui !== undefined && jumlah_box_disetujui !== '') {
            updates.push('jumlah_box_disetujui = ?');
            values.push(jumlah_box_disetujui);
        } else {
            updates.push('jumlah_box_disetujui = NULL');
        }

        if (keterangan !== undefined && keterangan !== '') {
            updates.push('keterangan = ?');
            values.push(keterangan);
        } else {
            updates.push('keterangan = NULL');
        }

        if (catatan !== undefined && catatan !== '') {
            updates.push('catatan = ?');
            values.push(catatan);
        } else {
            updates.push('catatan = NULL');
        }

        // Tambahkan nilai ID ke array values
        values.push(id_permintaan);

        // Buat query untuk memperbarui data
        const query = `
            UPDATE Permintaan_Konsumsi
            SET ${updates.join(', ')}
            WHERE id_permintaan = ?
        `;

        // Log query dan values untuk debugging
        // console.log('Query:', query);
        // console.log('Values:', values);

        // Jalankan query dengan parameter yang diberikan
        const [result] = await connection.execute(query, values);

        // Log hasil query untuk debugging
        console.log('Query result:', result);

        // Periksa apakah ada baris yang diperbarui
        if (result.affectedRows === 0) {
            console.error('Data not found');
            return new Response(JSON.stringify({ error: 'Data not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Kembalikan respons sukses
        return new Response(JSON.stringify({ message: 'Data updated successfully' }), {
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
            connection.release(); // Return the connection to the pool
        }
    }
}
