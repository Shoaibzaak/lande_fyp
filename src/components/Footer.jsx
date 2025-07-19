import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './styles.css';

const Footer = () => {
  const links = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
    { title: "Programs", url: "/programs" },
    { title: "Donate", url: "/donate" },
    { title: "Contact", url: "/contact" },
  ];

  const socialLinks = [
    { icon: "facebook", url: "#" },
    { icon: "twitter", url: "#" },
    { icon: "instagram", url: "#" },
    { icon: "linkedin", url: "#" },
    { icon: "youtube", url: "#" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="footer">
      <motion.div 
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="footer-content">
          <motion.div className="footer-about" variants={itemVariants}>
            <h3>About Our Charity</h3>
            <p>
              We are a non-profit organization dedicated to making a difference in 
              communities around the world through education, healthcare, and 
              sustainable development initiatives.
            </p>
            <div className="newsletter">
              <h4>Subscribe to our newsletter</h4>
              <div className="newsletter-input">
                <input type="email" placeholder="Your email address" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div className="footer-links" variants={itemVariants}>
            <h3>Quick Links</h3>
            <ul>
              {links.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link to={link.url}>{link.title}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer-contact" variants={itemVariants}>
            <h3>Contact Us</h3>
            <p>123 Charity Street, Compassion City, CC 12345</p>
            <p>Email: contact@yourcharity.org</p>
            <p>Phone: +1 (555) 123-4567</p>
            
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="footer-bottom"
          variants={itemVariants}
        >
          <p>&copy; {new Date().getFullYear()} Your Charity Name. All rights reserved.</p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;