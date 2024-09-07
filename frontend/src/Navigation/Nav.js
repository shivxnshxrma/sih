import react from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignUp from '../Components/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';


const Nav = () =>{

    return (<>
    <Router>
        <Routes>
            <Route path='/' element={<SignUp/>}></Route>
        </Routes>
    </Router>
        </>
      );

}

export default Nav;