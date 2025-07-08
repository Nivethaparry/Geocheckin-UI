import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { RiAdminLine } from 'react-icons/ri';
import { RiTaskLine } from 'react-icons/ri';
import { LuUserRound } from 'react-icons/lu';
import { useSelector } from 'react-redux';


const BottomNav = () => {
  const role = useSelector(state => state.auth.user?.roleName);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: <GoHome />, path: '/attendancedashboard' },
    { label: 'Admin', icon: <RiAdminLine />, path: '/admindashboard', adminOnly: true },
    { label: 'Tasks', icon: <RiTaskLine />, path: '/tasks' },
    { label: 'Profile', icon: <LuUserRound />, path: '/profile' },
  ];

  const filteredItems = navItems.filter(item => {
    if (item.adminOnly && role !== 'Admin') return false;
    return true;
  });

  return (
    <div className="bg-white shadow-sm border-top" style={{ maxWidth: '400px', margin: '0 auto', left: 0, right: 0, }}>
        <div className="dashboard">
      <Nav className="d-flex justify-content-around">
        {filteredItems.map(item => {
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
                }}
              >
                <div style={{ fontSize: '1.25rem' }}>{item.icon}</div>
                <p>{item.label}</p>
              </Nav.Link>
            </Nav.Item>
          );
        })}
      </Nav>
    </div>
    </div>
  );
};

export default BottomNav;
