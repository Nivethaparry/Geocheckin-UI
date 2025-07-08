import React from 'react';
import './App.css';
import './index.css'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ForgotPassword from './pages/ForgotPassword';
import OTPPage from './pages/OTPPage';
import ResetPassword from './pages/ResetPassword';
import AttendanceDashboard from './components/AttendanceDashboard';
import Profile from './components/Profile';
import UserDetails from './components/userdetails'
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ChangePassword from './pages/ChangePassword' ;
import AddNewUser from './components/AddNewUser';
import EditUser from './components/EditUser';
import ManageRole from './components/ManageRole';
import MapComponent from './components/MapComponent';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


function App() {
   
  const user = useSelector((state) => state.auth.user);
  const role = user?.roleName;

 
  const RequireAdmin = ({ children }) => {
    return role === 'Admin' ? children : <Navigate to="/attendancedashboard" />;
  };


  return(  
    
    <Router>
      <Routes>
        <Route path="/" element= { <LoginForm />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        <Route path="/attendancedashboard" element ={<AttendanceDashboard/>} />
        <Route path="/profile" element ={<Profile/>} />
        <Route path="/userdetails" element ={<UserDetails/>} />
         <Route path= "/changepassword" element={<ChangePassword />} />
         
        <Route path="/admindashboard" element ={  <RequireAdmin> <AdminDashboard />  </RequireAdmin> } />
        <Route path="/manageusers" element={  <RequireAdmin> <ManageUsers />  </RequireAdmin>} />
        <Route path="/addnewuser" element={ <RequireAdmin> <AddNewUser />  </RequireAdmin>} />
        <Route path="/edituser" element={ <RequireAdmin> <EditUser />  </RequireAdmin>} />
        <Route path="/manageRole" element={ <RequireAdmin> <ManageRole />  </RequireAdmin>} />
        <Route path="/map/:userId/:date" element={<MapComponent />} />
   
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
   
    </Router>

    
  )
}

export default App;
