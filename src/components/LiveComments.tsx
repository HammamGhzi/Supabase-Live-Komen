import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

type Comment = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export default function LiveComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setComments(data);
    };
    fetchComments();

    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          setComments((prev) => [payload.new as Comment, ...prev]);
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async () => {
    if (!name || !message) return;
    await supabase.from("comments").insert({ name, message });
    setName("");
    setMessage("");
  };

  const avatarColors = ['bg-nb-yellow', 'bg-nb-pink', 'bg-nb-blue', 'bg-nb-green', 'bg-nb-orange'];

  return (
    <div id="comments" className="py-24 px-6 bg-cream border-t-2 border-charcoal">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="inline-block bg-nb-pink border-2 border-charcoal px-4 py-1 text-sm font-bold mb-3">INTERAKSI</div>
          <h2 className="font-display text-5xl font-extrabold text-charcoal">Komentar</h2>
        </div>

        {/* Form */}
        <div className="bg-white border-2 border-charcoal shadow-nb-xl p-8 mb-10">
          <div className="flex flex-col gap-4">
            <input
              className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-cream focus:outline-none focus:bg-nb-yellow transition-colors placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="border-2 border-charcoal p-3 font-semibold text-charcoal bg-cream focus:outline-none focus:bg-nb-yellow transition-colors placeholder:text-gray-400 placeholder:font-normal resize-none h-28"
              placeholder="Tulis komentar..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="bg-charcoal text-nb-yellow border-2 border-charcoal shadow-nb font-bold py-3 text-base hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-hover transition-all duration-150 disabled:opacity-40"
              onClick={handleSubmit}
              disabled={!name || !message}
            >
              Kirim Komentar →
            </button>
          </div>
        </div>

        {/* Comments List — scrollable container */}
        <div className="bg-white border-2 border-charcoal shadow-nb-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b-2 border-charcoal flex items-center justify-between">
            <span className="font-display font-bold text-charcoal text-lg">
              {comments.length > 0 ? `${comments.length} Komentar` : 'Komentar'}
            </span>
            {comments.length > 0 && (
              <span className="text-xs font-semibold text-gray-400">Terbaru di atas</span>
            )}
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto max-h-[420px]">
            {comments.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-semibold">
                Belum ada komentar. Jadilah yang pertama! 🎉
              </div>
            ) : (
              <div className="divide-y-2 divide-charcoal">
                {comments.map((c, i) => (
                  <div key={c.id} className="p-5 flex gap-4 items-start hover:bg-cream transition-colors">
                    <div className={`w-10 h-10 shrink-0 ${avatarColors[i % avatarColors.length]} border-2 border-charcoal flex items-center justify-center font-display font-bold text-charcoal text-sm`}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-charcoal">{c.name}</p>
                        <p className="text-xs text-gray-400 font-medium shrink-0">
                          {new Date(c.created_at).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <p className="text-charcoal text-sm font-medium leading-relaxed">{c.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
