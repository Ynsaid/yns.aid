
import React from 'react';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Projects from '@/components/portfolio/Projects';
import Contact from '@/components/portfolio/Contact';
import Navbar from '@/components/portfolio/Navbar';
import Services from '@/components/portfolio/Services';
import Testimonials from '@/components/portfolio/Testimonials';
import BirthdayAnimation from '@/components/portfolio/BirthdayAnimation';
import MouseGlow from '@/components/portfolio/MouseGlow';
const Index = () => {
  return (
       <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #001C41, #194994, #001C41)' }}>

      <MouseGlow /> 
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Skills />
      <Projects />

      <Contact />
   

    </div>
  );
};

export default Index;
