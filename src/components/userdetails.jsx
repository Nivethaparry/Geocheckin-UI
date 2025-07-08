import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Form, Button, Container, Card, Navbar , Nav } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { toast } from 'react-toastify';



const UserDetails = () => {
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user?.roleName);

    useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        toast.error('Authorization failed. Please log in again.');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:7252/api/Auth/basic-info/1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { userName, email, phoneNumber } = response.data;

        setUserData({
          userName: userName || '',
          email: email || '',
          phoneNumber: phoneNumber || '',
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error.response?.data || error.message);
        toast.error('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
console.log("Submitting userData:", userData);

  const handleSubmit = async (e) => {
    e.preventDefault();

     const { userName, email, phoneNumber } = userData;

  if (!userName || !email || !phoneNumber) {
    toast.error('Please fill in all fields.');
    return;
  }

  if (!token) {
    toast.error('Authorization failed. Please log in again.');
    return;
  }

    try {
      await axios.put(`https://localhost:7252/api/Auth/basic-info/1`,userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Profile updated successfully!');
      toast.success('Profile updated successfully!');

    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <>
    <div style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', maxWidth: '400px', margin: 'auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', fontFamily: 'sans-serif' }}>
        <Navbar bg="white" variant="light" className="px-3 py-2 shadow-sm" style={{ borderBottom: '1px solid #eee' }}>
          <div className="d-flex align-items-center w-100">
            <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
            <h5 className="mx-auto fw-semibold my-3">User Details</h5>
          </div>
        </Navbar>

        <Container fluid className="pt-5" style={{ paddingTop: '90px' }}>
          <h6 className="fw-bold mb-4">Personal Information</h6>
          <Card className="p-3 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <Form>
              <Form.Group className="mb-4" controlId="formName">
                <Form.Label className="fw-medium">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="userName"
                  value={userData.userName}
                  onChange={handleChange}
                  style={{ borderRadius: '12px', backgroundColor: '#ffff', border: '1px solid #ddd', padding: '10px' }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label className="fw-medium">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  style={{ borderRadius: '12px', backgroundColor: '#ffff', border: '1px solid #ddd', padding: '10px' }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPhone">
                <Form.Label className="fw-medium">Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  style={{ borderRadius: '12px', backgroundColor: '#ffff', border: '1px solid #ddd', padding: '10px' }}
                />
              </Form.Group>
            </Form>
          </Card>

          <Button
            variant="dark"
            onClick={handleSubmit}
            className="w-100 my-5"
            style={{ borderRadius: '12px', padding: '10px' }}
          >
            Save Changes
          </Button>

          <h6 className="fw-bold mt-4 mb-4">Security</h6>
          <div
            className="d-flex justify-content-between align-items-center border p-2 px-3 mb-5 shadow-sm"
            style={{ backgroundColor: '#ffff', borderRadius: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/changePassword')}
          >
            <span className="fw-medium text-muted">Change Password</span>
            <span className="text-muted">→</span>
          </div>

          
        </Container>
      </div>
    </div>
    <BottomNav role={role} />
    </>
  );
};

export default UserDetails;


