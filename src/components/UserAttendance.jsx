
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner, Container, Navbar } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { MdSkipPrevious } from "react-icons/md";
import { MdSkipNext } from "react-icons/md";
import BottomNav from '../components/BottomNav';
import { useSelector } from 'react-redux';

const UserAttendace = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();
  const { userId } = useParams();
  const role = useSelector((state) => state.auth.user?.roleName);


  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://localhost:7252/api/Attendances/AllHistory` ,{
      params: {
      userId,
      yearmonth: `${year}-${String(month + 1).padStart(2, '0')}`
     }
      });
      setAttendanceData(res.data.records); 
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); 
  };

  const formatTime = (decimalHours) => {
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
    <Container fluid style={{ maxWidth: 400, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                                   height: '100vh', padding: 0, position: 'relative', fontFamily: 'sans-serif', }}>
        <Navbar
          variant="light"
          className="px-3 py-4 border-bottom"
          style={{ backgroundColor: 'white' }} >
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <Navbar.Brand className="mx-auto fw-medium">User Attendance</Navbar.Brand>
          </Navbar>

      <div className="d-flex justify-content-between align-items-center mb-5 mt-5">
        <Button className=" ms-4" variant="dark" onClick={handlePrevMonth}><MdSkipPrevious /> Prev
        </Button>
        <h5 className="mb-0">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</h5>
        <Button className=" me-4" variant="dark" onClick={handleNextMonth}>Next <MdSkipNext /></Button>
      </div>

      {loading ? (
        <div className="text-center"><Spinner animation="border" variant="primary" /></div>
      ) : (
        attendanceData.length === 0 ? (
          <div className="text-center text-muted mt-5 mb-5">No attendance records</div>
        ) : (
          attendanceData.map((item, idx) => (
            <Card
              key={idx}
              className="mb-2 shadow-sm"
              onClick={() => navigate(`/mapcomponent/${userId}/${item.date}`)}
              style={{ cursor: 'pointer' }}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>{formatDate(item.date)}</div>
                <div style={{ fontWeight: 'bold' }}>{formatTime(item.totalHours)}</div>
              </Card.Body>
            </Card>
          ))
        )
      )}
    </Container>
     <BottomNav role={role} />
     </>
  );
};

export default UserAttendace;
