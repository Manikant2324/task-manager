import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, CalendarDays, User, BadgeCheck } from "lucide-react";
import API from "../services/api";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const uploadsBase = apiBase.replace(/\/api$/, "") + "/uploads";

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  if (!task) return <div className="min-h-screen bg-slate-950 px-6 py-20 text-slate-200">Loading task details...</div>;

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 sm:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.25fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card overflow-hidden"
        >
          <div className="flex flex-col gap-6 p-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-3xl bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
                  <FileText className="inline-block h-4 w-4 text-cyan-300" /> Task details
                </div>
                <div className="rounded-full bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-300/90">
                  {task.status}
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">{task.title}</h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300">{task.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                <h2 className="text-sm uppercase tracking-[0.28em] text-slate-400">Priority</h2>
                <p className="mt-3 text-xl font-semibold text-white">{task.priority}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                <h2 className="text-sm uppercase tracking-[0.28em] text-slate-400">Assigned</h2>
                <p className="mt-3 text-xl font-semibold text-white">{task.assignedTo?.email || "Unassigned"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                <div className="flex items-center gap-3 text-slate-300">
                  <CalendarDays className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm">Due date</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                <div className="flex items-center gap-3 text-slate-300">
                  <User className="h-4 w-4 text-cyan-300" />
                  <span className="text-sm">Created by</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">{task.createdBy?.email || "Unknown"}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Attachments</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Documents</h2>
              </div>
              <BadgeCheck className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="mt-6 space-y-4">
              {task.documents && task.documents.length ? (
                task.documents.map((doc) => {
                  const url = `${uploadsBase}/${doc}`;
                  return (
                    <div key={doc} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 text-slate-200">
                          <FileText className="h-5 w-5 text-cyan-300" />
                          <div>
                            <p className="font-medium text-white">{doc}</p>
                            <p className="text-sm text-slate-400">PDF document</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/15"
                          >
                            <Download className="h-4 w-4" /> Download
                          </a>
                          <button
                            onClick={() => setSelectedFile(url)}
                            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-400">No documents attached yet.</p>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="glass-card rounded-[2rem] border border-white/10 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">Preview</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">Document viewer</h2>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="rounded-full bg-slate-900/60 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
                >
                  Close
                </button>
              </div>
              <div className="mt-6 h-[520px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950">
                <iframe title="doc-preview" src={selectedFile} className="h-full w-full" />
              </div>
            </div>
          )}
        </motion.aside>
      </div>
    </div>
  );
}

export default TaskDetails;
