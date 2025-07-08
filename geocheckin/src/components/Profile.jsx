
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { GoPencil } from "react-icons/go";
import image from '../assets/image.png'


const Profile = () => {

    const [user, setUser] = useState({
    image: 'image',
    name: 'Ethan Carter',
    role: 'Admin'
  });


  const dispatch = useDispatch();
  const navigate = useNavigate();
//   const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(loginUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigateTo = (path) => () => navigate(path);


  return (
    <Container fluid className="d-flex align-item-center mt-5 mb-5" style={{fontFamily: " sans-serif" }}>
         <div className=" profile-wrapper ">
         <div className="d-flex align-items-center pb-3 mb-5"  style={{ borderBottom: '0.5px solid #ced4da' }}>
          <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
          <h4 className="mx-auto">Settings</h4>
         </div>
    
     {user && (
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <img src={image} alt='image' className="rounded-circle" width="110" height="110" />
            <span className="position-absolute top-100 end-0 translate-middle badge bg-dark rounded-pill" style={{ cursor: 'pointer' }}>
             <GoPencil />
            </span>
          </div>
          <h5 className="mt-4">{user.name}</h5>
          <small className="text-muted">{user.role}</small>
        </div>
      )}

      <div>
  <h6 className="mb-2 fw-bold">Account</h6>
  <div className="list-group mb-4 rounded border">
    <p
      className="list-group-item list-group-item-action border-0 border-bottom pb-3 mt-2"
      onClick={() => navigate('/userdetails')}
    >
      Update Profile
    </p>
    <p
      className="list-group-item list-group-item-action border-0 p-1 px-3 "
      onClick={() => navigate('/change-password')}
    >
      Change Password
    </p>
  </div>

  <h6 className="mb-2 fw-bold">Support</h6>
  <div className="list-group rounded border">
    <p
      className="list-group-item list-group-item-action border-0 border-bottom pb-3 mt-2"
      onClick={() => navigate('/help-center')}
    >
      Help Center
    </p>
    <p
      className="list-group-item list-group-item-action border-0 p-1 px-3"
      onClick={() => navigate('/contact-us')}
    >
      Contact Us
    </p>
  </div>
</div>


     <Button variant="light" className="w-100 mt-4" onClick={handleLogout}>
        Log Out
      </Button>
</div>
    </Container>
  );
};

export default Profile