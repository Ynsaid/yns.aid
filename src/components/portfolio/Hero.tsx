'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Facebook, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

const Hero = () => {

  const goToProjects  = () => {
    const projects = document.getElementById('projects') as HTMLElement;
    projects.scrollIntoView({ behavior: 'smooth' });
  }
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Hi, I'm{' '}
           <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              <TypeAnimation
                sequence={[
                  'Younes Aid', 
                  2000,       
                  '',          
                  100,
                  'Younes Aid',
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>
          </h1>

           <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Full Stack Developer focused on creating smooth, user-friendly apps with both frontend and backend expertise, and a strong eye for design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
             <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0" onClick={ goToProjects}>
              View My Work
            </Button>
            <Button size="lg" variant="outline" className="border-blue-300/30 text-black hover:bg-blue-500/20 hover:text-white hover:border-blue-300/50">
              Download CV
            </Button>
          </div>

          <div className="flex justify-center space-x-6">
            <a href="https://github.com/Ynsaid" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Github className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/yyynsaid" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://www.facebook.com/yyyns.aid" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/yns.aid/" className="text-blue-300 hover:text-blue-100 transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-blue-300" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
