'use client';

import React from 'react';
import { Code, Smartphone, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';


const Services = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { t } = useTranslation();
const services = [
  {
    title: t("myservices.webDevelopment.title"),
    description: t("myservices.webDevelopment.description"),
    icon: <Code className="h-8 w-8 text-blue-400" />,
  },
  {
    title: t("myservices.mobileDevelopment.title"),
    description: t("myservices.mobileDevelopment.description"),
    icon: <Smartphone className="h-8 w-8 text-blue-400" />,
  },
  {
    title: t("myservices.uiuxDesign.title"),
    description: t("myservices.uiuxDesign.description"),
    icon: <Layers className="h-8 w-8 text-blue-400" />,
  },
  
];
  return (
    <section
      id="services"
      className="min-h-screen bg-white dark:bg-blue-900/20  py-20 px-6"
    >
      <div className="max-w-6xl mx-auto" ref={ref}>
        <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">
          {t("myservices.title")}
        </h2>

        {/* Flex layout with center alignment */}
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="w-[260px] bg-black/5 dark:bg-white/5 p-6 rounded-xl backdrop-blur-sm text-center hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-2xl font-semibold text-black dark:text-white  mb-2">{service.title}</h3>
              <p className="text-m text-gray-600 dark:text-white">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
