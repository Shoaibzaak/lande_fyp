import { useState, useEffect } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function HelpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    needDescription: '',
    helpType: '',
    location: '',
    documents: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  // Configure toast notifications
  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Get userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      showError('Please login to submit a help request');
      navigate('/login');
      return;
    }
    setUserId(storedUserId);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Validate file type and size
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        showError('Invalid file type. Please upload PDF, JPEG, or PNG files only.');
        return;
      }
      
      if (file.size > maxSize) {
        showError('File size too large. Maximum allowed size is 5MB.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        documents: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      showError('User authentication required');
      return;
    }

    // Form validation
    if (!formData.needDescription.trim()) {
      showError('Please describe your need in detail');
      return;
    }

    if (!formData.helpType) {
      showError('Please select a help type');
      return;
    }

    if (!formData.location.trim()) {
      showError('Please provide your location');
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('needDescription', formData.needDescription);
      formPayload.append('helpType', formData.helpType);
      formPayload.append('location', formData.location);
      formPayload.append('userId', userId);
      
      if (formData.documents) {
        formPayload.append('documents', formData.documents);
      }

      const response = await fetch('https://satillite-town-backend-5i11.vercel.app/api/ngo/createRequest', {
        method: 'POST',
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request. Please try again.');
      }

      showSuccess('Help request submitted successfully! Our team will review your request shortly.');
      
      // Reset form
      setFormData({
        needDescription: '',
        helpType: '',
        location: '',
        documents: null
      });
      
      // Navigate to home after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      showError(error.message);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const helpTypes = [
    'Medical Assistance',
    'Food Support',
    'Shelter/Housing',
    'Education Support',
    'Financial Aid',
    'Other Basic Needs'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="max-w-3xl mx-auto">
        {/* Header with logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Request for Assistance</h2>
          <p className="mt-2 text-lg text-gray-600">
            Please fill out this form to help us understand your needs better
          </p>
        </div>

        {/* Form container */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Need Description */}
            <div>
              <label htmlFor="needDescription" className="block text-sm font-medium text-gray-700">
                Describe your need in detail *
              </label>
              <div className="mt-1">
                <textarea
                  id="needDescription"
                  name="needDescription"
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                  placeholder="Please describe why you need help and how it will assist you..."
                  value={formData.needDescription}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Help Type */}
            <div>
              <label htmlFor="helpType" className="block text-sm font-medium text-gray-700">
                Type of help needed *
              </label>
              <select
                id="helpType"
                name="helpType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.helpType}
                onChange={handleChange}
                required
              >
                <option value="">Select a help type</option>
                {helpTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Your location *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="City, State/Province, Country"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Documents */}
            <div>
              <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                Supporting Documents
              </label>
              <div className="mt-1 flex items-center">
                <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-50">
                  <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-2 text-base leading-normal">
                    {formData.documents ? formData.documents.name : 'Select a file (PDF, JPEG, PNG)'}
                  </span>
                  <input 
                    id="documents" 
                    name="documents" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Please upload any documents that can verify your need for help (max 5MB)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Your information will be kept confidential and only used to process your assistance request.</p>
        </div>
      </div>
    </div>
  );
}