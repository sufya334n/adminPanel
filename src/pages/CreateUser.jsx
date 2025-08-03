import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api';
import '../styles/CreateUser.css';

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    avatar: 'https://ui-avatars.com/api/?name=User',
    isBlocked: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Update avatar with name
    const updatedFormData = {
      ...formData,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}`
    };

    createUser(updatedFormData)
      .then(() => {
        setLoading(false);
        navigate('/dashboard/users');
      })
      .catch(err => {
        setError('Failed to create user. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="create-user-container">
      <h2>Create New User</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="user-form">
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
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isBlocked"
              checked={formData.isBlocked}
              onChange={handleChange}
            />
            Block User
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard/users')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}