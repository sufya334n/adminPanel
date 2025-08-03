import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../api';
import '../styles/EditUser.css';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    avatar: '',
    isBlocked: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user data
    getUserById(id)
      .then(data => {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          password: '', // Don't populate password for security
          phone: data.phone || '',
          avatar: data.avatar || '',
          isBlocked: data.isBlocked || false
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch user data');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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

    updateUser(id, dataToUpdate)
      .then(() => {
        setSaving(false);
        navigate('/dashboard/users');
      })
      .catch(err => {
        setError('Failed to update user. Please try again.');
        setSaving(false);
      });
  };

  if (loading) return <div className="edit-user-container">Loading...</div>;
  if (error && !formData.name) return <div className="edit-user-container">{error}</div>;

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      
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
          <label htmlFor="password">Password (Leave blank to keep unchanged)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
        
        <div className="form-group">
          <label htmlFor="avatar">Avatar URL</label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar}
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
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}