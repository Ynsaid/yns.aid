'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        const projectsWithUrls = data.map((project) => {
          let imageUrl = null;

          if (project.image) {
            const { data: publicUrlData } = supabase.storage
              .from('project-images')
              .getPublicUrl(project.image); // 👈 تأكد أن الاسم فقط محفوظ في قاعدة البيانات

            imageUrl = publicUrlData?.publicUrl || null;
          }

          return {
            ...project,
            imageUrl,
          };
        });

        setProjects(projectsWithUrls);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Featured Projects
        </h2>

        <div className="grid md:grid-cols-4 lg:grid-cols-4 gap-8">
          {projects.map((project) => (
            <div
              key={project.id || project.title}
              className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300"
            >
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load image:', project.imageUrl);
                    e.currentTarget.src = '/item.png';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4 text-sm">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(Array.isArray(project.technologies)
                    ? project.technologies
                    : project.technologies?.split(',')
                  )?.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      className="flex-1 hover:bg-white/30 hover:text-white"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-black hover:bg-white/20 hover:text-white"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
