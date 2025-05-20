import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/StudentAdmission.css';

const StudentAdmission = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    cnic: '',
    
    // Step 2: Contact Information
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
    
    // Step 3: Academic Information
    previousSchool: '',
    previousDegree: '',
    previousGPA: '',
    yearOfCompletion: '',
    
    // Step 4: Program Selection
    department: '',
    program: '',
    semester: '',
    admissionType: '',
    
    // Step 5: Parent/Guardian Information
    parentName: '',
    parentOccupation: '',
    parentPhone: '',
    parentEmail: '',
    
    // Step 6: Documents
    documents: {
      cnicCopy: null,
      previousDegree: null,
      transcript: null,
      photo: null
    }
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Check file size (5MB limit)
      if (files[0].size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(files[0].type)) {
        setError('Only .pdf, .jpg, .jpeg, and .png files are allowed');
        return;
      }

      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0]
        }
      }));
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          Object.keys(formData.documents).forEach(docKey => {
            if (formData.documents[docKey]) {
              formDataToSend.append(docKey, formData.documents[docKey]);
            }
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Submitting form data:', Object.fromEntries(formDataToSend));

      const response = await axios.post('http://localhost:5000/api/students/admission', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        alert('Admission form submitted successfully! Your Student ID is: ' + response.data.data.studentId);
        navigate('/student/dashboard');
      } else {
        setError(response.data.message || 'Failed to submit admission form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit admission form. Please try again.');
    }
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.name || !formData.dateOfBirth || !formData.gender || !formData.nationality || !formData.cnic) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.email || !formData.phoneNumber || !formData.address || !formData.city || !formData.country) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 3:
        if (!formData.previousSchool || !formData.previousDegree || !formData.previousGPA || !formData.yearOfCompletion) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 4:
        if (!formData.department || !formData.program || !formData.semester || !formData.admissionType) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 5:
        if (!formData.parentName || !formData.parentOccupation || !formData.parentPhone || !formData.parentEmail) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 6:
        if (!formData.documents.cnicCopy || !formData.documents.previousDegree || !formData.documents.transcript || !formData.documents.photo) {
          setError('Please upload all required documents');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="step">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>CNIC</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step">
            <h3>Contact Information</h3>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step">
            <h3>Academic Information</h3>
            <div className="form-group">
              <label>Previous School/College</label>
              <input
                type="text"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Previous Degree</label>
              <input
                type="text"
                name="previousDegree"
                value={formData.previousDegree}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Previous GPA</label>
              <input
                type="number"
                name="previousGPA"
                value={formData.previousGPA}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Year of Completion</label>
              <input
                type="number"
                name="yearOfCompletion"
                value={formData.yearOfCompletion}
                onChange={handleInputChange}
                min="2000"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step">
            <h3>Program Selection</h3>
            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Program</label>
              <input
                type="text"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                placeholder="e.g., BS Computer Science"
                required
              />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Admission Type</label>
              <select
                name="admissionType"
                value={formData.admissionType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Admission Type</option>
                <option value="regular">Regular</option>
                <option value="transfer">Transfer</option>
                <option value="readmission">Readmission</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step">
            <h3>Parent/Guardian Information</h3>
            <div className="form-group">
              <label>Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="parentOccupation"
                value={formData.parentOccupation}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step">
            <h3>Required Documents</h3>
            <div className="form-group">
              <label>CNIC Copy</label>
              <input
                type="file"
                name="cnicCopy"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
            </div>
            <div className="form-group">
              <label>Previous Degree Certificate</label>
              <input
                type="file"
                name="previousDegree"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
            </div>
            <div className="form-group">
              <label>Transcript</label>
              <input
                type="file"
                name="transcript"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
            </div>
            <div className="form-group">
              <label>Recent Photograph</label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admission-container">
      <div className="admission-box">
        <h1>Student Admission Form</h1>
        <div className="progress-bar">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          {renderStep()}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="prev-button">
                Previous
              </button>
            )}
            {currentStep < 6 ? (
              <button type="button" onClick={nextStep} className="next-button">
                Next
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentAdmission; 