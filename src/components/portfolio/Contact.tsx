'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone } from 'lucide-react';
import emailjs from 'emailjs-com';
import { toast } from 'sonner'; 

import { useTranslation } from 'react-i18next';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();



  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE!,    
        import.meta.env.VITE_TEMPLATE!,    
        form.current,
        import.meta.env.VITE_PUBLIC_KEY     
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
    <section id="contact" className="py-20 px-4  relative bg-white dark:bg-blue-900/20"> 
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-dark dark:text-white text-center mb-12">
          {t('contact.title')}
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-dark dark:text-white mb-4">{
                t('contact.subtitle')
              }</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('contact.description')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">younesaid@mail.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">+213795065655</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">Medea, Algeria</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-600 dark:text-gray-300">
                {t('contact.name')}
              </Label>
              <Input
                id="name"
                name="user_name"
                placeholder={t('contact.yourname')}
                className="bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-600 dark:text-gray-300">{
                t('contact.email')
              }</Label>
              <Input
                id="email"
                type="email"
                name="user_email"
                placeholder="your.email@example.com"
                className="bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20 text-white placeholder:text-gray-400"
                required
              />

            </div>
            
            <div>
              <Label htmlFor="message" className="text-gray-600 dark:text-gray-300">{t('contact.message')}</Label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder={t('contact.yourmessage')}
                className="w-full px-3 py-2 bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
                required
              />
            </div>

      
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r border-white/10 text-white dark:text-white from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 hover:transition-all duration-300 ease-in-out"
            >
              {loading ? t('contact.sending') : t('contact.send')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
