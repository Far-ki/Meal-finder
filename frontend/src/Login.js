import React from 'react';

function Login() {
    return (
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <form action="">
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' className='form-control rounded-0'/>    
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' className='form-control rounded-0' />    
                    </div>
                    <button className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                    <p>Agree to your terms and policies</p>
                    <button className='btn btn-default border w-100 rounded-0'>Create Account</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
