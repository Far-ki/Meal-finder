const nlp = require('compromise');
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
});

const normalizeIngredient = (ingredient) => {
    return nlp(ingredient).normalize().out('text');
};

const normalizeIngredients = (query) => {
    return query.split(',').map(ingredient => normalizeIngredient(ingredient.trim()));
};

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

});

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

});

app.post('/recipes', (req, res) => {
    const { recipeTitle, ingredients, recipeUrl, recipeImage, difficulty, cook_time } = req.body;

    const decodedUrl = decodeURIComponent(recipeUrl);

    const sql = "INSERT INTO meal.recipes(name, ingredients, url,img,difficulty,time) VALUES (?, ?, ?,?,?,?)";
    const values = [recipeTitle, ingredients.join(', '), decodedUrl, recipeImage, difficulty, cook_time];

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
    const { recipeTitle, ingredients, recipeUrl, recipeImage, difficulty, cook_time } = req.body;

    const decodedUrl = decodeURIComponent(recipeUrl);

    const sql = "INSERT INTO meal.vegetarian(name, ingredients, url,img,difficulty,time) VALUES (?, ?, ?,?,?,?)";
    const values = [recipeTitle, ingredients.join(', '), decodedUrl, recipeImage, difficulty, cook_time];

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

app.get('/user', (req, res) => {
    const userEmail = req.query.email; 

    const sql = "SELECT name FROM login WHERE email = ?";
    db.query(sql, [userEmail], (err, result) => {
        if (err) {
            console.error('Błąd podczas pobierania nazwy użytkownika z bazy danych:', err);
            res.status(500).json({ message: 'Błąd podczas pobierania nazwy użytkownika z bazy danych' });
        } else {
            if (result.length > 0) {
                const userName = result[0].name;
                res.status(200).json({ name: userName });
            } else {
                res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym adresie e-mail' });
            }
        }
    });
});


app.get('/recipes/search', (req, res) => {
    const searchQuery = req.query.ingredients;
    const normalizedIngredients = normalizeIngredients(searchQuery);

    const placeholders = normalizedIngredients.map(() => 'ingredients LIKE ?').join(' OR ');
    const values = normalizedIngredients.map(ingredient => `%${ingredient}%`);

    const sql = `SELECT * FROM meal.recipes WHERE ${placeholders}`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Błąd podczas wyszukiwania przepisów:', err);
            res.status(500).json({ message: 'Błąd podczas wyszukiwania przepisów' });
        } else {
            console.log('Pomyślnie znaleziono przepisy pasujące do wyszukiwania.');

            const recipesWithMissingIngredients = result.map(recipe => {
                const recipeIngredients = recipe.ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase());
                const missingIngredients = normalizedIngredients.filter(ingredient => !recipeIngredients.includes(ingredient));
                return {
                    ...recipe,
                    missingIngredients: missingIngredients
                };
            });

            res.status(200).json(recipesWithMissingIngredients);
        }
    });
});




app.listen(8081, () => {
    console.log("listening");
});
