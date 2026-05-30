import React from "react";
import { useEffect } from "react";

const educationHistory = [
  {
    period: "2024 — Sekarang",
    degree: "D4 Teknik Terapan Informatika",
    institution: "Universitas Harkat Negeri Kota Tegal",
    description:
      "Fokus pada pengembangan perangkat lunak dan sistem informasi. IPK 3.95/4.00.",
    accent: "bg-nb-yellow",
  },
  {
    period: "2024",
    degree: "Web Front-End Developer Study Club",
    institution: "Plugin",
    description:
      "Kursus intensif tentang pengembangan web front-end menggunakan HTML, CSS, JavaScript, React, dan Tailwind. Membangun beberapa proyek mini sebagai portofolio.",
    accent: "bg-nb-blue",
  },
  {
    period: "2020 — 2024",
    degree: "SMK Negeri 2 Adiwerna",
    institution: "Jurusan Teknik Komputer dan Jaringan",
    description:
      "Pendidikan menengah kejuruan dengan fokus pada jaringan komputer, pemrograman dasar, dan administrasi sistem. ",
    accent: "bg-nb-pink",
  },
];

const Education: React.FC = () => {
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

    const cards = document.querySelectorAll(".edu-card");
    cards.forEach((card, i) => {
      (card as HTMLElement).style.animationDelay = `${i * 0.15}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <section
      id="pendidikan"
      className="py-24 px-6 bg-charcoal border-t-2 border-charcoal"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <div className="inline-block bg-nb-yellow border-2 border-nb-yellow px-4 py-1 text-sm font-bold mb-3 text-charcoal">
            LATAR BELAKANG
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-extrabold text-nb-yellow leading-none">
            Riwayat
            <br />
            Pendidikan
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-nb-yellow hidden md:block" />

          <div className="space-y-6">
            {educationHistory.map((item, i) => (
              <div key={i} className="md:pl-16 relative">
                {/* Timeline dot */}
                <div
                  className={`hidden md:flex absolute left-0 top-8 w-12 h-12 ${item.accent} border-2 border-white items-center justify-center font-display font-bold text-charcoal text-xs`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="edu-card bg-white border-2 border-white shadow-nb-lg p-8 flex flex-col md:flex-row gap-6">
                  <div className="md:w-36 shrink-0">
                    <div
                      className={`inline-block ${item.accent} border-2 border-charcoal px-3 py-1 text-xs font-bold text-charcoal`}
                    >
                      {item.period}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-charcoal mb-1">
                      {item.degree}
                    </h3>
                    <p className="font-semibold text-gray-500 text-sm mb-3">
                      {item.institution}
                    </p>
                    <p className="text-charcoal text-sm leading-relaxed opacity-80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
