import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if(res.data === "Success") {

                    localStorage.setItem('userEmail', values.email);
                    localStorage.setItem('userName', values.name);
                    navigate('/home');
                } else {
                    alert("No record existed");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-in</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='email'
                            onChange={handleInput} className='form-control rounded-0' />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={handleInput} className='form-control rounded-0' />
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                    <p>Agree to your terms and policies</p>
                    <Link to="/signup" className='btn btn-default border w-100 rounded-0 text-decoration-none'>Create Account</Link>

                </form>
            </div>
        </div>
    );
}

export default Login;