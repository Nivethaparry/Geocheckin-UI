import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Image, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';

const EditUser = () => {
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);
  const navigate = useNavigate();
  

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
 const [formData, setFormData] = useState({
  userName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  roleName: '',
  designation: '',
  department: '',
  photoUrl: null,
});

  useEffect(() => {
  if (!userId) return;

  const fetchAndUpdateUser = async () => {
    try {
     
      const res = await axios.get(`https://localhost:7252/api/Auth/profile/1`);
      const user = res.data;

      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        roleName: user.roleName || '',
        designation: user.designation || '',
        department: user.department || '',
        photoUrl: null,
      });

     

    } catch (error) {
      setToastVariant('danger');
      setToastMessage('Error fetching user details');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  fetchAndUpdateUser();
}, [userId]);

const handleChange = (e) => {
  const { name, value, files } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: name === 'photo' ? files[0] : value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const { userName, email, phoneNumber, dateOfBirth, roleName, designation, department, } = formData;

  if (!userName || !email || !phoneNumber || !dateOfBirth || !roleName || !designation || !department ) {
    setToastVariant('danger');
    setToastMessage('All fields are required.');
    setShowToast(true);
    return;
  }

  try {
    const userFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      userFormData.append(key, formData[key]);
    });

    await axios.put(`https://localhost:7252/api/Auth/update-profile`, userFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setToastVariant('success');
    setToastMessage('Profile updated successfully!');
    setShowToast(true);
  } catch (err) {
    console.error(err);
    setToastVariant('danger');
    setToastMessage('Update failed.');
    setShowToast(true);
  }
}

const handleUpdatePhoto = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const photoData = new FormData();
  photoData.append("photo", file);

  try {
    await axios.put(`https://localhost:7252/api/Auth/update-photo/${userId}`, photoData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setToastVariant("success");
    setToastMessage("Photo updated successfully!");
    setShowToast(true);

   
    setFormData((prev) => ({
      ...prev,
      photoUrl: URL.createObjectURL(file),
    }));
  } catch (error) {
    console.error(error);
    setToastVariant("danger");
    setToastMessage("Failed to update photo.");
    setShowToast(true);
  }
};


const handleRemovePhoto = async () => {
  try {
    await axios.delete(`https://localhost:7252/api/Auth/remove-photo/${userId}`);
    setToastVariant("success");
    setToastMessage("Photo removed successfully!");
    setShowToast(true);

    
    setFormData((prev) => ({
      ...prev,
      photoUrl: null,
    }));
  } catch (error) {
    console.error(error);
    setToastVariant("danger");
    setToastMessage("Failed to remove photo.");
    setShowToast(true);
  }
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border"/>
      </div>
    );
  }

  return (
    <>
    <Container fluid style={{ backgroundColor: "#ffffff", minHeight: "100vh", maxWidth: "400px", 
                                     margin: "0 auto", padding: "0", fontFamily: "sans-serif" }}>
      <div className='mt-4 , pb-4' style={{ display: "flex", alignItems: "center", padding: "12px 16px",  borderBottom: "1px solid #ddd" }} >
        <ArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h6 style={{ flex: 1, textAlign: "center", margin:0, fontSize: 25,fontWeight: 700}}>User Profile</h6>
      </div>

      <div className='mt-5 mb-4 ms-3' style={{ display: "flex", gap:"70px", alignItems: "start", justifyContent: "start"}} >
  
   <Image src=" https://localhost:7252/uploads/ef553a4b-5bb8-4949-9f9f-de76401826e7.jpg" roundedCircle width={80} height={80} style={{ objectFit: "cover" }} alt='image' />

    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
     <Button size="sm" style={{ backgroundColor: "#000",  borderColor: "#000", width: "200px",borderRadius: "8px"}}  onClick={() => document.getElementById("photoInput").click()}>
         Update Photo
     </Button>
    <Button size="sm" variant="light" 
      style={{
        border: "1px solid #000",
        color: "#000",
        width: "200px",
        borderRadius: "8px"}} 
        onClick={handleRemovePhoto}
        >
      Remove Photo
    </Button>
    <input
            type="file"
            accept="image/*"
            onChange={handleUpdatePhoto}
            style={{ display: "none" }}
            id="photoInput"
          />
  </div>
</div>

      <Form onSubmit={handleSubmit} style={{ padding: "0 16px"}} >
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 700 }}>Name</Form.Label>
          <Form.Control
              name="name"
              value={formData.userName}
              onChange={handleChange}/>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 700 }}>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}/>

        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 700 }}>Phone</Form.Label>
          <Form.Control
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}/>

        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 700 }}>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange} />

        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 700 }}>Role</Form.Label>
          <Form.Control
            name="roleName"
            value={formData.roleName}
            readOnly />

        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontWeight: 700 }}>Designation</Form.Label>
          <Form.Control
            name="designation"
            value={formData.designation}
            onChange={handleChange}/>

        </Form.Group>
        <Form.Group className="mb-5">
          <Form.Label style={{ fontWeight: 700 }}>Department</Form.Label>
          <Form.Control
            name="department"
            value={formData.department}
            onChange={handleChange}/>

        </Form.Group>
        <Button type="submit"
          style={{
            backgroundColor: "#000",
            borderColor: "#000",
            borderRadius: "4px",
            width: "100%",
            marginBottom: "30px" }}>
          Update Profile
        </Button>
      </Form>
    </Container>
    <ToastContainer position="bottom-end" className="p-3">
     <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        bg={toastVariant}
        delay={3000}
        autohide >
    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
  </Toast>
</ToastContainer>
   <BottomNav role={formData.role} />
    </>
  );
};


export default EditUser;
