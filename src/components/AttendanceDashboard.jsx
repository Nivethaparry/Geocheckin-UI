
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Navbar, Nav, Dropdown, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaBars } from 'react-icons/fa';
import { PiCaretCircleDown, PiCaretCircleUp } from 'react-icons/pi';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import image from '../assets/image.png';
import { toast } from 'react-toastify';
import BottomNav from '../components/BottomNav';
import { AiOutlineInfoCircle } from 'react-icons/ai';

const AttendanceDashboard = () => {

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);
  const role = useSelector((state) => state.auth.user?.roleName);

  const [userInfo, setUserInfo] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState('--:--');
  const [checkOutTime, setCheckOutTime] = useState('--:--');
  const [loading, setLoading] = useState(false);
  const [totalWorkedTime, setTotalWorkedTime] = useState('');
  const [elapsedTime, setElapsedTime] = useState('0h 00m 00s');
  const timerRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [dailySessions, setDailySessions] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false); 


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  if (!userId) return;

  const checkInStr = localStorage.getItem(`checkInTime_${userId}`);
  const stored = localStorage.getItem(`dailySessions_${userId}`);

    const lastDate = localStorage.getItem(`lastCheckInDate_${userId}`);
  const todayDate = new Date().toDateString();

  if (lastDate && lastDate !== todayDate) {
    localStorage.removeItem(`checkInTime_${userId}`);
    localStorage.removeItem(`dailySessions_${userId}`);
    localStorage.removeItem(`todayTotalSeconds_${userId}`);
  }

  localStorage.setItem(`lastCheckInDate_${userId}`, todayDate);


  if (stored) {
    const sessions = JSON.parse(stored);
    setDailySessions(sessions);

    const totalMs = sessions.reduce((sum, session) => sum + (session.durationMs || 0), 0);
    const totalSeconds = Math.floor(totalMs / 1000);
    const formatted = formatSecondsToHMS(totalSeconds);

    setElapsedTime(formatted);
    setTotalWorkedTime(formatted);
    localStorage.setItem(`todayTotalSeconds_${userId}`, totalSeconds);
  }

  
  if (!stored && !checkInStr) {
   
    setTimeout(() => {
      const newCheck = localStorage.getItem(`checkInTime_${userId}`);
      const newStored = localStorage.getItem(`dailySessions_${userId}`);
      if (!newCheck && !newStored) {
        setDailySessions([]);
        setElapsedTime('0h 00m 00s');
        setTotalWorkedTime('');
        localStorage.setItem(`todayTotalSeconds_${userId}`, '0');
      }
    }, 1000); 
  }
}, [userId]);

  const formatSecondsToHMS = (totalSeconds) => {
    if (totalSeconds === null || isNaN(totalSeconds) || totalSeconds < 0) return '0h 00m 00s';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const startTimerWithOffset = (initialSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let counter = initialSeconds;
    setElapsedTime(formatSecondsToHMS(counter));
    timerRef.current = setInterval(() => {
      counter += 1;
      setElapsedTime(formatSecondsToHMS(counter));
    }, 1000);
  };

  const stopTimer =  () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getUserLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported by this browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error('Geolocation error:', err);
          reject('Location access denied or unavailable.');
        }
      );
    });

  const handleCheckIn = () => {
    setShowConfirmModal(true);
    setActionType('checkin');
  };

  const performCheckIn = async () => {
    setLoading(true);
    try {
      const location = await getUserLocation();
      const payload = { userId, latitude: location.lat, longitude: location.lng };
      const res = await axios.post('https://localhost:7252/api/Attendances/CheckIn', payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const { checkIn, elapsedSeconds } = res.data.data;
      setCheckedIn(true);
      localStorage.setItem(`checkInTime_${userId}`, checkIn);
      localStorage.setItem(`lastCheckInTime_${userId}`, checkIn);
      setCheckInTime(new Date(checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      const existingSeconds = parseInt(localStorage.getItem(`todayTotalSeconds_${userId}`) || '0', 10);
      const combinedSeconds = existingSeconds + (elapsedSeconds || 0);
      setElapsedTime(formatSecondsToHMS(combinedSeconds));
      setTotalWorkedTime(formatSecondsToHMS(combinedSeconds));
      localStorage.setItem(`todayTotalSeconds_${userId}`, combinedSeconds);
      startTimerWithOffset(combinedSeconds);

      toast.success('Checked in successfully!');
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Check-in failed:', err.message);
      toast.error('Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = () => {
    setActionType('checkout');
    setShowConfirmModal(true);
  };

  const performCheckOut = async () => {
    setLoading(true);
    try {
      const location = await getUserLocation();
      const payload = { userId, latitude: location.lat, longitude: location.lng };
      const res = await axios.post('https://localhost:7252/api/Attendances/CheckOut', payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      const { checkOut, totalHours } = res.data.data;
      if (!checkOut) return;

      const checkInTimeStr = localStorage.getItem(`checkInTime_${userId}`);
      if (!checkInTimeStr) return;

      const checkInDate = new Date(checkInTimeStr);
      const checkOutDate = new Date(checkOut);
      const durationMs = checkOutDate - checkInDate;

      const session = {
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        durationMs,
      };

      const updatedSessions = [...dailySessions, session];
      setDailySessions(updatedSessions);
      localStorage.setItem(`dailySessions_${userId}`, JSON.stringify(updatedSessions));

      const totalMs = updatedSessions.reduce((sum, s) => sum + s.durationMs, 0);
      const totalSeconds = Math.floor(totalMs / 1000);
      const formatted = formatSecondsToHMS(totalSeconds);

      localStorage.setItem(`lastCheckOutTime_${userId}`, checkOutDate.toISOString());
      localStorage.setItem(`todayTotalSeconds_${userId}`, totalSeconds);

      setCheckedIn(false);
      localStorage.removeItem(`checkInTime_${userId}`);
      setCheckOutTime(checkOutDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTotalWorkedTime(formatted);
      setElapsedTime(formatted);
      stopTimer();
      toast.success('Checked out successfully!');
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Check-out failed:', err.message);
      toast.error('Check-out failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
   if (!userId || typeof userId !== 'string' && typeof userId !== 'number') return;


  const timeout = setTimeout(() => {
    const allowedSuffix = `_${userId}`;
    Object.keys(localStorage).forEach((key) => {
      const isUserScopedKey =
        key.startsWith('checkInTime_') ||
        key.startsWith('lastCheckOutTime_') ||
        key.startsWith('dailySessions_') ||
        key.startsWith('lastCheckInTime_') ||
        key.startsWith('todayTotalSeconds_');

   const belongsToCurrentUser = key.endsWith(allowedSuffix);
    });
  }, 500); 

    const checkInStr = localStorage.getItem(`checkInTime_${userId}`);
    const todayTotalSeconds = localStorage.getItem(`todayTotalSeconds_${userId}`);
    const lastCheckIn = localStorage.getItem(`lastCheckInTime_${userId}`);
    const lastCheckOut = localStorage.getItem(`lastCheckOutTime_${userId}`);

    if (checkInStr && !timerRef.current) {
      const checkInDate = new Date(checkInStr);
      const diffInSeconds = Math.floor((Date.now() - checkInDate.getTime()) / 1000);
      setCheckedIn(true);
      setCheckInTime(checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCheckOutTime('--:--');
      startTimerWithOffset(diffInSeconds);
    }

    if (lastCheckIn) {
      const inDate = new Date(lastCheckIn);
      setCheckInTime(inDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    if (lastCheckOut) {
      const outDate = new Date(lastCheckOut);
      setCheckOutTime(outDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    if (todayTotalSeconds && !checkInStr) {
      const totalSec = parseInt(todayTotalSeconds);
      if (!isNaN(totalSec)) {
        const formatted = formatSecondsToHMS(totalSec);
        setElapsedTime(formatted);
        setTotalWorkedTime(formatted);
      }
    }

    const fetchStatus = async () => {
      if (!userId || !token) {
        stopTimer();
        return;
      }

      try {
        const res = await axios.get(`https://localhost:7252/api/Attendances/History?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const records = res.data?.records;
        if (!Array.isArray(records) || records.length === 0) return;

        const formatTotalHours = (decimalHours) => {
          const totalMinutes = Math.round(decimalHours * 60);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
        };

        const completedRecords = records
          // .filter((r) => r.totalHours && r.totalHours > 0)
          // .sort((a, b) => new Date(b.date) - new Date(a.date))
          // .slice(0, 7)
          .map((record) => {
            const dateObj = new Date(record.date);
            const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const date = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const hours = formatTotalHours(record.totalHours || 0);
            return { day, date, hours };
          });

        setAttendance(completedRecords);

        const latestRecord = records[records.length - 1];
        const checkIn = latestRecord?.checkIn;
        const checkOut = latestRecord?.checkOut;
        const userName = latestRecord?.userName;
        const roleName = latestRecord?.roleName;
        const interval = latestRecord?.elapsedSeconds || 0;

        const isCurrentlyCheckedIn = !!checkIn && !checkOut;

        if (userName) {
          setUserInfo({ userName, img: 'null', roleName });
        }

        if (isCurrentlyCheckedIn && !checkInStr) {
          const checkInDate = new Date(checkIn);
          setCheckedIn(true);
          setCheckInTime(checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setCheckOutTime('--:--');
          localStorage.setItem(`checkInTime_${userId}`, checkIn);
          localStorage.setItem(`lastCheckInTime_${userId}`, checkIn);
          localStorage.setItem(`todayTotalSeconds_${userId}`, interval);
          startTimerWithOffset(interval);
        }
      } catch (error) {
        console.error('Failed to fetch attendance status:', error);
        stopTimer();
      }
    };

    fetchStatus();

    return () => {
      stopTimer();
       clearTimeout(timeout);
    };
  
  }, [userId]);

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
                <p className="text-secondary">{userInfo.roleName || 'Role'}</p>
              </div>
            </div>
          )}

          <div className="live-timer">
            <strong>Working Time:</strong> {elapsedTime}
          </div>

          <div className="buttons">

<button className="checkin" onClick={handleCheckIn} disabled={checkedIn || loading}>
  {loading && actionType === 'checkin' ? (
    <div className="d-flex flex-column align-items-center">
      <div className="spinner-border text-success mb-1" style={{ width: '1.5rem', height: '1.5rem' }} role="status" />
      <span>Checking in...</span>
    </div>
  ) : (
    <>
      <PiCaretCircleDown style={{ fontSize: '1.5rem' }} /><br />
      Check In <br />
      <span>{checkInTime}</span>
    </>
  )}
</button>

<button className="checkout" onClick={handleCheckOut} disabled={!checkedIn || loading}>
  {loading && actionType === 'checkout' ? (
    <div className="d-flex flex-column align-items-center">
      <div className="spinner-border text-danger mb-1" style={{ width: '1.5rem', height: '1.5rem' }} role="status" />
      <span>Checking out...</span>
    </div>
  ) : (
    <>
      <PiCaretCircleUp style={{ fontSize: '1.5rem' }} /><br />
      Check Out <br />
      <span>{checkOutTime}</span>
    </>
  )}
</button>
          </div>
            <div className="today-hours" style={{ gap: '8px' }}>
            <p style={{ marginBottom: 0 }}>Today's Total Hours</p>
            <h3 className='fw-bold fs-1 d-flex gap-5'>{totalWorkedTime || '0h 00m 00s'} <AiOutlineInfoCircle 
              size={20} 
              style={{ cursor: 'pointer', marginLeft:'50px'}} 
              onClick={() => setShowInfoModal(true)} 
              title="View today's sessions"/></h3>
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
     <BottomNav role={role} />
     <Modal
  show={showConfirmModal}
  onHide={() => setShowConfirmModal(false)}
  centered
  backdrop="static"
  keyboard={!loading} 
>
  <Modal.Header closeButton={!loading}>
    <Modal.Title>
      {actionType === 'checkin' ? 'Confirm Check-In' : 'Confirm Check-Out'}
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    Are you sure you want to {actionType === 'checkin' ? 'check in' : 'check out'}?
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowConfirmModal(false)}
      disabled={loading}
    >
      Cancel
    </Button>

    <Button
      variant={actionType === 'checkin' ? 'success' : 'danger'}
      onClick={actionType === 'checkin' ? performCheckIn : performCheckOut}
      disabled={loading}
    >
      {loading
        ? `${actionType === 'checkin' ? 'Checking in' : 'Checking out'}...`
        : `Yes, ${actionType === 'checkin' ? 'Check In' : 'Check Out'}`}
    </Button>
  </Modal.Footer>
</Modal>
<Modal
  show={showInfoModal}
  onHide={() => setShowInfoModal(false)}
  centered
  size="md"
>
  <Modal.Header closeButton>
    <Modal.Title>Today's Check-in Sessions</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {dailySessions.length === 0 ? (
      <p>No check-in sessions recorded for today.</p>
    ) : (
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {dailySessions.map((session, index) => {
            const checkInTime = session.checkIn ? new Date(session.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--';
            const checkOutTime = session.checkOut
              ? new Date(session.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : '--:--';
            const durationSeconds = Math.floor((new Date(session.checkOut || Date.now()) - new Date(session.checkIn)) / 1000);
            const durationFormatted = formatSecondsToHMS(durationSeconds);

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{checkInTime}</td>
                <td>{checkOutTime}</td>
                <td>{durationFormatted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowInfoModal(false)}>Close</Button>
  </Modal.Footer>
</Modal>




    </>
  );
};

export default AttendanceDashboard;



