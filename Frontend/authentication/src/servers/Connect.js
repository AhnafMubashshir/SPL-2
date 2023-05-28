

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'splprojectdb'
})

db.connect(err => {
    if(err){
        return err;
    }
})

console.log(db);

app.post('/submit', (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password =  req.body.password;

    const sql = "INSERT into userdb(Name, Email, Password) values('$name','$email','$password')";
    db.query(sql);
})

app.listen(3000, () => {
    console.log('Listening on port 3000.');
})