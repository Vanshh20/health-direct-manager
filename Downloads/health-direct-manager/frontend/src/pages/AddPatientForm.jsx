import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { addPatient } from '../utils/api';
import '../styles/Doctors.css';

function AddPatientForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    telephone: '',
    additionalPhone: '',
    email: '',
    comments: '',
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

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

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setFormData(prev => ({
      ...prev,
      dateOfBirth: formattedDate
    }));
    
    if (errors.dateOfBirth) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: ''
      }));
    }
  };

  const handleGenderChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      gender: selectedOption ? selectedOption.value : ''
    }));
    
    if (errors.gender) {
      setErrors(prev => ({
        ...prev,
        gender: ''
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
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Invalid date format. Use YYYY-MM-DD';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Telephone number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await addPatient({
          ...formData,
          comments: formData.comments || '',
        });
        toast.success('Patient added successfully');
        navigate('/patients');
      } catch (error) {
        console.error('Error adding patient:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to add patient');
      }
    }
  };

  const handleCancel = () => {
    navigate('/patients');
  };

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
                <h2 className="form-title">Patient Details</h2>
                
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
                      <label>Gender <span className="required-asterisk">*</span></label>
                      <Select
                        options={genderOptions}
                        value={genderOptions.find(option => option.value === formData.gender)}
                        onChange={handleGenderChange}
                        className={errors.gender ? 'error' : ''}
                        classNamePrefix="react-select"
                        placeholder="Select gender"
                      />
                      {errors.gender && <span className="field-error">{errors.gender}</span>}
                    </div>
                    
                    <div className="form-field">
                      <label>Date of Birth <span className="required-asterisk">*</span></label>
                      <DatePicker
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date"
                        className={errors.dateOfBirth ? 'error' : ''}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        maxDate={new Date()}
                      />
                      {errors.dateOfBirth && <span className="field-error">{errors.dateOfBirth}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Telephone <span className="required-asterisk">*</span></label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder="+123 456 789"
                        className={errors.telephone ? 'error' : ''}
                      />
                      {errors.telephone && <span className="field-error">{errors.telephone}</span>}
                    </div>
                    
                    <div className="form-field">
                      <label>Additional Phone</label>
                      <input
                        type="tel"
                        name="additionalPhone"
                        value={formData.additionalPhone}
                        onChange={handleChange}
                        placeholder="+123 456 789"
                      />
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
                  </div>

                  <div className="form-row">
                    <div className="form-field full-width">
                      <label>Comments</label>
                      <input
                        type="text"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="Any comments"
                      />
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

export default AddPatientForm;