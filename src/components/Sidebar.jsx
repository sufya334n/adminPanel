import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h3>Admin Pannel</h3>
      <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">📝</span> Home
  </NavLink>
<NavLink to="/dashboard/blogs" end className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">📝</span> Blogs
  </NavLink>
  <NavLink to="/dashboard/contact-info" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">📞</span> Contact Info
  </NavLink>
  
  <NavLink to="/dashboard/courses" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">📚</span> Courses
  </NavLink>
  <NavLink to="/dashboard/payouts" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">💰</span> Payouts
  </NavLink>

  <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">👥</span> Users
  </NavLink>
  <NavLink to="/dashboard/instructors" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">👤</span> Instructors
  </NavLink>

  <NavLink to="/dashboard/contacts" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">📧</span> Contacts
  </NavLink>

  <NavLink to="/dashboard/about" className={({ isActive }) => isActive ? 'active' : ''}>
    <span className="icon">📘</span> About
  </NavLink>
  
        <button onClick={logout}>Logout</button>
    </div>
  );
} 






