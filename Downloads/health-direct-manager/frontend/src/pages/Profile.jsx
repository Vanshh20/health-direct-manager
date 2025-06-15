import React, { useState, useEffect, useContext } from "react";
import { Camera, ChevronDown } from "lucide-react";
import { toast } from 'react-toastify';
import "../styles/Profile.css";
import { IoCamera } from "react-icons/io5";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../utils/api";

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    patronymicName: "",
    gender: "Male",
    dateOfBirth: "",
    age: "",
    residence: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const profileData = response.data.user;
        console.log('Fetched profile data:', profileData); // Debug log
        const dateOfBirth = profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : "";
        setFormData({
          name: profileData.name || "",
          surname: profileData.surname || "",
          patronymicName: profileData.patronymicName || "",
          gender: profileData.gender || "Male",
          dateOfBirth,
          age: calculateAge(dateOfBirth),
          residence: profileData.residence || "",
        });
        if (profileData.profilePicture) {
          setProfileImage(`data:image/jpeg;base64,${Buffer.from(profileData.profilePicture).toString('base64')}`);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        toast.error('Failed to load profile');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'dateOfBirth') {
        newData.age = calculateAge(value);
      }
      return newData;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = ['name', 'surname', 'gender', 'dateOfBirth', 'residence'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    const birthDate = new Date(formData.dateOfBirth);
    if (birthDate > new Date()) {
      toast.error('Date of birth cannot be in the future');
      return;
    }
    if (!formData.age || parseInt(formData.age) <= 0) {
      toast.error('Invalid age calculated from date of birth');
      return;
    }

    try {
      const updatedData = {
        ...formData,
        dateOfBirth: birthDate.toISOString(),
        age: parseInt(formData.age),
        profilePicture: profileImage ? profileImage.split(',')[1] : null, // Base64 data or null
      };
      console.log('Sending update data:', updatedData); // Debug log
      const response = await updateProfile(updatedData);
      console.log('Update response:', response.data); // Debug log
      // Update AuthContext with new user data, preserving existing token
      if (response.data.user) {
        login(localStorage.getItem('token'), response.data.user);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('No user data in response');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      // Prevent logout by not calling logout explicitly
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <div className="profile-wrapper">
            <div className="profile-container">
              {/* Profile Photo Section */}
              <div className="photo-section">
                <div className="photo-circle">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="profile-image-select"
                    />
                  ) : (
                    <div className="photo-placeholder">
                      <IoCamera size={36} className="camera-icon" />
                      <span className="photo-text">Click to change photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="photo-input"
                  />
                </div>
              </div>

              {/* Form Section */}
              <div className="form-section">
                <h2 className="form-title">Manager Profile</h2>

                <div className="form-grid">
                  {/* Surname */}
                  <div className="form-group">
                    <label className="form-label">
                      Surname <span className="required">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      placeholder="Surname"
                      className="form-input"
                    />
                  </div>

                  {/* First Name */}
                  <div className="form-group">
                    <label className="form-label">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className="form-input"
                    />
                  </div>

                  {/* Patronymic Name */}
                  <div className="form-group">
                    <label className="form-label">Patronymic Name</label>
                    <input
                      type="text"
                      name="patronymicName"
                      value={formData.patronymicName}
                      onChange={handleInputChange}
                      placeholder="Patronymic Name"
                      className="form-input"
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-group">
                    <label className="form-label">
                      Gender <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={20} className="select-icon" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="form-group">
                    <label className="form-label">
                      Date of Birth <span className="required">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  {/* City of Residence */}
                  <div className="form-group">
                    <label className="form-label">
                      City of Residence <span className="required">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="residence"
                      value={formData.residence}
                      onChange={handleInputChange}
                      placeholder="City of Residence"
                      className="form-input"
                    />
                  </div>
                </div>

                <button onClick={handleSave} className="save-button">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;