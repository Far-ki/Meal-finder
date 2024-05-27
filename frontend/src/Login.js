import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.data === "Success") {
                        localStorage.setItem('userEmail', values.email);
                        // Assuming you meant to set user's name here, but 'name' is not part of 'values'.
                        // localStorage.setItem('userName', values.name); 
                        navigate('/home');
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center vh-100' style={{ backgroundColor: '#6c757d' }} >
            <div className='bg-white p-3 rounded w-25'>
                <h2>Zaloguj</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder='Wprowadź email'
                            name='email'
                            onChange={handleInput}
                            className={`form-control rounded-0 ${errors.email ? 'is-invalid' : ''}`}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Hasło</strong></label>
                        <input
                            type="password"
                            placeholder='Wprowadź hasło'
                            name='password'
                            onChange={handleInput}
                            className={`form-control rounded-0 ${errors.password ? 'is-invalid' : ''}`}
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Zaloguj</strong></button>
                    <p>Zgodna na przetwarzanie danych</p>
                    <Link to="/signup" className='btn btn-default border w-100 rounded-0 text-decoration-none'>Stwórz konto</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
