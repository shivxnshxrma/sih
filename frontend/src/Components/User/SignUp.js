import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [adhaarNumber, setAdhaarNumber] = useState('');

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        // Validate Name
        if (userName.length < 3) {
            newErrors.userName = "Name must be at least 3 characters long.";
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            newErrors.userEmail = "Please enter a valid email address.";
        }

        // Validate Password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
        if (userPassword.length < 8 || !passwordRegex.test(userPassword)) {
            newErrors.userPassword = "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.";
        }

        // Validate Date of Birth (Minimum age 18)
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(birthDate.getFullYear() + 18)))) {
            newErrors.dateOfBirth = "You must be at least 18 years old.";
        }

        // Validate Aadhaar Number (12 digits)
        const adhaarRegex = /^\d{12}$/;
        if (!adhaarRegex.test(adhaarNumber)) {
            newErrors.adhaarNumber = "Aadhaar number must be 12 digits.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const user = {
            user_name: userName,
            user_email: userEmail,
            password: userPassword,
            date_of_birth: dateOfBirth,
            adhaar_number: adhaarNumber
        };

        try {
            const response = await fetch('http://localhost:3000/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('User registered successfully!');
            setUserName('');
            setUserEmail('');
            setUserPassword('');
            setDateOfBirth('');
            setAdhaarNumber('');
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: '#eee' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                                        <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="text"
                                                        id="form3Example1c"
                                                        className="form-control"
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example1c">Your Name</label>
                                                    {errors.userName && <div className="text-danger">{errors.userName}</div>}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="email"
                                                        id="form3Example3c"
                                                        className="form-control"
                                                        value={userEmail}
                                                        onChange={(e) => setUserEmail(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                                                    {errors.userEmail && <div className="text-danger">{errors.userEmail}</div>}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="password"
                                                        id="form3Example4c"
                                                        className="form-control"
                                                        value={userPassword}
                                                        onChange={(e) => setUserPassword(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example4c">Password</label>
                                                    {errors.userPassword && <div className="text-danger">{errors.userPassword}</div>}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-calendar-alt fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="date"
                                                        id="form3Example5c"
                                                        className="form-control"
                                                        value={dateOfBirth}
                                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example5c">Date of Birth</label>
                                                    {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-id-card fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <input
                                                        type="number"
                                                        id="form3Example6c"
                                                        className="form-control"
                                                        value={adhaarNumber}
                                                        onChange={(e) => setAdhaarNumber(e.target.value)}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="form3Example6c">Adhaar Number</label>
                                                    {errors.adhaarNumber && <div className="text-danger">{errors.adhaarNumber}</div>}
                                                </div>
                                            </div>

                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <input
                                                    className="form-check-input me-2"
                                                    type="checkbox"
                                                    value=""
                                                    id="form2Example3c"
                                                    required
                                                />
                                                <label className="form-check-label" htmlFor="form2Example3c">
                                                    I agree with all statements in <a href="#!">Terms of service</a>
                                                </label>
                                            </div>

                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="submit" className="btn btn-primary btn-lg">Register</button>
                                            </div>
                                        </form>

                                        <div className='text-center'>
                                            <p>Already a member? <a href="#!" onClick={() => { navigate('/login') }}>Login</a></p>
                                        </div>
                                    </div>

                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                                            className="img-fluid"
                                           
                                            alt="Sample"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
