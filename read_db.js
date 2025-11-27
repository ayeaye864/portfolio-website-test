const Database = require('better-sqlite3');

const db = new Database('commission.db');

try {
    const stmt = db.prepare('SELECT * FROM commissions');
    const rows = stmt.all();
    console.log('Commission data:');
    console.log(rows);
} catch (err) {
    console.error('Error reading database:', err);
} finally {
    db.close();
}
