import { useEffect, useMemo, useState } from "react";
import { Card } from "./components/Card";
import { Button, Input, Select } from "./components/ui";
import { createWorker, listWorkers, type Seniority, type Worker } from "./api/workers";
import { assignWorker, createProject, listProjectsWithWorkers, type ProjectWithWorkers} from "./api/projects";
import { resetDemo } from "./api/admin";
function formatDateRange(startDate: string, endDate: string) {
  return `${startDate} → ${endDate}`;
}

export default function App() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<ProjectWithWorkers[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  function showSuccess(message: string) {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 2500);
  }  

  // Worker form
  const [wName, setWName] = useState("");
  const [wRole, setWRole] = useState("");
  const [wSeniority, setWSeniority] = useState<Seniority>("junior");

  // Project form
  const [pName, setPName] = useState("");
  const [pClient, setPClient] = useState("");
  const [pStart, setPStart] = useState("2026-02-26");
  const [pEnd, setPEnd] = useState("2026-03-10");

  // Assign form
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const canAssign = useMemo(() => selectedProjectId && selectedWorkerId, [selectedProjectId, selectedWorkerId]);

  const canCreateWorker = wName.trim().length > 0 && wRole.trim().length > 0;
  
  const canCreateProject =
    pName.trim().length > 0 &&
    pClient.trim().length > 0 &&
    pStart.trim().length > 0 &&
    pEnd.trim().length > 0;
  
  async function refreshAll() {
    setError(null);
    const [w, p] = await Promise.all([listWorkers(), listProjectsWithWorkers()]);
    setWorkers(w);
    setProjects(p);

    // defaults para selects
    if (!selectedProjectId && p.length) setSelectedProjectId(p[0].id);
    if (!selectedWorkerId && w.length) setSelectedWorkerId(w[0].id);
  }

  useEffect(() => {
    setLoading(true);
    refreshAll()
      .catch((e) => setError(e instanceof Error ? e.message : "Unknown error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreateWorker(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createWorker({ name: wName, role: wRole, seniority: wSeniority });
      showSuccess("Worker created");
      setWName("");
      setWRole("");
      setWSeniority("junior");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function onCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createProject({ name: pName, client: pClient, startDate: pStart, endDate: pEnd });
      showSuccess("Project created");
      setPName("");
      setPClient("");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function onAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!canAssign) return;

    setLoading(true);
    setError(null);

    try {
      await assignWorker(selectedProjectId, selectedWorkerId);
      showSuccess("Worker assigned to project");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Project Management Mini</h1>
            <p className="mt-1 text-sm text-slate-600">
              Create workers, create projects, assign workers to projects, and list projects with assigned workers.
            </p>
          </div>
            <button
              type="button"
              onClick={async () => {
                const ok = confirm("This will clear all in-memory data. Continue?");
                if (!ok) return;

                setLoading(true);
                setError(null);
                try {
                  await resetDemo();
                  showSuccess("Demo data cleared");
                  setSelectedProjectId("");
                  setSelectedWorkerId("");
                  await refreshAll();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Unknown error");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-60"
            >
              Reset demo
            </button>

            <Button type="button" onClick={() => refreshAll()} disabled={loading}>
              Refresh
            </Button>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <div className="font-semibold">Error</div>
            <div className="mt-1 text-sm">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <div className="font-semibold">Done</div>
            <div className="mt-1 text-sm">{success}</div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Create Worker">
            <form onSubmit={onCreateWorker} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <Input value={wName} onChange={(e) => setWName(e.target.value)} placeholder="e.g. Ana Pérez" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                <Input value={wRole} onChange={(e) => setWRole(e.target.value)} placeholder="e.g. frontend" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Seniority</label>
                <Select value={wSeniority} onChange={(e) => setWSeniority(e.target.value as Seniority)}>
                  <option value="junior">junior</option>
                  <option value="semi-senior">semi-senior</option>
                  <option value="senior">senior</option>
                </Select>
              </div>
              <Button disabled={loading || !canCreateWorker} type="submit">
                Create
              </Button>
            </form>
          </Card>

          <Card title="Create Project">
            <form onSubmit={onCreateProject} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <Input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="e.g. Sistema Inventario" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Client</label>
                <Input value={pClient} onChange={(e) => setPClient(e.target.value)} placeholder="e.g. Cliente X" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Start</label>
                  <Input value={pStart} onChange={(e) => setPStart(e.target.value)} placeholder="YYYY-MM-DD" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">End</label>
                  <Input value={pEnd} onChange={(e) => setPEnd(e.target.value)} placeholder="YYYY-MM-DD" />
                </div>
              </div>
              <Button disabled={loading || !canCreateProject} type="submit">
                Create
              </Button>
            </form>
          </Card>

          <Card title="Assign Worker to Project">
            <form onSubmit={onAssign} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Project</label>
                <Select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                  <option value="" disabled>
                    {projects.length ? "Select a project" : "No projects yet"}
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Worker</label>
                <Select value={selectedWorkerId} onChange={(e) => setSelectedWorkerId(e.target.value)}>
                  <option value="" disabled>
                    {workers.length ? "Select a worker" : "No workers yet"}
                  </option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} — {w.role} ({w.seniority})
                    </option>
                  ))}
                </Select>
              </div>
              <Button disabled={loading || !canAssign} type="submit">
                Assign
              </Button>
              <p className="text-xs text-slate-500">
                Tip: data is in-memory, so restarting the backend resets projects and workers.
              </p>
            </form>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="Projects">
            {loading && projects.length === 0 ? (
              <div className="text-slate-600">Loading…</div>
            ) : projects.length === 0 ? (
              <div className="text-slate-600">No projects yet.</div>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <div className="text-base font-semibold text-slate-900">
                          {p.name} <span className="text-sm font-normal text-slate-500">({p.id})</span>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          Client: <span className="font-medium text-slate-800">{p.client}</span> ·{" "}
                          {formatDateRange(p.startDate, p.endDate)}
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                        {p.workers.length} worker{p.workers.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.workers.length === 0 ? (
                        <span className="text-sm text-slate-500">No workers assigned.</span>
                      ) : (
                        p.workers.map((w) => (
                          <span
                            key={w.id}
                            className="rounded-full bg-white px-3 py-1 text-sm text-slate-800 ring-1 ring-slate-200"
                            title={w.id}
                          >
                            {w.name} · {w.role} · {w.seniority}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}