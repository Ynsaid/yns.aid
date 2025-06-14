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
            <p className="text-gray-300 leading-relaxed mb-8">
              I'm a passionate full-stack developer and UI/UX designer with over 2 years of experience crafting user-centered web applications that are both functional and visually engaging. I thrive on solving real-world problems through clean code and thoughtful design, blending aesthetics with performance. Outside of coding, I enjoy exploring emerging technologies, contributing to open source, and sharing insights through writing and mentoring.
            </p>

            {/* Stats Row */}
            <div className="flex flex-row justify-start gap-6 flex-wrap">
              <div className="text-center p-4 w-40 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-xl font-bold text-purple-400">10+</div>
                <div className="text-gray-300 text-sm">Projects</div>
              </div>
              <div className="text-center p-4 w-40 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-xl font-bold text-purple-400">2+</div>
                <div className="text-gray-300 text-sm">Years Experience</div>
              </div>
              <div className="text-center p-4 w-40 bg-white/5 rounded-lg backdrop-blur-sm">
                <div className="text-xl font-bold text-purple-400">0</div>
                <div className="text-gray-300 text-sm">Clients</div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
              <img
                src={Me}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
