"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<
    "projects" | "certificates" | "positions"
  >("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Tab configuration for the bubble loop
  const tabs = [
    { id: "projects", label: "Projects" },
    { id: "certificates", label: "Certificates" },
    { id: "positions", label: "Positions" },
  ];

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        const projectsWithUrls = data.map((project) => {
          let imageUrl = null;
          if (project.image) {
            const { data: publicUrlData } = supabase.storage
              .from("project-images")
              .getPublicUrl(project.image);
            imageUrl = publicUrlData?.publicUrl || null;
          }
          return { ...project, imageUrl };
        });
        setProjects(projectsWithUrls);
      }
    };

    fetchProjects();
  }, []);

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      const { data, error } = await supabase.from("certificates").select("*");
      if (error) {
        console.error("Error fetching certificates:", error);
      } else {
        const certificatesWithUrls = data.map((cert) => {
          let imageUrl = null;
          if (cert.image) {
            const { data: publicUrlData } = supabase.storage
              .from("certificate-images")
              .getPublicUrl(cert.image);
            imageUrl = publicUrlData?.publicUrl || null;
          }
          return { ...cert, imageUrl };
        });
        setCertificates(certificatesWithUrls);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <section id="portfolio" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          My Portfolio
        </h2>

        {/* Bubble Switcher */}
        <div className="flex justify-center mb-10">
          <div className="flex space-x-1 bg-white/10 p-1 rounded-full backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                } relative rounded-full px-6 py-2 text-sm font-medium transition focus-visible:outline-2`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 mix-blend-normal">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {projects.map((project) => {
              
              const isNew = project.created_at
                ? (new Date().getTime() -
                    new Date(project.created_at).getTime()) /
                    (1000 * 3600 * 24) <
                  30
                : false;

              return (
                <div
                  key={project.id || project.title}
                 
                  className="relative bg-white/5 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                
                  {isNew && (
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}

                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(Array.isArray(project.technologies)
                        ? project.technologies
                        : project.technologies?.split(",")
                      )?.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 bg-blue-600/20 text-blue-300 rounded text-[10px]"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex gap-2">
                      {project.liveUrl && (
                        <Button
                          size="sm"
                          className="flex-1 hover:bg-white/30 hover:text-white text-xs"
                          onClick={() => window.open(project.liveUrl, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live Demo
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-black hover:bg-white/20 hover:text-white text-xs"
                          onClick={() =>
                            window.open(project.githubUrl, "_blank")
                          }
                        >
                          <Github className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Certificates Section */}
        {activeTab === "certificates" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {certificates.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id || cert.title}
                    className="bg-white/5 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto"
                  >
                    {cert.imageUrl ? (
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                        <Award className="text-gray-400 w-6 h-6" />
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-base font-semibold text-white mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                        {cert.issuer}
                      </p>

                      <div className="mt-auto flex gap-2">
                        {cert.url && (
                          <Button
                            size="sm"
                            className="flex-1 hover:bg-white/30 hover:text-white text-xs"
                            onClick={() => window.open(cert.url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white animate-pulse mt-10">
                Certificates coming soon...
              </p>
            )}
          </motion.div>
        )}

        {/* Positions Section */}
        {activeTab === "positions" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-center text-white animate-pulse mt-10">
              Positions coming soon...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
