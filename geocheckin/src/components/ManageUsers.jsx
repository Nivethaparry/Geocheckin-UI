import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Card, InputGroup, FormControl, Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { IoMdSearch } from "react-icons/io";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://your-backend-api.com/api/users'); 
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
    if (filter === 'Active') return user.status?.toLowerCase() === 'active';
    if (filter === 'Inactive') return user.status?.toLowerCase() === 'inactive';
    if (filter === 'Manager') return user.role?.toLowerCase() === 'manager';
    return true;
  })
  .filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid style={{ maxWidth: 400, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)', height: '100vh', padding: 0 }}>
     
      <Navbar variant="light" className="px-3 py-2 border-bottom" style={{backgroundColor: 'white'}}>
         <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
        <Navbar.Brand className="mx-auto">Manage Users</Navbar.Brand>
      </Navbar>

     
      <div className="px-3 pt-3">
        <InputGroup className="mb-3 rounded" style={{ backgroundColor: '#f2f2f2' }}>
        <span style={{fontSize:'20px', marginLeft:'10px'}}><IoMdSearch /></span>
          <FormControl 
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', backgroundColor: '#f2f2f2' }}
          />
        </InputGroup>

       
<div className="d-flex gap-2 px-3 mb-3 mt-4">
  {['All', 'Active', 'Inactive', 'Manager'].map((key) => (
    <Button
      key={key}
      variant={filter === key ? 'primary' : 'light'}
      onClick={() => setFilter(key)}
      style={{
        borderRadius: '999px',
        fontWeight: '500',
        padding: '6px 16px',
        backgroundColor: filter === key ? '#1A73E8' : '#f1f1f1',
        color: filter === key ? '#fff' : '#000',
        border: 'none'
      }}
    >
      {key}
    </Button>
  ))}
</div>

      </div>

      <div style={{ overflowY: 'auto', padding: '0 1rem', maxHeight: 'calc(100vh - 200px)' }}>
        {filteredUsers.map((user, idx) => (
          <Card key={idx} className="mb-2 border-0">
            <Card.Body className="d-flex align-items-center px-0 py-2">
              <img
                src={user.image || ``}
                alt="image"
                style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', marginRight: 10 }}
              />
              <div className="flex-grow-1"  style={{ borderBottom: '1px solid #eee', maxwidth:'400px' }}>
                <div style={{ fontWeight: '600' }}>{user.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{user.role}</div>
              </div>
              <BsThreeDotsVertical color="#888" />
            </Card.Body>
          </Card>
        ))}
      </div>

     
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderTop: '1px solid #ddd'
      }}>
        <Button variant="dark" className="w-100 d-flex align-items-center justify-content-center">
          <FaPlus className="me-2" /> Add New User
        </Button>
      </div>
    </Container>
  );
};

export default ManageUsers;

