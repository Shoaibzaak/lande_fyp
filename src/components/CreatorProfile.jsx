import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const HelpCreatorProfileSetup = () => {
  const [step, setStep] = useState(1);
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    profilePic: null,
    verifyDocuments: null,
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const allowedImageTypes = [".png", ".jpg", ".gif", ".jpeg"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedImageTypes.includes(fileExt)) {
      setErrors(prev => ({ ...prev, [e.target.name]: 'Please upload a valid image file (PNG, JPG, GIF, JPEG)' }));
      return;
    }

    setFormData(prev => ({ ...prev, [e.target.name]: file }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.profilePic) newErrors.profilePic = 'Profile picture is required';
    if (!formData.verifyDocuments) newErrors.verifyDocuments = 'Verification document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('profilePic', formData.profilePic);
      formDataToSend.append('verifyDocuments', formData.verifyDocuments);

      const response = await axios.post(
        'https://satillite-town-backend-5i11.vercel.app/api/auth/user/uploadJobCreatorProfile',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Get the created user ID from response
      const userId = response?.data?.data._id; // Assuming the response contains the _id field
      // Redirect to create-ngo page with the user ID
      navigate(`/create-ngo?userId=${userId}`);
      
      setSuccessMessage('Profile created successfully! Redirecting...');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-32 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Help Creator Profile Setup</h2>
            <div className="text-sm text-gray-500">Step {step} of 2</div>
          </div>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="mb-8">
            <div className="flex mb-2">
              <div className={`w-1/2 h-2 rounded-l-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`w-1/2 h-2 rounded-r-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Child protection"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="We provide protection to children"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="test23442df3@gmail.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="034332324234"
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your password"
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Wahando village Vehari"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.profilePic ? 'border-red-500' : 'border-gray-300'}`}>
                    <input
                      type="file"
                      id="profilePic"
                      name="profilePic"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/gif, image/jpg"
                      className="hidden"
                    />
                    <label htmlFor="profilePic" className="cursor-pointer">
                      {formData.profilePic ? (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-blue-600">{formData.profilePic.name}</span>
                          <span className="text-green-600 text-sm">✓ Uploaded</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600">Click to upload profile picture</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.profilePic && <p className="mt-1 text-sm text-red-600">{errors.profilePic}</p>}
                </div>

                <div>
                  <label htmlFor="verifyDocuments" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Documents
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.verifyDocuments ? 'border-red-500' : 'border-gray-300'}`}>
                    <input
                      type="file"
                      id="verifyDocuments"
                      name="verifyDocuments"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/gif, image/jpg, .pdf"
                      className="hidden"
                    />
                    <label htmlFor="verifyDocuments" className="cursor-pointer">
                      {formData.verifyDocuments ? (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-blue-600">{formData.verifyDocuments.name}</span>
                          <span className="text-green-600 text-sm">✓ Uploaded</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600">Click to upload verification documents</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, PDF up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.verifyDocuments && <p className="mt-1 text-sm text-red-600">{errors.verifyDocuments}</p>}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Submitting...' : 'Complete Profile'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default HelpCreatorProfileSetup;