import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousal';
import AboutSection from './components/AboutSection';
import HelpCards from './components/HelpCards';
import Register from './components/Register';
import Signin from './components/Signin';
import DonateSection from './components/Donate';
import HelpForm from './components/HelpForm';
import HelpCreatorProfileSetup from './components/CreatorProfile';
import NGOProfileForm from './components/CreatorProfile2';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactSection from './components/Contace';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroCarousel />
            <AboutSection />
            <HelpCards />
            {/* <HelpCreatorProfileSetup /> */}
            <DonateSection/>
               <ContactSection/>
                    <Footer/>
          </>
        } />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/help" element={<HelpCards />} />
         <Route path="/donate" element={<DonateSection />} />
          <Route path="/contact" element={<ContactSection />} />
                    <Route path="/join-movement" element={<HelpCreatorProfileSetup />} />
                                  <Route path="/create-ngo" element={<NGOProfileForm />} />
         <Route path="/register" element={<Register />} />
           <Route path="/login" element={<Signin />} />
              <Route path="/helpForm" element={<HelpForm />} />
      </Routes>
    </Router>
  );
}

export default App;