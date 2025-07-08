import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiUsers,
  FiSettings,
  FiHome,
  FiBarChart2,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    rolesCount: 0,
    todayAttendance: '',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/dashboard/summary');
        const { totalUsers, rolesCount, presentToday, totalEmployees } = res.data;
        setDashboardData({
          totalUsers,
          rolesCount,
          todayAttendance: `${presentToday}/${totalEmployees}`,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div
      style={{backgroundColor: '#ffff',minHeight: '100vh',fontFamily: 'sans-serif',fontSize: '20px'}}
    >
     
      <Navbar
        bg="white"
        variant="light"
        className="shadow-sm justify-content-between px-3"
        style={{
           padding: '10px' ,
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%',
          fontSize: '20px',
          borderBottom: '1px solid #dee2e6',
        }}
      >
        <Navbar.Text className="fw-bold mx-auto">Dashboard</Navbar.Text>
        <FiSettings size={20} style={{ position: 'absolute', right: '16px' }} />
      </Navbar>

  
      <Container fluid
        style={{ paddingTop: '20px', paddingBottom: '100px', maxWidth: '400px',fontSize: '20px' }}
        className="mx-auto"
      >
        <h6 className="fw-bold my-3 fs-4">Overview</h6>

        <Card className=" p-3  shadow-sm rounded" style={{border: '1px solid #333 '}}>
          <div className="text-muted  " style={{ fontSize: '16px' }}>Total Users</div>
          <div  className="my-2" style={{ fontSize: '24px', fontWeight: 600 }}>{dashboardData.totalUsers}</div>
        </Card>

        <Card className=" p-4 shadow-sm rounded my-3 " style={{border: '1px solid #333 '}}>
          <div className="text-muted " style={{ fontSize: '16px' }}>Roles</div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>{dashboardData.rolesCount}</div>
        </Card>

        <Card className=" p-3 shadow-sm rounded my-4" style={{border: '1px solid #333 '}}>
          <div className="text-muted " style={{ fontSize: '16px' }}>Today's Attendance</div>
          <div style={{ fontSize: '24px', fontWeight: 600 }}>{dashboardData.todayAttendance}</div>
        </Card>

        <h6 className="fw-bold mt-5 mb-4"  style={{ fontSize: '16px',fontFamily: 'sans-serif' }}>Quick Actions</h6>

        <Button
          variant="dark"
          className="w-100 mb-4 d-flex justify-content-center align-items-center gap-2 rounded"
          style={{ height: '42px', fontWeight: '500',fontFamily: 'sans-serif' }}
          onClick={() => navigate('/manageUsers')}
        >
          <FiUsers /> Manage Users
        </Button>

        <Button
          variant="light"
          className="w-100 d-flex justify-content-center align-items-center gap-2 border rounded"
          style={{ height: '42px', fontWeight: '500', backgroundColor: '#f6f6f6',fontFamily: 'sans-serif' }}
          onClick={() => navigate('/manage-roles')}
        >
          <FiUser /> Manage Roles
        </Button>
      </Container>

      <Navbar
        bg="white"
        variant="light"
        fixed="bottom"
        className="justify-content-around shadow-sm border-top"
        style={{
          height: '56px',
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Nav.Link onClick={() => navigate('/')} className="text-center">
          <FiHome size={20} />
          <div style={{ fontSize: '12px' }}>Home</div>
        </Nav.Link>

        <Nav.Link onClick={() => navigate('/attendance')} className="text-center">
          <FiCalendar size={20} />
          <div style={{ fontSize: '12px' }}>Attendance</div>
        </Nav.Link>

        <Nav.Link onClick={() => navigate('/reports')} className="text-center">
          <FiBarChart2 size={20} />
          <div style={{ fontSize: '12px' }}>Reports</div>
        </Nav.Link>

        <Nav.Link onClick={() => navigate('/profile')} className="text-center">
          <FiUser size={20} />
          <div style={{ fontSize: '12px' }}>Profile</div>
        </Nav.Link>
      </Navbar>
    </div>
  );
};

export default Dashboard;
