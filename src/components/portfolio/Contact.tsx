'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone } from 'lucide-react';
import emailjs from 'emailjs-com';
import { toast } from 'sonner'; // You can use any toast library



const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);


  // TWILIO   


  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE!,     // Replace with your EmailJS service ID
        import.meta.env.VITE_TEMPLATE!,    // Replace with your EmailJS template ID
        form.current,
        import.meta.env.VITE_PUBLIC_KEY      // Replace with your EmailJS public key (formerly user ID)
      )
      .then(
        () => {
          toast.success('Message sent successfully!');
          form.current?.reset();
        },
        (error) => {
          console.error('EmailJS error:', error);
          toast.error('Failed to send message. Try again later.');
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section id="contact" className="py-20 px-4  relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Get In Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">Let's work together</h3>
              <p className="text-gray-300 leading-relaxed">
                I'm always interested in new opportunities and exciting projects. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">younesaid@mail.ru</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+213795065655</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">Medea, Algeria</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                name="user_name"
                placeholder="Your name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                name="user_email"
                placeholder="your.email@example.com"
                className="bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-white text-white placeholder:text-gray-400"
                required
              />

            </div>

            <div>
              <Label htmlFor="message" className="text-white">Message</Label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Your message..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:transition-all duration-300 ease-in-out"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
