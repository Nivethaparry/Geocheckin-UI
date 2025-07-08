import React, { useEffect } from 'react';
import {Container,Form,Row,Col,Button,Card} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { IoMdInformationCircleOutline } from "react-icons/io";

const LoginForm = () => {

  const dispatch = useDispatch();
  const {loading, error, token } = useSelector((state) => state.auth);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);


  useEffect(() => {
    if(token) { 
      navigate ('/attendancedashboard');
    }
  },[token,navigate]);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ userName, password, rememberMe }));
  };
   
   const handleUserChange  = (e) => {
    setUserName(e.target.value);
    if (error) {
      dispatch(clearError());
    }
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) dispatch(clearError());
  };

    return (
    <Container fluid className=" d-flex align-items-center justify-content-center vh-100" style={{fontFamily: " sans-serif" }}>
       <Card className="bg-white p-5 p-mt-5 rounded-4 border-0" style={{ width:" 400px" }}>
         <div className="text-center mb-4">
           <IoMdInformationCircleOutline style={{fontSize:"2rem"}}/>
           <h3 className="mt-3 mb-1 fw-bold" >Employee Attendance</h3>
           <p className="text-muted mb-0">Sign in to your account</p>
         </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group  className="mb-4 rounded input-box-wrapper">
            <Form.Control type="text" className=" input-box bg-light p-2" placeholder="User ID" value ={userName} onChange={handleUserChange} />
            <Form.Control type="password" placeholder="Password" className=" input-box bg-light p-2" value ={password} onChange={handlePasswordChange}/>
          </Form.Group> 
           
            <Row className="mb-4 p=0 ms-auto">
            <Col xs="6 p-0" >
              <Form.Check type="checkbox" label="Remember me" className='fw-bold ' style={{ fontSize: '12px' }} checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
            </Col>
            <Col xs="6 p-0" className="text-center">
               <Link to='/forgotPassword' className="text-decoration-none small text-dark fw-bold" style={{ fontSize: '12px' }}>
                Forgot your password?
               </Link>
            </Col>
          </Row>
              {error && <div className = "alert alert-danger mt-2">{error}</div>}
            <Button type="submit" variant="dark" className="dark w-100 py-2 rounded-3" disabled={loading}>
               {loading ?'logging in...' : 'Login'}
            </Button>
         </Form>
       </Card>
     </Container>
   );
 };

export default LoginForm;


 