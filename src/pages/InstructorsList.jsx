




import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  getInstructors, 
  verifyInstructor, 
  deleteInstructor, 
  getInstructorCourses,
  getUnpaidPayouts,
  getUnpaidPayoutsDetails,
  processInstructorPayout,
  getPayoutBatches
} from '../api';
import '../styles/InstructorsList.css';

export default function InstructorsList() {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // New states for payouts
  const [unpaidPayouts, setUnpaidPayouts] = useState([]);
  const [unpaidPayoutDetails, setUnpaidPayoutDetails] = useState(null);
  const [paidPayouts, setPaidPayouts] = useState([]);
  const [payoutBatches, setPayoutBatches] = useState([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [processingPayout, setProcessingPayout] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = () => {
    setLoading(true);
    getInstructors()
      .then(data => {
        setInstructors(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch instructors');
        setLoading(false);
      });
  };


  const handleInstructorClick = (instructor) => {
    setSelectedInstructor(instructor);
    setLoadingCourses(true);
    setActiveTab('profile'); // Reset to profile tab when selecting a new instructor
    
    // Fetch instructor courses
    getInstructorCourses(instructor._id)
      .then(courses => {
        setInstructorCourses(courses);
        setLoadingCourses(false);
      })
      .catch(err => {
        console.error('Failed to fetch instructor courses:', err);
        setInstructorCourses([]);
        setLoadingCourses(false);
      });
  };

  // ... other existing functions ...
const handleVerifyInstructor = (id, e) => {
    e.stopPropagation();
    verifyInstructor(id)
      .then(() => {
        // Update the instructor in the list
        setInstructors(instructors.map(instructor => {
          if (instructor._id === id) {
            return { ...instructor, verifiedInstructor: !instructor.verifiedInstructor };
          }
          return instructor;
        }));

        // Update selected instructor if it's the one being verified
        if (selectedInstructor && selectedInstructor._id === id) {
          setSelectedInstructor({
            ...selectedInstructor,
            verifiedInstructor: !selectedInstructor.verifiedInstructor
          });
        }
      })
      .catch(err => {
        console.error('Failed to verify instructor:', err);
      });
  };

  const handleDeleteInstructor = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      deleteInstructor(id)
        .then(() => {
          setInstructors(instructors.filter(instructor => instructor._id !== id));
          if (selectedInstructor && selectedInstructor._id === id) {
            setSelectedInstructor(null);
            setInstructorCourses([]);
          }
        })
        .catch(err => {
          console.error('Failed to delete instructor:', err);
        });
    }
  };

  // New functions for payouts
  const fetchUnpaidPayouts = (instructorId) => {
    setLoadingPayouts(true);
    getUnpaidPayouts(instructorId)
      .then(data => {
        setUnpaidPayouts(data);
        setLoadingPayouts(false);
      })
      .catch(err => {
        console.error('Failed to fetch unpaid payouts:', err);
        setUnpaidPayouts([]);
        setLoadingPayouts(false);
      });
  };

  const fetchPayoutDetails = (instructorId) => {
    setLoadingPayouts(true);
    getUnpaidPayoutsDetails(instructorId)
      .then(data => {
        setUnpaidPayoutDetails(data);
        setLoadingPayouts(false);
      })
      .catch(err => {
        console.error('Failed to fetch payout details:', err);
        setUnpaidPayoutDetails(null);
        setLoadingPayouts(false);
      });
  };

  const fetchPayoutBatches = (instructorId) => {
    setLoadingPayouts(true);
    getPayoutBatches(instructorId)
      .then(data => {
        setPayoutBatches(data);
        setLoadingPayouts(false);
      })
      .catch(err => {
        console.error('Failed to fetch payout batches:', err);
        setPayoutBatches([]);
        setLoadingPayouts(false);
      });
  };

  const handleProcessPayout = () => {
    if (!selectedInstructor) return;
    
    setProcessingPayout(true);
    processInstructorPayout(selectedInstructor._id)
      .then(data => {
        // Refresh the unpaid payouts and payout batches
        fetchUnpaidPayouts(selectedInstructor._id);
        fetchPayoutBatches(selectedInstructor._id);
        setShowPayoutModal(false);
        setProcessingPayout(false);
        alert('Payout processed successfully!');
      })
      .catch(err => {
        console.error('Failed to process payout:', err);
        setProcessingPayout(false);
        alert('Failed to process payout. Please try again.');
      });
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (selectedInstructor) {
      if (tab === 'pending') {
        fetchUnpaidPayouts(selectedInstructor._id);
        fetchPayoutDetails(selectedInstructor._id);
      } else if (tab === 'done') {
        fetchPayoutBatches(selectedInstructor._id);
      }
    }
  };

  // ... existing code for filtering instructors ...

  
  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="instructors-list-container">Loading...</div>;
  if (error) return <div className="instructors-list-container">{error}</div>;

  return (
    <div className="instructors-page">
      <h2>Instructor Management</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search instructors..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="instructor-search-input"
      />

      <div className="instructors-layout">
        {/* Instructors List */}
        <div className="instructors-list-container">
          <div className="instructor-card create-card" onClick={() => navigate('/dashboard/instructors/create')}>
            <span className="plus-icon">+</span>
            <span>Create Instructor</span>
          </div>

          {filteredInstructors.length === 0 ? (
            <p>No instructors found.</p>
          ) : (
            filteredInstructors.map(instructor => (
              <div 
                className={`instructor-card ${selectedInstructor && selectedInstructor._id === instructor._id ? 'selected' : ''}`} 
                key={instructor._id}
                onClick={() => handleInstructorClick(instructor)}
              >
                <img src={instructor.instructorAvatar} alt={instructor.name} className="instructor-avatar" />
                <h3>{instructor.name}</h3>
                <p>{instructor.email}</p>
                <p>Status: {instructor.verifiedInstructor ? 'Verified' : 'Not Verified'}</p>
              </div>
            ))
          )}
        </div>

        {/* Instructor Details */}
        {selectedInstructor && (
          <div className="instructor-details">

            <div className="tabs">
              <button onClick={() => handleTabChange('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
              <button onClick={() => handleTabChange('sold')} className={activeTab === 'sold' ? 'active' : ''}>Sold Courses</button>
              <button onClick={() => handleTabChange('done')} className={activeTab === 'done' ? 'active' : ''}>Payments Done</button>
              <button onClick={() => handleTabChange('pending')} className={activeTab === 'pending' ? 'active' : ''}>Pending Payments</button>
            </div>

            {activeTab === 'profile' && (
              <div className="instructor-info">
                <h2>{selectedInstructor.name}</h2>
                <p><strong>Instructor ID</strong> {selectedInstructor._id} </p>
                <p><strong>Email:</strong> {selectedInstructor.email}</p>
                <p><strong>Status:</strong> {selectedInstructor.verifiedInstructor ? 'Verified' : 'Not Verified'}</p>
                <p><strong>Bio:</strong> {selectedInstructor.bio || 'No bio available'}</p>
                <p><strong>Expertise:</strong> {selectedInstructor.expertise && selectedInstructor.expertise.length > 0 ? 
                  selectedInstructor.expertise.join(', ') : 'None specified'}</p>
                  
                <p><strong>stripeAccountId:</strong> {selectedInstructor.stripeAccountId}</p>  

                <p><strong>Commission:</strong> {selectedInstructor.commission}%</p>
                
                <p><strong>Joined:</strong> {new Date(selectedInstructor.createdAt).toLocaleDateString()}</p>
                
                <div className="instructor-actions">
                  <button 
                    className={selectedInstructor.verifiedInstructor ? 'disapprove-btn' : 'approve-btn'}
                    onClick={(e) => handleVerifyInstructor(selectedInstructor._id, e)}
                  >
                    {selectedInstructor.verifiedInstructor ? 'Disapprove' : 'Approve'}
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/instructors/edit/${selectedInstructor._id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeleteInstructor(selectedInstructor._id, e)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'sold' && (
              <div className="instructor-courses">
                <h3>Sold Courses</h3>
                {loadingCourses ? (
                  <p>Loading courses...</p>
                ) : instructorCourses.length === 0 ? (
                  <p>No courses found for this instructor.</p>
                ) : (
                  <div className="courses-grid">
                    {instructorCourses.map(course => (
                      <div 
                        className="course-item" 
                        key={course._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/courses/edit/${course._id}`);
                        }}
                      >
                        <img src={course.image} alt={course.title} className="course-thumbnail" />
                        <div className="course-info">
                          <h4>{course.title}</h4>
                          <p>Level: {course.level}</p>
                          <p>Price: ${course.price}</p>
                          <p>Enrolled Students: {course.enrolledUsers.length}</p>
                          <p>Status: {course.courseVerified ? 'Verified' : 'Not Verified'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'done' && (
              <div className="payment-history">
                <h3>Processed Payouts</h3>
                {loadingPayouts ? (
                  <p>Loading payment history...</p>
                ) : payoutBatches.length === 0 ? (
                  <p>No processed payouts found for this instructor.</p>
                ) : (
                  <table className="payment-table">
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Total Amount</th>
                        <th>Platform Fee</th>
                        <th>Instructor Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutBatches.map((batch) => (
                        <tr key={batch._id}>
                          <td>{batch._id.substring(0, 8)}...</td>
                          <td>${batch.paidPayoutId.amount.toFixed(2)}</td>
                          <td>${batch.totalPlatformCut.toFixed(2)}</td>
                          <td>${(batch.paidPayoutId.amount - batch.totalPlatformCut).toFixed(2)}</td>
                          <td>{new Date(batch.payoutAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="payment-history">
                <h3>Pending Payments</h3>
                {loadingPayouts ? (
                  <p>Loading pending payments...</p>
                ) : unpaidPayouts.length === 0 ? (
                  <p>No pending payments found for this instructor.</p>
                ) : (
                  <>
                    {unpaidPayoutDetails && (
                      <div className="payout-summary">
                        <h4>Payout Summary</h4>
                        <div className="summary-details">
                          <p><strong>Total Amount:</strong> ${unpaidPayoutDetails.summary.totalAmount.toFixed(2)}</p>
                          <p><strong>Commission Rate:</strong> {unpaidPayoutDetails.summary.commissionRate}%</p>
                          <p><strong>Instructor Amount:</strong> ${unpaidPayoutDetails.summary.instructorAmount.toFixed(2)}</p>
                          <p><strong>Platform Fee:</strong> ${unpaidPayoutDetails.summary.platformCut.toFixed(2)}</p>
                        </div>
                        {/* <button 
                          className="process-payout-btn" 
                          onClick={() => setShowPayoutModal(true)}
                          disabled={processingPayout || unpaidPayouts.length === 0}
                        >
                          {processingPayout ? 'Processing...' : 'Process Payout'}
                        </button> */}
                      </div>
                    )}
                    
                    <table className="payment-table">
                      <thead>
                        <tr>
                          <th>Course</th>
                          <th>Student</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unpaidPayouts.map((payout) => (
                          <tr key={payout._id}>
                            <td>{payout.courseId.title}</td>
                            <td>{payout.studentId.name}</td>
                            <td>${payout.amount.toFixed(2)}</td>
                            <td>{new Date(payout.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}

            {/* Payout Confirmation Modal */}
            {showPayoutModal && unpaidPayoutDetails && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Confirm Payout</h3>
                  <p>Are you sure you want to process the following payout?</p>
                  
                  <div className="payout-details">
                    <p><strong>Instructor:</strong> {selectedInstructor.name}</p>
                    <p><strong>Total Amount:</strong> ${unpaidPayoutDetails.summary.totalAmount.toFixed(2)}</p>
                    <p><strong>Instructor Amount:</strong> ${unpaidPayoutDetails.summary.instructorAmount.toFixed(2)}</p>
                    <p><strong>Platform Fee:</strong> ${unpaidPayoutDetails.summary.platformCut.toFixed(2)}</p>
                  </div>
                  
                  <div className="modal-actions">
                    <button 
                      className="cancel-btn" 
                      onClick={() => setShowPayoutModal(false)}
                      disabled={processingPayout}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-btn" 
                      onClick={handleProcessPayout}
                      disabled={processingPayout}
                    >
                      {processingPayout ? 'Processing...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}