import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { X, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateAppointment from "@/components/Calendar/CreateAppointment";
import ShowAppointment from "@/components/Calendar/ShowAppointment";

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Amanda Chavez",
      start: "2025-05-23T10:00:00",
      end: "2025-05-23T10:30:00",
      extendedProps: {
        age: 36,
        gender: "female",
        serviceNo: "1234 6546 897",
        service: "Physiotherapy",
      },
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "12:30",
    patientName: "",
    age: "",
    gender: "",
    service: "",
    serviceNo: "",
  });
  const [doctorSearch, setDoctorSearch] = useState("");
  const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Helper function to calculate smart positioning
  const calculatePopoverPosition = (clickedRect) => {
    const popoverWidth = 300; // Approximate popover width
    const popoverHeight = 400; // Approximate popover height
    const margin = 20;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = clickedRect.left + clickedRect.width / 2;
    let y = clickedRect.top + margin;
    let transformX = "-50%"; // Default: center horizontally

    // Check if popover would go off the right edge
    if (x + popoverWidth / 2 > viewportWidth - margin) {
      x = clickedRect.right - margin;
      transformX = "-100%"; // Align to right edge of clicked element
    }

    // Check if popover would go off the left edge
    if (x - (popoverWidth + 200) < margin) {
      x = clickedRect.left + margin;
      transformX = "0%"; // Align to left edge of clicked element
    }

    // Check if popover would go off the bottom edge
    if (y + popoverHeight > viewportHeight - margin) {
      y = clickedRect.bottom - margin - popoverHeight;
      y = Math.max(y, margin); // Ensure it doesn't go above viewport
    }

    return { x, y, transformX };
  };

  const doctors = [
    "Dr. Place Holder",
    "Dr. Place Holder 01",
    "Dr. Place Holder 02",
    "Dr. Place Holder 03",
    "Dr. Place Holder 04",
    "Dr. Place Holder 05",
  ];

  const calendarRef = useRef(null);

  const handleDateClick = (arg) => {
    const rect = arg.dayEl.getBoundingClientRect();

    // Calculate smart position
    const position = calculatePopoverPosition(rect);
    setPopoverPosition(position);

    setSelectedDate(arg.dateStr);
    setShowAddModal(true);
    setFormData({
      doctor: "",
      date: arg.dateStr,
      time: "12:30",
      patientName: "",
      age: "",
      gender: "",
      service: "",
      serviceNo: "",
    });
    setDoctorSearch("");
    setShowDoctorSuggestions(false);
  };

  const handleEventClick = (info) => {
    const rect = info.el.getBoundingClientRect();

    // Calculate smart position
    const position = calculatePopoverPosition(rect);
    setShowDetailsModal(true);

    setPopoverPosition(position);

    // Set the selected event
    setSelectedEvent(info.event);

    setSelectedEvent(info.event);
    setPopupPosition({
      x: rect.left + window.scrollX + 20,
      y: rect.top + window.scrollY + 30,
    });
  };

  // const closePopup = () => {
  //   setSelectedEvent(null);
  // };

  const closeModal = () => {
    setShowAddModal(false);
    setFormData({
      doctor: "",
      date: "",
      time: "12:30",
      patientName: "",
      age: "",
      service: "",
      serviceNo: "",
    });
    setDoctorSearch("");
    setShowDoctorSuggestions(false);
  };

  const handleAddPatient = () => {
    if (
      formData.patientName &&
      formData.doctor &&
      formData.date &&
      formData.time
    ) {
      const [hours, minutes] = formData.time.split(":");
      const startTime = `${formData.date}T${hours}:${minutes}:00`;

      // Calculate end time (30 minutes later)
      const startDate = new Date(startTime);
      const endDate = new Date(startDate.getTime() + 30 * 60000);
      const endTime = endDate.toISOString().slice(0, 19);

      const newEvent = {
        id: String(events.length + 1),
        title: formData.patientName,
        start: startTime,
        end: endTime,
        extendedProps: {
          age: parseInt(formData.age) || 30,
          serviceNo: formData.serviceNo || `TEMP${Date.now()}`,
          service: formData.service || "General Consultation",
          doctor: formData.doctor,
        },
      };
      setEvents([...events, newEvent]);
      closeModal();
    } else {
      alert(
        "Please fill in all required fields: Patient Name, Doctor, Date, and Time"
      );
    }
  };

  const handleDoctorSearch = (value) => {
    setDoctorSearch(value);
    setShowDoctorSuggestions(value.length > 0);
  };

  const selectDoctor = (doctor) => {
    setFormData((prev) => ({ ...prev, doctor }));
    setDoctorSearch(doctor);
    setShowDoctorSuggestions(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#calendar-popup")) {
        closePopup();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <div className="relative calendar-area">
            <div className="calendar-header">
              <h2 className="page-title">Schedule Appointments</h2>
              <p className="page-subtitle">See all your appointments</p>
            </div>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                start: "prev,next today",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
            />

            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
              <DialogContent className="!max-w-[25rem]">
                <ShowAppointment
                  selectedEvent={selectedEvent}
                  popoverPosition={popoverPosition}
                />
              </DialogContent>
            </Dialog>

            {/* {showAddModal && ( */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogContent>
                <CreateAppointment
                  popoverPosition={popoverPosition}
                  closeModal={closeModal}
                  doctorSearch={doctorSearch}
                  handleDoctorSearch={handleDoctorSearch}
                  showDoctorSuggestions={showDoctorSuggestions}
                  filteredDoctors={filteredDoctors}
                  selectDoctor={selectDoctor}
                  handleInputChange={handleInputChange}
                  formData={formData}
                  handleAddPatient={handleAddPatient}
                />
              </DialogContent>
            </Dialog>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;