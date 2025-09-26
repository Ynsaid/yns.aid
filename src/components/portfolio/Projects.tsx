"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState<
    "projects" | "certificates" | "positions"
  >("projects");
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

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

        {/* Switcher */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            variant={activeTab === "projects" ? "default" : "outline"}
            className={
              activeTab === "projects"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                : "bg-transparent text-white border-white/20"
            }
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </Button>

          <Button
            variant={activeTab === "certificates" ? "default" : "outline"}
            className={
              activeTab === "certificates"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                : "bg-transparent text-white border-white/20"
            }
            onClick={() => setActiveTab("certificates")}
          >
            Certificates
          </Button>

          <Button
            variant={activeTab === "positions" ? "default" : "outline"}
            className={
              activeTab === "positions"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                : "bg-transparent text-white border-white/20"
            }
            onClick={() => setActiveTab("positions")}
          >
            Positions
          </Button>
        </div>

        {/* Projects Section */}
        {activeTab === "projects" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project.id || project.title}
                className="bg-white/5 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
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
                        onClick={() => window.open(project.githubUrl, "_blank")}
                      >
                        <Github className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Section */}
        {activeTab === "certificates" && (
          <>
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
          </>
        )}

        {/* Positions Section */}
        {activeTab === "positions" && (
          <p className="text-center text-white animate-pulse mt-10">
            Positions coming soon...
          </p>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
