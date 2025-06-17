import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { getPatient } from '../utils/api';
import '../styles/Doctors.css';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatient(id);
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patient details');
        setLoading(false);
        toast.error('Failed to load patient details');
        console.error('Fetch Patient Error:', err);
      }
    };
    fetchPatient();
  }, [id]);

  const handleCancel = () => {
    navigate('/patients');
  };

  const renderGeneralDetails = () => {
    if (!patient) return null;

    const fullName = [
      patient.firstName,
      patient.middleName,
      patient.lastName
    ].filter(Boolean).join(' ');

    return (
      <div className="details-section">
        <div className="detail-row">
          <span className="detail-label">Full Name:</span>
          <span className="detail-value">{fullName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Gender:</span>
          <span className="detail-value">{patient.gender}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date of Birth:</span>
          <span className="detail-value">{patient.dateOfBirth}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Telephone:</span>
          <span className="detail-value">{patient.telephone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Additional Phone:</span>
          <span className="detail-value">{patient.additionalPhone || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{patient.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Comments:</span>
          <span className="detail-value">{patient.comments || 'N/A'}</span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralDetails();
      case 'appointments':
        return <div className="placeholder-tab">Appointment History (Placeholder)</div>;
      case 'early-detection':
        return <div className="placeholder-tab">Early Detection (Placeholder)</div>;
      default:
        return null;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <div className="modern-form-container">
            <div className="modern-form-card">
              <button className="cancel-btn" onClick={handleCancel} title="Back to Patients">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="form-section">
                <h2 className="form-title">Patient Details</h2>
                <div className="tab-row">
                  <button
                    className={activeTab === 'general' ? 'active-tab' : 'tab-button'}
                    onClick={() => setActiveTab('general')}
                  >
                    General Details
                  </button>
                  <button
                    className={activeTab === 'appointments' ? 'active-tab' : 'tab-button'}
                    onClick={() => setActiveTab('appointments')}
                  >
                    Appointment History
                  </button>
                  <button
                    className={activeTab === 'early-detection' ? 'active-tab' : 'tab-button'}
                    onClick={() => setActiveTab('early-detection')}
                  >
                    Early Detection
                  </button>
                </div>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;