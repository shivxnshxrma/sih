import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HospitalLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleHospitalLogin = async (e) => {
        e.preventDefault();

        const hospitaldata = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:3000/getHospital', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hospitaldata)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log('User data:', data);

            if (data) {
                sessionStorage.setItem('hospital',JSON.stringify(data));
                navigate(`/hospitalDashboard?id=${data.id}`);

            } else {
                console.log('No user data found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    return (
        <div className="container mt-5" style={{ width: '30%' }}>
            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Log in</p>
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-light">Hospital Login</h2>
            <form onSubmit={handleHospitalLogin} className="bg-dark p-4 rounded text-light">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
        </div>
    );
};

export default HospitalLogin;
