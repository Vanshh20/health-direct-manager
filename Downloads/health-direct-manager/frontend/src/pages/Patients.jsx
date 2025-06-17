import React, { useState, useEffect } from "react";
import {
  FaMars,
  FaVenus,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { PiTelegramLogo } from "react-icons/pi";
import clsx from "clsx";
import "../styles/Patients.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../utils/api';

const Tabs = ["Today", "Last Week", "Last Month"];
const StatusTabs = ["New", "Progress", "Finished"];

const Patients = () => {
  const [selectedTab, setSelectedTab] = useState("Today");
  const [selectedStatusTab, setSelectedStatusTab] = useState("New");
  const [layout, setLayout] = useState("Expanded");
  const [activePatient, setActivePatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients();
        // Add default status to each patient for filtering
        const patientsWithStatus = response.data.map(patient => ({
          ...patient,
          status: patient.status || 'New'
        }));
        setPatients(patientsWithStatus);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patients');
        setLoading(false);
        console.error('Fetch Patients Error:', err);
      }
    };
    fetchPatients();
  }, []);

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const filterData = () => {
    // Remove status filtering in Expanded view since status is not in schema
    return patients;
  };

  const renderIcons = () => (
    <div className="icon-buttons">
      <button className="icon phone">
        <FaPhoneAlt />
      </button>
      <button className="icon email">
        <IoMail />
      </button>
      <button className="icon whatsapp">
        <FaWhatsapp />
      </button>
      <button className="icon telegram">
        <PiTelegramLogo />
      </button>
    </div>
  );

  const renderPatientCard = (patient, index) => {
    const isActive = patient._id === activePatient;
    const genderIcon =
      patient.gender === "Male" ? (
        <FaMars className="gender-icon male" />
      ) : (
        <FaVenus className="gender-icon female" />
      );

    const fullName = [
      patient.firstName,
      patient.middleName,
      patient.lastName
    ].filter(Boolean).join(' ');

    const content =
      layout === "Compact" ? (
        <div
          key={patient._id}
          className={clsx("patient-card", isActive ? "active" : "")}
          onClick={() => setActivePatient(patient._id)}
        >
          <div className="card-top">
            <div className="left-section">
              <h2 className="patient-name">{fullName}</h2>
            </div>
            <div className="right-section">
              <button
                className="btn details"
                onClick={() => navigate(`/patients/${patient._id}`)}
              >
                View Details
              </button>
              <div className="gender-appt-div">
                <div className="gender-icon-wrapper">{genderIcon}</div>
                <div className="appointment-number">
                  Appointment No. <span>{patient._id.slice(-6)}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="divider" />

          <div className="card-bottom">
            <div className="info-left">
              <div className="info-row">
                <div>
                  <small>Requested Service</small>
                  <strong>{patient.comments || 'N/A'}</strong>
                </div>
                <div className="info-row-2">
                  <div>
                    <small>Age</small>
                    <div>{calculateAge(patient.dateOfBirth)}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="info-right">{renderIcons()}</div>
          </div>
        </div>
      ) : (
        <div
          key={patient._id}
          className={clsx("patient-card-2", isActive ? "active" : "")}
          onClick={() => setActivePatient(patient._id)}
        >
          <div className="header-row-2">
            <div>
              <h2 className="patient-name-2">{fullName}</h2>
            </div>
            <div className="gender-icon-wrapper-2">{genderIcon}</div>
          </div>

          <div className="info-group-2">
            <div>
              <small>Requested Service</small>
              <strong>{patient.comments || 'N/A'}</strong>
            </div>
            <div>
              <small>Age</small>
              <div>{calculateAge(patient.dateOfBirth)}</div>
            </div>
          </div>

          <hr className="divider" />
          <div className="appt-number-2">
            Appl. No: <span>{patient._id.slice(-6)}</span>
          </div>

          <button
            className="btn-2 details-2"
            onClick={() => navigate(`/patients/${patient._id}`)}
          >
            View Details
          </button>

          <div className="icon-buttons-2">
            <button className="icon-2 phone-2">
              <FaPhoneAlt />
            </button>
            <button className="icon-2 email-2">
              <IoMail />
            </button>
            <button className="icon-2 whatsapp-2">
              <FaWhatsapp />
            </button>
            <button className="icon-2 telegram-2">
              <PiTelegramLogo />
            </button>
          </div>
        </div>
      );

    return layout === "Compact" ? (
      <div className="compact-wrapper">{content}</div>
    ) : (
      <div className="expanded-wrapper">{content}</div>
    );
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <div className="patients-container">
            <h1 className="page-title">Patients</h1>
            <p className="page-subtitle">See all the patients here</p>

            <div className="toolbar">
              <div className="tab-row">
                {layout === "Compact"
                  ? Tabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setSelectedTab(tab);
                        }}
                        className={clsx(
                          "tab-button",
                          selectedTab === tab ? "active-tab" : ""
                        )}
                      >
                        {tab}
                      </button>
                    ))
                  : StatusTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setSelectedStatusTab(tab);
                        }}
                        className={clsx(
                          "tab-button",
                          selectedStatusTab === tab ? "active-tab" : ""
                        )}
                      >
                        {tab}
                      </button>
                    ))}
              </div>
              <div className="layout-pagination-div">
                <div className="layout-switch">
                  <button
                    onClick={() => setLayout("Compact")}
                    className={clsx(
                      "layout-button-1",
                      layout === "Compact" ? "active-layout" : ""
                    )}
                  >
                    Compact
                  </button>
                  <button
                    onClick={() => setLayout("Expanded")}
                    className={clsx(
                      "layout-button-2",
                      layout === "Expanded" ? "active-layout" : ""
                    )}
                  >
                    Expanded
                  </button>
                </div>
                <button
                  onClick={() => navigate('/patients/add')}
                  className="add-patient-btn"
                >
                  Add Patient
                </button>
              </div>
            </div>

            <div
              className={clsx(
                layout === "Compact" ? "compact-list" : "expanded-grid"
              )}
            >
              {loading ? (
                <p>Loading patients...</p>
              ) : error ? (
                <p>{error}</p>
              ) : filterData().length > 0 ? (
                filterData().map((patient, i) => renderPatientCard(patient, i))
              ) : (
                <p>No patients available. Please add a patient.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;