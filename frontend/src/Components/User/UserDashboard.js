import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');

  // Fetch hospitals data from the backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/hospitals'); // Adjust the API endpoint
        setHospitals(response.data);
        setFilteredHospitals(response.data);
        
        // Extract unique cities and states
        const uniqueCities = [...new Set(response.data.map(hospital => hospital.city))];
        const uniqueStates = [...new Set(response.data.map(hospital => hospital.state))];
        setCities(uniqueCities);
        setStates(uniqueStates);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };

    fetchHospitals();
  }, []);

  // Filter hospitals based on selected city and state
  useEffect(() => {
    let filtered = hospitals;

    if (selectedCity) {
      filtered = filtered.filter(hospital => hospital.city === selectedCity);
    }

    if (selectedState) {
      filtered = filtered.filter(hospital => hospital.state === selectedState);
    }

    setFilteredHospitals(filtered);
  }, [selectedCity, selectedState, hospitals]);

  // Inline styles for hover effect
  const tableRowStyle = {
    transition: 'background-color 0.3s ease'
  };

  const hoverStyle = {
    backgroundColor: '#f5f5f5'
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Hospitals In Your Area</h1>

      {/* Dropdowns for filtering */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">Filter by City</label>
          <select 
            id="city" 
            className="form-select" 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value=''>All Cities</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="col-md-6">
          <label htmlFor="state" className="form-label">Filter by State</label>
          <select 
            id="state" 
            className="form-select" 
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value=''>All States</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Table to display hospitals */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Hospital Name</th>
              <th>City</th>
              <th>Address</th>
              <th>State</th>
              <th>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.map((hospital, index) => (
              <tr 
                key={index}
                style={tableRowStyle}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <td>{hospital.hospital_name}</td>
                <td>{hospital.city}</td>
                <td>{hospital.address}</td>
                <td>{hospital.state}</td>
                <td>{hospital.contact_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
