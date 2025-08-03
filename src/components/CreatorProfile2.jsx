import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';

const NGOProfileForm = () => {
      const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    createdBy: ''
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const allowedImageTypes = [".png", ".jpg", ".gif", ".jpeg"];

  // Extract userId from query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    if (userId) {
      setFormData(prev => ({ ...prev, createdBy: userId }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedImageTypes.includes(fileExt)) {
      setErrors(prev => ({ ...prev, image: 'Please upload a valid image file (PNG, JPG, GIF, JPEG)' }));
      return;
    }

    setFormData(prev => ({ ...prev, image: file }));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image is required';
    if (!formData.createdBy) newErrors.createdBy = 'User ID is missing';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('createdBy', formData.createdBy);

      const response = await axios.post(
        'https://satillite-town-backend-5i11.vercel.app/api/ngo/createNgo',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccessMessage('NGO profile created successfully!');
        navigate(`/`);
      // You can redirect or perform other actions after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create NGO profile. Please try again.');
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
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">NGO Profile Information</h2>
        
        {/* Success and error messages */}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              NGO Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Child Protection Foundation"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe your NGO's mission and activities..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              NGO Image/Logo
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/gif, image/jpg"
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                {formData.image ? (
                  <>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-blue-600">{formData.image.name}</span>
                      <span className="text-green-600 text-sm">✓ Uploaded</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Change Image
                    </button>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </label>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NGOProfileForm;