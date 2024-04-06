import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState({});
    const [nickname, setNickname] = useState('');
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    useEffect(() => {
        fetchUserData();
        fetchFavoriteRecipes();
    }, []);

    const fetchUserData = () => {
        axios.get('http://localhost:8081/user')
            .then(res => {
                setUserData(res.data);
                setNickname(res.data.nickname || '');
            })
            .catch(err => console.error('Error while fetching user data:', err));
    };

    const fetchFavoriteRecipes = () => {
        axios.get('http://localhost:8081/user/favorite-recipes')
            .then(res => {
                setFavoriteRecipes(res.data);
            })
            .catch(err => console.error('Error while fetching favorite recipes:', err));
    };

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    const handleNicknameSubmit = () => {
        axios.put('http://localhost:8081/user', { nickname })
            .then(res => {
                setUserData(prevUserData => ({
                    ...prevUserData,
                    nickname: nickname
                }));
            })
            .catch(err => console.error('Error while updating user nickname:', err));
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-secondary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Meal Finder</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2 className="mb-4">User Profile</h2>
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input type="text" className="form-control" value={userData.name} readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="email" className="form-control" value={userData.email} readOnly />
                </div>
                <div>
                    <h3>Favorite Recipes:</h3>
                    <ul className="list-group">
                        {favoriteRecipes.map(recipe => (
                            <li className="list-group-item" key={recipe.id}>{recipe.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Profile;
