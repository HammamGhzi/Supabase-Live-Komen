import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  created_at?: string;
};

const ADMIN_PASSWORD = "hammam2006";

const cardColors = ["bg-nb-yellow", "bg-nb-pink", "bg-nb-blue", "bg-nb-green"];
const tagColors = [
  "bg-nb-pink text-charcoal",
  "bg-nb-blue text-white",
  "bg-nb-yellow text-charcoal",
  "bg-charcoal text-white",
];

const emptyForm = { title: "", description: "", tags: "", link: "" };

const extractRepoPath = (url: string) => {
  try {
    const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
    return match ? match[1].replace(/\.git$/, "") : null;
  } catch {
    return null;
  }
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editDetecting, setEditDetecting] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("admin")) {
      if (sessionStorage.getItem("isAdmin") === "true") {
        setIsAdmin(true);
      } else {
        setShowPasswordPrompt(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) setProjects(data);
      } catch (_) {}
    };
    fetchProjects();

    const channel = supabase
      .channel("projects-crud")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => {
          fetchProjects();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const detectLanguages = async (url: string): Promise<string[]> => {
    const repoPath = extractRepoPath(url);
    if (!repoPath) return [];

    const results: string[] = [];

    // Fetch languages dari GitHub API
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repoPath}/languages`,
      );
      if (res.ok) {
        const data = await res.json();
        Object.keys(data).forEach((l) => {
          if (
            ![
              "JavaScript",
              "TypeScript",
              "PHP",
              "Python",
              "Ruby",
              "Dart",
            ].includes(l)
          ) {
            results.push(l);
          }
        });
      }
    } catch (_) {}

    const tryFetch = async (path: string) => {
      for (const branch of ["main", "master"]) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${repoPath}/${branch}/${path}`,
          );
          if (res.ok) return await res.json();
        } catch (_) {}
      }
      return null;
    };

    // package.json — Node/JS ecosystem
    const pkg = await tryFetch("package.json");
    if (pkg) {
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const map: Record<string, string> = {
        react: "React",
        next: "Next.js",
        vue: "Vue",
        nuxt: "Nuxt",
        svelte: "Svelte",
        "@angular/core": "Angular",
        express: "Express",
        fastify: "Fastify",
        "socket.io": "Socket.io",
        prisma: "Prisma",
        mongoose: "MongoDB",
        tailwindcss: "Tailwind CSS",
        bootstrap: "Bootstrap",
        vite: "Vite",
        typescript: "TypeScript",
        "react-native": "React Native",
        expo: "Expo",
        redux: "Redux",
        zustand: "Zustand",
        graphql: "GraphQL",
        firebase: "Firebase",
        "@supabase/supabase-js": "Supabase",
        "framer-motion": "Framer Motion",
        three: "Three.js",
        trpc: "tRPC",
        hono: "Hono",
        astro: "Astro",
        remix: "Remix",
      };
      Object.entries(map).forEach(([key, label]) => {
        if (deps?.[key]) results.push(label);
      });
    }

    // composer.json — PHP ecosystem
    const composer = await tryFetch("composer.json");
    if (composer) {
      results.push("PHP");
      const deps = { ...composer.require, ...composer["require-dev"] };
      const map: Record<string, string> = {
        "laravel/framework": "Laravel",
        "symfony/symfony": "Symfony",
        "codeigniter4/framework": "CodeIgniter",
        "slim/slim": "Slim",
        "cakephp/cakephp": "CakePHP",
        "yiisoft/yii2": "Yii2",
        "doctrine/orm": "Doctrine",
        "filament/filament": "Filament",
        "livewire/livewire": "Livewire",
        "inertiajs/inertia-laravel": "Inertia.js",
      };
      Object.entries(map).forEach(([key, label]) => {
        if (deps?.[key]) results.push(label);
      });
    }

    // requirements.txt — Python ecosystem
    const requirements = await (async () => {
      for (const branch of ["main", "master"]) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${repoPath}/${branch}/requirements.txt`,
          );
          if (res.ok) return await res.text();
        } catch (_) {}
      }
      return null;
    })();

    if (requirements) {
      results.push("Python");
      const map: Record<string, string> = {
        django: "Django",
        flask: "Flask",
        fastapi: "FastAPI",
        sqlalchemy: "SQLAlchemy",
        celery: "Celery",
        pandas: "Pandas",
        numpy: "NumPy",
        tensorflow: "TensorFlow",
        torch: "PyTorch",
        scikit: "Scikit-learn",
        scrapy: "Scrapy",
        pydantic: "Pydantic",
      };
      const lower = requirements.toLowerCase();
      Object.entries(map).forEach(([key, label]) => {
        if (lower.includes(key)) results.push(label);
      });
    }

    // Gemfile — Ruby ecosystem
    const gemfile = await (async () => {
      for (const branch of ["main", "master"]) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${repoPath}/${branch}/Gemfile`,
          );
          if (res.ok) return await res.text();
        } catch (_) {}
      }
      return null;
    })();

    if (gemfile) {
      results.push("Ruby");
      const map: Record<string, string> = {
        rails: "Ruby on Rails",
        sinatra: "Sinatra",
        devise: "Devise",
        sidekiq: "Sidekiq",
      };
      const lower = gemfile.toLowerCase();
      Object.entries(map).forEach(([key, label]) => {
        if (lower.includes(key)) results.push(label);
      });
    }

    // pubspec.yaml — Dart/Flutter ecosystem
    const pubspec = await (async () => {
      for (const branch of ["main", "master"]) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${repoPath}/${branch}/pubspec.yaml`,
          );
          if (res.ok) return await res.text();
        } catch (_) {}
      }
      return null;
    })();

    if (pubspec) {
      results.push("Dart");
      if (pubspec.includes("flutter")) results.push("Flutter");
    }

    // go.mod — Go ecosystem
    const gomod = await (async () => {
      for (const branch of ["main", "master"]) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${repoPath}/${branch}/go.mod`,
          );
          if (res.ok) return await res.text();
        } catch (_) {}
      }
      return null;
    })();

    if (gomod) {
      results.push("Go");
      const map: Record<string, string> = {
        "gin-gonic/gin": "Gin",
        "gofiber/fiber": "Fiber",
        "gorilla/mux": "Gorilla Mux",
        "labstack/echo": "Echo",
      };
      Object.entries(map).forEach(([key, label]) => {
        if (gomod.includes(key)) results.push(label);
      });
    }

    return [...new Set(results)];
  };

  const handleDetect = async (mode: "add" | "edit") => {
    const url = mode === "add" ? addForm.link : editForm.link;
    if (!url) {
      setDetectError("Isi link GitHub dulu");
      return;
    }
    if (!url.includes("github.com")) {
      setDetectError("Link harus dari GitHub");
      return;
    }

    setDetectError("");
    if (mode === "add") setDetecting(true);
    else setEditDetecting(true);

    const langs = await detectLanguages(url);

    if (langs.length === 0) {
      setDetectError("Gagal detect, cek link GitHub-nya");
    } else {
      if (mode === "add")
        setAddForm((prev) => ({ ...prev, tags: langs.join(", ") }));
      else setEditForm((prev) => ({ ...prev, tags: langs.join(", ") }));
    }

    if (mode === "add") setDetecting(false);
    else setEditDetecting(false);
  };

  const handleAdd = async () => {
    if (!addForm.title || !addForm.description) return;
    setSubmitting(true);
    const tagArray = addForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { data } = await supabase
      .from("projects")
      .insert({
        title: addForm.title,
        description: addForm.description,
        tags: tagArray,
        link: addForm.link || null,
      })
      .select();
    if (data) setProjects((prev) => [data[0], ...prev]);
    setAddForm(emptyForm);
    setShowAddForm(false);
    setSubmitting(false);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      link: project.link || "",
    });
  };

  const handleEdit = async (id: number) => {
    const tagArray = editForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { data } = await supabase
      .from("projects")
      .update({
        title: editForm.title,
        description: editForm.description,
        tags: tagArray,
        link: editForm.link || null,
      })
      .eq("id", id)
      .select();
    if (data)
      setProjects((prev) => prev.map((p) => (p.id === id ? data[0] : p)));
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const DetectButton = ({ mode }: { mode: "add" | "edit" }) => (
    <button
      type="button"
      onClick={() => handleDetect(mode)}
      disabled={mode === "add" ? detecting : editDetecting}
      className="border-2 border-charcoal bg-white font-bold px-4 py-3 text-sm text-charcoal hover:bg-cream transition-all disabled:opacity-40 flex items-center gap-2"
    >
      {(mode === "add" ? detecting : editDetecting) ? (
        <>
          <span className="animate-spin">⟳</span> Detecting...
        </>
      ) : (
        <>⚡ Auto-detect dari GitHub</>
      )}
    </button>
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-slide-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card, i) => {
      (card as HTMLElement).style.animationDelay = `${i * 0.12}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [projects]);

  return (
    <section
      id="projects"
      className="py-24 px-6 bg-white border-t-2 border-charcoal"
    >
      <div className="max-w-5xl mx-auto">
        {showPasswordPrompt && (
          <div className="fixed inset-0 z-50 bg-charcoal/80 flex items-center justify-center p-6">
            <div className="bg-white border-2 border-charcoal shadow-nb-xl p-8 w-full max-w-sm">
              <h3 className="font-display text-2xl font-bold text-charcoal mb-6">
                Admin Access
              </h3>
              <input
                type="password"
                autoFocus
                className="w-full border-2 border-charcoal p-3 font-semibold text-charcoal bg-cream focus:outline-none focus:bg-nb-yellow transition-colors mb-3"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              {passwordError && (
                <p className="text-red-500 text-sm font-semibold mb-3">
                  Password salah.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-charcoal text-nb-yellow border-2 border-charcoal font-bold py-3 hover:opacity-90 transition-all"
                >
                  Masuk →
                </button>
                <button
                  onClick={() => {
                    setShowPasswordPrompt(false);
                    setPasswordInput("");
                  }}
                  className="px-4 border-2 border-charcoal font-bold text-charcoal hover:bg-cream transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {deletingId !== null && (
          <div className="fixed inset-0 z-50 bg-charcoal/80 flex items-center justify-center p-6">
            <div className="bg-white border-2 border-charcoal shadow-nb-xl p-8 w-full max-w-sm">
              <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
                Hapus Proyek?
              </h3>
              <p className="text-charcoal text-sm mb-6 opacity-70">
                Proyek ini akan dihapus permanen.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="flex-1 bg-red-500 text-white border-2 border-charcoal font-bold py-3 hover:opacity-90"
                >
                  Hapus
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 border-2 border-charcoal font-bold text-charcoal py-3 hover:bg-cream"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block bg-nb-yellow border-2 border-charcoal px-4 py-1 text-sm font-bold mb-3">
              PORTOFOLIO
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-extrabold text-charcoal leading-none">
              Proyek
              <br />
              Terbaru
            </h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="self-start md:self-auto bg-charcoal text-nb-yellow border-2 border-charcoal shadow-nb font-bold px-6 py-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-hover transition-all duration-150"
            >
              {showAddForm ? "✕ Tutup" : "+ Tambah Proyek"}
            </button>
          )}
        </div>

        {isAdmin && showAddForm && (
          <div className="bg-nb-yellow border-2 border-charcoal shadow-nb-xl p-8 mb-10">
            <h3 className="font-display text-2xl font-bold text-charcoal mb-6">
              Proyek Baru
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none focus:bg-cream col-span-full placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Judul proyek *"
                value={addForm.title}
                onChange={(e) =>
                  setAddForm({ ...addForm, title: e.target.value })
                }
              />
              <textarea
                className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none focus:bg-cream resize-none h-24 col-span-full placeholder:text-gray-400 placeholder:font-normal"
                placeholder="Deskripsi proyek *"
                value={addForm.description}
                onChange={(e) =>
                  setAddForm({ ...addForm, description: e.target.value })
                }
              />
              <div className="col-span-full flex gap-3">
                <input
                  className="flex-1 border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none focus:bg-cream placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Link GitHub (untuk auto-detect) atau link deploy"
                  value={addForm.link}
                  onChange={(e) => {
                    setAddForm({ ...addForm, link: e.target.value });
                    setDetectError("");
                  }}
                />
                <DetectButton mode="add" />
              </div>
              <div className="col-span-full">
                <input
                  className="w-full border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none focus:bg-cream placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="Tags (otomatis terisi, atau isi manual pisah koma)"
                  value={addForm.tags}
                  onChange={(e) =>
                    setAddForm({ ...addForm, tags: e.target.value })
                  }
                />
                {detectError && (
                  <p className="text-red-500 text-xs font-semibold mt-1">
                    {detectError}
                  </p>
                )}
              </div>
              <button
                onClick={handleAdd}
                disabled={!addForm.title || !addForm.description || submitting}
                className="col-span-full bg-charcoal text-nb-yellow border-2 border-charcoal font-bold py-3 hover:opacity-90 transition-all disabled:opacity-40"
              >
                {submitting ? "Menyimpan..." : "Publikasikan →"}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div key={project.id}>
              {isAdmin && editingId === project.id ? (
                <div className="border-2 border-charcoal shadow-nb-lg p-8 bg-cream">
                  <h3 className="font-display text-xl font-bold text-charcoal mb-4">
                    Edit Proyek
                  </h3>
                  <div className="flex flex-col gap-3">
                    <input
                      className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                    <textarea
                      className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none resize-none h-20"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-3">
                      <input
                        className="flex-1 border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
                        placeholder="Link GitHub atau deploy"
                        value={editForm.link}
                        onChange={(e) =>
                          setEditForm({ ...editForm, link: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDetect("edit")}
                        disabled={editDetecting}
                        className="border-2 border-charcoal bg-white font-bold px-3 py-2 text-xs text-charcoal hover:bg-cream transition-all disabled:opacity-40"
                      >
                        {editDetecting ? "⟳" : "⚡"}
                      </button>
                    </div>
                    <input
                      className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-white focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
                      placeholder="Tags (pisah koma)"
                      value={editForm.tags}
                      onChange={(e) =>
                        setEditForm({ ...editForm, tags: e.target.value })
                      }
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(project.id)}
                        className="flex-1 bg-charcoal text-nb-yellow border-2 border-charcoal font-bold py-2 hover:opacity-90"
                      >
                        Simpan ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 border-2 border-charcoal font-bold text-charcoal hover:bg-white"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`project-card ${cardColors[i % cardColors.length]} border-2 border-charcoal shadow-nb-lg p-8 ...`}
                >
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => startEdit(project)}
                        className="bg-white border-2 border-charcoal px-2 py-1 text-xs font-bold text-charcoal hover:bg-cream transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(project.id)}
                        className="bg-white border-2 border-charcoal px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50 transition-all"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-4xl font-extrabold text-charcoal opacity-20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-charcoal font-bold text-xl group-hover:translate-x-1 transition-transform">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ↗
                        </a>
                      ) : (
                        "→"
                      )}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
                    {project.title}
                  </h3>
                  <p className="text-charcoal opacity-80 leading-relaxed mb-6 text-sm font-medium">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, j) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 border-2 border-charcoal text-xs font-bold ${tagColors[j % tagColors.length]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
