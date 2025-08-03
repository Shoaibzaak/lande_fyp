import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HelpCreatorPage = () => {
  const navigate = useNavigate();
  
  const helpOptions = [
    { 
      title: "Join as Volunteer",
      description: "Donate your time and skills to make a difference",
      icon: "⏱️"
    },
    { 
      title: "Share Resources", 
      description: "Contribute goods or services to those in need",
      icon: "🔄"
    },
    { 
      title: "Spread Awareness", 
      description: "Help us reach more people by sharing our mission",
      icon: "📢"
    },
    { 
      title: "Fundraise", 
      description: "Start your own campaign to support our cause",
      icon: "💰"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const hoverEffect = {
    scale: 1.03,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: { type: 'spring', stiffness: 300 }
  };

  const handleJoinClick = () => {
    navigate('/join-movement');
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6"
          variants={itemVariants}
        >
          Become a Force for Good
        </motion.h2>
        
        <motion.p 
          className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12"
          variants={itemVariants}
        >
          Join our community of changemakers and help transform lives through your actions.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {helpOptions.map((option, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col items-center text-center"
              variants={itemVariants}
              whileHover={hoverEffect}
            >
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{option.description}</p>
              <motion.button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoinClick}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Ready to make an impact?</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative flex-grow max-w-md">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input 
                type="number" 
                placeholder="Enter donation amount" 
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <motion.button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinClick}
            >
              Join the Movement
            </motion.button>
          </div>
          
          <p className="text-center text-gray-500 mt-6">
            Every contribution helps us build a better world together.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HelpCreatorPage;