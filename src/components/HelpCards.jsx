import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Add this import
export default function HelpCardsSection() {
    const navigate = useNavigate(); 
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await fetch('https://satillite-town-backend-5i11.vercel.app/api/ngo/getAllNgos');
        if (!response.ok) {
          throw new Error('Failed to fetch NGOs');
        }
        const data = await response.json();
        const dataArray=data?.data?.Ngo
        setNgos(dataArray);
      } catch (err) {
        setError(err.message);
        toast.error(`Error fetching NGOs: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token; // returns true if token exists, false otherwise
  };
const handleApplyClick = (ngo) => {
  if (!checkAuth()) {
    toast.error('Please login or register to apply for help', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
    navigate('/register', { 
      state: { 
        from: '/helpForm', // Redirect to helpForm after login
        message: 'You need to register/login to apply for help',
        ngoData: ngo // Pass the NGO data to pre-fill the form
      } 
    });
    return;
  }

  // If authenticated, navigate directly to helpForm with NGO data
  navigate('/helpForm', {
    state: {
      ngoData: ngo // Pass the selected NGO data to pre-fill the form
    }
  });
};

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Loading NGOs...
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Please wait while we load the available assistance programs
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Error Loading NGOs
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Assistance Programs
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Select a program to apply for assistance
          </p>
        </div>
        
        {ngos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No assistance programs available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ngos.map((ngo) => (
              <div 
                key={ngo._id}
                className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-in-out transform hover:-translate-y-2 ${hoveredCard === ngo._id ? 'ring-4 ring-blue-500 scale-105' : ''}`}
                onMouseEnter={() => setHoveredCard(ngo._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  console.log(`Selected: ${ngo.title}`);
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={ngo.image} 
                    alt={ngo.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${hoveredCard === ngo._id ? 'scale-110' : 'scale-100'}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x300?text=NGO+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                </div>
                
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{ngo.title}</h3>
                  <p className="text-gray-600 mb-4">{ngo.description}</p>
                  <button 
                    className={`
                      w-full py-2 px-4 rounded-md font-medium 
                      transition-all duration-300 ease-in-out
                      ${hoveredCard === ngo._id 
                        ? 'bg-blue-600 text-white shadow-lg transform hover:scale-105' 
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700'
                      }
                      hover:shadow-md
                      active:scale-95
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                      cursor-pointer
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyClick(ngo);
                    }}
                  >
                    Apply for help
                  </button>
                </div>
                
                <div 
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${hoveredCard === ngo._id ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    background: 'radial-gradient(circle at var(--x) var(--y), rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}