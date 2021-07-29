const express = require("express");
const util = require('util');
const app = express();

names = [
    {"name": "Leonardo"},
    {"name": "Leandro"},
    {"name": "Marcos"},
    {"name": "Maria"},
    {"name": "Mario"},
    {"name": "Paula"},
    {"name": "Tamires"},
    {"name": "Thiago"},
    {"name": "Tomas"},
    {"name": "Victoria"},
];

const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'db', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user
    password: 'root', // A senha do usuário. Ex: user123
    database: 'fullcycle-docker-challenge-2' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

con.connect((err) => {
    if (err) {
        console.log('Erro connecting to database...', err)
        return
    }
    console.log('Connection established!')
})

app.get("/", async (req, res) => {
   res.send(await persistNameAndReturnThem());
})
let i = 0;
async function persistNameAndReturnThem() {
    if (i < 10)
        con.query(
            'INSERT INTO people (name) VALUES (?)', names[i++].name, (err, res) => {
                if (err) throw err

                console.log(`New name added with ID: ${res.insertId}`)
            }
        )

    // node native promisify
    const query = util.promisify(con.query).bind(con);

    const persistedNames = await query( 'SELECT name FROM people');

    let htmlList = "";
    persistedNames.forEach((element) => {
        console.log(element)
        htmlList += "<li>" + JSON.parse(JSON.stringify(element['name'])) + "</li>"
    });
    console.log(htmlList)
    return '<h1>Full Cycle Rocks!</h1>' +
    '<ul>' +
    htmlList +
    '</ul>';
}

app.listen(3000, () => console.log('Running node server on 3000'));