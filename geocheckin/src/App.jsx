import React from 'react';
import './App.css';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/attendancedashboard" element ={<AttendanceDashboard/>} />
        <Route path="/profile" element ={<Profile/>} />
        <Route path="/userdetails" element ={<UserDetails/>} />
        <Route path="/admindashboard" element ={<AdminDashboard />} />
        <Route path="/manageusers" element={<ManageUsers />} />
        <Route path= "/changepassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  )
}

export default App;
