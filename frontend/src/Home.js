import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = () => {
        fetch('http://localhost:8081/recipes')
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch(error => console.error('Błąd podczas pobierania przepisów:', error));
    };

    const handleQueryClick = (query) => {
        fetch(`http://localhost:8081/recipes/${query}`)
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
            })
            .catch(error => console.error(`Błąd podczas pobierania przepisów dla zapytania ${query}:`, error));
    };

    const handleLogout = () => {
        window.location.href = "http://localhost:3000/"; 
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-secondary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/home">Meal Finder</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/home">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/profile">Profile</a>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-danger" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>  
            <div className="container mt-3">
                <div className="row">
                    <div className="col">
                        <button className="btn btn-info me-2" onClick={() => handleQueryClick('query1')}>Zapytanie 1</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-info me-2" onClick={() => handleQueryClick('query2')}>Zapytanie 2</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-info me-2" onClick={() => handleQueryClick('query3')}>Zapytanie 3</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-info me-2" onClick={() => handleQueryClick('query4')}>Zapytanie 4</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-info me-2" onClick={() => handleQueryClick('query5')}>Zapytanie 5</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-info me-2" onClick={() => handleQueryClick('query6')}>Zapytanie 6</button>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {recipes.map(recipe => (
                        <div className="col mb-4" key={recipe.id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.name}</h5>
                                    <img height="50%" width="100%" src={recipe.img} alt="Zdjecie" />
                                    <p className="card-text">Ingredients: {recipe.ingredients}</p>
                                    <a href={decodeURIComponent(recipe.url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Przejdz do przepisu na {`${recipe.name}`}</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
