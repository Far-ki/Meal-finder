import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        // Pobierz adres e-mail użytkownika z local storage
        const userEmail = localStorage.getItem('userEmail');

        // Wyślij zapytanie do serwera, aby pobrać nazwę użytkownika na podstawie adresu e-mail
        axios.get(`http://localhost:8081/user?email=${userEmail}`)
            .then(res => {
                const userName = res.data.name;
                setUserData({ email: userEmail, name: userName });
            })
            .catch(err => {
                console.error('Błąd podczas pobierania nazwy użytkownika:', err);
            });
    }, []);

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
                                <Link className="nav-link" to="/home">Home</Link>
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
                    <input type="text" className="form-control" value={userData.name || ''} readOnly />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="email" className="form-control" value={userData.email || ''} readOnly />
                </div>
                <div>
                    <h3>Favorite Recipes:</h3>
                    {/* Wyświetlanie ulubionych przepisów */}
                </div>
            </div>
        </div>
    );
}

export default Profile;
