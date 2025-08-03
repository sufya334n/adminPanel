import { useState, useEffect } from 'react';
import { getContacts, markAsReplied, deleteContact, sendReply } from '../api';
import '../styles/ContactsList.css';

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load contact messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (contact) => {
    setSelectedContact(contact);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message');
      return;
    }
    
    try {
      setSending(true);
      // Send actual email reply
      await sendReply(selectedContact._id, replyMessage);
      
      setShowReplyModal(false);
      setSelectedContact(null);
      setReplyMessage('');
      
      // Update the contacts list
      const updatedContacts = contacts.map(c => 
        c._id === selectedContact._id ? {...c, isReplied: true, repliedAt: new Date()} : c
      );
      setContacts(updatedContacts);
      
    } catch (err) {
      setError('Failed to send reply');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap is message ko delete karna chahte hain?')) return;
    
    try {
      await deleteContact(id);
      setContacts(contacts.filter(c => c._id !== id));
    } catch (err) {
      setError('Failed to delete message');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="contacts-list-container">
      <h2>Contact Messages</h2>
      
      {contacts.length === 0 ? (
        <p className="no-contacts">No contact messages found.</p>
      ) : (
        <div className="contacts-list">
          {contacts.map(contact => (
            <div key={contact._id} className={`contact-card ${contact.isReplied ? 'replied' : ''}`}>
              <div className="contact-header">
                <h3>{contact.name}</h3>
                <span className="contact-date">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="contact-email">{contact.email}</div>
              <div className="contact-message">{contact.message}</div>
              
              <div className="contact-actions">
                {!contact.isReplied ? (
                  <button 
                    className="reply-btn" 
                    onClick={() => handleReply(contact)}
                  >
                    Reply
                  </button>
                ) : (
                  <span className="replied-badge">
                    Replied on {new Date(contact.repliedAt).toLocaleDateString()}
                  </span>
                )}
                
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(contact._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showReplyModal && selectedContact && (
        <div className="reply-modal">
          <div className="reply-modal-content">
            <h3>Reply to {selectedContact.name}</h3>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Original Message:</strong> {selectedContact.message}</p>
            
            <div className="form-group">
              <label htmlFor="reply">Your Reply</label>
              <textarea 
                id="reply" 
                rows="5" 
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              ></textarea>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn" 
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedContact(null);
                  setReplyMessage('');
                }}
                disabled={sending}
              >
                Cancel
              </button>
              <button 
                className="send-btn" 
                onClick={handleSendReply}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}