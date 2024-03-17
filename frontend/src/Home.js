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

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-secondary">
            <nav className="navbar navbar-expand-lg bg-secondary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Pricing</a>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
            </nav>
            <div className="container mt-5">
                <div className="row">
                    {recipes.map(recipe => (
                        <div className="col-md-4 mb-4" key={recipe.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{recipe.name}</h5>
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
