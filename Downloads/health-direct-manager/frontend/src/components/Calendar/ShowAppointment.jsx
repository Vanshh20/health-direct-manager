import React from "react";
import "./ShowAppointment.css";
import {
  PiGenderMaleBold,
  PiGenderFemaleBold,
  PiTelegramLogo,
} from "react-icons/pi";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

const ShowAppointment = ({ selectedEvent, popoverPosition }) => {
  console.log(selectedEvent);

  return (
    <div className="show-appointment-container">
      <div className="show-appointment-header">
        <h4 className="show-appointment-title">{selectedEvent.title}</h4>
        <span className="show-appointment-icon">
          {" "}
          {selectedEvent.extendedProps.gender === "female" ? (
            <PiGenderFemaleBold />
          ) : (
            <PiGenderMaleBold />
          )}{" "}
        </span>
      </div>
      <div className="show-appointment-info">
        <p className="show-appointment-info-title"> Requested Service </p>{" "}
        {selectedEvent.extendedProps.service}
      </div>
      <div className="show-appointment-info">
        <p className="show-appointment-info-title"> Age </p>{" "}
        {selectedEvent?.extendedProps?.age}
      </div>
      <div className="show-appointment-info">
        <p className="show-appointment-info-title"> Appointment Date </p>{" "}
        {new Date(selectedEvent.start).toLocaleDateString()}
      </div>
      <div className="show-appointment-info">
        <p className="show-appointment-info-title">Time of Request</p>{" "}
        {new Date(selectedEvent.start).toLocaleTimeString()} -{" "}
        {new Date(selectedEvent.end).toLocaleTimeString()}
      </div>
      <div className="show-appointment-service-no">
        Service No: {selectedEvent.extendedProps.serviceNo}
      </div>

      <div className="show-appointment-actions">
        <button className="show-btn-view">View Report</button>
        <button className="show-btn-delete">Delete Patient</button>
      </div>

      <div className="show-appointment-colors">
        <a href="/" className="show-dot show-dot-green">
          <FaPhoneAlt />
        </a>
        <a href="/" className="show-dot show-dot-pink">
          <IoMail />
        </a>
        <a href="/" className="show-dot show-dot-darkgreen">
          <FaWhatsapp />
        </a>
        <a href="/" className="show-dot show-dot-blue">
          <PiTelegramLogo />
        </a>
      </div>
    </div>
  );
};

export default ShowAppointment;