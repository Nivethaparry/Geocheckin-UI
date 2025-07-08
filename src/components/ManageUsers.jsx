import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Card, InputGroup, FormControl, Tab, Tabs, Container,Dropdown, Row, Col } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { IoMdSearch } from "react-icons/io";
import image from '../assets/image.png'
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useSelector } from 'react-redux'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ManageUsers = () => { 
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showDatePickerForUser, setShowDatePickerForUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);
  const role = useSelector((state) => state.auth.user?.roleName);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://localhost:7252/api/Role/GetAllRoles'); 
        console.log('Fetched users:', res.data); 
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      if (filter === 'All') return true;
      return user.roleName?.toLowerCase() === filter.toLowerCase();
    })
    .filter((user) => {
      if (statusFilter === "All") return true;
      if (statusFilter === "Active") return user.active === true;
      if (statusFilter === "Inactive") return user.active === false;
  return true;
})

    .filter((user) =>
      user.username?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <Container fluid style={{ maxWidth: 400, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                   height: '100vh', padding: 0, position: 'relative', }}>
        <Navbar
          variant="light"
          className="px-3 py-2 border-bottom"
          style={{ backgroundColor: 'white' }} >
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <Navbar.Brand className="mx-auto">Manage Users</Navbar.Brand>
          </Navbar>

        <div className="px-3 pt-3">
          <InputGroup className="mb-3 rounded" style={{ backgroundColor: '#f2f2f2' }}>
            <span style={{ fontSize: '20px', marginLeft: '10px' }}>
              <IoMdSearch />
            </span>
            <FormControl
              placeholder="Search users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', backgroundColor: '#f2f2f2' }} />
          </InputGroup>

          <div className=" d-flex justify-content-between px-3 mb-3 mt-4">
            <Dropdown>
              <Dropdown.Toggle
                  variant="light"
                  style={{
                        borderRadius: '999px',
                        fontWeight: 500,
                        padding: '6px 16px',
                        backgroundColor: '#f1f1f1',
                        color: '#000',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left'}}>
                       Users
              </Dropdown.Toggle>


              <Dropdown.Menu>
                {[ 'Admin', 'Employee'].map((key) => (
                  <Dropdown.Item key={key} onClick={() => {
                    setFilter(key);
                    setStatusFilter('All'); 
                  }}>
                {key}
              </Dropdown.Item>

                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown >
              <Dropdown.Toggle
                variant="light"
                style={{
                  borderRadius: '999px',
                  fontWeight: 500,
                  padding: '6px 16px',
                  backgroundColor: '#f1f1f1',
                  color: '#000',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                Status
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[  'Active', 'Inactive'].map((status) => (
                  <Dropdown.Item
                  key={status}
                     onClick={() => {
                     setStatusFilter(status);
                    setFilter('All'); 
                  }}>
                {status}
                </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div
          style={{ overflowY: 'auto', padding: '0 1rem', maxHeight: 'calc(100vh - 200px)',paddingBottom: '120px', }}>
          {filteredUsers.map((userItem, idx) => (
            <Card key={idx} className="mb-2 border-0">
              <Card.Body className="d-flex align-items-center px-0 py-2">
                <img src={userItem.image ? userItem.image : image} alt="user"
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', marginRight: 10, }} />

                <div
                  className="flex-grow-1"
                  style={{ borderBottom: '1px solid #eee', maxWidth: '400px' }}>
                  <div style={{ fontWeight: '600' }}>{userItem.username}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{userItem.roleName}</div>
                </div>

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    bsPrefix="p-0 border-0 bg-transparent"
                    style={{ color: "#888" }}>
                    <BsThreeDotsVertical color="#888" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/edituser")}>
                      Edit user profile 
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        console.log("Clicked user:", userItem);
                        setShowDatePickerForUser(userItem.userId); 
                     }}>
                    Attendance
                    </Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown>
              </Card.Body>
            </Card>
          ))}
        </div>

          {showDatePickerForUser && (
          <div style={{
              position: "fixed",
               top: 0, left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 1999,
               border: '2px solid red'
          }}
          onClick={() => setShowDatePickerForUser(null)}
          >
          <div
            onClick={(e) => e.stopPropagation()} 
            style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 2000,
      }}
    >
      <h5 className="mb-3">Select a date</h5>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
        className="form-control"
      />
      <div className="d-flex justify-content-end mt-3">
        <Button variant="secondary" onClick={() => setShowDatePickerForUser(null)} className="me-2">
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            navigate(`/map/${showDatePickerForUser}/${formattedDate}`);
            setShowDatePickerForUser(null);
          }}
        >
          View Map
        </Button>
      </div>
    </div>
  </div>
)}

        <div
          style={{position: 'fixed', bottom: 120, left: '50%', transform: 'translateX(-50%)', width: '100%',
                   maxWidth: 400, padding: '10px 20px', zIndex: 1000, }} >
          <Button
            variant="dark"
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ borderRadius: 10 }}
            onClick={() => navigate('/addnewuser')} >
            <FaPlus className="me-2" /> Add New User
          </Button>
        </div>

        <div
          style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                       width: '100%', maxWidth: 400, backgroundColor: '#fff', borderTop: '1px solid #ddd',  zIndex: 999, }} />
      </Container>
      <BottomNav role={role} />
    </>
  );
};

export default ManageUsers;

