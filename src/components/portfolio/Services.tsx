'use client';

import React from 'react';
import { Briefcase, Code, Smartphone, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const services = [
  {
    title: 'Web Development',
    description: 'Modern websites using React, Next.js, Tailwind, and backend APIs.',
    icon: <Code className="h-8 w-8 text-purple-400" />,
  },
  {
    title: 'Mobile App Development',
    description: ' Android apps built with Kotlin or Java.',
    icon: <Smartphone className="h-8 w-8 text-purple-400" />,
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful and functional interfaces designed with user experience in mind.',
    icon: <Layers className="h-8 w-8 text-purple-400" />,
  },
  {
    title: 'Freelance Services',
    description: 'Professional development for startups and businesses, tailored to your needs.',
    icon: <Briefcase className="h-8 w-8 text-purple-400" />,
  },
];

const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="services"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-6"
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <h2 className="text-4xl font-bold text-white text-center mb-12">My Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm text-center hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-sm text-gray-300">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
