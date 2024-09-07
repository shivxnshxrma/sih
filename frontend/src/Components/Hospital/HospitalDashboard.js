import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';


const HospitalDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract hospitalId from the query string
    const queryParams = new URLSearchParams(location.search);
    const hospitalId = queryParams.get('id');
    // Modal state
  const [showModal, setShowModal] = useState(false);
  
  const [resources, setResources] = useState({
    icu_beds: 0,
    general_beds: 0,
    emergency_beds: 0,
    blood_quantities: {}
  });

  const [bedQuantities, setBedQuantities] = useState({
    icu: resources.icu_beds || 0,
    general: resources.general_beds || 0,
    emergency: resources.emergency_beds || 0
  });
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState({
    name: '',
    id: '',
    age: '',
    gender: '',
    condition: '',
    bedType: ''
  });

  useEffect(() => {
   
    fetchResources();
  }, [hospitalId]);

  const fetchResources = async () => {
    try {
      const response = await fetch(`http://localhost:3000/hospitalResources?id=${hospitalId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setResources({
        icu_beds: data.icu_beds,
        general_beds: data.general_beds,
        emergency_beds:data.emergency_beds,
        blood_quantities: data.blood_quantities
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdmitPatient = async (e) => {
    e.preventDefault();
  
    const data = {
      patient_name: patientData.name,
      patient_id: patientData.id,
      patient_age: patientData.age,
      gender: patientData.gender,
      patient_condition: patientData.condition,
      bed_type: patientData.bedType,
      hospital_id: hospitalId 
    };
  
    try {
      const response = await fetch('http://localhost:3000/admitPatient', { // Adjust the URL here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Patient admitted successfully:', result.message);
        // Optionally, show a success message to the user
      } else {
        const error = await response.json();
        console.error('Error admitting patient:', error.error);
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  
    // Reset form after submission
    setPatientData({
      name: '',
      id: '',
      age: '',
      gender: '',
      condition: '',
      bedType: ''
    });
  };
  
  

  const handleBedQuantityChange = (e) => {
    const { name, value } = e.target;
    setBedQuantities((prevState) => ({
      ...prevState,
      [name]: parseInt(value)
    }));
  };

  const handleUpdateBeds = async () => {
    try {
      // Make the PUT request to update bed quantities in the database
      const response = await fetch(`http://localhost:3000/updateResources?id=${hospitalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          icu_count: bedQuantities.icu + resources.icu_beds,
          general_count: bedQuantities.general + resources.general_beds,
          emergency_count: bedQuantities.emergency + resources.emergency_beds
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update hospital resources');
      }
  
      const result = await response.json();
      console.log(result.message);
  
      fetchResources();
  
      setShowModal(false); // Close modal after updating
    } catch (error) {
      console.error('Error updating hospital resources:', error);
      // Handle error (e.g., show a notification or alert)
    }
  };
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Hospital Management System</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Patients</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Staff</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Settings</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h2 className="mb-4">Dashboard</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header bg-dark text-light">Patient Queue</div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Appointment Time</th>
                      <th>Triage</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe<br/>ID: 12345</td>
                      <td>10:30 AM</td>
                      <td>Urgent</td>
                      <td><span className="badge bg-danger">High</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline-dark me-1">Edit</button>
                        <button className="btn btn-sm btn-outline-danger">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6">
  <div className="card mb-4">
    <div className="card-header bg-dark text-light">Bed Availability</div>
    <div className="card-body">
      <div className="row">
        <div className="col-md-4 d-flex align-items-stretch">
          <div className="card h-100 w-100">
            <div className="card-body text-center">
              <h5 className="card-title">ICU Beds</h5><br></br>
              <p className="card-text display-4">{resources.icu_beds || 0}</p>
              <p className="text-muted">Available</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-stretch">
          <div className="card h-100 w-100">
            <div className="card-body text-center">
              <h5 className="card-title">General Ward</h5>
              <p className="card-text display-4">{resources.general_beds || 0}</p>
              <p className="text-muted">Available</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-stretch">
          <div className="card h-100 w-100">
            <div className="card-body text-center">
              <h5 className="card-title">Emergency Beds</h5>
              <p className="card-text display-4">{resources.emergency_beds || 0}</p>
              <p className="text-muted">Available</p>
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-dark mt-3" onClick={() => setShowModal(true)}>+ Add Bed</button>
    </div>
  </div>
</div>

        </div>
        <div className="card mt-4">
          <div className="card-header bg-dark text-light"><h3 className="card-title d-flex justify-content-between align-items-center">
              Patient Admission
            </h3></div>
          <div className="card-body">
            
            <form onSubmit={handleAdmitPatient}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="patientName" className="form-label">Patient Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="patientName"
                    name="name"
                    placeholder="Enter patient name"
                    value={patientData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="patientId" className="form-label">Patient ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="patientId"
                    name="id"
                    placeholder="Enter patient ID"
                    value={patientData.id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="patientAge" className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="patientAge"
                    name="age"
                    placeholder="Enter patient age"
                    value={patientData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="patientGender" className="form-label">Gender</label>
                  <select
                    className="form-select"
                    id="patientGender"
                    name="gender"
                    value={patientData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="patientCondition" className="form-label">Condition</label>
                  <textarea
                    className="form-control"
                    id="patientCondition"
                    name="condition"
                    placeholder="Enter patient condition"
                    value={patientData.condition}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="bedType" className="form-label">Bed Type</label>
                  <select
                    className="form-select"
                    id="bedType"
                    name="bedType"
                    value={patientData.bedType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select bed type</option>
                    <option value="icu">ICU</option>
                    <option value="general">General Ward</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div className="text-end mt-3">
                <button type="submit" className="btn btn-dark">Admit Patient</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal for Updating Bed Quantities */}
      <div className={`modal ${showModal ? 'd-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Bed Quantities</h5>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="icuBeds" className="form-label">ICU Beds</label>
                <input type="number" className="form-control" id="icuBeds" name="icu" value={bedQuantities.icu} onChange={handleBedQuantityChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="generalBeds" className="form-label">General Beds</label>
                <input type="number" className="form-control" id="generalBeds" name="general" value={bedQuantities.general} onChange={handleBedQuantityChange} />
              </div>
              <div className="mb-3">
                <label htmlFor="emergencyBeds" className="form-label">Emergency Beds</label>
                <input type="number" className="form-control" id="emergencyBeds" name="emergency" value={bedQuantities.emergency} onChange={handleBedQuantityChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-dark" onClick={handleUpdateBeds}>Save changes</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalDashboard;