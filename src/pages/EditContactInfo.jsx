import { useState, useEffect } from 'react';
import '../styles/EditContactInfo.css';
import { getContactInfo, updateContactInfo } from '../api';

export default function EditContactInfo() {
  const [contactInfo, setContactInfo] = useState({
    _id: '',
    phone: '',
    email: '',
    address: '',
    __v: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contact info on component mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (err) {
        setError('Failed to load contact information');
        console.error(err);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await updateContactInfo({
        phone: contactInfo.phone,
        email: contactInfo.email,
        address: contactInfo.address
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to update contact info');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-contact-info-container">
      <h2>Contact Information</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Contact information updated!</div>}
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            placeholder="+92-300-000000"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
            placeholder="info@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Office Address</label>
          <textarea
            id="address"
            name="address"
            value={contactInfo.address}
            onChange={handleChange}
            rows="3"
            placeholder="SIBAU MIRPURKHS, Pakistan"
            required
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}