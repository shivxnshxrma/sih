import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Hero from '../Hero';
import Login from '../User/Login';
import Signup from '../User/SignUp';
import HospitalSignUp from '../Hospital/HospitalSignUp';
import HospitalLogin from '../Hospital/HospitalLogin';
import HospitalResources from '../Hospital/HospitalResources';
import HospitalDashboard from '../Hospital/HospitalDashboard';
import UserDashboard from '../User/UserDashboard';
const Navbar = () => {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/hospitalsignup" element={<HospitalSignUp />} />
        <Route path="/hospitallogin" element={<HospitalLogin />} />
        <Route path="/hospitalresources" element={<HospitalResources />} />
        <Route path="/hospitalDashboard" element={<HospitalDashboard />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  )
}

export default Navbar