import { useState, useEffect } from "react";
import { LogIn, LogOut, User as UserIcon, History, FileSignature, Shield, Zap, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthHeaderProps {
  onShowHistory: () => void;
  onShowAudit: () => void;
}

interface LocalUser {
  name: string;
  email: string;
  avatar: string;
}

const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=unnati1&backgroundColor=0d9488",
  "https://api.dicebear.com/7.x/bottts/svg?seed=unnati2&backgroundColor=7c3aed",
  "https://api.dicebear.com/7.x/bottts/svg?seed=unnati3&backgroundColor=0891b2",
];

const AuthHeader = ({ onShowHistory, onShowAudit }: AuthHeaderProps) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const saved = localStorage.getItem("unnati_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const signIn = () => {
    setName(""); setEmail(""); setError(""); setSuccess(false);
    setShowModal(true);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }

    const newUser: LocalUser = {
      name: name.trim(),
      email: email.trim(),
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    };
    localStorage.setItem("unnati_user", JSON.stringify(newUser));
    setUser(newUser);
    setSuccess(true);
    setTimeout(() => setShowModal(false), 1200);
  };

  const signOut = () => {
    localStorage.removeItem("unnati_user");
    setUser(null);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-2 glass-strong shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/8"
            : "py-3 bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex items-center justify-between gap-4">

          {/* ── LEFT: LOGO ── */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="relative flex items-center justify-center w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-primary/20 animate-glow-breathe" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-600/20 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <Shield className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-lg tracking-tight text-gradient-brand">UNNATI</span>
              <span className="text-[9px] font-code text-muted-foreground tracking-[0.15em] uppercase opacity-70">Truth Engine</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[9px] font-code font-bold text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* ── CENTER: Status pills ── */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { icon: Zap, label: "Gemini 2.5 Flash", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              { icon: Shield, label: "Tavily Search", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${bg} ${color}`}>
                <Icon className="w-3 h-3" />
                {label}
              </div>
            ))}
          </div>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAudit}
              className="hidden sm:flex items-center gap-2 border-primary/20 bg-primary/5 hover:bg-primary/15 text-primary text-xs font-semibold hover:border-primary/40 transition-all duration-200"
            >
              <FileSignature className="w-3.5 h-3.5" />
              Audit Log
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/60 bg-card/60 backdrop-blur-sm text-foreground gap-2 hover:border-primary/30 transition-all"
                  >
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full ring-1 ring-primary/30 bg-primary/10"
                    />
                    <span className="max-w-[100px] truncate text-xs">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/60 shadow-xl">
                  <div className="px-3 py-2 border-b border-border/40 mb-1">
                    <p className="text-xs font-semibold text-foreground">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={onShowHistory} className="gap-2 cursor-pointer hover:bg-primary/10">
                    <History className="w-4 h-4 text-primary" />
                    My History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut} className="gap-2 cursor-pointer text-destructive hover:bg-destructive/10">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={signIn}
                className="border-border/60 bg-card/60 backdrop-blur-sm text-foreground gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign in</span>
                <span className="sm:hidden">Sign in</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ── SIGN IN MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-md rounded-2xl bg-[#0d1117]/95 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-400/10 blur-xl rounded-full" />

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-cyan-600/20 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.25)]">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl text-gradient-brand">UNNATI</h2>
                  <p className="text-[10px] text-muted-foreground font-code uppercase tracking-wider">Truth Engine Access</p>
                </div>
              </div>

              {success ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                  <p className="text-emerald-400 font-semibold text-lg">Welcome aboard!</p>
                  <p className="text-muted-foreground text-sm">Signing you in…</p>
                </div>
              ) : (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); setError(""); }}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary/20 border border-primary/40 text-primary font-bold text-sm hover:bg-primary/30 hover:border-primary/60 transition-all shadow-[0_0_20px_rgba(0,255,255,0.15)] hover:shadow-[0_0_30px_rgba(0,255,255,0.25)] mt-2"
                  >
                    <LogIn className="w-4 h-4 inline mr-2" />
                    Access UNNATI
                  </button>

                  <p className="text-center text-[10px] text-muted-foreground/60 mt-3">
                    No password required · Local session only · No data sent
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthHeader;
