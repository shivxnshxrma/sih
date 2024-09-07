import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const HospitalSignUp = () => {
    const navigate = useNavigate();
    const [hospitalName, setHospitalName] = useState('');
    const [hospitalEmail, setHospitalEmail] = useState('');
    const [hospitalPassword, setHospitalPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const [errors, setErrors] = useState({});

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};

        if (!hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
        if (!hospitalEmail) {
            newErrors.hospitalEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(hospitalEmail)) {
            newErrors.hospitalEmail = 'Email is invalid';
        }
        if (!hospitalPassword) {
            newErrors.hospitalPassword = 'Password is required';
        } else if (hospitalPassword.length < 6) {
            newErrors.hospitalPassword = 'Password must be at least 6 characters';
        }
        if (!address.trim()) newErrors.address = 'Address is required';
        if (!city.trim()) newErrors.city = 'City is required';
        if (!state.trim()) newErrors.state = 'State is required';
        if (!pincode) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(pincode)) {
            newErrors.pincode = 'Pincode must be a valid 6-digit number';
        }
        if (!contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (!/^\d{10}$/.test(contactNumber)) {
            newErrors.contactNumber = 'Contact number must be a valid 10-digit number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const hospital = {
            hospital_name: hospitalName,
            hospital_email: hospitalEmail,
            hospital_password: hospitalPassword,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            contact_number: contactNumber
        };

        try {
            const response = await fetch('http://localhost:3000/registerHospital', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(hospital),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            alert('Hospital registered successfully!');
            setHospitalName('');
            setHospitalEmail('');
            setHospitalPassword('');
            setAddress('');
            setCity('');
            setState('');
            setPincode('');
            setContactNumber('');
            navigate(`/hospitalresources?id=${data.hospitalId}`);

        } catch (error) {
            console.error('Error registering hospital:', error);
            alert('Error registering hospital. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register Hospital</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="hospitalName" className="form-label">Hospital Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="hospitalName"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                    />
                    {errors.hospitalName && <small className="text-danger">{errors.hospitalName}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="hospitalEmail" className="form-label">Hospital Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="hospitalEmail"
                        value={hospitalEmail}
                        onChange={(e) => setHospitalEmail(e.target.value)}
                    />
                    {errors.hospitalEmail && <small className="text-danger">{errors.hospitalEmail}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="hospitalPassword" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="hospitalPassword"
                        value={hospitalPassword}
                        onChange={(e) => setHospitalPassword(e.target.value)}
                    />
                    {errors.hospitalPassword && <small className="text-danger">{errors.hospitalPassword}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <small className="text-danger">{errors.address}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    {errors.city && <small className="text-danger">{errors.city}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                        type="text"
                        className="form-control"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    {errors.state && <small className="text-danger">{errors.state}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                    />
                    {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
                </div>

                <div className="mb-3">
                    <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="contactNumber"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                    />
                    {errors.contactNumber && <small className="text-danger">{errors.contactNumber}</small>}
                </div>

                <button type="submit" className="btn btn-primary">Register Hospital</button>
            </form>
        </div>
    );
};

export default HospitalSignUp;
