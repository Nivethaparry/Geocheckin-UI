import React, { useState } from 'react';
import {Navbar,Container,Form,Button} from 'react-bootstrap';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



const AddNewUser = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    password:'',
    dateOfBirth: '',
    roleName: '',         
    designation: '',
    department: '',
    photoUrl: null
  });
const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photoUrl') {
      setFormData({ ...formData, photoUrl: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { userName, email, phoneNumber, dateOfBirth, password,roleName, designation, department, photoUrl } = formData;

  
  if (
    !userName ||
    !email ||
    !phoneNumber ||
    !dateOfBirth ||
    !password||
    !roleName ||
    !designation ||
    !department ||
    !photoUrl
  ) {
    toast('All fields are required. Please fill in every field.');
    return;
  }

    const userFormData = new FormData();

    Object.keys(formData).forEach(key => {
      userFormData.append(key, formData[key]);
    });

    try {
      await axios.post('https://localhost:7252/api/Auth/Register', userFormData);
      toast('User created successfully!');
    } catch (error) {
      console.error(error);
      toast('Failed to create user');
    }
  };

  return (
    <>
      <Container fluid
            style={{maxWidth: 400, backgroundColor: 'white',borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)',padding:'15px'}}>
      
            <Navbar variant="light" className="px-3 py-2 border-bottom" style={{ backgroundColor: 'white' }}>
               <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
              <Navbar.Brand className="mx-auto fw-medium">Add New User</Navbar.Brand>
            </Navbar>
        
      

        <div style={{maxWidth: 400, backgroundColor: 'white',borderRadius: '8',
                    height: '100vh', padding: '5px', margin:'5px'}}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" >
            <Form.Label className='fw-medium'>Name</Form.Label>
            <Form.Control
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Phone</Form.Label>
            <Form.Control
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Date of Birth</Form.Label>
            <Form.Control
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </Form.Group>

           <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>


          <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Role</Form.Label>
            <Form.Select
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              required
            >
             
              <option>Admin</option>
              <option>Employee</option>
            </Form.Select>
          </Form.Group>

          {formData.role === 'Admin' && (
            <Form.Text className="text-muted mb-2">
              You selected Admin role.
            </Form.Text>
          )}

          <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Designation</Form.Label>
            <Form.Select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required >
              <option>Select</option>
              <option>Junior Developer</option>
              <option>Senior Developer</option>
              <option>Team Lead</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className='fw-medium'>Department</Form.Label>
            <Form.Select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required>
              <option>Select</option>
              <option>IT Services</option>
              <option>UI/UX Design</option>
              <option>HR</option>
              <option>Marketing</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4 pb-3">
            <Form.Label className='fw-medium'>Photo</Form.Label>
            <Form.Control
              name="photoUrl"
              type="file"
              accept="image/*"
              onChange={handleChange}
            />

          <span className="d-grid mt-5 " >
            <Button type="submit" variant="dark">
              Save Changes
            </Button></span> 
            </Form.Group>
        </Form>
        </div>
      </Container>
       <div className='mt-5 mb-5 pt-5 '>
        <BottomNav role={formData.role} />
      </div> 
      
    </>
  );
};

export default AddNewUser