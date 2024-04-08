import React, { useState, useEffect, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import nlp from 'compromise'; // Importuj bibliotekę compromise
import { Modal, Button } from 'react-bootstrap';

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState([]);
    const [showIngredientsModal, setShowIngredientsModal] = useState(false);
    const [enteredIngredients, setEnteredIngredients] = useState([]);

    const fetchRecipes = useCallback((query) => {
        setLoading(true);
        const normalizedQuery = normalizeQuery(query);
        fetch(`http://localhost:8081/recipes/search?ingredients=${normalizedQuery}`)
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania przepisów:', error);
                setLoading(false);
            });
    }, []);

    const handleSearch = () => {
        fetchRecipes(searchQuery);
        setEnteredIngredients(prevIngredients => [...prevIngredients, ...searchQuery.split(',').map(ingredient => nlp(ingredient.trim()).normalize().out('text'))]);
        setSearchQuery('');
    };

    const handleLogout = () => {
        window.location.href = "http://localhost:3000/"; 
    };

    const removeEnteredIngredient = (indexToRemove) => {
        setEnteredIngredients(prevIngredients => prevIngredients.filter((_, index) => index !== indexToRemove));
    };

    const normalizeQuery = (query) => {
        const normalizedIngredients = query.split(',').map(ingredient => nlp(ingredient.trim()).normalize().out('text'));
        return normalizedIngredients.join(',');
    };

    const handleShowIngredients = (ingredients) => {
        setSelectedRecipeIngredients(ingredients.split(','));
        setShowIngredientsModal(true);
    };

    const renderIngredients = (ingredients) => {
        return (
            <ul>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
        );
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
                <div className="input-group mb-3">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter ingredients separated by commas..." 
                        value={searchQuery} 
                        onChange={event => setSearchQuery(event.target.value)} 
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleSearch();
                            }
                        }} 
                    />
                    <button className="btn btn-outline-primary" type="button" onClick={handleSearch}>Search</button>
                </div>
                <div>
                    {enteredIngredients.map((ingredient, index) => (
                        <span key={index} className="badge bg-primary me-2 mb-2">
                            {ingredient}
                            <button type="button" className="btn-close ms-2" onClick={() => removeEnteredIngredient(index)}></button>
                        </span>
                    ))}
                </div>
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
                                        <img src={recipe.img} alt="Recipe" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                        <div className="d-flex justify-content-between">
                                            <Button variant="info" onClick={() => handleShowIngredients(recipe.ingredients)}>Show Ingredients</Button>
                                            <a href={decodeURIComponent(recipe.url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Recipe</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Modal show={showIngredientsModal} onHide={() => setShowIngredientsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ingredients</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderIngredients(selectedRecipeIngredients)}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Home;
