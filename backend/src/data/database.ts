import Database from "better-sqlite3"

const db = new Database("finanzas.db")

db.pragma("journal_mode=WAL")
db.pragma("foreign_kets=ON")

db.exec(`
    CREATE TABLE IF NO EXISTS movimientos (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        valor       INTEGER NOT NULL,
        categoria   TEXT    NOT NULL,
        bolsillo    TEXT    DEFAULT SaldoDisponible,
        cuenta      TEXT    NOT NULL
        tipo        TEXT    NOT NULL CHECK(estado IN('gasto', 'ingreso'))
    )
    
    CREATE TABLE IF NO EXISTS categorias (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT    NOT NULL,
        limite      INTEGER NOT NULL,
        gastado     INTEGER NOT NULL,
        sobrante    INTEGER NOT NULL
    )
    
    CREATE TABLE IF NO EXISTS bolsillos (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT NOT NULL,
        valor       INTEGER NOT NULL
    )

    CREATE TABLE IF NO EXISTS cuentas (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT NOT NULL,
        valor       INTEGER NOT NULL
    )
`)

export default db;