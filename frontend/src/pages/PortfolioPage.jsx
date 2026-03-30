import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Projects from '../components/Projects/Projects';
import Certificates from '../components/Certificates/Certificates';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

export default function PortfolioPage() {
  return (
    <>
      {/* fixed grid overlay */}
      <div className="grid-bg" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
