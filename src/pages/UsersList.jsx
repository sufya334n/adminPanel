




import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsers, blockUser, deleteUser, getUserEnrolledCourses, getUserCompletedCourses, getUserPurchasedCourses, getUserPaymentHistory } from '../api';
import '../styles/UsersList.css';

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [loadingCourses, setLoadingCourses] = useState({
    enrolled: false,
    completed: false,
    purchased: false,
    payment: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  };



const fetchCourseData = (userId, type) => {
  // Set loading state for this specific type
  setLoadingCourses(prev => ({ ...prev, [type]: true }));
  setError(null); // Reset error state
  
  let fetchFunction;
  let setDataFunction;
  
  switch(type) {
    case 'enrolled':
      fetchFunction = getUserEnrolledCourses;
      setDataFunction = setEnrolledCourses;
      break;
    case 'completed':
      fetchFunction = getUserCompletedCourses;
      setDataFunction = setCompletedCourses;
      break;
    case 'purchased':
      fetchFunction = getUserPurchasedCourses;
      setDataFunction = setPurchasedCourses;
      break;
    case 'payment':
      fetchFunction = getUserPaymentHistory;
      setDataFunction = setPaymentHistory;
      break;
    default:
      return;
  }
  
  console.log(`Fetching ${type} data for user:`, userId);
 
fetch(`http://localhost:5000/api/users/${userId}/${type === 'completed' ? 'completed-courses' : 
      type === 'purchased' ? 'purchased-courses' : 
      type === 'enrolled' ? 'enrolled-courses' : 
      type.replace('payment', 'payment-history')}`, {
  headers: { 'Content-Type': 'application/json' }
})
  .then(res => {  
    if (!res.ok) throw new Error(`Failed to fetch ${type} (${res.status})`);  // Error handling
    return res.json();  // Parse JSON response
  })
  .then(response => {
    console.log(`${type} raw response:`, response);  // Log the raw response
    
    // Response handling
    if (Array.isArray(response)) {
      console.log(`${type} is an array with ${response.length} items`);
      setDataFunction(response);  // Set the data in state
    } else if (response && typeof response === 'object') {
      // If it's a user object with course arrays
      if (Array.isArray(response.enrolledCourses) && type === 'enrolled') {
        setDataFunction(response.enrolledCourses);
      } else if (Array.isArray(response.completedCourses) && type === 'completed') {
        setDataFunction(response.completedCourses);
      } else if (Array.isArray(response.purchasedCourses) && type === 'purchased') {
        setDataFunction(response.purchasedCourses);
      } else if (Array.isArray(response.paymentHistory) && type === 'payment') {
        setDataFunction(response.paymentHistory);
      } else if (response._id) {
        // If it's a single course object
        setDataFunction([response]);
      } else {
        // If response format is unrecognized
        console.log('Setting empty array because response format is not recognized');
        setDataFunction([]);
      }
    } else {
      console.log('Setting empty array because response is not an array or object');
      setDataFunction([]);  // Empty array if response is invalid
    }
    
    setLoadingCourses(prev => ({ ...prev, [type]: false }));  // Set loading state to false
  })
  .catch(err => {
    console.error(`Failed to fetch ${type}:`, err);  // Log the error
    setError(`Failed to fetch ${type}. ${err.message}`);  // Display the error
    setLoadingCourses(prev => ({ ...prev, [type]: false }));  // Set loading state to false
    setDataFunction([]);  // Set empty array in case of error
  });
}

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setActiveTab('info');
    
    // Reset course and payment data
    setEnrolledCourses([]);
    setCompletedCourses([]);
    setPurchasedCourses([]);
    setPaymentHistory([]);
    
    // Reset error state
    setError(null);
    
    // Fetch all user data immediately
    fetchCourseData(user._id, 'enrolled');
    fetchCourseData(user._id, 'completed');
    fetchCourseData(user._id, 'purchased');
    fetchCourseData(user._id, 'payment');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (selectedUser) {
      // Only fetch data if it hasn't been loaded yet
      if (tab === 'enrolled' && enrolledCourses.length === 0 && !loadingCourses.enrolled) {
        fetchCourseData(selectedUser._id, 'enrolled');
      } else if (tab === 'completed' && completedCourses.length === 0 && !loadingCourses.completed) {
        fetchCourseData(selectedUser._id, 'completed');
      } else if (tab === 'purchased' && purchasedCourses.length === 0 && !loadingCourses.purchased) {
        fetchCourseData(selectedUser._id, 'purchased');
      } else if (tab === 'payment' && paymentHistory.length === 0 && !loadingCourses.payment) {
        fetchCourseData(selectedUser._id, 'payment');
      }
    }
  };

  const handleBlockUser = (id, e) => {
    e.stopPropagation();
    blockUser(id)
      .then(() => {
        // Update the user in the list
        setUsers(users.map(user => {
          if (user._id === id) {
            return { ...user, isBlocked: !user.isBlocked };
          }
          return user;
        }));

        // Update selected user if it's the one being blocked
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser({
            ...selectedUser,
            isBlocked: !selectedUser.isBlocked
          });
        }
      })
      .catch(err => {
        console.error('Failed to block user:', err);
      });
  };

  const handleDeleteUser = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
        .then(() => {
          setUsers(users.filter(user => user._id !== id));
          if (selectedUser && selectedUser._id === id) {
            setSelectedUser(null);
          }
        })
        .catch(err => {
          console.error('Failed to delete user:', err);
        });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="users-list-container">Loading...</div>;
  if (error) return <div className="users-list-container">{error}</div>;

  return (
    <div className="users-page">
      <h2>User Management</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="user-search-input"
      />

      <div className="users-layout">
        {/* Users List */}
        <div className="users-list-container">
          <div className="user-card create-card" onClick={() => navigate('/dashboard/users/create')}>
            <span className="plus-icon">+</span>
            <span>Create User</span>
          </div>

          {filteredUsers.length === 0 ? (
            <p>No users found.</p>
          ) : (
            filteredUsers.map(user => (
              <div 
                className={`user-card ${selectedUser && selectedUser._id === user._id ? 'selected' : ''}`} 
                key={user._id}
                onClick={() => handleUserClick(user)}
              >
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p>Status: {user.isBlocked ? 'Blocked' : 'Active'}</p>
              </div>
            ))
          )}
        </div>

        {/* User Details */}
        {selectedUser && (
          <div className="user-details">
            <div className="user-tabs">
              <button 
                className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => handleTabChange('info')}
              >
                Info
              </button>
              <button 
                className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                onClick={() => handleTabChange('enrolled')}
              >
                Enrolled Courses
              </button>
              <button 
                className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => handleTabChange('completed')}
              >
                Completed Courses
              </button>
              <button 
                className={`tab-btn ${activeTab === 'purchased' ? 'active' : ''}`}
                onClick={() => handleTabChange('purchased')}
              >
                Purchased Courses
              </button>
              <button 
                className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => handleTabChange('payment')}
              >
                Payment History
              </button>
            </div>

            {activeTab === 'info' && (
              <div className="user-info">
                
                <h2>{selectedUser.name}</h2>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</p>
                <p><strong>Status:</strong> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
                <p><strong>Enrolled Courses:</strong> {selectedUser.enrolledCourses ? selectedUser.enrolledCourses.length : 0}</p>
                <p><strong>Completed Courses:</strong> {selectedUser.completedCourses ? selectedUser.completedCourses.length : 0}</p>
                <p><strong>Purchased Courses:</strong> {selectedUser.purchasedCourses ? selectedUser.purchasedCourses.length : 0}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                
                <div className="user-actions">
                  <button 
                    className={selectedUser.isBlocked ? 'unblock-btn' : 'block-btn'}
                    onClick={(e) => handleBlockUser(selectedUser._id, e)}
                  >
                    {selectedUser.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/users/edit/${selectedUser._id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeleteUser(selectedUser._id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}







{activeTab === 'enrolled' && (
  <div className="user-courses">
    <h3>Enrolled Courses ({enrolledCourses.length})</h3>
    {loadingCourses.enrolled ? (
      <p>Loading enrolled courses...</p>
    ) : enrolledCourses.length === 0 ? (
      <div>
        <p>No enrolled courses found.</p>
        <button onClick={() => fetchCourseData(selectedUser._id, 'enrolled')} className="refresh-btn">
          Refresh Data
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    ) : (
      <div className="courses-grid">
        {enrolledCourses.map((course, index) => {
          // Check if course is just an ID reference or full object
          const isReference = typeof course === 'string' || (course && !course.title && !course.instructor);
          return (
            <div className="course-item" key={course._id || `course-${index}`}>
              <img 
                src={course.image || 'https://via.placeholder.com/150'} 
                alt={course.title || 'Course'} 
                className="course-thumbnail" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
              />
              <div className="course-info">
                <h4>{isReference ? `Course ID: ${course._id || course}` : (course.title || 'Unnamed Course')}</h4>
                {!isReference && (
                  <>
                    <p>Instructor: {course.instructor || 'Unknown'}</p>
                    <p>Level: {course.level || 'Not specified'}</p>
                    <p>Price: ${course.price || '0'}</p>
                  </>
                )}
                <p>Enrolled: {course.enrolledAt ? new Date(course.enrolledAt).toLocaleDateString() : 
                           (course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Unknown date')}</p>
              </div>
            </div>
          );
        })}
      </div>
    )}
    

  </div>
)}

{activeTab === 'completed' && (
  <div className="user-courses">
    <h3>Completed Courses</h3>
    {loadingCourses.completed ? (
      <p>Loading completed courses...</p>
    ) : completedCourses.length === 0 ? (
      <p>No completed courses found.</p>
    ) : (
      <div className="courses-grid">
        {completedCourses.map(course => (
          <div className="course-item" key={course._id}>
            {/* No fallback image provided, allowing image to be empty if not available */}
            <img 
              src={course.image || ''}  // Leave empty if no image
              alt={course.title || 'Course'}
              className="course-thumbnail"
            />
            <div className="course-info">
              <h4>{course.title || 'Unnamed Course'}</h4>
              <p>Instructor: {course.instructor || 'Unknown'}</p>
              <p>Level: {course.level || 'Not specified'}</p>
              <p>Price: ${course.price || '0'}</p>
              <p>Completed: {course.completedAt ? new Date(course.completedAt).toLocaleDateString() : 'Unknown date'}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{activeTab === 'purchased' && (
  <div className="user-courses">
    <h3>Purchased Courses</h3>
    {loadingCourses.purchased ? (
      <p>Loading purchased courses...</p>
    ) : purchasedCourses.length === 0 ? (
      <p>No purchased courses found.</p>
    ) : (
      <div className="courses-grid">
        {purchasedCourses.map(course => (
          <div className="course-item" key={course._id}>
            {/* No fallback image provided */}
            <img 
              src={course.image || ''}  // Leave empty if no image
              alt={course.title || 'Course'} 
              className="course-thumbnail"
            />
            <div className="course-info">
              <h4>{course.title || 'Unnamed Course'}</h4>
              <p>Instructor: {course.instructor || 'Unknown'}</p>
              <p>Level: {course.level || 'Not specified'}</p>
              <p>Price: ${course.price || '0'}</p>
              <p>Purchased: {course.purchasedAt ? new Date(course.purchasedAt).toLocaleDateString() : 'Unknown date'}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}









            {activeTab === 'payment' && (
              <div className="payment-history">
                <h3>Payment History</h3>
                {loadingCourses.payment ? (
                  <p>Loading payment history...</p>
                ) : paymentHistory.length === 0 ? (
                  <p>No payment history found.</p>
                ) : (
                  <table className="payment-table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Amount</th>
                        <th>Payment ID</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td>{payment.courseId ? (payment.courseId.title || 'Unknown Course') : 'Unknown Course'}</td>
                          <td>${payment.amount}</td>
                          <td>{payment.paymentId}</td>
                          <td>{payment.status}</td>
                          <td>{new Date(payment.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
