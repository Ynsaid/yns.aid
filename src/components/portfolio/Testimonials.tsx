'use client';

import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Startup Founder',
    message:
      'Working with Younes was an amazing experience. The mobile app exceeded our expectations in both design and functionality.',
  },
  {
    name: 'Ali Benali',
    role: 'Freelance Designer',
    message:
      'Super professional, fast delivery, and great attention to detail. I’ll definitely work with him again!',
  },
  {
    name: 'Emily Chen',
    role: 'Tech Lead at XYZ',
    message:
      'One of the best developers I’ve collaborated with. Clean code, great communication, and on-time delivery.',
  },
];

const Testimonials = () => {
  return (
    <section id='testimonials' className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Testimonials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
            >
              <Quote className="text-purple-400 h-6 w-6 mb-4" />
              <p className="text-gray-300 italic mb-4">"{t.message}"</p>
              <div className="text-white font-semibold">{t.name}</div>
              <div className="text-sm text-gray-400">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
