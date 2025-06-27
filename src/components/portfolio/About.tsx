import React from 'react';
import Me from '../assets/me.jpg';

const About = () => {
  return (
    <section id='about' className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text */}
          <div>
            <p className="text-gray-300 text-[16px] leading-relaxed mb-8">
                I'm a passionate full-stack developer, mobile app developer, and UI/UX designer with over 2 years of experience building user-centric digital experiences. I specialize in creating responsive web and mobile applications that are not only visually engaging but also robust, scalable, and performant. From clean front-end interfaces to efficient back-end systems, I bring ideas to life with thoughtful code and design. I thrive on solving real-world problems through intuitive user experiences and modern tech stacks. Outside of development, I enjoy exploring emerging technologies, contributing to open-source projects, and mentoring others in the tech community.            </p>

            {/* Stats Row */}
            <div className="flex flex-row justify-center gap-6 flex-wrap">
              <div className="text-center p-4 w-40 bg-white/5 rounded-lg backdrop-blur-sm ">
                <div className="text-xl font-bold text-blue-400">10+</div>
                <div className="text-gray-300 text-sm">Projects</div>
              </div>
              <div className="text-center p-4 w-40 bg-white/5 rounded-lg backdrop-blur-sm ">
                <div className="text-xl font-bold text-blue-400">2+</div>
                <div className="text-gray-300 text-sm">Years Experience</div>
              </div>
              
            </div>
          </div>

          {/* Right Column: Animated Rectangle Image */}
          <div className="relative flex justify-center items-center">
            {/* Animated Glow Background */}
            <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-blue-500 via-blue-500 to-blue-500 blur-3xl opacity-20 animate-pulse rounded-xl"></div>

            {/* Floating Rectangle Image */}
            <div className="relative w-80 h-80 animate-float">
              <img
                src={Me}
                alt="Profile"
                className="w-full h-full object-cover rounded-xl border-4 border-white/20 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
