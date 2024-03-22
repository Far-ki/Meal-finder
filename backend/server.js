const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login(name,email,password) VALUES (?)"
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    })

})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json("Success");
        }
        else {
            return res.json("Faile")
        }
    })

})

app.post('/recipes', (req, res) => {
    const { recipeTitle, ingredients, recipeUrl, recipeImage,difficulty,cook_time } = req.body;

    const decodedUrl = decodeURIComponent(recipeUrl);

    const sql = "INSERT INTO meal.recipes(name, ingredients, url,img,difficulty,time) VALUES (?, ?, ?,?,?,?)";
    const values = [recipeTitle, ingredients.join(', '), decodedUrl,recipeImage,difficulty,cook_time];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Błąd podczas zapisywania przepisu do bazy danych:', err);
            res.status(500).json({ message: 'Błąd podczas zapisywania przepisu do bazy danych' });
        } else {
            console.log('Przepis został pomyślnie zapisany do bazy danych.');
            res.status(200).json({ message: 'Przepis został pomyślnie zapisany do bazy danych' });
        }
    });
});


app.post('/vegetarian', (req, res) => {
    const { recipeTitle, ingredients, recipeUrl, recipeImage,difficulty,cook_time } = req.body;

    const decodedUrl = decodeURIComponent(recipeUrl);

    const sql = "INSERT INTO meal.vegetarian(name, ingredients, url,img,difficulty,time) VALUES (?, ?, ?,?,?,?)";
    const values = [recipeTitle, ingredients.join(', '), decodedUrl,recipeImage,difficulty,cook_time];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Błąd podczas zapisywania przepisu do bazy danych:', err);
            res.status(500).json({ message: 'Błąd podczas zapisywania przepisu do bazy danych' });
        } else {
            console.log('Przepis został pomyślnie zapisany do bazy danych.');
            res.status(200).json({ message: 'Przepis został pomyślnie zapisany do bazy danych' });
        }
    });
});


app.get('/vegetarian', (req, res) => {
    const sql = "SELECT * FROM meal.vegetarian";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Błąd podczas pobierania przepisów z bazy danych:', err);
            res.status(500).json({ message: 'Błąd podczas pobierania przepisów z bazy danych' });
        } else {
            console.log('Pomyślnie pobrano przepisy z bazy danych.');
            res.status(200).json(result);
        }
    });
});

app.get('/recipes', (req, res) => {
    const sql = "SELECT * FROM meal.recipes";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Błąd podczas pobierania przepisów z bazy danych:', err);
            res.status(500).json({ message: 'Błąd podczas pobierania przepisów z bazy danych' });
        } else {
            console.log('Pomyślnie pobrano przepisy z bazy danych.');
            res.status(200).json(result);
        }
    });
});


app.listen(8081, () => {
    console.log("listening");
})