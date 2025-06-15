import { Search, X } from "lucide-react";
import React from "react";
import "./CreateAppointment.css";

const CreateAppointment = ({
  popoverPosition,
  closeModal,
  doctorSearch,
  handleDoctorSearch,
  showDoctorSuggestions,
  filteredDoctors,
  selectDoctor,
  handleInputChange,
  formData,
  handleAddPatient,
}) => {
  return (
    <div className="appointment-container">
      {/* Header */}
      <div className="appointment-header">
        {/* <button onClick={closeModal} className="close-btn">
          <X size={20} />
        </button> */}
      </div>

      <div className="appointment-body">
        {/* Doctor Search */}
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search Doctor..."
              value={doctorSearch}
              onChange={(e) => handleDoctorSearch(e.target.value)}
              className="text-input"
            />
            <Search className="search-icon" size={16} />
          </div>

          {showDoctorSuggestions && filteredDoctors.length > 0 && (
            <div className="suggestions-list">
              {filteredDoctors.map((doctor, index) => (
                <div
                  key={index}
                  onClick={() => selectDoctor(doctor)}
                  className="suggestion-item"
                >
                  {doctor}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date Picker */}
        <div className="input-group">
          <label className="label">Select Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="text-input"
          />
        </div>

        {/* Time Picker */}
        <div className="input-group">
          <label className="label">Select Time</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            className="text-input"
          />
        </div>

        {/* Patient Details */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Patient Name"
            value={formData.patientName}
            onChange={(e) => handleInputChange("patientName", e.target.value)}
            className="text-input"
          />
          <input
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className="text-input"
          />
          <input
            type="text"
            placeholder="Gender"
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="text-input"
          />
          <input
            type="text"
            placeholder="Service"
            value={formData.service}
            onChange={(e) => handleInputChange("service", e.target.value)}
            className="text-input"
          />
        </div>

        {/* Add Patient Button */}
        <button onClick={handleAddPatient} className="submit-btn">
          Add Patient
        </button>
      </div>
    </div>
  );
};

export default CreateAppointment;