import React from "react";
import { useEffect } from "react";

const Hero: React.FC = () => {
  useEffect(() => {
    const el = document.getElementById("stickynote");
    if (!el) return;

    let angle = 2;
    let velocity = 0;
    let animId = 0;

    const applyTransform = (a: number) => {
      el.style.transform = `rotate(${a}deg)`;
    };

    const shake = () => {
      velocity += -0.05 * (angle - 2);
      velocity *= 0.9;
      angle += velocity;
      applyTransform(angle);
      if (Math.abs(velocity) > 0.05 || Math.abs(angle - 2) > 0.1) {
        animId = requestAnimationFrame(shake);
      } else {
        angle = 2;
        applyTransform(2);
      }
    };

    const onClick = () => {
      cancelAnimationFrame(animId);
      velocity = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 8);
      animId = requestAnimationFrame(shake);
    };

    el.addEventListener("click", onClick);

    // Auto goyang saat pertama load
    setTimeout(() => {
      velocity = 6;
      animId = requestAnimationFrame(shake);
    }, 500);

    return () => {
      el.removeEventListener("click", onClick);
      cancelAnimationFrame(animId);
    };
  }, []);
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 bg-cream relative overflow-hidden">
      <div className="absolute top-32 right-16 w-48 h-48 bg-nb-pink border-2 border-charcoal rotate-12 opacity-30" />
      <div className="absolute bottom-24 left-8 w-36 h-36 bg-nb-blue border-2 border-charcoal -rotate-6 opacity-20" />
      <div className="absolute top-48 left-24 w-24 h-24 bg-nb-yellow border-2 border-charcoal rotate-45 opacity-40" />

      <div className="max-w-4xl mx-auto text-center animate-fade-in-up relative z-10">
        <div className="mb-10 flex justify-center">
          <div
            id="stickynote"
            className="relative cursor-pointer select-none"
            style={{ transform: "rotate(2deg)", transformOrigin: "top center" }}
          >
            {/* Pin */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
              <div className="w-6 h-6 bg-red-500 border-2 border-charcoal rounded-full shadow-md" />
              <div className="w-1.5 h-4 bg-charcoal" />
            </div>

            {/* Note */}
            <div
              className="bg-nb-yellow border-2 border-charcoal shadow-nb-xl p-5 pt-8"
              style={{ width: 260 }}
            >
              {/* Foto */}
              <img
                src="src/img/HammamProfil.jpg"
                alt="Hammam"
                className="w-full object-cover border-2 border-charcoal mb-4"
                style={{ height: 200 }}
              />
              {/* Nama */}
              <p
                className="text-charcoal text-xl font-black text-center mb-1"
                style={{ fontFamily: "cursive" }}
              >
                Muhammad Hammam Ghazi
              </p>
              {/* Role */}
              <p
                className="text-charcoal text-sm font-bold text-center opacity-70 mb-3"
                style={{ fontFamily: "cursive" }}
              >
                Mahasiswa Teknik Informatika
              </p>
              {/* Garis */}
              <div className="flex flex-col gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-charcoal opacity-20" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 max-w-xl mx-auto leading-relaxed text-base mb-10 font-medium">
          Saya adalah seorang mahasiswa Teknik Informatika , Universitas Harkat Negeri Kota Tegal. Saya memiliki minat besar dalam pengembangan web. Saya suka menciptakan proyek-proyek kreatif yang tidak hanya fungsional tetapi juga menyenangkan untuk digunakan. Di luar dunia coding, saya menikmati bermain game dan mendengarkan musik.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#projects"
            className="px-8 py-3 bg-charcoal text-nb-yellow border-2 border-charcoal shadow-nb font-bold text-base hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-hover transition-all duration-150"
          >
            Lihat Proyek →
          </a>
          <a
            href="#comments"
            className="px-8 py-3 bg-nb-yellow text-charcoal border-2 border-charcoal shadow-nb font-bold text-base hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-hover transition-all duration-150"
          >
            Tinggalkan Komentar
          </a>
        </div>

        {/* Social */}
      <div className="mt-12 flex justify-center gap-3 mb-16">
        {[
          { label: 'GitHub', url: 'https://github.com/HammamGhzi' },
          { label: 'Instagram', url: 'https://www.instagram.com/hmmamghzi?igsh=MThnaG94bDN6cTU3dw==' },
          { label: 'Email', url: 'mailto:hammamghazi54@gmail.com' },
        ].map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 text-sm font-semibold border-2 border-charcoal bg-white hover:bg-charcoal hover:text-white transition-all duration-150"
          >
            {s.label}
          </a>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Hero;
