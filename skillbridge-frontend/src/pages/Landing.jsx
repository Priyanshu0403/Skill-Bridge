import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import BridgeIcon from '../assets/bridge-icon.png';
import {
  Sparkles,
  TrendingUp,
  Shield,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Code,
  Palette,
  Music,
  Camera,
  Coffee,
  BookOpen,
  } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { number: "2,440+", label: "Active Students", icon: Users },
    { number: "5,000+", label: "Skills Exchanged", icon: TrendingUp },
    { number: "98%", label: "Success Rate", icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Students Only",
      desc: "Secure campus-exclusive network with email verification",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    },
    {
      icon: Zap,
      title: "Instant Matching",
      desc: "AI-powered skill matching finds your perfect collaboration",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    },
    {
      icon: Sparkles,
      title: "Dual Economy",
      desc: "Trade skills or earn money - your choice, your freedom",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
    },
  ];

  const successStories = [
    {
      name: "Elena Richardson",
      field: "Web Development",
      major: "Computer Science",
      story: "Built a full-service creative agency through skill exchange",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop",
      icon: Code,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "David Chen",
      field: "Financial Literacy",
      major: "Economics",
      story: "Earned 5,000+ credits building fintech solutions",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Aisha Mbeki",
      field: "Grand Strategy",
      major: "Marketing",
      story: "Consulted 12 startups, landed dream internship",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop",
      icon: Sparkles,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const skillCategories = [
    {
      name: "Coding",
      icon: Code,
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      color: "from-gray-800 to-gray-600",
    },
    {
      name: "Teaching",
      icon: BookOpen,
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Design",
      icon: Palette,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Music",
      icon: Music,
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Photography",
      icon: Camera,
      image:
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=300&fit=crop",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Writing",
      icon: BookOpen,
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 transition-transform duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            top: "10%",
            left: "10%",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 transition-transform duration-1000"
          style={{
            transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
            bottom: "10%",
            right: "10%",
          }}
        />
      </div>

      {/* Sticky Navbar with Glass Effect */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg dark:bg-slate-950/80 dark:shadow-slate-950/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10  rounded-lg flex  transform group-hover:rotate-12 transition-transform">
              <img src={BridgeIcon} alt="Skill Bridge Logo" className="object-contain" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              Skill Bridge
            </h1>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <ThemeToggle />
            {["Our Stories", "The Exchange", "Community"].map((item, idx) => (
              <button
                key={idx}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(" ", "-"))
                }
                className="relative group text-sm text-gray-600 transition-all hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300" />
              </button>
            ))}

            <Link
              to="/login"
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-2 rounded-full text-sm hover:bg-emerald-800 transition-colors flex items-center gap-2"
            >
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden px-6 pt-32 pb-20">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=2000&h=1200&fit=crop"
            alt="Students collaborating"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90 dark:from-slate-950/95 dark:via-slate-950/80 dark:to-slate-900/95" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Floating Badge */}
          <div className="flex justify-center mb-1 animate-bounce">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 shadow-lg dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-1 dark:ring-emerald-400/20">
              <Sparkles className="w-4 h-4" />
              Trusted by 2,440+ students
            </div>
          </div>
          <div className="relative pt-10 pb-10 px-6 overflow-hidden">
            <div className="text-center space-y-6 mb-12 mx-auto relative z-10">
              <h2 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="animate-fade-in bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300">
                  Trade Skills.
                </span>
                <br />
                <span className="animate-fade-in-delay-1 bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent italic dark:from-emerald-300 dark:to-emerald-500">
                  Earn Together.
                </span>
                <br />
                <span className="animate-fade-in-delay-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300">
                  Build the Future.
                </span>
              </h2>

              <p className="mx-auto max-w-3xl animate-fade-in-delay-3 text-xl leading-relaxed text-gray-600 dark:text-slate-300">
                Join the most prestigious network of verified students building
                real-world projects through
                <span className="text-emerald-600 font-semibold">
                  {" "}
                  AI-powered mentorship
                </span>{" "}
                and meaningful skill exchange.
              </p>
              {/* CTA Buttons */}
              
              <div className="flex gap-4 justify-center items-center">
                <Link
                  to="/login"
                  className="bg-emerald-700 text-white px-8 py-3 rounded-full hover:bg-emerald-800 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => scrollToSection("exchange")}
                  className="flex items-center gap-2 text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
                >
                  How we exchange <span>→</span>
                </button>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <DotLottieReact
                src="https://lottie.host/60ef2fa1-2300-41e4-af5a-d10edfcc4858/lFGqTIq5Tu.lottie"
                loop
                autoplay
                style={{ width: "2000px", height: "600px" }}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="transform rounded-2xl border border-gray-200 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-emerald-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-slate-300">{stat.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skill Categories Showcase */}
      <div className="bg-gradient-to-b from-white to-gray-50 px-6 py-20 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Explore Skills in Every
              </span>
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                {" "}
                Category
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {skillCategories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="aspect-square relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60 group-hover:opacity-80 transition-opacity`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <Icon className="w-12 h-12 mb-3 transform group-hover:scale-110 transition-transform" />
                      <h4 className="text-xl font-bold">{category.name}</h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Grid with Images */}
      <div className="relative bg-white px-6 py-20 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Why Students Choose
              </span>
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent italic">
                {" "}
                Skill Bridge
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 hover:border-emerald-500 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                  onMouseEnter={() => setActiveCard(idx)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="leading-relaxed text-gray-600 dark:text-slate-300">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Hover Border Animation */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 group-hover:w-full transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success Stories with Real Images */}
      <div
        id="our-stories"
        className="bg-gradient-to-b from-gray-50 to-white px-6 py-20 dark:from-slate-900 dark:to-slate-950"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Where ambition meets
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent italic">
                opportunity
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((person, idx) => {
              const Icon = person.icon;
              return (
                <div
                  key={idx}
                  className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative rounded-2xl overflow-hidden mb-4 h-80 shadow-xl">
                    {/* Profile Image */}
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${person.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border-2 border-white/50">
                        <Icon className="w-10 h-10" />
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2 drop-shadow-lg">
                          SUCCESS
                        </div>
                        <div className="w-16 h-1 bg-white mx-auto rounded-full" />
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                      {person.field}
                    </div>
                  </div>

                  <div className="px-2">
                    <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {person.name}
                    </h3>
                    <p className="text-sm text-emerald-600 mb-3 italic font-medium">
                      {person.major}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                      {person.story}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

{/* Philosophy Section */}
<div
  id="the-exchange"
  className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-b from-white via-gray-50 to-white px-6 py-24 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
>
  {/* subtle background glow */}
  <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-200 opacity-20 blur-3xl rounded-full" />
  <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-200 opacity-20 blur-3xl rounded-full" />

  <div className="max-w-6xl mx-auto relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      
      {/* LEFT CONTENT */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          The Philosophy
        </p>

        {/* <h2 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-gray-900">
          Built on trust,
        </h2> */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                Built on trust,
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent italic">
                scaled with technology
              </span>
            </h2>

        {/* <h2 className="text-4xl md:text-5xl italic font-light text-emerald-700 mb-6">
          scaled with technology.
        </h2> */}

        <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-slate-300">
          Skill Bridge isn't just another gig platform. It's a student-first
          ecosystem where collaboration meets credibility — combining academic
          excellence with real-world execution.
        </p>

        {/* POINTS */}
        <div className="space-y-6">
          {/* Item 1 */}
          <div className="flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl group-hover:scale-110 transition">
              🛡️
            </div>
            <div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                Student First
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                Every feature is crafted specifically for student life,
                learning, and growth.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl group-hover:scale-110 transition">
              🔒
            </div>
            <div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                Safe & Verified
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                Verified students, secure transactions, and a trusted
                environment to collaborate freely.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl group-hover:scale-110 transition">
              ⚡
            </div>
            <div>
              <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                Growth Driven
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                Build real projects, earn credibility, and grow beyond the
                classroom.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE VISUAL CARD */}
      <div className="relative">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl backdrop-blur-sm transition duration-300 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/90">
          <p className="mb-4 text-sm uppercase tracking-wide text-gray-400 dark:text-slate-400">
            Our Vision
          </p>

          <h3 className="mb-4 text-2xl font-semibold leading-snug text-gray-900 dark:text-white">
            A world where students don't wait to succeed —
            <span className="text-emerald-600"> they start now.</span>
          </h3>

          <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-slate-300">
            We’re building a future where skills matter more than resumes,
            collaboration beats competition, and students create value from day one.
          </p>

          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
            <span>Explore the exchange</span>
            <span>→</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
      {/* How It Works - Timeline */}
      <div id="community" className="bg-white px-6 py-20 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent italic">
                Your journey of collaboration
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Share Your Gift",
                desc: "List your unique talent - Python, ceramics, copywriting. Set your price in credits or cash.",
                icon: Sparkles,
                image:
                  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
              },
              {
                num: "02",
                title: "Find Your Ask",
                desc: "Need graphic design, voice acting, or data analysis? AI matches you instantly.",
                icon: Zap,
                image:
                  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
              },
              {
                num: "03",
                title: "Exchange & Grow",
                desc: "Complete projects, earn credits, build your reputation. Your portfolio starts here.",
                icon: TrendingUp,
                image:
                  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop",
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white transition-all duration-300 hover:border-emerald-500 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Number Badge */}
                    <div className="absolute top-4 left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.num}
                    </div>

                    {/* Icon */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      {step.title}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-slate-300">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section with Background Image */}
      <div className="relative py-24 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=2000&h=800&fit=crop"
            alt="Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-emerald-800/95 to-emerald-900/95" />
        </div>

        {/* Animated circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-700 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 animate-bounce border-2 border-white/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 italic drop-shadow-lg">
            Begin your campus legacy today
          </h2>
          <p className="text-emerald-100 text-xl mb-10 leading-relaxed">
            Join 2,440+ students turning classroom knowledge into community
            value
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-emerald-900 px-10 py-4 rounded-full hover:bg-gray-100 transition-all hover:scale-105 font-medium"
          >
            Register with University Email
          </Link>
          <p className="text-emerald-200 text-sm mt-6 font-medium flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            NO FEES. JUST GROWTH
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Skill Bridge</h3>
              </div>
              <p className="text-sm leading-relaxed">
                Designed for students. By students. Join an ecosystem built to
                turn classroom knowledge into community value.
              </p>
            </div>

            {[
              {
                title: "Community",
                links: ["Success Stories", "Campus Hubs", "Safety Guide"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Use", "Guidelines"],
              },
              { title: "Connect", links: ["Twitter", "LinkedIn", "Instagram"] },
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-bold mb-4 uppercase tracking-wide text-white">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="hover:text-emerald-400 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2026 Skill Bridge. All Rights Reserved.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay-1 {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 0.8s ease-out 0.6s both;
        }
        .animate-fade-in-delay-4 {
          animation: fade-in 0.8s ease-out 0.8s both;
        }

        
      `}</style>
    </div>
  );
};

export default Landing;
