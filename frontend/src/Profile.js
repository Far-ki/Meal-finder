import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

function Profile() {
    const [userData, setUserData] = useState({});
    const [userData2, setUserData2] = useState({});
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showIngredientsModal, setShowIngredientsModal] = useState(false);
    const [recipeIngredients, setRecipeIngredients] = useState([]);

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        axios.get(`http://localhost:8081/user?email=${userEmail}`)
            .then(res => {
                const userName = res.data.name;
                setUserData({ email: userEmail, name: userName });
            })
            .catch(err => {
                console.error('Błąd podczas pobierania nazwy użytkownika:', err);
            });

        axios.get(`http://localhost:8081/id?email=${userEmail}`)
            .then(res => {
                const userid = res.data.id;
                setUserData2({ email: userEmail, id: userid });
            })
            .catch(err => {
                console.error('Błąd podczas pobierania id:', err);
            });

    }, []);

    useEffect(() => {
        if (userData2.id) {
            setLoading(true);
            axios.get(`http://localhost:8081/favoriteRecipes/show?id=${userData2.id}`)
                .then(response => {
                    setFavoriteRecipes(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Błąd podczas pobierania ulubionych przepisów:', error);
                    setLoading(false);
                });
        }
    }, [userData2.id]);

    const handleShowIngredients = (ingredients) => {
        setRecipeIngredients(ingredients.split(','));
        setShowIngredientsModal(true);
    };

    const handleRemoveFromFavorites = (recipeId) => {
        axios.delete(`http://localhost:8081/favoriteRecipes/${recipeId}`)
            .then(response => {
                setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.id !== recipeId));
            })
            .catch(error => {
                console.error('Błąd podczas usuwania przepisu z ulubionych:', error);
            });
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
                                <Link className="nav-link" to="/home">Strona główna</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profil</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2 className="mb-4">Profil użytkownika</h2>
                <div className="mb-3">
                    <label className="form-label">Imie:</label>
                    <input type="text" className="form-control" value={userData.name || ''} readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="email" className="form-control" value={userData.email || ''} readOnly />
                </div>
                <div>
                    <h3>Ulubione przepisy:</h3>
                    <div className="container mt-5">
                        {loading ? (
                            <p>Ładowanie...</p>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                {favoriteRecipes.map(recipe => (
                                    <div className="col mb-4" key={recipe.id}>
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title">{recipe.name}</h5><img src={recipe.img} alt="Recipe" style={{ width: '380px', height: '250px' }} />
                                                <p>poziom trudności: {recipe.difficulty}</p>
                                                <p>Czas przygotownia: {recipe.time}</p>
                                                <div className="d-flex justify-content-between">
                                                    <Button variant="info" onClick={() => handleShowIngredients(recipe.ingredients)}>Pokaż składniki</Button>
                                                    <Button variant="danger" onClick={() => handleRemoveFromFavorites(recipe.id)}>Usuń z ulubionych</Button>
                                                    <a href={decodeURIComponent(recipe.url)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Pokaż przepis</a>
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
                            <Modal.Title>Składniki</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {renderIngredients(recipeIngredients)}
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Profile;
