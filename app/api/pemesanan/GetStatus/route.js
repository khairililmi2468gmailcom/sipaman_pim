import mysql from 'mysql2/promise';

// Create a connection pool with the correct configuration
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
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Total Pesanan (all time)
        const [totalPesananResult] = await connection.execute(`
            SELECT COUNT(*) AS totalPesanan
            FROM Permintaan_Konsumsi
        `);
        const totalPesanan = totalPesananResult[0].totalPesanan || 0;

        // Pesanan Disetujui (all time)
        const [totalPesananDisetujuiResult] = await pool.execute(`
            SELECT COUNT(*) AS totalPesananDisetujui
            FROM Permintaan_Konsumsi
            WHERE status = 'Disetujui'
        `);
        const totalPesananDisetujui = totalPesananDisetujuiResult[0].totalPesananDisetujui || 0;

        // Total Box Permintaan (all time)
        const [totalBoxPermintaanResult] = await pool.execute(`
            SELECT SUM(jumlah_box_pesan) AS totalBoxPermintaan
            FROM Permintaan_Konsumsi
        `);
        const totalBoxPermintaan = totalBoxPermintaanResult[0].totalBoxPermintaan || 0;

        // Jumlah Box Disetujui (all time)
        const [jumlahBoxDisetujuiResult] = await pool.execute(`
            SELECT SUM(jumlah_box_disetujui) AS jumlahBoxDisetujui
            FROM Permintaan_Konsumsi
        `);
        const jumlahBoxDisetujui = jumlahBoxDisetujuiResult[0].jumlahBoxDisetujui || 0;


        const statusCardsData = [
            {
                color: "orange",
                icon: "total",
                title: "Total Pesanan",
                amount: totalPesanan,
                date: "Pesanan"
            },
            {
                color: "blue",
                icon: "pemesan",
                title: "Pesanan Disetujui",
                amount: totalPesananDisetujui,
                date: "Pesanan"
            },
            {
                color: "purple",
                icon: "box",
                title: "Total Box Permintaan",
                amount: totalBoxPermintaan,
                date: "Kotak"
            },
            {
                color: "pink",
                icon: "check",
                title: "Jumlah Box Disetujui",
                amount: jumlahBoxDisetujui,
                date: "Kotak"
            }
        ];

        return new Response(JSON.stringify(statusCardsData), {
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
            connection.release(); // Return the connection to the pool
        }
    }
}
