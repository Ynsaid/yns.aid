"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Award,
  FileText,
  Image as ImageIcon,
  X,
  Briefcase,
  LayoutGrid,
  Sparkles,
  Monitor,
  Figma,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type ProjectCategory = "all" | "website" | "ai" | "uiux";

const Portfolio = () => {
  const { t, i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState<
    "projects" | "certificates" | "positions"
  >("projects");

  const [projectCategory, setProjectCategory] =
    useState<ProjectCategory>("all");

  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  const [previewFile, setPreviewFile] = useState<{
    url: string;
    type: "image" | "pdf";
  } | null>(null);

  const tabs = [
    { id: "projects", label: t("projects.projects") },
    { id: "certificates", label: t("projects.certificates") },
    { id: "positions", label: t("projects.positions") },
  ];

  const projectTabs: {
    id: ProjectCategory;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: "all", label: "All", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "website", label: "Websites", icon: <Monitor className="h-4 w-4" /> },
    { id: "ai", label: "AI Apps", icon: <Sparkles className="h-4 w-4" /> },
    { id: "uiux", label: "UI/UX Design", icon: <Figma className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        const projectsWithUrls = (data || []).map((project) => {
          let imageUrl = null;

          if (project.image) {
            const { data: publicUrlData } = supabase.storage
              .from("project-images")
              .getPublicUrl(project.image);

            imageUrl = publicUrlData?.publicUrl || null;
          }

          return {
            ...project,
            imageUrl,
            categoryLabel: (project.type || "website")
              .toString()
              .toLowerCase()
              .trim(),
          };
        });

        setProjects(projectsWithUrls);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching certificates:", error);
      } else if (data) {
        const certificatesWithUrls = data.map((cert) => {
          const { data: publicUrlData } = supabase.storage
            .from("Certificates")
            .getPublicUrl(cert.image);

          return {
            id: cert.id,
            title: cert.title,
            imageUrl: publicUrlData.publicUrl,
            issuer: cert.issuer || "Verified Certificate",
            url: publicUrlData.publicUrl,
          };
        });

        setCertificates(certificatesWithUrls);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching positions:", error);
        setPositions([]);
      } else {
        setPositions(data || []);
      }
    };

    fetchPositions();
  }, []);

  useEffect(() => {
    if (previewFile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [previewFile]);

  const filteredProjects = useMemo(() => {
    if (projectCategory === "all") return projects;
    return projects.filter((project) => project.type === projectCategory);
  }, [projects, projectCategory]);

  const useSlider = filteredProjects.length > 8;

  const renderProjectCard = (project: any) => {
    const isNew = project.created_at
      ? (new Date().getTime() - new Date(project.created_at).getTime()) /
          (1000 * 3600 * 24) <
        30
      : false;

    const categoryMap: Record<string, string> = {
      website: "Website",
      ai: "AI App",
      uiux: "UI/UX",
    };

    return (
      <div
        key={project.id || project.title}
        className="relative h-full bg-white dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {isNew && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
              NEW
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-20">
          <span className="bg-black/70 text-white text-[10px] font-medium px-2 py-1 rounded-full backdrop-blur">
            {categoryMap[project.type] || "Project"}
          </span>
        </div>

        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-black dark:text-white mb-2 line-clamp-1">
            {project.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3 min-h-[60px]">
            {i18n.language === "ar" && project.description_ar
              ? project.description_ar
              : project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Array.isArray(project.technologies)
              ? project.technologies
              : project.technologies?.split(","))?.map(
              (tech: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-600/10 text-blue-700 dark:text-blue-200 rounded-full text-[10px] border border-blue-200/40 dark:border-blue-500/20"
                >
                  {tech.trim()}
                </span>
              )
            )}
          </div>

          <div className="mt-auto flex gap-2">
            {project.liveUrl && (
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                onClick={() => window.open(project.liveUrl, "_blank")}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                {t("projects.live")}
              </Button>
            )}

            {project.githubUrl && (
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 dark:border-white/20 bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 text-xs"
                onClick={() => window.open(project.githubUrl, "_blank")}
              >
                <Github className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section
        id="portfolio"
        className="py-16 px-4 bg-white dark:bg-blue-900/20 relative"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black dark:text-white text-center mb-8">
            {t("projects.title")}
          </h2>

          <div className="flex justify-center mb-6">
            <div className="flex flex-wrap justify-center gap-2 bg-black/5 dark:bg-white/10 p-2 rounded-2xl backdrop-blur-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  } relative rounded-xl px-5 py-2.5 text-sm font-medium transition`}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="bubble"
                      className="absolute inset-0 z-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {projectTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setProjectCategory(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm ${
                      projectCategory === tab.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-slate-900 text-black dark:text-white border-gray-200 dark:border-white/10 hover:border-blue-400"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    <span className="text-[11px] opacity-80">
                      (
                      {tab.id === "all"
                        ? projects.length
                        : projects.filter((p) => p.type === tab.id).length}
                      )
                    </span>
                  </button>
                ))}
              </div>

              {filteredProjects.length > 0 ? (
                useSlider ? (
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination, A11y]}
                      navigation
                      pagination={{ clickable: true }}
                      spaceBetween={20}
                      slidesPerView={1}
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 16,
                        },
                        1024: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        1280: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                      }}
                      className="portfolio-projects-slider pb-12"
                    >
                      {filteredProjects.map((project) => (
                        <SwiperSlide
                          key={project.id || project.title}
                          className="h-auto"
                        >
                          <div className="h-full">{renderProjectCard(project)}</div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProjects.map((project) => renderProjectCard(project))}
                  </div>
                )
              ) : (
                <p className="text-center text-xl text-black dark:text-white mt-10">
                  No projects in this category yet.
                </p>
              )}
            </motion.div>
          )}

          {activeTab === "certificates" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {certificates.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert) => {
                    const isPdf = cert.imageUrl?.toLowerCase().includes(".pdf");

                    return (
                      <div
                        key={cert.id || cert.title}
                        className="bg-gray-100 dark:bg-gray-950 rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto w-full border border-gray-100 dark:border-gray-800 relative group aspect-[4/3] cursor-pointer"
                        onClick={() =>
                          setPreviewFile({
                            url: cert.url,
                            type: isPdf ? "pdf" : "image",
                          })
                        }
                      >
                        {isPdf ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center relative z-0">
                            <FileText className="w-16 h-16 text-red-500 mb-3 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-white/60 dark:bg-black/40 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                              PDF
                            </span>
                          </div>
                        ) : cert.imageUrl ? (
                          <img
                            src={cert.imageUrl}
                            alt={cert.title}
                            className="w-full h-full object-cover relative z-0 group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative z-0">
                            <Award className="text-gray-400 w-12 h-12" />
                          </div>
                        )}

                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-base font-semibold text-white line-clamp-2 mb-1">
                            {cert.title}
                          </h3>

                          <div className="flex justify-between items-center gap-2">
                            <p className="text-gray-300 text-xs line-clamp-1">
                              {cert.issuer || "Verified Certificate"}
                            </p>

                            {cert.url && (
                              <Button
                                size="sm"
                                className="h-7 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium rounded-full flex items-center gap-1 shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewFile({
                                    url: cert.url,
                                    type: isPdf ? "pdf" : "image",
                                  });
                                }}
                              >
                                {isPdf ? (
                                  <FileText className="h-3 w-3" />
                                ) : (
                                  <ImageIcon className="h-3 w-3" />
                                )}
                                Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-2xl text-black dark:text-white animate-pulse mt-10">
                  {t("projects.soon")}
                </p>
              )}
            </motion.div>
          )}

          {activeTab === "positions" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {positions.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {positions.map((position, index) => (
                    <div
                      key={position.id || index}
                      className="bg-white dark:bg-slate-950/60 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-black dark:text-white">
                            {position.title || position.position || "Work Position"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {position.company || position.organization || "Organization"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
                            {i18n.language === "ar" && position.description_ar
                              ? position.description_ar
                              : position.description || "No description available."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-2xl text-black dark:text-white animate-pulse mt-10">
                  {t("projects.soon")}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {previewFile && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
                <h3 className="font-semibold text-lg text-black dark:text-white flex items-center gap-2">
                  {previewFile.type === "pdf" ? (
                    <FileText className="w-5 h-5 text-blue-500" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  )}
                  Certificate Preview
                </h3>

                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow overflow-auto bg-gray-100 dark:bg-gray-950 p-4 sm:p-8 flex justify-center items-center">
                {previewFile.type === "pdf" ? (
                  <iframe
                    src={`${previewFile.url}#view=FitH`}
                    className="w-full h-[70vh] sm:h-[75vh] rounded-lg shadow-inner bg-white dark:bg-gray-900 border dark:border-gray-800"
                    title="PDF Preview"
                  />
                ) : (
                  <img
                    src={previewFile.url}
                    alt="Certificate Preview"
                    className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg shadow-md"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


export default Portfolio; 





