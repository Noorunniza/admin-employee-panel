import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ComplaintDetail.css';

const statusSteps = ['Pending', 'In Review', 'Resolved', 'Rejected'];

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('');

  useEffect(() => {
   axios.get(`http://localhost:5000/admin/complaints/${id}`)

      .then((res) => {
        setComplaint(res.data);
        setCurrentStatus(res.data.status || 'Pending');
      })
      .catch((err) => console.error('Fetch Error:', err));
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/complaints/${id}/status`, { status });
      setCurrentStatus(res.data.status);
      alert('Status updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update status');
    }
  };

  if (!complaint) return <p className="loading-message">Fetching complaint details...</p>;

  return (
    <div className="complaint-detail-container">
      <button onClick={() => navigate('/view-complaints')} className="back-button">← Back</button>
      <h2>Complaint Details</h2>

      <div className="complaint-info">
        <p><strong>User ID:</strong> {complaint.user_id?._id}</p>
        <p><strong>Name:</strong> {complaint.user_id?.name}</p>
        <p><strong>Email:</strong> {complaint.user_id?.email}</p>
        <p><strong>Phone:</strong> {complaint.user_id?.phone_no}</p>
        <p><strong>Complaint:</strong> {complaint.complaints}</p>
        <p><strong>Date:</strong> {new Date(complaint.created_at).toLocaleString()}</p>
      </div>

      <div className="status-section">
        <h4>Update Status</h4>
        <div className="status-steps-container">
          {statusSteps.map((step) => (
            <div
              key={step}
              className={`status-step ${currentStatus === step ? 'active' : ''}`}
              onClick={() => updateStatus(step)}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
