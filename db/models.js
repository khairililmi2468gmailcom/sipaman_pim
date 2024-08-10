// db/models.js
const { mysqlTable, int, varchar, date } = require('drizzle-orm/mysql-core');

const Pemesan = mysqlTable('Pemesan', {
    id_pemesan: int('id_pemesan').primaryKey().notNull(),
    nama_pemesan: varchar('nama_pemesan', 30).notNull(),
    email: varchar('email', 30).notNull(),
    password: varchar('password', 30).notNull(),
    isPemesan: varchar('isPemesan', 10).notNull(),
});

const Admin = mysqlTable('Admin', {
    id_admin: int('id_admin').primaryKey().notNull(),
    nama_admin: varchar('nama_admin', 30).notNull(),
    email: varchar('email', 30).notNull(),
    password: varchar('password', 30).notNull(),
    isAdmin: varchar('isAdmin', 10).notNull(),
});

const PermintaanKonsumsi = mysqlTable('Permintaan_Konsumsi', {
    id_permintaan: int('id_permintaan').primaryKey().notNull(),
    kegiatan: varchar('kegiatan', 40).notNull(),
    waktu: varchar('waktu', 6).notNull(),
    lokasi: varchar('lokasi', 30).notNull(),
    jenis_konsumsi: varchar('jenis_konsumsi', 30).notNull(),
    cost_center: varchar('cost_center', 10).notNull(),
    status: varchar('status', 8).notNull(),
    tanggal_permintaan: date('tanggal_permintaan').notNull(),
    tanggal_persetujuan: date('tanggal_persetujuan'),
    jumlah_box_pesan: int('jumlah_box_pesan'),
    jumlah_box_disetujui: int('jumlah_box_disetujui'),
    keterangan: varchar('keterangan', 60),
    id_pemesan: int('id_pemesan').notNull(),
    id_admin: int('id_admin').notNull(),
});

module.exports = { Pemesan, Admin, PermintaanKonsumsi };
