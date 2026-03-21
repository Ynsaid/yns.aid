import React from 'react';
import Me from '../assets/me.jpg';
import { useTranslation } from 'react-i18next';
const About = () => {
  const { t } = useTranslation();
  return (
    <section id='about' className="min-h-screen bg-white dark:bg-blue-900/20 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-black dark:text-white text-center mb-12">
          {t("aboutme.title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-[16px] leading-relaxed mb-8">
                {t("aboutme.description")}
            </p>

       
            <div className="flex flex-row justify-start gap-6 flex-wrap">
              <div className="text-center p-4 w-40 bg-black/5 dark:bg-white/5 rounded-lg backdrop-blur-sm ">
                <div className="text-xl font-bold text-blue-400">10+</div>
                <div className="text-gray-600 dark:text-white text-xxl">{t("aboutme.projectsCompleted")}</div>
              </div>
              <div className="text-center p-4 w-40 bg-black/5 dark:bg-white/5 rounded-lg backdrop-blur-sm ">
                <div className="text-xl font-bold text-blue-400">2+</div>
                <div className="text-gray-600 dark:text-white text-xxl">{t("aboutme.yearsExperience")}</div>
              </div>
              
            </div>
          </div>

    
          <div className="relative flex justify-center items-center">
            <div className="absolute w-[360px] h-[360px] bg-gradient-to-tr from-blue-500 via-blue-500 to-blue-500 blur-3xl opacity-20 animate-pulse rounded-xl"></div>
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
