import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const HospitalResources = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract hospitalId from the query string
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('id');
    const [resources, setResources] = useState({
        opd_count: '',
        bed_count: '',
        blood_quantities: bloodTypes.reduce((acc, type) => ({ ...acc, [type]: '' }), {})
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResources(prevResources => ({
            ...prevResources,
            [name]: value
        }));
    };

    const handleBloodChange = (e) => {
        const { name, value } = e.target;
        setResources(prevResources => ({
            ...prevResources,
            blood_quantities: {
                ...prevResources.blood_quantities,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { blood_quantities, ...otherResources } = resources;

        try {
            const response = await fetch(`http://localhost:3000/initialResources/${hospitalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...otherResources, blood_quantities })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            // alert('Resources saved successfully!');
            navigate(`/hospitalDashboard?id=${hospitalId}`);
        } catch (error) {
            console.error('Error saving resources:', error);
            alert('Error saving resources. Please try again.');
        }
    };

    return (
        <section className="vh-100" style={{ backgroundColor: '#eee' }}>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Hospital Resources</p>

                                <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-hospital fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <input
                                                type="number"
                                                id="opd_count"
                                                name="opd_count"
                                                className="form-control"
                                                value={resources.opd_count}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label className="form-label" htmlFor="opd_count">OPD Count</label>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row align-items-center mb-4">
                                        <i className="fas fa-bed fa-lg me-3 fa-fw"></i>
                                        <div className="form-outline flex-fill mb-0">
                                            <input
                                                type="number"
                                                id="bed_count"
                                                name="bed_count"
                                                className="form-control"
                                                value={resources.bed_count}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label className="form-label" htmlFor="bed_count">Bed Count</label>
                                        </div>
                                    </div>

                                    {bloodTypes.map((type) => (
                                        <div className="d-flex flex-row align-items-center mb-4" key={type}>
                                            <i className="fas fa-tint fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input
                                                    type="number"
                                                    id={`blood_quantity_${type}`}
                                                    name={type}
                                                    className="form-control"
                                                    value={resources.blood_quantities[type]}
                                                    onChange={handleBloodChange}
                                                    required
                                                />
                                                <label className="form-label" htmlFor={`blood_quantity_${type}`}>{`${type} Blood Quantity`}</label>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                        <button type="submit" className="btn btn-primary btn-lg">Save Resources</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HospitalResources;
