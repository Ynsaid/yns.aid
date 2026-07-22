"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Award,
  LayoutDashboard,
  Wrench,
  FolderKanban,
  BadgeCheck,
  Mail,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const { i18n } = useTranslation();

  const [activeTab, setActiveTab] = useState<
    "overview" | "skills" | "projects" | "certificates" | "messages"
  >("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [skills, setSkills] = useState<any[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    level: 0,
  });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    description_ar: "",
    image: "",
    technologies: "",
    liveUrl: "",
    type: "",
    githubUrl: "",
  });

  const [certificates, setCertificates] = useState<any[]>([]);
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [newCertificate, setNewCertificate] = useState({ title: "" });
  const [certFile, setCertFile] = useState<File | null>(null);

  const [visitorsCount, setVisitorsCount] = useState<number | null>(null);
  const [yearVisitorsData, setYearVisitorsData] = useState<
    { name: string; count: number }[]
  >([]);
  const [monthVisitorsData, setMonthVisitorsData] = useState<
    { name: string; count: number }[]
  >([]);
  const [messages, setMessages] = useState<any[]>([]);

  const getVisitorsByday = async () => {
    const { count, error } = await supabase
      .from("Visitors")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error(error);
      return 0;
    }
    return count || 0;
  };

  const fetchVisitorsCharts = async () => {
    try {
      const now = new Date();
      const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
      const nextYearStart = new Date(now.getFullYear() + 1, 0, 1).toISOString();

      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString();
      const nextMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      ).toISOString();

      const { data: yearData, error: yearError } = await supabase
        .from("Visitors")
        .select("visited_at")
        .gte("visited_at", yearStart)
        .lt("visited_at", nextYearStart);

      if (yearError) {
        console.error("Error fetching year visitors:", yearError);
      } else {
        const months = Array.from({ length: 12 }, (_, i) => ({
          name: new Date(0, i).toLocaleString("en", { month: "short" }),
          count: 0,
        }));

        (yearData || []).forEach((row: any) => {
          const dt = new Date(row.visited_at);
          if (!isNaN(dt.getTime())) {
            months[dt.getMonth()].count += 1;
          }
        });

        setYearVisitorsData(months);
      }

      const { data: monthData, error: monthError } = await supabase
        .from("Visitors")
        .select("visited_at")
        .gte("visited_at", monthStart)
        .lt("visited_at", nextMonthStart);

      if (monthError) {
        console.error("Error fetching month visitors:", monthError);
      } else {
        const daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();

        const days = Array.from({ length: daysInMonth }, (_, i) => ({
          name: String(i + 1),
          count: 0,
        }));

        (monthData || []).forEach((row: any) => {
          const dt = new Date(row.visited_at);
          if (!isNaN(dt.getTime())) {
            const day = dt.getDate();
            days[day - 1].count += 1;
          }
        });

        setMonthVisitorsData(days);
      }
    } catch (err) {
      console.error("Error building visitors charts:", err);
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from("skills").select("*");
      if (error) console.error(error);
      else setSkills(data || []);
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) console.error(error);
      else setProjects(data || []);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data, error } = await supabase.from("certificates").select("*");
      if (error) console.error(error);
      else setCertificates(data || []);
    };
    fetchCertificates();
  }, []);

  useEffect(() => {
    const fetchVisitors = async () => {
      const count = await getVisitorsByday();
      setVisitorsCount(count);
      await fetchVisitorsCharts();
    };
    fetchVisitors();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*");
      if (error) console.error(error);
      else setMessages(data || []);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogout();
    }, 600000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleAddSkill = async () => {
    if (newSkill.name && newSkill.category) {
      const { data, error } = await supabase
        .from("skills")
        .insert([newSkill])
        .select();

      if (error) {
        console.error(error);
      } else if (data) {
        setSkills([...skills, data[0]]);
        setNewSkill({ name: "", category: "", level: 0 });
        setIsAddingSkill(false);
      }
    }
  };

  const handleUpdateSkill = async () => {
    if (editingSkillId !== null && newSkill.name && newSkill.category) {
      const { error } = await supabase
        .from("skills")
        .update(newSkill)
        .eq("id", editingSkillId);

      if (error) {
        console.error(error);
      } else {
        const updatedSkills = skills.map((skill) =>
          skill.id === editingSkillId
            ? { ...newSkill, id: editingSkillId }
            : skill
        );
        setSkills(updatedSkills);
        setNewSkill({ name: "", category: "", level: 0 });
        setEditingSkillId(null);
        setIsAddingSkill(false);
      }
    }
  };

  const handleDeleteSkill = async (id: number) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) console.error(error);
    else setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleEditSkill = (id: number) => {
    const skillToEdit = skills.find((skill) => skill.id === id);
    if (skillToEdit) {
      setNewSkill(skillToEdit);
      setEditingSkillId(id);
      setIsAddingSkill(true);
      setActiveTab("skills");
    }
  };

  const uploadImageAndGetName = async (
    file: File,
    bucket: string = "project-images"
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      return fileName;
    } catch (error) {
      console.error("Error in uploadImageAndGetName:", error);
      return null;
    }
  };

  const handleAddProject = async () => {
    if (newProject.title && newProject.description) {
      let imageUrl = newProject.image;

      if (imageFile) {
        const uploadedUrl = await uploadImageAndGetName(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          console.error("Failed to upload image");
          return;
        }
      }

      const payload = {
        ...newProject,
        image: imageUrl,
        technologies: newProject.technologies
          .split(",")
          .map((t) => t.trim()),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([payload])
        .select();

      if (error) {
        console.error("Error inserting project:", error.message);
      } else if (data) {
        setProjects([...projects, data[0]]);
        setNewProject({
          title: "",
          description: "",
          description_ar: "",
          image: "",
          technologies: "",
          liveUrl: "",
          type: "",
          githubUrl: "",
        });
        setImageFile(null);
        setIsAddingProject(false);
      }
    }
  };

  const handleEditProject = (id: number) => {
    const projectToEdit = projects.find((project) => project.id === id);
    if (projectToEdit) {
      setNewProject({
        title: projectToEdit.title,
        description: projectToEdit.description,
        description_ar: projectToEdit.description_ar || "",
        image: projectToEdit.image || "",
        technologies: Array.isArray(projectToEdit.technologies)
          ? projectToEdit.technologies.join(", ")
          : projectToEdit.technologies || "",
        liveUrl: projectToEdit.liveUrl || "",
        type: projectToEdit.type || "",
        githubUrl: projectToEdit.githubUrl || "",
      });
      setEditingProjectId(id);
      setIsEditingProject(true);
      setIsAddingProject(true);
      setActiveTab("projects");
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProjectId) return;

    let imageUrl = newProject.image;

    if (imageFile) {
      const uploadedUrl = await uploadImageAndGetName(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const updatedData = {
      ...newProject,
      image: imageUrl,
      technologies: newProject.technologies
        .split(",")
        .map((t) => t.trim()),
    };

    const { data, error } = await supabase
      .from("projects")
      .update(updatedData)
      .eq("id", editingProjectId)
      .select();

    if (error) {
      console.error(error);
    } else if (data) {
      const updatedProjects = projects.map((project) =>
        project.id === editingProjectId ? data[0] : project
      );
      setProjects(updatedProjects);
      setEditingProjectId(null);
      setIsEditingProject(false);
      setIsAddingProject(false);
      setImageFile(null);
      setNewProject({
        title: "",
        description: "",
        description_ar: "",
        image: "",
        technologies: "",
        liveUrl: "",
        type: "",
        githubUrl: "",
      });
    }
  };

  const handleDeleteProject = async (id: number) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) console.error(error);
    else setProjects(projects.filter((project) => project.id !== id));
  };

  const handleAddCertificate = async () => {
    if (newCertificate.title && certFile) {
      const uploadedUrl = await uploadImageAndGetName(certFile, "Certificates");

      if (uploadedUrl) {
        const { data, error } = await supabase
          .from("certificates")
          .insert([{ title: newCertificate.title, image: uploadedUrl }])
          .select();

        if (error) {
          console.error("Error inserting certificate:", error);
        } else if (data) {
          setCertificates([...certificates, data[0]]);
          setNewCertificate({ title: "" });
          setCertFile(null);
          setIsAddingCertificate(false);
        }
      }
    }
  };

  const handleDeleteCertificate = async (id: number, imageName: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setCertificates(certificates.filter((cert) => cert.id !== id));
      if (imageName) {
        await supabase.storage.from("Certificates").remove([imageName]);
      }
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "certificates", label: "Certificates", icon: BadgeCheck },
    { id: "messages", label: "Messages", icon: Mail },
  ] as const;

  const cardClass =
    "border-slate-200 bg-white/80 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-white";
  const panelClass =
    "border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5";
  const inputClass =
    "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/50";
  const subtleText = "text-slate-500 dark:text-slate-400";

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${cardClass} rounded-2xl p-6`}>
          <h3 className="text-lg font-semibold mb-2">Total Skills</h3>
          <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
            {skills.length}
          </p>
        </Card>

        <Card className={`${cardClass} rounded-2xl p-6`}>
          <h3 className="text-lg font-semibold mb-2">Projects</h3>
          <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {projects.length}
          </p>
        </Card>

        <Card className={`${cardClass} rounded-2xl p-6`}>
          <h3 className="text-lg font-semibold mb-2">Visitors</h3>
          <p className="text-4xl font-extrabold text-violet-600 dark:text-violet-400">
            {visitorsCount !== null ? visitorsCount : "Loading..."}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold mb-4">
            Visitors This Year (by month)
          </h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer>
              <LineChart data={yearVisitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className={`${cardClass} p-6`}>
          <h3 className="text-lg font-semibold mb-4">
            Visitors This Month (by day)
          </h3>
          <div className="w-full h-[260px]">
            <ResponsiveContainer>
              <LineChart data={monthVisitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis allowDecimals={false} stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSkills = () => (
    <Card className={`${cardClass} p-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Skills Management</h2>
        <Button
          onClick={() => {
            setIsAddingSkill(true);
            setEditingSkillId(null);
            setNewSkill({ name: "", category: "", level: 0 });
          }}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {isAddingSkill && (
        <div className={`${panelClass} p-4 rounded-lg mb-6`}>
          {editingSkillId && (
            <p className="text-amber-500 dark:text-amber-300 mb-2">
              Editing Skill ID: {editingSkillId}
            </p>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="skillName" className="mb-2 block">
                Skill Name
              </Label>
              <Input
                id="skillName"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                placeholder="e.g., React"
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="category" className="mb-2 block">
                Category
              </Label>
              <Input
                id="category"
                value={newSkill.category}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, category: e.target.value })
                }
                placeholder="e.g., Frontend"
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="level" className="mb-2 block">
                Level (%)
              </Label>
              <Input
                id="level"
                type="number"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) =>
                  setNewSkill({
                    ...newSkill,
                    level: parseInt(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={editingSkillId ? handleUpdateSkill : handleAddSkill}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {editingSkillId ? "Update" : "Add"}
              </Button>
              <Button
                onClick={() => {
                  setIsAddingSkill(false);
                  setEditingSkillId(null);
                  setNewSkill({ name: "", category: "", level: 0 });
                }}
                variant="outline"
                className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className={`${panelClass} flex items-center justify-between p-4 rounded-lg`}
          >
            <div className="flex flex-col space-y-1">
              <span className="font-medium">{skill.name}</span>
              <span className="text-blue-600 dark:text-blue-400 text-sm">
                {skill.category}
              </span>
              <span className={subtleText + " text-sm"}>{skill.level}%</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                onClick={() => handleEditSkill(skill.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDeleteSkill(skill.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderProjects = () => (
    <Card className={`${cardClass} p-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Projects Management</h2>
        <Button
          onClick={() => {
            setIsAddingProject(true);
            setIsEditingProject(false);
            setEditingProjectId(null);
          }}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isAddingProject && (
        <div className={`${panelClass} p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`}>
          <Input
            placeholder="Title"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className={inputClass}
          />

          <Select
            value={newProject.type}
            onValueChange={(value) =>
              setNewProject({ ...newProject, type: value })
            }
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="ai">AI Application</SelectItem>
              <SelectItem value="uiux">UI/UX Design</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Description (English)"
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className={inputClass}
          />

          <Input
            placeholder="الوصف بالعربية"
            value={newProject.description_ar}
            onChange={(e) =>
              setNewProject({ ...newProject, description_ar: e.target.value })
            }
            dir="rtl"
            className={`${inputClass} text-right`}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className={inputClass}
          />

          <Input
            placeholder="Technologies (comma separated)"
            value={newProject.technologies}
            onChange={(e) =>
              setNewProject({ ...newProject, technologies: e.target.value })
            }
            className={inputClass}
          />

          <Input
            placeholder="Live URL"
            value={newProject.liveUrl}
            onChange={(e) =>
              setNewProject({ ...newProject, liveUrl: e.target.value })
            }
            className={inputClass}
          />

          <Input
            placeholder="GitHub URL"
            value={newProject.githubUrl}
            onChange={(e) =>
              setNewProject({ ...newProject, githubUrl: e.target.value })
            }
            className={`${inputClass} md:col-span-2 xl:col-span-1`}
          />

          <div className="flex gap-2 col-span-full">
            <Button
              onClick={editingProjectId ? handleUpdateProject : handleAddProject}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {editingProjectId ? "Update" : "Add"}
            </Button>
            <Button
              onClick={() => {
                setIsAddingProject(false);
                setIsEditingProject(false);
                setEditingProjectId(null);
                setImageFile(null);
                setNewProject({
                  title: "",
                  description: "",
                  description_ar: "",
                  image: "",
                  technologies: "",
                  liveUrl: "",
                  type: "",
                  githubUrl: "",
                });
              }}
              variant="outline"
              className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`${panelClass} p-4 rounded-lg flex flex-col justify-between`}
          >
            <div className="mb-3">
              <h3 className="font-medium">{project?.title}</h3>

              {project.type && (
                <span className="inline-block mt-2 mb-2 text-xs rounded-full px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  {project.type}
                </span>
              )}

              <p className="text-blue-600 dark:text-blue-400 text-sm mb-1">
                EN: {project.description}
              </p>

              {project.description_ar && (
                <p className="text-emerald-600 dark:text-emerald-400 text-sm" dir="rtl">
                  AR: {project.description_ar}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10"
                onClick={() => handleEditProject(project.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderCertificates = () => (
    <Card className={`${cardClass} p-6`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Certificates Management</h2>
        <Button
          onClick={() => setIsAddingCertificate(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {isAddingCertificate && (
        <div className={`${panelClass} p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4`}>
          <Input
            placeholder="Certificate Name"
            value={newCertificate.title}
            onChange={(e) =>
              setNewCertificate({ ...newCertificate, title: e.target.value })
            }
            className={inputClass}
          />
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setCertFile(e.target.files[0]);
              }
            }}
            className={inputClass}
          />
          <div className="flex gap-2 col-span-full">
            <Button
              onClick={handleAddCertificate}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setIsAddingCertificate(false);
                setNewCertificate({ title: "" });
                setCertFile(null);
              }}
              variant="outline"
              className="border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className={`${panelClass} p-4 rounded-lg flex items-center justify-between`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <Award className="text-blue-600 dark:text-blue-400 shrink-0 h-6 w-6" />
              <span className="font-medium truncate">{cert.title}</span>
            </div>
            <Button
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600 shrink-0 ml-2"
              onClick={() => handleDeleteCertificate(cert.id, cert.image)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderMessages = () => (
    <Card className={`${cardClass} p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Messages</h2>
        <span className={`text-sm ${subtleText}`}>{messages.length} messages</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={msg.id ?? index}
              className={`${panelClass} rounded-xl p-4`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h3 className="font-medium">{msg.name || "Unknown sender"}</h3>
                <span className={`text-xs ${subtleText}`}>
                  {msg.email || "No email"}
                </span>
              </div>
              <p className={`text-sm whitespace-pre-wrap ${subtleText}`}>
                {msg.message || "No message content"}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-xl p-10 text-center border border-dashed border-slate-300 text-slate-500 dark:border-white/15 dark:text-slate-400">
            No messages yet.
          </div>
        )}
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "skills":
        return renderSkills();
      case "projects":
        return renderProjects();
      case "certificates":
        return renderCertificates();
      case "messages":
        return renderMessages();
      default:
        return renderOverview();
    }
  };

  return (
    <div
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white"
    >
      <div className="flex min-h-screen">
        <aside
          className={`
            fixed inset-y-0 z-50 w-72
            bg-white/85 dark:bg-slate-900/85
            border-r border-slate-200 dark:border-slate-800
            backdrop-blur-xl
            transform transition-transform duration-300
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:flex lg:flex-col
          `}
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Panel
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Portfolio control center
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              className="w-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <main className="flex-1 lg:ml-0">
          <div className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div>
                  <h2 className="text-lg md:text-xl font-semibold capitalize text-slate-900 dark:text-white">
                    {activeTab}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage your portfolio content
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">
                  Visitors: {visitorsCount !== null ? visitorsCount : "..."}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
