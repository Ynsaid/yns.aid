import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone } from 'lucide-react';
import emailjs from 'emailjs-com';
import { supabase } from "@/lib/supabase"

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;
  
    const formData = new FormData(form.current);
    const name = formData.get('user_name') as string;
    const email_sender = formData.get('user_email') as string;
    const content = formData.get('message') as string;
  
    try {
      // ✅ Send email with EmailJS
      await emailjs.sendForm(
        import.meta.env.SERVICE,
        import.meta.env.TEMPLATE,
        form.current,
         import.meta.env.PUBLIC_KEY
      );
  
      // ✅ Insert message into Supabase
      const { error } = await supabase.from('messages').insert([
        { name, email_sender, content }
      ]);
  
      if (error) throw error;
  
      setToast({ message: 'Message sent and saved successfully!', type: 'success' });
      form.current?.reset();
    } catch (error) {
      setToast({ message: 'Failed to send or save message.', type: 'error' });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };
  

  return (
    <section id="contact" className="py-20 px-4 bg-black/20 relative">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Get In Touch
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Let's work together
              </h3>
              <p className="text-gray-300 leading-relaxed">
                I'm always interested in new opportunities and exciting projects. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">younesaid@mail.ru</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">+213795065655</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">Medea, Algeria</span>
              </div>
            </div>
          </div>

          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                name="user_name"
                placeholder="Your name"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                name="user_email"
                placeholder="your.email@example.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-white">Message</Label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Your message..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-lg z-50 transition-all
            ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default Contact;
