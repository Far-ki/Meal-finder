import React, { useState, useEffect, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRecipes = useCallback(() => {
        setLoading(true);
        fetch(`http://localhost:8081/recipes/search?ingredients=${searchQuery}`)
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data);
                setRecipes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania przepisów:', error);
                setLoading(false);
            });
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            fetchRecipes();
        }
    }, [searchQuery, fetchRecipes]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            fetchRecipes();
        }
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
                <form onSubmit={handleSearchSubmit}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Enter ingredients separated by commas..." value={searchQuery} onChange={handleSearchChange} />
                        <button className="btn btn-outline-primary" type="submit">Search</button>
                    </div>
                </form>
            </div>
            <div className="container mt-5">
                {loading ? (
                    <p>Loading...</p>
                ) : (
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
                )}
            </div>
        </div>
    );
}

export default Home;
