import Database from "better-sqlite3"

const db: Database.Database = new Database("finanzas.db")

db.pragma("journal_mode=WAL")
db.pragma("foreign_keys=ON")

db.exec(`
    CREATE TABLE IF NOT EXISTS movimientos (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        valor       INTEGER NOT NULL,
        categoria   TEXT    NOT NULL,
        bolsillo    TEXT    DEFAULT 'SaldoDisponible',
        cuenta      TEXT    NOT NULL,
        tipo        TEXT    NOT NULL CHECK(tipo IN('gasto', 'ingreso'))
    );
    
    CREATE TABLE IF NOT EXISTS categorias (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT    NOT NULL,
        limite      INTEGER NOT NULL,
        gastado     INTEGER NOT NULL,
        sobrante    INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS bolsillos (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT NOT NULL,
        valor       INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cuentas (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT NOT NULL,
        valor       INTEGER NOT NULL
    );
`)

export default db;