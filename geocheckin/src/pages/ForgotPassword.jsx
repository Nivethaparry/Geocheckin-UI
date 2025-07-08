import React, { useState } from 'react';
import { Form, Button, Container,Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap';


  const ForgotPassword = () =>  {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);    
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    

try {
  const response = await axios.post(
    'https://localhost:7252/api/Auth/ForgotPassword',{ email },{headers: {'Content-Type': 'application/json',},}
  );

  console.log("API response:", response.data);
  setMessage('OTP sent to your registered email');
  
  navigate('/otp', { state: { email } });
} catch (error) {
  setError(error.response?.data?.message || 'Failed to send OTP');
} finally {
  setLoading(false);
}
    }
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Card className="bg-white p-5 p-mt-5 rounded-4 border-0" style={{ width:" 400px" }}>
       <div  style={{ maxWidth: '600px'}}>
       <h3 className='text-center mb-1'>Forgot Password</h3>
       <br></br>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group >
          <Form.Control
            type="email"
            placeholder="Enter your mail ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <br></br>
           <Button variant="dark" type="submit" className="w-100">
              {loading ? 'Sending OTP...' : 'Send OTP'}
           </Button>
      </Form>
      </div>
      </Card>
    </Container>
  );
}

export default ForgotPassword;
