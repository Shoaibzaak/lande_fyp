import { motion } from 'framer-motion';
import './styles.css';

const DonateSection = () => {
  const donationOptions = [
    { amount: 10, description: "Supports basic needs for one person" },
    { amount: 25, description: "Provides meals for a family" },
    { amount: 50, description: "Helps fund educational programs" },
    { amount: 100, description: "Sponsors a child's needs for a month" },
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

  return (
    <section className="donate-section">
      <motion.div 
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2 variants={itemVariants}>Make a Difference Today</motion.h2>
        <motion.p className="subtitle" variants={itemVariants}>
          Your donation helps us continue our mission and change lives.
        </motion.p>

        <div className="donation-options">
          {donationOptions.map((option, index) => (
            <motion.div 
              key={index}
              className="donation-card"
              variants={itemVariants}
              whileHover={hoverEffect}
            >
              <div className="amount">${option.amount}</div>
              <p className="description">{option.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Donate Now
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div className="custom-donation" variants={itemVariants}>
          <h3>Or enter a custom amount</h3>
          <div className="input-group">
            <span>$</span>
            <input type="number" placeholder="Enter amount" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default DonateSection;