import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'makanan',
    password: 'passwordMakanan',
    database: 'sistem_pemesanan_makanan_pim',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function GET(req, res) {
    let connection;

    try {
        const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
        const year = searchParams.get('year') || new Date().getFullYear();

        console.log(`Fetching data for year: ${year}`);
        connection = await pool.getConnection(); // Ambil koneksi dari pool

        const [rows] = await connection.execute(`
      SELECT 
        MONTH(tanggal_permintaan) AS month, 
        jenis_konsumsi, 
        COUNT(*) AS orderCount
      FROM 
        Permintaan_Konsumsi
      WHERE 
        YEAR(tanggal_permintaan) = ?
      GROUP BY 
        MONTH(tanggal_permintaan), jenis_konsumsi
      ORDER BY 
        MONTH(tanggal_permintaan)
    `, [year]);

        console.log('Query executed successfully:', rows);

        const ordersPerMonth = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            data: {}
        }));

        rows.forEach(row => {
            ordersPerMonth[row.month - 1].data[row.jenis_konsumsi] = row.orderCount;
        });

        console.log('Formatted data:', ordersPerMonth);

        return new Response(JSON.stringify(ordersPerMonth), {
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
