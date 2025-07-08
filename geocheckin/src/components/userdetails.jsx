import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Navbar } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        const { name, email, phone } = response.data;
        setUserData({
          name: name || '',
          email: email || '',
          phone: phone || '',
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/user/profile', userData); 
      console.log('Profile updated successfully!');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f6f6f6', minHeight:'100vh', maxWidth: '400px',margin:'auto', display:'flex',justifyContent:'center'}}>
      <div style={{ width: '100%', maxWidth: '400px',fontFamily: 'sans-serif' }}>
      <Navbar
        bg="white"
        variant="light"
        className="px-3 py-2 shadow-sm"
        style={{ borderBottom: '1px solid #eee', maxwidth:'400px' }}
      >
        <div className="d-flex align-items-center w-100" style={{maxwidth:'400px'}}>
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <h5 className="mx-auto  fw-semibold my-3">User Details</h5>
        </div>
      </Navbar>

    
      <Container fluid
        className="pt-5"
        style={{
          maxWidth: '400px',
          paddingTop: '90px',
          fontFamily: 'sans-serif',
        }}
      >
        <h6 className="fw-bold mb-4">Personal Information</h6>

        <Card className="p-3 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formName">
              <Form.Label className="fw-medium">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                name="name"
                value={userData.name}
                onChange={handleChange}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffff',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formEmail">
              <Form.Label className="fw-medium">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="john.doe@example.com"
                name="email"
                value={userData.email}
                onChange={handleChange}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffff',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPhone">
              <Form.Label className="fw-medium">Phone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+1234567890"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                style={{
                  borderRadius: '12px',
                  backgroundColor: '#ffff',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
              />
            </Form.Group>
          </Form>
        </Card>


        <h6 className="fw-bold mt-5 mb-4">Security</h6>
        <div
          className="d-flex justify-content-between align-items-center border p-2 px-3 mb-5 shadow-sm"
          style={{
            backgroundColor: '#ffff',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/changePassword')}
        >
          <span className="fw-medium text-muted">Change Password</span>
          <span className="text-muted">→</span>
        </div>

        <Button
          variant="dark"
          type="submit"
          onClick={handleSubmit}
          className="w-100 my-5"
          style={{ borderRadius: '12px', padding: '10px' }}
        >
          Save Changes
        </Button>
      </Container>
    </div>
    </div>
  );
};

export default UserDetails;

