import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteDoctor } from '../utils/api';

function DoctorsList({ doctors, onViewChange, currentView, refetchDoctors }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteDoctor(doctorToDelete._id);
      toast.success('Doctor deleted successfully');
      setShowDeleteModal(false);
      setDoctorToDelete(null);
      await refetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const openDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDoctorToDelete(null);
  };

  return (
    <div className="applications-container">
      <div className="applications-header">
        <div className="applications-title">
          <h2>Doctors</h2>
          <p>Manage all doctors</p>
        </div>
        <div className="view-controls">
          <button 
            className={currentView === 'list' ? 'active' : ''}
            onClick={() => onViewChange('list')}
          >
            Compact
          </button>
          <button 
            className={currentView === 'grid' ? 'active' : ''}
            onClick={() => onViewChange('grid')}
          >
            Expanded
          </button>
          <button 
            className="add-doctor-btn"
            onClick={() => navigate('/doctors/add')}
          >
            Add New Doctor
          </button>
        </div>
      </div>

      <div className="doctors-list">
        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-item">
              <div className="doctor-info">
                <div className="doctor-name">
                  {doctor.firstName} {doctor.middleName} {doctor.lastName}
                </div>
                <div className="doctor-details">
                  <span className="specialty">{doctor.specialty}</span>
                  {doctor.serviceType.map((type) => (
                    <span
                      key={type}
                      className="service-type-badge"
                      data-type={type.toLowerCase()}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="doctor-contact">
                  <span className="email">{doctor.email}</span>
                  <span className="phone">{doctor.phone || '-'}</span>
                </div>
                <div className="doctor-fees">
                  <span className="fees">{doctor.currency} {doctor.feesAmount}</span>
                </div>
              </div>
              <div className="doctor-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => navigate(`/doctors/edit/${doctor._id}`)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => openDeleteModal(doctor)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3 className="delete-modal-title">Confirm Deletion</h3>
            <p className="delete-modal-message">
              Are you sure you want to delete {doctorToDelete?.firstName} {doctorToDelete?.lastName}?
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="delete-modal-confirm" onClick={handleDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsList;