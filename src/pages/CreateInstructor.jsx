import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInstructor } from '../api';
import '../styles/CreateInstructor.css';

export default function CreateInstructor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    verifiedInstructor: false,
    instructorAvatar: 'https://ui-avatars.com/api/?name=Instructor',
    bio: '',
    expertise: [],
    commission: 70,
    accountNumber: ''
  });
  const [expertiseInput, setExpertiseInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setLoading(true);
    setError(null);

    // Update avatar with name
    const updatedFormData = {
      ...formData,
      instructorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`
    };

    createInstructor(updatedFormData)
      .then(() => {
        setLoading(false);
        navigate('/dashboard/instructors');
      })
      .catch(err => {
        setError('Failed to create instructor. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="create-instructor-container">
      <h2>Create New Instructor</h2>
      
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
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
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
        
        <div className="form-group">
          <label htmlFor="commission">Commission</label>
          <input
            type="number"
            id="commission"
            name="commission"
            value={formData.commission}
            
            onChange={handleChange}
            
            required

          />
        </div>
        
        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            placeholder="Enter account number"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard/instructors')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Instructor'}
          </button>
        </div>
      </form>
    </div>
  );
}