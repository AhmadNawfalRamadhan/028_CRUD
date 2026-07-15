const express = require('express');
const {Pool} = require ('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '12345678',
    port: 5432,
});

app.use(express.json());

// get
app.get('/biodata', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biodata');

        res.status(200).json({
            message: 'Berhasil mengambil data biodata',
            data: result.rows
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Terjadi kesalahan pada server atau database' });
    }
});

// post
app.post('/biodata', async (req, res) => {
    try {
        const { id, nama, nim, kelas } = req.body;
        const result = await pool.query(
            'INSERT INTO biodata(id, nama, nim, kelas) VALUES($1, $2, $3, $4) RETURNING *',
            [id, nama, nim, kelas]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
// put
app.put('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, nim, kelas } = req.body;
        const result = await pool.query(
            'UPDATE biodata SET nama=$1, nim=$2, kelas=$3 WHERE id=$4 RETURNING *',
            [nama, nim, kelas, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// delete

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});


