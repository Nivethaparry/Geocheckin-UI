import React, { useState } from 'react';
import { Form, Button, Container,Card, Alert} from 'react-bootstrap';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';


const OTPPage = () => {
   
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);  
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state?.email;
    
      const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
        
       try {
      const response = await axios.post('https://localhost:7252/api/Auth/VerifyOtp', {email,otp});
      console.log("API response:", response.data);
      setMessage('OTP verified successfully');

      navigate('/resetpassword', { state: { email } });
      
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Card className="bg-white p-5 p-mt-5 rounded-4 border-0" style={{ width:" 400px" }}>
         <div style={{ maxWidth: '600px' }}>
         <h3 className='text-center mb-3'>Enter OTP</h3>

        {message && <Alert variant="success">{message}</Alert>}
         {error && <Alert variant="danger">{error}</Alert>}

       <Form  onSubmit={handleSubmit}>
         <Form.Group controlId="otp" className="mb-4">
           <Form.Control
              type="number"
              placeholder="Enter OTP"
              value = {otp}
              onChange={ (e) => setOtp(e.target.value)}
              required />
        </Form.Group>
           <Button variant="dark" type="submit" className="w-100"  disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
           </Button>
      </Form>
      </div>
      </Card>
    </Container>
  );
};

export default OTPPage;
