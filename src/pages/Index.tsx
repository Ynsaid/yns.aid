
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* <BirthdayAnimation /> */}
      <MouseGlow /> 
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Skills />
      <Projects />
      {/* <Testimonials /> */} /* coming sooooooooon */
      <Contact />
   

    </div>
  );
};

export default Index;
