



import '../styles/PayoutsSummary.css';
import { useEffect, useState } from 'react';
import {
  getUnpaidPayoutsSummary,
  getPaidPayouts,
  getPayoutBatches,
  getUnpaidPayoutsDetails,
  processInstructorPayout,
  getAllUsersPaymentHistory,
} from '../api'; // Your API helpers


export default function PayoutsSummary() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pending, setPending] = useState([]);
  const [paid, setPaid] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [modalDetails, setModalDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
 const [allPayments, setAllPayments] = useState([]);
const [selectedBatch, setSelectedBatch] = useState(null);
const [batchModalOpen, setBatchModalOpen] = useState(false);


const [selectedPayout, setSelectedPayout] = useState(null);
const [payoutModalOpen, setPayoutModalOpen] = useState(false);





const fetchAll = async () => {
  setLoading(true);
  try {
    const [pendingData, paidData, batchData] = await Promise.all([
      getUnpaidPayoutsSummary(),
      getPaidPayouts(),
      getPayoutBatches() // Now returns array by default
    ]);
    setPending(pendingData);
    setPaid(paidData);
    setBatches(Array.isArray(batchData) ? batchData : []);
  } catch (err) {
    console.error('Error loading payout data:', err);
  } finally {
    setLoading(false);
  }
};





  useEffect(() => {
    fetchAll();
  }, []);
 
useEffect(() => {
  const fetchAllPayments = async () => {
    setLoading(true);
    try {
      const response = await getAllUsersPaymentHistory();
      if (response.success) {
        setAllPayments(response.payments);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAllPayments();
}, []);

const handleReleasePayment = async (instructorId) => {
  setSelectedInstructor(instructorId);
  try {
    const details = await getUnpaidPayoutsDetails(instructorId);
    console.log("✅ MODAL DETAILS:", details); // 🔍 check this
    setModalDetails(details);
    setShowModal(true);
  } catch (err) {
    console.error('Failed to fetch payout details:', err);
  }
};

  const handleConfirmPayout = async () => {
    try {
      await processInstructorPayout(selectedInstructor);
      setShowModal(false);
      setModalDetails(null);
      setSelectedInstructor(null);
      fetchAll(); // Refresh data
    } catch (err) {
      console.error('Failed to process payout:', err);
    }
  };

const BatchDetailsModal = ({ batch, onClose }) => {
  if (!batch) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Batch Payout Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p><strong>Instructor:</strong> {batch.instructorId?.name}</p>
<p><strong>Email:</strong> {batch.instructorId?.email}</p>


<p><strong>Instructor Received:</strong> ${batch.instructorAmount?.toFixed(2)}</p>


          </div>
          <div>
            
            <p><strong>Payout Date:</strong> {new Date(batch.payoutDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p><strong>Total Amount:</strong> ${batch.amount?.toFixed(2)}</p>
            <p><strong>Commission Rate:</strong> {batch.commissionRate}%</p>
          </div>
          <div>
            <p><strong>Platform Profit:</strong> ${batch.platformCut?.toFixed(2)}</p>
          </div>
        </div>

        <h4 className="mb-2">Transactions ({batch.transactions.length})</h4>
        <div className="overflow-auto max-h-96">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {batch.transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.studentName} ({txn.studentEmail})</td>
                  <td>{txn.courseName}</td>
                  <td>${txn.amount.toFixed(2)}</td>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const PayoutDetailsModal = ({ payout, onClose }) => {
  if (!payout) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Payout Details</h3>
        <p><strong>Instructor:</strong> {payout.instructorName} ({payout.instructorEmail})</p>
        <p><strong>Total Amount:</strong> ${payout.totalAmount.toFixed(2)}</p>
        <p><strong>Instructor Received:</strong> ${payout.instructorAmount.toFixed(2)} ({payout.commissionRate}%)</p>
        <p><strong>Platform Cut:</strong> ${payout.platformCut.toFixed(2)}</p>
        <p><strong>Paid On:</strong> {new Date(payout.paidAt).toLocaleDateString()}</p>
        
        <h4>Transactions:</h4>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payout.transactions.map((txn, index) => (
              <tr key={index}>
                <td>{txn.studentName} ({txn.studentEmail})</td>
                <td>{txn.courseName}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>{new Date(txn.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};




  return (
    <div className="admin-payout-dashboard">
      <h2>Admin Payouts Dashboard</h2>

      <div className="tab-buttons">
        {['pending', 'paid', 'admin', 'user'].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'pending' && 'Pending Instructor Payouts'}
            {tab === 'paid' && 'Paid Instructor Payouts'}
            {tab === 'admin' && 'Admin Summary'}
            {tab === 'user' && 'User Payments History'}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}



{activeTab === 'pending' && !loading && (
  <table className="payouts-table">
    <thead>
      <tr>
        <th>Instructor</th>
        <th>Courses Sold</th>
        <th>Total Earnings</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {pending.length === 0 ? (
        <tr>
          <td colSpan="5">No unpaid payouts found.</td>
        </tr>
      ) : (
        pending.map((payout) => (
          <tr key={payout.instructorId}>
            <td>{payout.instructorName}</td>
            <td>{payout.courseCount}</td>
            <td>${payout.totalAmount.toFixed(2)}</td>
            <td>{payout.status}</td>
            <td>
              <button onClick={() => handleReleasePayment(payout.instructorId)}>
                Release Payment
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
)}


{payoutModalOpen && (
  <PayoutDetailsModal 
    payout={selectedPayout} 
    onClose={() => setPayoutModalOpen(false)} 
  />
)} 



      {/* TAB 2: Paid Payouts */}
      {activeTab === 'paid' && (
          <table className="payouts-table">
    <thead>
      <tr>
        <th>Instructor</th>
        <th>Total Amount</th>
        <th>Instructor Received</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {paid.length === 0 ? (
        <tr>
          <td colSpan="5">No paid payouts found.</td>
        </tr>
      ) : (
        paid.map((payout) => (
          <tr key={payout._id}>
            <td>{payout.instructorName}</td>
            <td>${payout.totalAmount.toFixed(2)}</td>
            <td>${payout.instructorAmount.toFixed(2)} ({payout.commissionRate}%)</td>
            <td>{new Date(payout.paidAt).toLocaleDateString()}</td>
            <td>
              <button 
                onClick={() => {
                  setSelectedPayout(payout);
                  setPayoutModalOpen(true);
                }}
              >
                View Details
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
        
      )}





{batchModalOpen && (
  <BatchDetailsModal 
    batch={selectedBatch} 
    onClose={() => setBatchModalOpen(false)} 
  />
)}
      {/* TAB 3: Admin Summary */}
   {activeTab === 'admin' && (
  <div className="batch-payouts">
    <h3 className="text-xl font-semibold mb-4">Payout Batches</h3>
    <table className="payouts-table">
      <thead>
        <tr>
          <th>Instructor</th>
          <th>Total Amount</th>
          <th>Platform Profit</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {batches.length === 0 ? (
          <tr>
            <td colSpan="5">No payout batches found.</td>
          </tr>
        ) : (
          batches.map((batch) => {
            const payout = batch.paidPayoutId;
            return (
              <tr key={batch._id}>
                <td>{batch.instructorId?.name || 'N/A'}</td>
                <td>${payout?.amount?.toFixed(2) || '0.00'}</td>
                <td>${payout?.platformCut?.toFixed(2) || '0.00'}</td>
                <td>{batch.payoutAt ? new Date(batch.payoutAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button
                    onClick={() => {
                      const transactions = (payout?.unpaidIds || []).map((item) => ({
                        studentName: item.studentId?.name || '',
                        studentEmail: item.studentId?.email || '',
                        courseName: item.courseId?.title || '',
                        amount: item.amount || 0,
                        date: item.createdAt,
                      }));
                      setSelectedBatch({
                        ...payout,
                        instructorId: batch.instructorId,
                        transactions,
                        payoutDate: batch.payoutAt
                      });
                      setBatchModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
)}


      {/* TAB 4: User Payments - Placeholder */}
      {activeTab === 'user' && (
        
       
// Render in your component

  <table className="payment-history-table">
    <thead>
      <tr>
        <th>User</th>
        <th>Course</th>
        <th>Amount</th>
        <th>Payment ID</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {allPayments.map((payment) => (
        <tr key={`${payment.userId}-${payment.paymentId}`}>
          <td>{payment.userName} ({payment.userEmail})</td>
          <td>{payment.courseName}</td>
          <td>${payment.amount.toFixed(2)}</td>
          <td className="payment-id">{payment.paymentId}</td>
          <td>
            <span className={`status-badge ${payment.status}`}>
              {payment.status}
            </span>
          </td>
          <td>{new Date(payment.date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>


      )}

      {/* MODAL */}
     {showModal && modalDetails && (
  <div className="modal">
    <div className="modal-box">
      <h3>Release Payout</h3>

      <p><strong>Instructor:</strong> {modalDetails.instructorName}</p>
      <p><strong>Stripe Account ID:</strong> {modalDetails.stripeAccountId}</p>

      <p><strong>Courses/Users Paid:</strong> {modalDetails.payouts.length}</p>
      <p><strong>Total Amount:</strong> ${modalDetails.summary.totalAmount.toFixed(2)}</p>
      <p><strong>Commission:</strong> {modalDetails.summary.commissionRate}%</p>
      <p><strong>Instructor Amount:</strong> ${modalDetails.summary.instructorAmount.toFixed(2)}</p>
      <p><strong>Platform Cut:</strong> ${modalDetails.summary.platformCut.toFixed(2)}</p>

      <button onClick={handleConfirmPayout}>Confirm & Release</button>
      <button id='cancel' onClick={() => setShowModal(false)}>Cancel</button>
    </div>
  </div>
)}








    </div>
  );
}


