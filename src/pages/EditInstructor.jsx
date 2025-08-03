import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInstructorById, updateInstructor, getInstructorCourses } from '../api';
import '../styles/EditInstructor.css';

export default function EditInstructor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    commission: 70,
    stripeAccountId: '',
    verifiedInstructor: false,
    instructorAvatar: '',
    bio: '',
    expertise: []

  });
  const [expertiseInput, setExpertiseInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    // Fetch instructor data
    getInstructorById(id)
      .then(data => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '', // Don't show the password
          verifiedInstructor: data.verifiedInstructor || false,
          instructorAvatar: data.instructorAvatar || '',
          bio: data.bio || '',
          expertise: data.expertise || []
          
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch instructor data');
        setLoading(false);
      });

    // Fetch instructor courses
    setLoadingCourses(true);
    getInstructorCourses(id)
      .then(data => {
        setCourses(data);
        setLoadingCourses(false);
      })
      .catch(err => {
        console.error('Failed to fetch instructor courses:', err);
        setCourses([]);
        setLoadingCourses(false);
      });
  }, [id]);

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setFormData({
    ...formData,
    [name]: type === 'checkbox' ? checked : value
  });
};


  const handleAddExpertise = () => {
    if (expertiseInput.trim() !== '') {
      setFormData({
        ...formData,
        expertise: [...formData.expertise, expertiseInput.trim()]
      });
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (index) => {
    const updatedExpertise = [...formData.expertise];
    updatedExpertise.splice(index, 1);
    setFormData({
      ...formData,
      expertise: updatedExpertise
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Only include password if it was changed
    const dataToUpdate = { ...formData };
    if (!dataToUpdate.password) {
      delete dataToUpdate.password;
    }

    updateInstructor(id, dataToUpdate)
      .then(() => {
        setSaving(false);
        navigate('/dashboard/instructors');
      })
      .catch(err => {
        setError('Failed to update instructor. Please try again.');
        setSaving(false);
      });
  };

  if (loading) return <div className="edit-instructor-container">Loading...</div>;
  if (error && !formData.name) return <div className="edit-instructor-container">{error}</div>;

  return (
    <div className="edit-instructor-container">
      <h2>Edit Instructor</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="instructor-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password (Leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="instructorAvatar">Avatar URL</label>
          <input
            type="text"
            id="instructorAvatar"
            name="instructorAvatar"
            value={formData.instructorAvatar}
            onChange={handleChange}
          />
          {formData.instructorAvatar && (
            <div className="avatar-preview">
              <img src={formData.instructorAvatar} alt="Avatar Preview" />
            </div>
          )}
        </div>


        <div className="form-group">
  <label htmlFor="commission">Commission (%)</label>
  <input
    type="number"
    id="commission"
    name="commission"
    value={formData.commission}
    onChange={handleChange}
    min="0"
    max="100"
    
  />
</div>

    <div className="form-group">
  <label htmlFor="stripeAccountId">Stripe AccountId</label>
  <input
    type="text"
    id="stripeAccountId"
    name="stripeAccountId"  // <-- yahan exact same as formData key hona chahiye
    value={formData.stripeAccountId}
    onChange={handleChange}
  />
</div>

        
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="expertise">Expertise</label>
          <div className="expertise-input-container">
            <input
              type="text"
              id="expertise"
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              placeholder="Add expertise and press Add"
            />
            <button type="button" onClick={handleAddExpertise}>Add</button>
          </div>
          
          <div className="expertise-tags">
            {formData.expertise.map((item, index) => (
              <div key={index} className="expertise-tag">
                {item}
                <button type="button" onClick={() => handleRemoveExpertise(index)}>×</button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="verifiedInstructor"
              checked={formData.verifiedInstructor}
              onChange={handleChange}
            />
            Verified Instructor
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard/instructors')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Instructor Courses Section */}
      <div className="instructor-courses-section">
        <h3>Instructor Courses</h3>
        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <p>No courses found for this instructor.</p>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div 
                className="course-item" 
                key={course._id}
                onClick={() => navigate(`/dashboard/courses/edit/${course._id}`)}
              >
                <img src={course.image} alt={course.title} className="course-thumbnail" />
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <p>Level: {course.level}</p>
                  <p>Price: ${course.price}</p>
                  <p>Status: {course.courseVerified ? 'Verified' : 'Not Verified'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}