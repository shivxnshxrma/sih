import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Stylesheet/style.css";
const ChooseRole = () => {
    const navigate = useNavigate();
    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4 text-light">Select Your Role</h1>
            <div className="row justify-content-center">
                <div className="col-md-4 mb-4">
                    <div className="card bg-dark text-light border-0">
                        <div className="card-body">
                            <h3 className="card-title">User</h3>
                            <button 
                                className="btn btn-outline-light me-2 mb-2 w-100" 
                                onClick={() => navigate('/login')}
                            >
                                Login as User
                            </button>
                            <button 
                                className="btn btn-outline-light w-100" 
                                onClick={() => navigate('/signup')}
                            >
                                Signup as User
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card bg-dark text-light border-0">
                        <div className="card-body">
                            <h3 className="card-title">Hospital</h3>
                            <button 
                                className="btn btn-outline-light me-2 mb-2 w-100" 
                                onClick={() => navigate('/hospitallogin')}
                            >
                                Login as Hospital
                            </button>
                            <button 
                                className="btn btn-outline-light w-100" 
                                onClick={() => navigate('/hospitalsignup')}
                            >
                                Signup as Hospital
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseRole;
