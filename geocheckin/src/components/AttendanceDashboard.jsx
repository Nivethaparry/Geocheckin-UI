import React, { useState, useEffect, useRef } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';
import { PiCaretCircleDown, PiCaretCircleUp } from 'react-icons/pi';
import { GoHome } from 'react-icons/go';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { RiTaskLine } from 'react-icons/ri';
import { LuUserRound } from 'react-icons/lu';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import image from '../assets/image.png'

const AttendanceDashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('--:--'); 
  const [checkOutTime, setCheckOutTime] = useState('--:--');
  const [loading, setLoading] = useState(false); 
  const [totalWorkedTime, setTotalWorkedTime] = useState('');
  const [elapsedTime, setElapsedTime] = useState('0h 00m 00s'); 
  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: <GoHome />, path: '/' },
    { label: 'Attendance', icon: <IoCalendarNumberSharp />, path: '/attendancedashboard' },
    { label: 'Tasks', icon: <RiTaskLine />, path: '/tasks' },
    { label: 'Profile', icon: <LuUserRound />, path: '/profile' },
  ];

  const formatSecondsToHMS = (totalSeconds) => {
    if (totalSeconds === null || isNaN(totalSeconds) || totalSeconds < 0) return '0h 00m 00s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const calculateElapsedTime = (checkInISO) => {
    if (!checkInISO) return '0h 00m 00s';
    const now = new Date();
    const checkInDate = new Date(checkInISO);
    const diffMs = now - checkInDate;
    const totalSeconds = Math.floor(diffMs / 1000);
    return formatSecondsToHMS(totalSeconds);
  };

  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported by this browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error("Geolocation error:", err);
          reject('Location access denied or unavailable.');
        }
      );
    });

  const startTimer = (checkInISO) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime(calculateElapsedTime(checkInISO));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const location = await getUserLocation(); 
      const payload = {
        userId, 
        latitude: location.lat,
        longitude: location.lng,
      };

      const res = await axios.post('https://localhost:7252/api/Attendance/CheckIn', payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      console.log("API response:",res.data);
      const checkInISO = res.data.data.checkIn; 
      setCheckedIn(true); 
      setCheckInTime(new Date(checkInISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); 
      startTimer(checkInISO); 
      setTotalWorkedTime(''); 
    } catch (err) {
      console.error('Check-in failed:', err.message);
      
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true); 
    try {
      const location = await getUserLocation(); 
      const payload = {
        userId, 
        latitude: location.lat,
        longitude: location.lng,
      };

      const res = await axios.post('https://localhost:7252/api/Attendance/CheckOut', payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      
      console.log("API response:",res.data);
      const { checkIn, checkOut, totalHours } = res.data.data; 

      if (!checkIn || !checkOut) {
        console.error('Missing check-in or check-out time from backend response.');
        return;
      }

      const checkOutDate = new Date(checkOut);
      const totalSeconds = Math.floor(totalHours * 3600);
      const formattedTotalTime = formatSecondsToHMS(totalSeconds); 

      setCheckedIn(false); 
      setCheckOutTime(checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); 
      setTotalWorkedTime(formattedTotalTime); 
      setElapsedTime(formattedTotalTime); 
      stopTimer(); 
    } catch (err) {
      console.error('Check-out failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId || !token) {
        console.log('User ID or Token not available, skipping attendance status fetch.');
        setCheckedIn(false);
        setCheckInTime('--:--');
        setCheckOutTime('--:--');
        setTotalWorkedTime('');
        setElapsedTime('0h 00m 00s');
        stopTimer();
        return;
      }

      try {
        const res = await axios.get(`https://localhost:7252/api/Attendance/FullAttendance?userId=3`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API response:",res.data);
        const records = res.data?.records;
        if (!Array.isArray(records) || records.length === 0) {
          console.log('No attendance records found for this user.');
          setCheckedIn(false);
          setCheckInTime('--:--');
          setCheckOutTime('--:--');
          setTotalWorkedTime('0h 00m 00s'); 
          setElapsedTime('0h 00m 00s');
          stopTimer();
          setUserInfo(null); 
          return;
        }


      const last7Records = records
          .filter(r => r.checkIn && !isNaN(new Date(r.checkIn)))
          .slice(-7)
          .map(record => {
      const parsedDate = new Date(record.checkIn);

    return {
      day: parsedDate.toLocaleDateString('en-US', { weekday: 'long' }),
      date: parsedDate.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      hours: record.totalHours != null
        ? formatSecondsToHMS(Math.floor(record.totalHours * 3600)).split(' ')[0]
        : '0h',
    };
  });


        setAttendance(last7Records);
        const latest = records[records.length - 1];
        const { checkIn, checkOut, totalHours, userName } = latest;
        const isCurrentlyCheckedIn = checkIn && !checkOut;
        setUserInfo({ userName, img: 'null' });
        setCheckedIn(isCurrentlyCheckedIn); 

        if (checkIn) {
          setCheckInTime(new Date(checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          setCheckInTime('--:--');
        }

        if (checkOut) {
          setCheckOutTime(new Date(checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          setCheckOutTime('--:--');
        }

        if (isCurrentlyCheckedIn) {
          setElapsedTime(calculateElapsedTime(checkIn));
          startTimer(checkIn);
          setTotalWorkedTime(''); 
        } else {
          stopTimer();
          if (totalHours != null) {
            const totalSeconds = Math.floor(totalHours * 3600);
            const formatted = formatSecondsToHMS(totalSeconds);
            setTotalWorkedTime(formatted);
            setElapsedTime(formatted); 
          } else {
            setTotalWorkedTime('0h 00m 00s');
            setElapsedTime('0h 00m 00s');
          }
        }
      } catch (err) {
        console.error('Failed to fetch attendance status:', err);
        setCheckedIn(false);
        setCheckInTime('--:--');
        setCheckOutTime('--:--');
        setTotalWorkedTime('');
        setElapsedTime('0h 00m 00s');
        stopTimer();
      }
    }
    fetchStatus();
    return () => stopTimer();
  }, [userId, token, dispatch]); 

  return (
    <>
      <Container fluid className="d-flex align-item-center mt-3" style={{ fontFamily: 'sans-serif' }}>
        <div className="dashboard-wrapper">
          <Navbar expand="lg" className="navbar-custom align-item-center p-4 ">
            <FaBars className="ms-1 fw-medium" size={24} />
            <div className="text-center position-absolute w-100">
              <h1 className="h4 mb-0 fw-bold">Attendance</h1>
            </div>
         
              <Dropdown>
              <Dropdown.Menu>
                <Dropdown.Item></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar>
        </div>
      </Container>

      <Container fluid style={{ fontFamily: 'sans-serif' }}>
        <div className="dashboard py-4">
          {userInfo && (
            <div className="user-card">
              <img src={image} alt='image' className="rounded-circle" width="110" height="110" 
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%' }} />
              <div>
                <h4 className="mb-0 h4 fw-bold mt-3">{userInfo.userName || 'Employee'}</h4>
                <p className="text-secondary">{userInfo.userRole || 'Role'}</p>
              </div>
            </div>
          )}

          <div className="live-timer">
            <strong>Working Time:</strong> {elapsedTime}
          </div>

          <div className="buttons">
            <button className="checkin" onClick={handleCheckIn} disabled={checkedIn || loading}>
              <PiCaretCircleDown style={{ fontSize: '1.5rem' }} /><br /> Check In <br /><span>{checkInTime}</span></button>
            <button className="checkout" onClick={handleCheckOut} disabled={!checkedIn || loading}>
              <PiCaretCircleUp style={{ fontSize: '1.5rem' }} /> <br /> Check Out <br /><span>{checkOutTime}</span></button>
          </div>

          <div className="today-hours">
            <p>Today's Total Hours</p>
            <h3 className='fw-bold fs-1'>{totalWorkedTime}</h3>
          </div>

          <div className="week summary">
            <h5 className="mb-3 fw-semibold">Last 7 Days</h5>
            <div className="day-list">
              {attendance.length > 0 ? (
                attendance.map((day, index) => (
                  <div className="day-item d-flex justify-content-between align-items-center" key={index}>
                      <span className="day-name">{day.day}</span>
                      <span className="day-hours">{day.date}</span>
                      <span className="day-hours">{day.hours}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted">No attendance data available.</p>
              )}
            </div>
          </div>
        </div>
      </Container>

      <Container fluid className="bg-white fixed-bottom shadow-sm border-top" style={{ maxWidth: '400px' }}>
        <div className="dashboard">
          <Nav className="d-flex justify-content-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Nav.Item key={item.path} className="text-center">
                  <Nav.Link
                    onClick={() => navigate(item.path)}
                    className={`d-flex flex-column align-items-center ${isActive ? 'text-primary' : 'text-secondary'}`}
                    style={{
                      backgroundColor: isActive ? 'rgba(84, 105, 255, 0.1)' : 'transparent',
                      borderRadius: '1rem',
                      padding: '0.5rem 0.75rem',
                    }}>
                    <div style={{ fontSize: '1.25rem' }}>{item.icon}</div>
                    <p>{item.label}</p>
                  </Nav.Link>
                </Nav.Item>
              );
            })}
          </Nav>
        </div>
      </Container>
    </>
  );
};

export default AttendanceDashboard;



