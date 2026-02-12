'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiRedux,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiPostgresql, SiFirebase, SiSupabase,
  SiTailwindcss, SiBootstrap, SiKotlin, SiPython, SiFigma, SiCanva, SiAdobeillustrator,
  SiAdobephotoshop, SiGit, SiGithub, SiDocker, SiVite, SiFramer, SiJquery, SiLinux,
  SiUbuntu, SiCplusplus, SiPhp, SiDart, SiFlutter, SiAndroidstudio,SiAffinityphoto
} from 'react-icons/si';
import { RiJavaLine } from "react-icons/ri";
import { BsFiletypeXml } from "react-icons/bs";
import { FaTools, FaCode } from 'react-icons/fa';

const skillIcons: Record<string, JSX.Element> = {
  html: <SiHtml5 className="w-8 h-8 text-orange-500" />,
  css: <SiCss3 className="w-8 h-8 text-blue-500" />,
  javascript: <SiJavascript className="w-8 h-8 text-yellow-400" />,
  typescript: <SiTypescript className="w-8 h-8 text-blue-400" />,
  react: <SiReact className="w-8 h-8 text-cyan-400" />,
  nextjs: <SiNextdotjs className="w-8 h-8 text-white" />,
  redux: <SiRedux className="w-8 h-8 text-purple-500" />,
  node: <SiNodedotjs className="w-8 h-8 text-green-500" />,
  express: <SiExpress className="w-8 h-8 text-white" />,
  mongodb: <SiMongodb className="w-8 h-8 text-green-600" />,
  mysql: <SiMysql className="w-8 h-8 text-blue-500" />,
  postgresql: <SiPostgresql className="w-8 h-8 text-blue-700" />,
  firebase: <SiFirebase className="w-8 h-8 text-yellow-500" />,
  supabase: <SiSupabase className="w-8 h-8 text-green-400" />,
  tailwind: <SiTailwindcss className="w-8 h-8 text-sky-400" />,
  bootstrap: <SiBootstrap className="w-8 h-8 text-purple-600" />,
  kotlin: <SiKotlin className="w-8 h-8 text-purple-300" />,
  java: <RiJavaLine className="w-8 h-8 text-red-500" />,
  python: <SiPython className="w-8 h-8 text-yellow-300" />,
  dart: <SiDart className="w-8 h-8 text-sky-500" />,
  flutter: <SiFlutter className="w-8 h-8 text-blue-400" />,
  php: <SiPhp className="w-8 h-8 text-indigo-400" />,
  androidstudio: <SiAndroidstudio className="w-8 h-8 text-green-600" />,
  figma: <SiFigma className="w-8 h-8 text-pink-400" />,
  canva: <SiCanva className="w-8 h-8 text-indigo-400" />,
  illustrator: <SiAdobeillustrator className="w-8 h-8 text-orange-400" />,
  photoshop: <SiAdobephotoshop className="w-8 h-8 text-blue-400" />,
  git: <SiGit className="w-8 h-8 text-orange-500" />,
  github: <SiGithub className="w-8 h-8 text-white" />,
  docker: <SiDocker className="w-8 h-8 text-blue-400" />,
  vite: <SiVite className="w-8 h-8 text-yellow-400" />,
  framer: <SiFramer className="w-8 h-8 text-white" />,
  jquery: <SiJquery className="w-8 h-8 text-blue-400" />,
  linux: <SiLinux className="w-8 h-8 text-yellow-100" />,
  ubuntu: <SiUbuntu className="w-8 h-8 text-orange-400" />,
  cplusplus: <SiCplusplus className="w-8 h-8 text-blue-400" />,
  tools: <FaTools className="w-8 h-8 text-gray-400" />,
  xml: <BsFiletypeXml className="w-8 h-8 text-orange-400" />,
  code: <FaCode className="w-8 h-8 text-gray-300" />,
  Affinity : <SiAffinityphoto className="w-8 h-8 text-green-400" />
};

type Skill = {
  id: number;
  name: string;
  level: number;
  category: string;
};

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from('skills').select('*');
      if (error) {
        console.error('Error fetching skills:', error);
      } else {
        setSkills(data || []);
      }
    };

    fetchSkills();
  }, []);

  const skillCategories = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Skills & Technologies
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category} className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                {category}
              </h3>

              <div className="grid grid-cols-4 gap-4 justify-items-center">
                {skills.map((skill) => {
                  const icon = skillIcons[skill.name.toLowerCase()] || (
                    <FaCode className="w-8 h-8 text-gray-400" />
                  );

                  return (
                    <div key={skill.id} className="flex flex-col items-center gap-2">
            
                      <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition duration-300">
                        {icon}
                      </div>
                      <span className="text-sm text-gray-300 text-center">{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
