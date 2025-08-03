import Sidebar from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';

import BlogsList from './BlogsList';
import CreateBlog from './CreateBlog';
import EditBlog from './EditBlog';
import CoursesList from './CourseList'; // نئی فائلز شامل کی گئیں
import CreateCourse from './CreateCourse';
import EditCourse from './EditCourse';
import '../styles/Dashboard.css';


import InstructorsList from './InstructorsList';
import CreateInstructor from './CreateInstructor';
import EditInstructor from './EditInstructor';
import UsersList from './UsersList';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import EditContactInfo from './EditContactInfo';
import ContactsList from './ContactsList';
import EditAbout from './EditAbout';
import PayoutsSummary from './PayoutsSummary';
import AnalyticsDashboard from './AnalyticsDashboard';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>

          <Route path="blogs" element={<BlogsList />} />
          <Route path="blogs/create" element={<CreateBlog />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
          <Route path="courses" element={<CoursesList />} /> {/* کورسز کے لیے نئے روٹس */}
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />



           <Route path="instructors" element={<InstructorsList />} />
          <Route path="instructors/create" element={<CreateInstructor />} />
          <Route path="instructors/edit/:id" element={<EditInstructor />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/create" element={<CreateUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />
          <Route path="contact-info" element={<EditContactInfo />} />
          <Route path="contacts" element={<ContactsList />} />
          <Route path="about" element={<EditAbout />} />
          <Route path="payouts" element={<PayoutsSummary />} />
          <Route path="/" element ={<AnalyticsDashboard/>}/>
          

        </Routes>
      </div>
    </div>
  );
}