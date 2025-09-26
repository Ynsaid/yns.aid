import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Recharts imports for the two line charts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Admin = () => {
  // Skills state
  const [skills, setSkills] = useState([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    level: 0,
  });
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // visitors charts state
  const [visitorsCount, setVisitorsCount] = useState<number | null>(null);
  const [yearVisitorsData, setYearVisitorsData] = useState<
    { name: string; count: number }[]
  >([]);
  const [monthVisitorsData, setMonthVisitorsData] = useState<
    { name: string; count: number }[]
  >([]);

  // function to get visitors
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

  // fetch and build yearly and monthly chart data
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

      // Fetch visited_at for the whole year
      const { data: yearData, error: yearError } = await supabase
        .from("Visitors")
        .select("visited_at")
        .gte("visited_at", yearStart)
        .lt("visited_at", nextYearStart);

      if (yearError) {
        console.error("Error fetching year visitors:", yearError);
      } else {
        // initialize months array
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

      // Fetch visited_at for current month
      const { data: monthData, error: monthError } = await supabase
        .from("Visitors")
        .select("visited_at")
        .gte("visited_at", monthStart)
        .lt("visited_at", nextMonthStart);

      if (monthError) {
        console.error("Error fetching month visitors:", monthError);
      } else {
        // determine number of days in current month
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
      else setSkills(data);
    };
    fetchSkills();
  }, []);

  // fetch visitors count and chart data on mount
  useEffect(() => {
    const fetchVisitors = async () => {
      const count = await getVisitorsByday();
      setVisitorsCount(count);
      await fetchVisitorsCharts();
    };
    fetchVisitors();
  }, []);

  // functions of skills
  const handleAddSkill = async () => {
    if (newSkill.name && newSkill.category) {
      const { data, error } = await supabase
        .from("skills")
        .insert([newSkill])
        .select();
      if (error) {
        console.error(error);
      } else {
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
    }
  };

  // Projects state
  const [projects, setProjects] = useState([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    liveUrl: "",
    githubUrl: "",
  });
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) console.error(error);
      else setProjects(data);
    };
    fetchProjects();
  }, []);

  const uploadImageAndGetName = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // return just the file name
      return fileName;
    } catch (error) {
      console.error("Error in uploadImageAndGetName:", error);
      return null;
    }
  };

  // functions of projects
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
        technologies: newProject.technologies.split(",").map((t) => t.trim()),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([payload])
        .select();

      if (error) {
        console.error("Error inserting project:", error.message);
      } else {
        setProjects([...projects, data[0]]);
        setNewProject({
          title: "",
          description: "",
          image: "",
          technologies: "",
          liveUrl: "",
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
        image: projectToEdit.image,
        technologies: Array.isArray(projectToEdit.technologies)
          ? projectToEdit.technologies.join(", ")
          : projectToEdit.technologies,
        liveUrl: projectToEdit.liveUrl,
        githubUrl: projectToEdit.githubUrl,
      });
      setEditingProjectId(id);
      setIsEditingProject(true);
      setIsAddingProject(true);
    }
  };
  const handleUpdateProject = async () => {
    if (!editingProjectId) return;

    const updatedData = {
      ...newProject,
      technologies: newProject.technologies.split(",").map((t) => t.trim()),
    };

    const { data, error } = await supabase
      .from("projects")
      .update(updatedData)
      .eq("id", editingProjectId)
      .select();

    if (error) {
      console.error(error);
    } else {
      const updatedProjects = projects.map((project) =>
        project.id === editingProjectId ? data[0] : project
      );
      setProjects(updatedProjects);
      setEditingProjectId(null);
      setIsEditingProject(false);
      setIsAddingProject(false);
      setNewProject({
        title: "",
        description: "",
        image: "",
        technologies: "",
        liveUrl: "",
        githubUrl: "",
      });
    }
  };
  const handleDeleteProject = async (id: number) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) console.error(error);
    else setProjects(projects.filter((project) => project.id !== id));
  };

  // function to get messages
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*");
      if (error) console.error(error);
      else setMessages(data);
    };
    fetchMessages();
  }, []);

  // function of logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleLogout();
    }, 600000); // logout after 100 seconds

    return () => clearTimeout(timer); // cleanup if component is removed
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          {/* Btn logout */}
          <Button
            variant="outline"
            className="border-white/20 text-black hover:bg-white/10 hover:text-white/80"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Skills Management */}
        <Card className="bg-white/10 border-white/20 p-6 mb-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Skills Management
            </h2>
            <Button
              onClick={() => {
                setIsAddingSkill(true);
                setEditingSkillId(null);
                setNewSkill({ name: "", category: "", level: 0 });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>

          {isAddingSkill && (
            <div className="bg-white/5 p-4 rounded-lg mb-6">
              {editingSkillId && (
                <p className="text-yellow-300 mb-2">
                  Editing Skill ID: {editingSkillId}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="skillName" className="text-white">
                    Skill Name
                  </Label>
                  <Input
                    id="skillName"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    placeholder="e.g., React"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={newSkill.category}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, category: e.target.value })
                    }
                    placeholder="e.g., Frontend"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="level" className="text-white">
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
                        level: parseInt(e.target.value),
                      })
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={
                      editingSkillId ? handleUpdateSkill : handleAddSkill
                    }
                    className="bg-green-600 hover:bg-green-700"
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
                    className="border-white/20 text-black hover:bg-white/5 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Skills list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
              >
                <div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-blue-400 text-sm">
                      {skill.category}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {skill.level}%
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-black hover:bg-white/10"
                    onClick={() => handleEditSkill(skill.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                    onClick={() => handleDeleteSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects Management */}
        <Card className="bg-white/10 border-white/20 p-6 mb-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Projects Management
            </h2>
            <Button
              onClick={() => setIsAddingProject(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {isAddingProject && (
            <div className="bg-white/5 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Title"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="bg-white/10 border-white/20 text-white"
              />

              <Input
                placeholder="Technologies (comma separated)"
                value={newProject.technologies}
                onChange={(e) =>
                  setNewProject({ ...newProject, technologies: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="Live URL"
                value={newProject.liveUrl}
                onChange={(e) =>
                  setNewProject({ ...newProject, liveUrl: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Input
                placeholder="GitHub URL"
                value={newProject.githubUrl}
                onChange={(e) =>
                  setNewProject({ ...newProject, githubUrl: e.target.value })
                }
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <div className="flex gap-2 col-span-full">
                <Button
                  onClick={
                    editingProjectId ? handleUpdateProject : handleAddProject
                  }
                  className="bg-green-600 hover:bg-green-700"
                >
                  {editingProjectId ? "Update" : "Add"}
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingProject(false);
                    setIsEditingProject(false);
                    setEditingProjectId(null);
                    setNewProject({
                      title: "",
                      description: "",
                      image: "",
                      technologies: "",
                      liveUrl: "",
                      githubUrl: "",
                    });
                  }}
                  variant="outline"
                  className="border-white/20 text-black hover:bg-white/20 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects &&
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/5 p-4 rounded-lg flex flex-col justify-between"
                >
                  <div className="mb-3">
                    <h3 className="text-white font-medium">{project?.title}</h3>
                    <p className="text-blue-400 text-sm">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                      onClick={() => handleEditProject(project.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-white mb-2">
              Total Skills
            </h3>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-300 text-transparent bg-clip-text">
              {skills.length}
            </p>
          </Card>

          <Card className="bg-white/10 border-white/20 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-green-300 text-transparent bg-clip-text">
              {projects.length}
            </p>
          </Card>

          <Card className="bg-white/10 border-white/20 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-white mb-2">Visitors</h3>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">
              {visitorsCount !== null ? visitorsCount : "Loading..."}
            </p>
          </Card>
        </div>

        {/* Visitors Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-white/10 border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Visitors This Year (by month)
            </h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={yearVisitorsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#60A5FA"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-white/10 border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Visitors This Month (by day)
            </h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={monthVisitorsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#34D399"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
