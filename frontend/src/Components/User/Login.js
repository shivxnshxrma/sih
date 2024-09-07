import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebookF, FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import { json, useNavigate } from 'react-router-dom';

const Login = () => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const navigate = useNavigate();

    const getUser = async () => {
        const user = {
            user_email: userEmail,
            user_password: userPassword,
        };

        try {
            const response = await fetch('http://localhost:3000/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log('User data:', data);

            if (data) {
                sessionStorage.setItem('user',JSON.stringify(data));
                navigate('/userDashboard');
            } else {
                console.log('No user data found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getUser();
    };

    return (
        <div className="container mt-5" style={{ width: '30%' }}>
            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Log in</p>
            <form onSubmit={handleSubmit}>
                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="form2Example1"
                        className="form-control"
                        placeholder="Enter your email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example1">Email address</label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="form2Example2"
                        className="form-control"
                        placeholder="Enter your password"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                </div>

                <div className="row mb-4">
                    <div className="col d-flex justify-content-center">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="form2Example31"
                                defaultChecked
                            />
                            <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
                        </div>
                    </div>

                    <div className="col text-end">
                        <a href="#!">Forgot password?</a>
                    </div>
                </div>

                <div className='text-center'>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block mb-4"
                    >
                        Sign in
                    </button>
                </div>

                <div className="text-center">
                    {/* <p>Not a member? <a href="#!" onClick={()=>{navigate('/')}}>Register</a></p> */}
                    <p>or sign up with:</p>
                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <FaFacebookF />
                    </button>

                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <FaGoogle />
                    </button>

                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <FaTwitter />
                    </button>

                    <button
                        type="button"
                        className="btn btn-link btn-floating mx-1"
                    >
                        <FaGithub />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
