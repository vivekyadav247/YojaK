import { SignInButton, SignUpButton } from "@clerk/react";
import {
  MapPin,
  Users,
  CalendarCheck,
  Wallet,
  Plane,
  ArrowRight,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Heart,
  CheckCircle2,
  MessageSquare,
  Clock,
  Shield,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ─── Nav ─── */}
      <nav className="px-5 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Plane size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--text)]">YojaK</span>
          </div>
          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-[var(--text)] hover:text-[var(--primary)] transition-colors cursor-pointer">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-5 py-2 text-sm font-semibold text-white bg-[var(--text)] rounded-full hover:bg-[var(--primary)] transition-colors cursor-pointer">
                Sign up free
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="px-5 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
            Made for real group trips, not hypothetical ones
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--text)] leading-[1.1] tracking-tight">
            Your group trip
            <br />
            <span className="text-[var(--primary)]">actually organized</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-[var(--text-light)] max-w-lg mx-auto leading-relaxed">
            No more 50 WhatsApp messages, 3 Google Sheets, and "bhai dates
            confirm kar do". Just one place for itineraries, budgets, and
            checklists.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SignUpButton mode="modal">
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white bg-[var(--accent)] font-semibold text-sm hover:bg-amber-600 transition-colors cursor-pointer shadow-lg shadow-amber-500/20">
                Start planning — it's free
                <ArrowRight size={15} />
              </button>
            </SignUpButton>
            <a
              href="#how"
              className="px-6 py-3.5 rounded-full text-sm font-medium text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── Photo strip ─── */}
      <section className="px-5 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {[
            {
              src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80",
              alt: "Road trip",
            },
            {
              src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
              alt: "Beach",
            },
            {
              src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
              alt: "Mountains",
            },
            {
              src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80",
              alt: "Paris",
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl ${i % 2 === 1 ? "mt-4" : ""}`}
            >
              <img
                src={p.src}
                alt={p.alt}
                className="w-full h-40 md:h-56 object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── The Problem ─── */}
      <section className="px-5 py-20 bg-white/40">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            The problem
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] leading-snug">
            Every group trip starts the same way...
          </h2>
          <div className="mt-8 space-y-4">
            {[
              {
                icon: MessageSquare,
                text: '"Bhai dates confirm karo" — 14 messages, 0 replies',
              },
              {
                icon: Clock,
                text: "Hotel links lost in chat. Budget? Nobody tracked it.",
              },
              {
                icon: Users,
                text: '"Koi itinerary bana do yaar" — nobody does it.',
              },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/80 border border-[var(--cards)]/30"
              >
                <Icon size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-light)]">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--text)] font-medium">
            YojaK replaces all of that with one shared workspace.
          </p>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="px-5 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3 text-center">
            How it works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] text-center mb-12">
            Three steps. That's it.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create a trip",
                desc: "Pick dates, destinations, set it public or private. Takes 30 seconds.",
              },
              {
                step: "02",
                title: "Invite your group",
                desc: "Send invites by email or mobile. Everyone gets their own view.",
              },
              {
                step: "03",
                title: "Plan together",
                desc: "Add itineraries, split budgets, check off to-dos. All in sync.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <span className="text-5xl font-black text-[var(--primary)]/10">
                  {step}
                </span>
                <h3 className="text-base font-bold text-[var(--text)] -mt-2 mb-1">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-light)] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features (bigger, fewer gimmicks) ─── */}
      <section className="px-5 py-20 bg-white/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3 text-center">
            Features
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--text)] mb-12">
            Everything your trip needs
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: MapPin,
                title: "Day-by-day itinerary",
                desc: "Add activities for each day. Add time, notes, comments. Everyone sees the plan.",
              },
              {
                icon: Wallet,
                title: "Shared budget tracker",
                desc: "Set a budget, add expenses as you go. Know exactly what's been spent and what's left.",
              },
              {
                icon: CalendarCheck,
                title: "Checklists",
                desc: "Packing lists, booking confirmations, to-dos. Tick them off as a team.",
              },
              {
                icon: Users,
                title: "Real-time collaboration",
                desc: "Invite friends as editors or viewers. No more copy-pasting plans in WhatsApp.",
              },
              {
                icon: Shield,
                title: "Public or private",
                desc: "Make trips public so others can discover and request to join, or keep it private for your group.",
              },
              {
                icon: CheckCircle2,
                title: "Documents",
                desc: "Upload tickets, hotel bookings, ID proofs — everything the group needs, in one place.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-5 rounded-2xl bg-[var(--background)] border border-[var(--cards)]/30 hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)] mb-1">
                    {title}
                  </h3>
                  <p className="text-xs text-[var(--text-light)] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Destinations strip ─── */}
      <section className="px-5 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
            Explore
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-3">
            Beaches, mountains, cities — plan anything
          </h2>
          <p className="text-sm text-[var(--text-light)] mb-10 max-w-md mx-auto">
            Public trips are open for anyone to discover. Find your vibe.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
                label: "Beaches",
              },
              {
                src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
                label: "Mountains",
              },
              {
                src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
                label: "Lakes",
              },
              {
                src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80",
                label: "Cities",
              },
            ].map(({ src, label }) => (
              <div
                key={label}
                className="group relative rounded-2xl overflow-hidden"
              >
                <img
                  src={src}
                  alt={label}
                  className="w-full h-36 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-sm font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-5 py-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[var(--text)] px-8 py-14 md:py-16 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[var(--primary)]/20" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-[var(--accent)]/15" />
          <h2 className="relative text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Stop planning in chaos.
          </h2>
          <p className="relative text-white/60 mb-8 max-w-sm mx-auto text-sm">
            Your next trip deserves better than a group chat. Free to use,
            nothing to install.
          </p>
          <SignUpButton mode="modal">
            <button className="relative px-8 py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold text-sm hover:bg-amber-600 transition-colors cursor-pointer shadow-lg shadow-amber-500/25">
              Get Started Free
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* ─── About / Why YojaK ─── */}
      <section className="px-5 py-20 bg-white/40">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-4">
            Why "YojaK"?
          </h2>
          <p className="text-sm text-[var(--text-light)] leading-relaxed mb-6">
            <span className="text-[var(--primary)] font-semibold">योजक</span>{" "}
            means "planner" in Hindi. I built this because every group trip I've
            been on ended up with 47 WhatsApp messages, three spreadsheets, and
            someone still forgetting the hotel booking. This is the app I wished
            existed — simple, no-nonsense, gets out of your way.
          </p>
          <p className="text-sm text-[var(--text-light)] leading-relaxed">
            It's built with React, Node.js, Express, MongoDB, and Clerk auth.
            Open source, built by one person, actually used by real people.
          </p>
        </div>
      </section>

      {/* ─── Developer ─── */}
      <section className="px-5 py-20">
        <div className="max-w-sm mx-auto text-center">
          <img
            src="https://avatars.githubusercontent.com/u/150873594?v=4"
            alt="Vivek Yadav"
            className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[var(--cards)]"
          />
          <h3 className="text-base font-bold text-[var(--text)]">
            Vivek Yadav
          </h3>
          <p className="text-xs text-[var(--text-light)] mt-1 mb-4">
            B.Tech CSE · Khargone, MP
          </p>
          <div className="flex items-center justify-center gap-5 mb-4">
            <a
              href="https://github.com/vivekyadav247"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/vivek-yadav-coder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="https://instagram.com/vivek_yadav.07x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
            >
              <Instagram size={18} />
            </a>
            <a
              href="mailto:vivekyad240706@gmail.com"
              className="text-[var(--text-light)] hover:text-[var(--text)] transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-5 py-8 border-t border-[var(--cards)]/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--primary)] flex items-center justify-center">
              <Plane size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-[var(--text)]">YojaK</span>
          </div>
          <p className="text-xs text-[var(--text-light)] flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400" />{" "}
            by Vivek Yadav
          </p>
          <p className="text-xs text-[var(--text-light)]/50">
            © {new Date().getFullYear()} YojaK
          </p>
        </div>
      </footer>
    </div>
  );
}
