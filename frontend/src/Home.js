import React, { useState, useEffect, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import levenshtein from 'js-levenshtein';
import axios from "axios";
function Home() {
    const [userData, setUserData] = useState({});
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState([]);
    const [showIngredientsModal, setShowIngredientsModal] = useState(false);
    const [enteredIngredients, setEnteredIngredients] = useState([]);
    const [basicIngredients] = useState({
        vegetables: ['marchew', 'ziemniak', 'cebula', 'pomidor', 'sałata', 'brokuł', 'papryka', 'czosnek', 'kapusta', 'szpinak'],
        fruits: ['jabłko', 'banan', 'pomarańcza', 'gruszka', 'winogrono', 'truskawka', 'malina', 'ananas', 'kiwi', 'mango'],
        meats: ['kurczak', 'wołowina', 'wieprzowina', 'indyk', 'jajka', 'łosoś', 'tuńczyk', 'szynka', 'kiełbasa', 'cielęcina']
    });
    const [activeCategory, setActiveCategory] = useState('/recipes/search');

    const fetchRecipes = useCallback(() => {
        setLoading(true);
        fetch(`http://localhost:8081${activeCategory}?ingredients=${enteredIngredients.join(',')}`)
            .then(response => response.json())
            .then(data => {
                setRecipes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Błąd podczas pobierania przepisów:', error);
                setLoading(false);
            });
    }, [activeCategory, enteredIngredients]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    useEffect(() => {

        const userEmail = localStorage.getItem('userEmail');

        axios.get(`http://localhost:8081/id?email=${userEmail}`)
            .then(res => {
                const userid = res.data.id;
                setUserData({ email: userEmail, id: userid });
            })
            .catch(err => {
                console.error('Błąd podczas pobierania id:', err);
            });
    }, []);



    const handleSearch = () => {
        fetchRecipes();
        setSearchQuery('');
    };

    const handleLogout = () => {
        window.location.href = "http://localhost:3000/";
    };

    const removeEnteredIngredient = (indexToRemove) => {
        setEnteredIngredients(prevIngredients => prevIngredients.filter((_, index) => index !== indexToRemove));
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const closestIngredient = findClosestMatch(searchQuery, basicIngredients);
            setEnteredIngredients(prevIngredients => [...prevIngredients, closestIngredient.trim()]);
            setSearchQuery('');
        }
    };

    const findClosestMatch = (ingredient, basicIngredients) => {
        let minDistance = Infinity;
        let closestIngredient = '';

        for (const category in basicIngredients) {
            basicIngredients[category].forEach(basicIngredient => {
                const distance = levenshtein(ingredient.toLowerCase(), basicIngredient.toLowerCase());

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIngredient = basicIngredient;
                }
            });
        }

        return closestIngredient;
    };

    const sortRecipesByOwnedIngredients = () => {
        const sortedRecipes = [...recipes];
        sortedRecipes.forEach(recipe => {
            const recipeIngredients = recipe.ingredients && typeof recipe.ingredients === 'string' ? recipe.ingredients.split(',').map(ingredient => ingredient.trim().toLowerCase()) : [];
            const ownedIngredients = enteredIngredients.filter(ingredient => recipeIngredients.includes(ingredient));
            const missingIngredientsCount = recipeIngredients.length - ownedIngredients.length;
            recipe.missingIngredientsCount = missingIngredientsCount;
        });
        sortedRecipes.sort((a, b) => a.missingIngredientsCount - b.missingIngredientsCount);
        return sortedRecipes;
    };

    const handleSearchBasicIngredient = (ingredient) => {
        const closestIngredient = findClosestMatch(ingredient, basicIngredients);
        setEnteredIngredients(prevIngredients => [...prevIngredients, closestIngredient.trim()]);
        setSearchQuery('');
    };

    const addToFavorites = (recipeId,userId) => {
        axios.post('http://localhost:8081/favoriteRecipes/add', { userId: userData.id, recipeId })
            .then(res => {
                console.log('Recipe added to favorites:', res.data);
            })
            .catch(err => {
                console.error('Error adding recipe to favorites:', err);
            });
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
                        placeholder="Enter ingredients"
                        value={searchQuery}
                        onChange={event => setSearchQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
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

            <div className="container mt-5 border-top pt-5">
                <h2>Category</h2>
                <div className="row mb-3">
                    <div className="col">
                        <Button className={`me-2 ${activeCategory === '/dinner/search' ? 'btn-success' : 'btn-danger'}`} onClick={() => setActiveCategory(activeCategory === '/dinner/search' ? '/recipes/search' : '/dinner/search')}>Dinner</Button>
                        <Button className={`me-2 ${activeCategory === '/breakfast/search' ? 'btn-success' : 'btn-danger'}`} onClick={() => setActiveCategory(activeCategory === '/breakfast/search' ? '/recipes/search' : '/breakfast/search')}>Breakfast</Button>
                        <Button className={`me-2 ${activeCategory === '/vegetarian/search' ? 'btn-success' : 'btn-danger'}`} onClick={() => setActiveCategory(activeCategory === '/vegetarian/search' ? '/recipes/search' : '/vegetarian/search')}>Vegetarian</Button>
                        <Button className={`me-2 ${activeCategory === '/vegan/search' ? 'btn-success' : 'btn-danger'}`} onClick={() => setActiveCategory(activeCategory === '/vegan/search' ? '/recipes/search' : '/vegan/search')}>Vegan</Button>
                        <Button className={`me-2 ${activeCategory === '/meat/search' ? 'btn-success' : 'btn-danger'}`} onClick={() => setActiveCategory(activeCategory === '/meat/search' ? '/recipes/search' : '/meat/search')}>Meat</Button>

                    </div>
                </div>
                <h2>Basic Ingredients</h2>
                <div className="row">
                    <div className="col">
                        <h3>Vegetables</h3>
                        <div className="d-flex flex-wrap">
                            {basicIngredients.vegetables.map((ingredient, index) => (
                                <div key={index} className="badge bg-success me-2 mb-2 p-2" onClick={() => handleSearchBasicIngredient(ingredient)}>
                                    {ingredient}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col">
                        <h3>Fruits</h3>
                        <div className="d-flex flex-wrap">
                            {basicIngredients.fruits.map((ingredient, index) => (
                                <div key={index} className="badge bg-warning me-2 mb-2 p-2" onClick={() => handleSearchBasicIngredient(ingredient)}>
                                    {ingredient}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col">
                        <h3>Meats</h3>
                        <div className="d-flex flex-wrap">
                            {basicIngredients.meats.map((ingredient, index) => (
                                <div key={index} className={`badge ${activeCategory === '/meat/search' ? 'bg-success' : 'bg-danger'} me-2 mb-2 p-2`} onClick={() => handleSearchBasicIngredient(ingredient)}>
                                    {ingredient}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {sortRecipesByOwnedIngredients().map(recipe => (
                            <div className="col mb-4" key={recipe.id}>
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{recipe.name}</h5><img src={recipe.img} alt="Recipe" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                        <p>Missing Ingredients: {recipe.missingIngredientsCount}</p>
                                        <p>Difficulty: {recipe.difficulty}</p>
                                        <p>Preparation Time: {recipe.time}</p>

                                        <div className="d-flex justify-content-between">
                                            <Button variant="info" onClick={() => handleShowIngredients(recipe.ingredients)}>Show Ingredients</Button>
                                            <Button variant="success" onClick={() => addToFavorites(recipe.id,userData.name)}>Add to Favorites</Button>
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
