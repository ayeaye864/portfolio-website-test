//need database library + express, create port 
const Database = require('better-sqlite3');
const express = require("express");
const app = express();
app.listen(3000, () => console.log("listening at port: 3000"));
app.use(express.static("public"));
app.use(express.json({limit:"20mb"})); //prevents overloading server

const db = new Database('commission.db'); //new database

// Create table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS commissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        comm TEXT,
        detail TEXT
    )
`);

// POST method route - for user input on comm page
app.post('/api', (request, response) => {
    const myArray = [];
    myArray.push(request.body.name, request.body.email,request.body.comm, request.body.detail);
    console.log(myArray);
    console.log(request.body);
    const data = request.body;
    try {
        const stmt = db.prepare('INSERT INTO commissions (name, email, comm, detail) VALUES (?, ?, ?, ?)');
        const result = stmt.run(data.name, data.email, data.comm, data.detail);
        console.log('Data inserted:', result);
        myArray.push(data);
        console.log(data);

        console.log(request.body);//logs to terminal, put in html file if want to see in browser
        response.json({
            status: "success",
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        response.status(500).json({ status: "error", message: "Failed to save data" });
    }
});//takes 2 arguments, api enpdoint name+vaiables to receive and send request

app.get('/api', (request, response) => { //get/request data from database
    try {
        const stmt = db.prepare('SELECT * FROM commissions');
        const data = stmt.all();
        console.log("Done"); //for testing purpose
        response.json(data);
        console.log(data);
    } catch (err) {
        console.error('Error retrieving data:', err);
        response.status(500).json({ status: "error", message: "Failed to retrieve data" });
    }
});
