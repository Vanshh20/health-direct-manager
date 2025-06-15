import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import DoctorsList from './DoctorsList';
import DoctorsGrid from './DoctorsGrid';
import { getDoctors } from '../utils/api';
import '../styles/Doctors.css';

function Doctors() {
  const [currentView, setCurrentView] = useState('list');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await getDoctors();
      setDoctors(response.data.doctors);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch doctors');
      toast.error('Failed to load doctors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  if (error) {
    return <div className="app">{error}</div>;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          {currentView === 'list' ? (
            <DoctorsList
              doctors={doctors}
              onViewChange={handleViewChange}
              currentView={currentView}
              refetchDoctors={fetchDoctors}
            />
          ) : (
            <DoctorsGrid
              doctors={doctors}
              onViewChange={handleViewChange}
              currentView={currentView}
              refetchDoctors={fetchDoctors}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctors;