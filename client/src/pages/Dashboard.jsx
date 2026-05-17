import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UploadCloud, ChevronDown, Plus, ArrowRight, LogOut, CalendarDays, User, FileText, Sparkles } from "lucide-react";
import API from "../services/api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    dueDate: "",
  });

  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dueDate: "",
    sort: "createdAt",
  });

  const [tasks, setTasks] = useState([]);

  const taskMetrics = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    overdue: tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today && task.status !== "completed";
    }).length,
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTasks = async () => {
    try {
      const query = [];
      if (filters.status) query.push(`status=${filters.status}`);
      if (filters.priority) query.push(`priority=${filters.priority}`);
      if (filters.dueDate) query.push(`dueDate=${filters.dueDate}`);
      if (filters.sort) query.push(`sort=${filters.sort}`);
      const queryString = query.length ? `?${query.join("&")}` : "";
      const res = await API.get(`/tasks${queryString}`);
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!formData.title || formData.title.trim().length < 3) {
        alert("Title must be at least 3 characters");
        return;
      }
      if (!formData.description || formData.description.trim().length < 5) {
        alert("Description must be at least 5 characters");
        return;
      }
      if (files.length > 3) {
        alert("You can upload up to 3 documents");
        return;
      }
      for (const f of files) {
        if (f.type !== "application/pdf") {
          alert("Only PDF files are allowed");
          return;
        }
      }

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("priority", formData.priority);
      payload.append("status", formData.status);
      if (formData.dueDate) payload.append("dueDate", formData.dueDate);
      if (formData.assignedTo) payload.append("assignedTo", formData.assignedTo);
      files.slice(0, 3).forEach((file) => payload.append("documents", file));
      await API.post("/tasks", payload, {
      });
      alert("Task Created");
      fetchTasks();
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        assignedTo: "",
        dueDate: "",
      });
      setFiles([]);
    } catch (error) {
      alert("Error creating task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchTasks();
    if (user.role === "admin") {
      API.get("/users")
        .then((res) => setUsers(res.data.users || []))
        .catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950/95 px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.08),_transparent_24%)]"></div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-2 md:px-6">
      <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_30px_75px_rgba(30,58,138,0.25)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">TaskFlow</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Task Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">A modern premium workspace for managing deadlines, priorities and teams.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.role === "admin" && (
            <button
              onClick={() => (window.location.href = "/users")}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" /> Manage Users
            </button>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_0.85fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_30px_75px_rgba(30,58,138,0.15)]"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">New task</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Create task</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
              <UploadCloud className="h-4 w-4 text-cyan-300" /> PDF upload
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500"
                required
              />
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Task description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500 min-h-[140px] resize-none"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500" />
            </div>
            {user.role === "admin" && (
              <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500">
                <option value="">Assign user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.email}
                  </option>
                ))}
              </select>
            )}
            <div className="relative">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = Array.from(e.dataTransfer.files);
                  setFiles((prev) => [...prev, ...dropped].slice(0, 3));
                }}
                className="flex min-h-[56px] items-center justify-between rounded-2xl border-dashed border-white/15 bg-slate-950/70 px-4 text-sm text-slate-400 transition hover:border-cyan-400"
              >
                <span className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-cyan-300" />
                  <span>{files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Drag & drop PDFs or click to upload"}</span>
                </span>
                <span className="rounded-full bg-slate-900/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
                  PDF only
                </span>
              </div>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 3))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            {files.length > 0 && (
              <div className="grid gap-2 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                    <span className="truncate">{file.name}</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== index))} className="text-cyan-300 hover:text-white">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 px-6 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> Create Task
            </button>
          </form>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_30px_75px_rgba(30,58,138,0.15)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Filters</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Search & sort</h2>
            </div>
            <div className="rounded-full bg-slate-900/70 px-3 py-2 text-sm text-slate-300">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            <select
              name="status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500"
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              name="priority"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500"
            >
              <option value="">All priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={filters.dueDate}
              onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500"
            />
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 placeholder:text-slate-500"
            >
              <option value="createdAt">Created at</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
            </select>
            <button
              type="button"
              onClick={fetchTasks}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            >
              <ArrowRight className="h-4 w-4 text-cyan-300" /> Apply filters
            </button>
          </div>
        </motion.aside>
      </div>

      <section className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_30px_75px_rgba(30,58,138,0.15)]">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Total tasks</p>
            <p className="mt-4 text-3xl font-semibold text-white">{taskMetrics.total}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_30px_75px_rgba(30,58,138,0.15)]">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Open tasks</p>
            <p className="mt-4 text-3xl font-semibold text-white">{taskMetrics.pending}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_30px_75px_rgba(30,58,138,0.15)]">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Completed</p>
            <p className="mt-4 text-3xl font-semibold text-white">{taskMetrics.completed}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_30px_75px_rgba(30,58,138,0.15)]">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Overdue</p>
            <p className="mt-4 text-3xl font-semibold text-white">{taskMetrics.overdue}</p>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden p-6 shadow-[0_30px_75px_rgba(30,58,138,0.15)]"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Task board</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">All tasks</h2>
            </div>
            <button
              type="button"
              onClick={fetchTasks}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              <ArrowRight className="h-4 w-4 text-cyan-300" /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Assigned</th>
                  <th className="px-4 py-4">Priority</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Due date</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-950/50">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-white/5 transition-colors">
                    <td className="whitespace-nowrap px-4 py-4">
                      <p className="font-semibold text-white">{task.title}</p>
                      <p className="mt-1 max-w-xl truncate text-xs text-slate-400">{task.description}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">{task.assignedTo?.email || "Unassigned"}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        task.priority === "high"
                          ? "bg-rose-500/15 text-rose-300"
                          : task.priority === "medium"
                          ? "bg-sky-500/15 text-sky-300"
                          : "bg-emerald-500/15 text-emerald-300"
                      }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        task.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-400/15 text-amber-300"
                      }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <button
                        type="button"
                        onClick={() => (window.location.href = `/tasks/${task._id}`)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      No tasks found. Create a task or adjust your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>
      </section>
    </div>
  </div>
  );
}

export default Dashboard;
