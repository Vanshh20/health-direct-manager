import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { getDoctor, updateDoctor } from '../utils/api';
import '../styles/Doctors.css';

function EditDoctorForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    specialty: '',
    serviceType: [],
    email: '',
    phone: '',
    feesAmount: '',
    currency: 'USD'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const serviceTypeOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' }
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await getDoctor(id);
        const doctor = response.data.doctor;
        setFormData({
          firstName: doctor.firstName,
          middleName: doctor.middleName || '',
          lastName: doctor.lastName,
          specialty: doctor.specialty,
          serviceType: doctor.serviceType,
          email: doctor.email,
          phone: doctor.phone || '',
          feesAmount: doctor.feesAmount.toString(),
          currency: doctor.currency
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor:', error.response?.data || error.message);
        toast.error('Failed to load doctor data');
        navigate('/doctors');
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleServiceTypeChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    setFormData(prev => ({
      ...prev,
      serviceType: selectedValues
    }));
    
    if (errors.serviceType) {
      setErrors(prev => ({
        ...prev,
        serviceType: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }
    
    if (formData.serviceType.length === 0) {
      newErrors.serviceType = 'At least one service type is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.feesAmount.trim()) {
      newErrors.feesAmount = 'Fees amount is required';
    } else if (isNaN(formData.feesAmount) || parseFloat(formData.feesAmount) <= 0) {
      newErrors.feesAmount = 'Please enter a valid amount';
    }
    
    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await updateDoctor(id, {
          ...formData,
          feesAmount: parseFloat(formData.feesAmount)
        });
        toast.success('Doctor updated successfully');
        navigate('/doctors');
      } catch (error) {
        console.error('Error updating doctor:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to update doctor');
      }
    }
  };

  const handleCancel = () => {
    navigate('/doctors');
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <div className="modern-form-container">
            <div className="modern-form-card">
              <button className="cancel-btn" onClick={handleCancel} title="Cancel">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className="form-section">
                <h2 className="form-title">Edit Doctor Details</h2>
                
                <form onSubmit={handleSubmit} className="modern-form">
                  <div className="form-row">
                    <div className="form-field">
                      <label>First Name <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-field">
                      <label>Last Name <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field full-width">
                      <label>Middle Name</label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        placeholder="Middle Name"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Specialty <span className="required-asterisk">*</span></label>
                      <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        placeholder="Specialty"
                        className={errors.specialty ? 'error' : ''}
                      />
                      {errors.specialty && <span className="field-error">{errors.specialty}</span>}
                    </div>
                    
                    <div className="form-field">
                      <label>Service Type <span className="required-asterisk">*</span></label>
                      <Select
                        isMulti
                        options={serviceTypeOptions}
                        value={serviceTypeOptions.filter(option => formData.serviceType.includes(option.value))}
                        onChange={handleServiceTypeChange}
                        className={errors.serviceType ? 'error' : ''}
                        classNamePrefix="react-select"
                        placeholder="Select service types"
                      />
                      {errors.serviceType && <span className="field-error">{errors.serviceType}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+123 456 789"
                      />
                    </div>
                    
                    <div className="form-field">
                      <label>Fees Amount <span className="required-asterisk">*</span></label>
                      <input
                        type="number"
                        name="feesAmount"
                        value={formData.feesAmount}
                        onChange={handleChange}
                        placeholder="Amount"
                        min="0"
                        step="0.01"
                        className={errors.feesAmount ? 'error' : ''}
                      />
                      {errors.feesAmount && <span className="field-error">{errors.feesAmount}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Email <span className="required-asterisk">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                    
                    <div className="form-field">
                      <label>Currency <span className="required-asterisk">*</span></label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className={errors.currency ? 'error' : ''}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="INR">INR</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                      {errors.currency && <span className="field-error">{errors.currency}</span>}
                    </div>
                  </div>

                  <button type="submit" className="save-changes-btn">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDoctorForm;