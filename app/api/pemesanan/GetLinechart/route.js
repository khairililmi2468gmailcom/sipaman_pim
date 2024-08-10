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
    queueLimit: 0,
});

export async function GET(req, res) {
    let connection;

    try {
        const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
        const year = searchParams.get('year') || new Date().getFullYear();

        console.log(`Fetching data for year: ${year}`);
        // Get a connection from the pool
        connection = await pool.getConnection();

        // Fetch the number of orders per month for the given year
        const [rows] = await pool.execute(`
      SELECT 
        MONTH(tanggal_permintaan) AS month, 
        COUNT(*) AS orderCount
      FROM 
        Permintaan_Konsumsi
      WHERE 
        YEAR(tanggal_permintaan) = ?
      GROUP BY 
        MONTH(tanggal_permintaan)
      ORDER BY 
        MONTH(tanggal_permintaan)
    `, [year]);

        // console.log('Query executed successfully:', rows);

        // Format the result to match the chart's data structure
        const ordersPerMonth = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            orderCount: 0,
        }));

        rows.forEach(row => {
            ordersPerMonth[row.month - 1].orderCount = row.orderCount;
        });

        // console.log('Formatted data:', ordersPerMonth);

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
            connection.release(); // Return the connection to the pool
        }
    }
}
