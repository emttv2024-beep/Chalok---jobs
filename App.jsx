import { useState, useEffect } from "react";

const C = {
  navy: "#1a2744", navyLight: "#243560", yellow: "#f5c518", yellowLight: "#ffd93d",
  white: "#ffffff", gray50: "#f8f9fb", gray100: "#eef0f5", gray300: "#c4c9d8",
  gray500: "#6b7394", gray700: "#3d4466", green: "#22c55e", red: "#ef4444",
  orange: "#f97316", redLight: "#fef2f2",
};

const s = {
  app: { fontFamily: "'Segoe UI','Hind Siliguri',sans-serif", backgroundColor: C.gray50, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.15)" },
  header: { background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: "16px 20px 14px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(26,39,68,0.3)" },
  content: { padding: "16px 16px 100px" },
  card: { background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(26,39,68,0.07)", border: `1px solid ${C.gray100}` },
  modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(26,39,68,0.65)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" },
  modalBox: { background: C.white, borderRadius: "20px 20px 0 0", padding: 24, maxWidth: 430, width: "100%", maxHeight: "90vh", overflowY: "auto" },
  input: { width: "100%", padding: "11px 14px", border: `1.5px solid ${C.gray100}`, borderRadius: 10, fontSize: 14, color: C.gray700, background: C.gray50, outline: "none", boxSizing: "border-box" },
  select: { width: "100%", padding: "11px 14px", border: `1.5px solid ${C.gray100}`, borderRadius: 10, fontSize: 14, color: C.gray700, background: C.gray50, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "11px 14px", border: `1.5px solid ${C.gray100}`, borderRadius: 10, fontSize: 14, color: C.gray700, background: C.gray50, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" },
  btn: { background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, color: C.white, border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnYellow: { width: "100%", padding: 14, background: `linear-gradient(135deg,${C.yellow},${C.yellowLight})`, color: C.navy, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" },
  btnRed: { background: "#fef2f2", color: C.red, border: `1px solid #fecaca`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnGreen: { background: "#f0fdf4", color: "#16a34a", border: `1px solid #bbf7d0`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 },
  divider: { height: 1, background: C.gray100, margin: "14px 0" },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.white, borderTop: `1px solid ${C.gray100}`, display: "flex", zIndex: 200, boxShadow: "0 -4px 20px rgba(26,39,68,0.08)" },
  toast: { position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: C.navy, color: C.white, padding: "12px 24px", borderRadius: 30, fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(26,39,68,0.3)", whiteSpace: "nowrap", borderLeft: `4px solid ${C.yellow}`, maxWidth: "90%" },
};

// ── helpers ──
function addMonths(m) { const d = new Date(); d.setMonth(d.getMonth() + m); return d; }
function daysLeft(exp) { if (!exp) return 0; return Math.max(0, Math.ceil((new Date(exp) - new Date()) / 86400000)); }
function formatDate(d) { if (!d) return ""; const dt = new Date(d); return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`; }

// deadline from today + N days
function deadlineDate(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().split("T")[0]; }

function isDeadlinePassed(dl) { return dl && new Date(dl) < new Date(new Date().toDateString()); }

function deadlineDaysLeft(dl) {
  if (!dl) return null;
  const diff = Math.ceil((new Date(dl) - new Date(new Date().toDateString())) / 86400000);
  return diff;
}

const LOCATIONS = ["সব জায়গা", "ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "বরিশাল", "ময়মনসিংহ", "রংপুর"];

const INITIAL_JOBS = [
  { id: 1, title: "প্রাইভেট কার ড্রাইভার", company: "রহিম এন্টারপ্রাইজ", location: "ঢাকা", area: "গুলশান", salary: "২০,০০০ - ২৫,০০০ টাকা", type: "ফুল-টাইম", license: "হালকা যানবাহন", experience: "২ বছর", posted: "২ দিন আগে", applicants: 12, description: "একটি বিশ্বস্ত পরিবারের জন্য ব্যক্তিগত গাড়িচালক প্রয়োজন।", postedBy: "owner1", deadline: deadlineDate(5), status: "active" },
  { id: 2, title: "ট্রাক ড্রাইভার", company: "স্বপ্ন ট্রান্সপোর্ট", location: "চট্টগ্রাম", area: "বন্দর", salary: "৩০,০০০ - ৩৫,০০০ টাকা", type: "ফুল-টাইম", license: "ভারী যানবাহন", experience: "৫ বছর", posted: "১ দিন আগে", applicants: 8, description: "পণ্য পরিবহনের জন্য অভিজ্ঞ ট্রাক ড্রাইভার প্রয়োজন।", postedBy: "owner2", deadline: deadlineDate(10), status: "active" },
  { id: 3, title: "অ্যাম্বুলেন্স ড্রাইভার", company: "ইসলামী হাসপাতাল", location: "সিলেট", area: "জিন্দাবাজার", salary: "২২,০০০ - ২৮,০০০ টাকা", type: "শিফট-ভিত্তিক", license: "হালকা যানবাহন", experience: "৩ বছর", posted: "৩ দিন আগে", applicants: 5, description: "জরুরি সেবার জন্য দক্ষ অ্যাম্বুলেন্স চালক দরকার।", postedBy: "owner1", deadline: deadlineDate(-1), status: "active" },
  { id: 4, title: "মাইক্রোবাস ড্রাইভার", company: "গ্রীন ট্যুরস", location: "ঢাকা", area: "মিরপুর", salary: "১৮,০০০ - ২২,০০০ টাকা", type: "পার্ট-টাইম", license: "হালকা যানবাহন", experience: "১ বছর", posted: "৪ দিন আগে", applicants: 3, description: "পর্যটন সংস্থার জন্য মাইক্রোবাস চালক প্রয়োজন।", postedBy: "owner1", deadline: deadlineDate(7), status: "active" },
];

const MOCK_APPLICANTS = [
  { id: 1, name: "মো. করিম মিয়া", exp: "৫ বছর", license: "ভারী যানবাহন", phone: "01711-234567" },
  { id: 2, name: "রফিকুল ইসলাম", exp: "৩ বছর", license: "হালকা যানবাহন", phone: "01812-345678" },
  { id: 3, name: "শফিকুল আলম", exp: "৭ বছর", license: "ভারী যানবাহন", phone: "01913-456789" },
];

export default function App() {
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("সব জায়গা");
  const [showApplicants, setShowApplicants] = useState(null);
  const [hireConfirm, setHireConfirm] = useState(null); // { job, applicant }
  const [deactiveConfirm, setDeactiveConfirm] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payStep, setPayStep] = useState(1);
  const [bkashNum, setBkashNum] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", location: "ঢাকা", area: "", salary: "", type: "ফুল-টাইম", license: "হালকা যানবাহন", experience: "", description: "", deadline: "" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const isActive = subscription && daysLeft(subscription.expiry) > 0;
  const isOwner = role === "owner";

  // Auto-deactivate past deadline jobs
  useEffect(() => {
    setJobs(prev => prev.map(j => {
      if (j.status === "active" && isDeadlinePassed(j.deadline)) {
        return { ...j, status: "expired" };
      }
      return j;
    }));
  }, []);

  const handlePost = () => {
    if (!form.title || !form.company || !form.location || !form.salary || !form.deadline) {
      showToast("⚠️ সব তারকা (*) চিহ্নিত ঘর পূরণ করুন"); return;
    }
    const newJob = { id: Date.now(), ...form, posted: "এইমাত্র", applicants: 0, postedBy: "owner1", status: "active" };
    setJobs([newJob, ...jobs]);
    setForm({ title: "", company: "", location: "ঢাকা", area: "", salary: "", type: "ফুল-টাইম", license: "হালকা যানবাহন", experience: "", description: "", deadline: "" });
    setActiveTab("myjobs");
    showToast("🎉 বিজ্ঞপ্তি সফলভাবে প্রকাশিত হয়েছে!");
  };

  const handleDeactivate = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "inactive" } : j));
    setDeactiveConfirm(null);
    showToast("⏸️ পোস্ট ডিঅ্যাক্টিভ করা হয়েছে");
  };

  const handleRemove = (jobId) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    setRemoveConfirm(null);
    setShowApplicants(null);
    showToast("🗑️ পোস্ট মুছে ফেলা হয়েছে");
  };

  const handleReactivate = (jobId) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: "active" } : j));
    showToast("✅ পোস্ট পুনরায় সক্রিয় করা হয়েছে");
  };

  const handleHire = (job, applicant) => {
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: "hired", hiredName: applicant.name } : j));
    setHireConfirm(null);
    setShowApplicants(null);
    showToast(`🎉 ${applicant.name} কে নিয়োগ দেওয়া হয়েছে! পোস্ট বন্ধ হয়ে গেছে।`);
  };

  const handlePay = () => {
    if (!bkashNum || bkashNum.length < 11) { showToast("⚠️ সঠিক নম্বর দিন"); return; }
    setPayStep(3);
    setSubscription({ expiry: addMonths(3) });
    setTimeout(() => { setShowPayment(false); setShowPaywall(false); setPayStep(1); setBkashNum(""); showToast("✅ প্রিমিয়াম সক্রিয় হয়েছে!"); }, 2500);
  };

  const myPostedJobs = jobs.filter(j => j.postedBy === "owner1");

  // Filtered jobs for listing (only active, matching search + location)
  const visibleJobs = jobs.filter(j => {
    if (j.status !== "active") return false;
    const locMatch = locationFilter === "সব জায়গা" || j.location === locationFilter;
    const searchMatch = !search || j.title.includes(search) || j.location.includes(search) || j.company.includes(search) || (j.area && j.area.includes(search));
    return locMatch && searchMatch;
  });

  // Status badge helper
  const StatusBadge = ({ status, deadline }) => {
    if (status === "hired") return <div style={{ background: "#eff6ff", color: "#1d4ed8", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>✅ নিয়োগ হয়েছে</div>;
    if (status === "inactive") return <div style={{ background: C.gray100, color: C.gray500, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>⏸ ডিঅ্যাক্টিভ</div>;
    if (status === "expired") return <div style={{ background: "#fef2f2", color: C.red, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>⏰ মেয়াদ শেষ</div>;
    const dl = deadlineDaysLeft(deadline);
    if (dl !== null && dl <= 2) return <div style={{ background: "#fff7ed", color: C.orange, borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🔥 {dl === 0 ? "আজ শেষ" : `${dl} দিন বাকি`}</div>;
    return <div style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🟢 সক্রিয়</div>;
  };

  // ── ROLE SELECTION ──
  if (!role) return (
    <div style={s.app}>
      <div style={{ ...s.header, padding: "24px 20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, background: C.yellow, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚗</div>
          <div><div style={{ color: C.white, fontWeight: 700, fontSize: 18 }}>চালক জবস</div><div style={{ color: C.yellow, fontSize: 11 }}>Chalok Jobs</div></div>
        </div>
      </div>
      <div style={{ padding: "32px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🛣️</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8 }}>আপনি কে?</div>
          <div style={{ fontSize: 14, color: C.gray500 }}>আপনার ভূমিকা বেছে নিন</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button onClick={() => setRole("owner")} style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, color: C.white, border: "none", borderRadius: 16, padding: "24px 20px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 20px rgba(26,39,68,0.25)" }}>
            <span style={{ fontSize: 42 }}>🏢</span>
            <div><div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>মালিকপক্ষ / নিয়োগকর্তা</div><div style={{ fontSize: 13, opacity: 0.8 }}>ড্রাইভার নিয়োগ করতে চাই</div></div>
          </button>
          <button onClick={() => setRole("driver")} style={{ background: `linear-gradient(135deg,${C.yellow},${C.yellowLight})`, color: C.navy, border: "none", borderRadius: 16, padding: "24px 20px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 20px rgba(245,197,24,0.3)" }}>
            <span style={{ fontSize: 42 }}>🚘</span>
            <div><div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>ড্রাইভার / চালক</div><div style={{ fontSize: 13, color: "#3d4466" }}>চাকরি খুঁজছি</div></div>
          </button>
        </div>
      </div>
    </div>
  );

  const ownerTabs = [
    { id: "home", icon: "📋", label: "সব পোস্ট" },
    { id: "post", icon: "➕", label: "পোস্ট করুন" },
    { id: "myjobs", icon: "📁", label: "আমার পোস্ট" },
    { id: "profile", icon: "👤", label: "প্রোফাইল" },
  ];
  const driverTabs = [
    { id: "home", icon: "🔍", label: "চাকরি খুঁজুন" },
    { id: "applied", icon: "📝", label: "আবেদন" },
    { id: "profile", icon: "👤", label: "প্রোফাইল" },
  ];
  const tabs = isOwner ? ownerTabs : driverTabs;

  return (
    <div style={s.app}>
      {toast && <div style={s.toast}>{toast}</div>}

      {/* HEADER */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, background: C.yellow, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚗</div>
            <div><div style={{ color: C.white, fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>চালক জবস</div><div style={{ color: C.yellow, fontSize: 11 }}>Chalok Jobs</div></div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {isOwner && isActive && <div style={{ background: "rgba(34,197,94,0.2)", border: "1px solid #22c55e", color: "#22c55e", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>✅ প্রিমিয়াম</div>}
            <div style={{ background: "rgba(245,197,24,0.18)", border: `1px solid ${C.yellow}`, color: C.yellow, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }} onClick={() => { setRole(null); setActiveTab("home"); }}>
              {isOwner ? "🏢 মালিক" : "🚘 চালক"} ↩
            </div>
          </div>
        </div>
      </div>

      <div style={s.content}>

        {/* ── HOME ── */}
        {activeTab === "home" && (
          <>
            {isOwner && !isActive && (
              <div onClick={() => setShowPaywall(true)} style={{ background: `linear-gradient(135deg,${C.yellow},${C.yellowLight})`, borderRadius: 14, padding: "14px 16px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>👑</span>
                <div><div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>প্রিমিয়াম নিন মাত্র ৫০ টাকায়!</div><div style={{ fontSize: 12, color: C.gray700 }}>৩ মাস চাকরির বিজ্ঞপ্তি দিন</div></div>
                <div style={{ marginLeft: "auto", fontSize: 20 }}>›</div>
              </div>
            )}
            {isOwner && isActive && (
              <div style={{ background: "linear-gradient(135deg,#0f4c2a,#16653a)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div><div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>প্রিমিয়াম সক্রিয়</div><div style={{ fontSize: 12, color: "#86efac" }}>মেয়াদ: {formatDate(subscription.expiry)} · বাকি {daysLeft(subscription.expiry)} দিন</div></div>
              </div>
            )}
            {!isOwner && (
              <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 14, padding: "14px 16px", marginBottom: 16, color: C.white }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>👋 স্বাগতম, চালক ভাই!</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{visibleJobs.length}টি সক্রিয় চাকরি পাওয়া গেছে</div>
              </div>
            )}

            {/* Search + Filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input style={{ ...s.input, flex: 1, background: C.white }} placeholder="🔍 পদ, প্রতিষ্ঠান..." value={search} onChange={e => setSearch(e.target.value)} />
              <button style={{ ...s.btn, padding: "10px 14px", fontSize: 18, flexShrink: 0 }} onClick={() => setShowFilter(!showFilter)}>⚙️</button>
            </div>

            {/* Location filter pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 10, scrollbarWidth: "none" }}>
              {LOCATIONS.map(loc => (
                <button key={loc} onClick={() => setLocationFilter(loc)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "none", background: locationFilter === loc ? C.navy : C.white, color: locationFilter === loc ? C.white : C.gray500, fontSize: 12, fontWeight: locationFilter === loc ? 700 : 500, cursor: "pointer", boxShadow: locationFilter === loc ? "0 2px 8px rgba(26,39,68,0.2)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                  {loc === "সব জায়গা" ? "🗺 " + loc : "📍 " + loc}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{visibleJobs.length}টি সক্রিয় চাকরি</div>

            {visibleJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.gray500 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                <div>এই এলাকায় কোনো চাকরি পাওয়া যায়নি</div>
              </div>
            )}

            {visibleJobs.map(job => {
              const dl = deadlineDaysLeft(job.deadline);
              return (
                <div key={job.id} style={{ ...s.card, cursor: "pointer", borderLeft: dl !== null && dl <= 2 ? `3px solid ${C.orange}` : `3px solid transparent` }} onClick={() => setSelectedJob(job)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: C.gray500 }}>🏢 {job.company}</div>
                    </div>
                    <StatusBadge status={job.status} deadline={job.deadline} />
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: C.gray500 }}>📍 {job.location}{job.area ? `, ${job.area}` : ""}</span>
                    <span style={{ fontSize: 12, color: C.gray500 }}>🪪 {job.license}</span>
                    <span style={{ fontSize: 12, color: C.gray500 }}>⏱ {job.experience}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 8 }}>💰 {job.salary}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: C.gray300 }}>🕐 {job.posted}</div>
                      {job.deadline && <div style={{ fontSize: 11, color: dl !== null && dl <= 2 ? C.orange : C.gray300, fontWeight: dl !== null && dl <= 2 ? 700 : 400, marginTop: 2 }}>📅 ডেডলাইন: {formatDate(job.deadline)}</div>}
                    </div>
                    {!isOwner && (
                      appliedJobs.includes(job.id)
                        ? <div style={{ background: C.green, color: C.white, borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600 }}>✅ আবেদন হয়েছে</div>
                        : <button style={s.btn} onClick={e => { e.stopPropagation(); setAppliedJobs([...appliedJobs, job.id]); showToast("✅ আবেদন সফলভাবে জমা হয়েছে!"); }}>আবেদন করুন</button>
                    )}
                    {isOwner && <button style={{ ...s.btn, fontSize: 12, padding: "7px 12px" }} onClick={e => { e.stopPropagation(); setShowApplicants(job); }}>👥 আবেদনকারী</button>}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ── POST JOB ── */}
        {activeTab === "post" && isOwner && (
          <>
            {!isActive ? (
              <div style={{ ...s.card, textAlign: "center", padding: "32px 20px" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>প্রিমিয়াম দরকার</div>
                <div style={{ fontSize: 14, color: C.gray500, marginBottom: 24, lineHeight: 1.6 }}>চাকরির বিজ্ঞপ্তি পোস্ট করতে<br />প্রিমিয়াম সাবস্ক্রিপশন নিন</div>
                <button style={s.btnYellow} onClick={() => setShowPaywall(true)}>👑 মাত্র ৫০ টাকায় শুরু করুন</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 14 }}>নতুন চাকরির বিজ্ঞপ্তি</div>
                <div style={s.card}>
                  {[
                    { k: "title", l: "পদের নাম *", p: "যেমন: প্রাইভেট কার ড্রাইভার" },
                    { k: "company", l: "প্রতিষ্ঠানের নাম *", p: "আপনার প্রতিষ্ঠান/নাম" },
                    { k: "area", l: "এলাকা", p: "যেমন: গুলশান, মিরপুর" },
                    { k: "salary", l: "বেতন *", p: "যেমন: ২০,০০০ - ২৫,০০০ টাকা" },
                    { k: "experience", l: "অভিজ্ঞতা", p: "যেমন: ৩ বছর" },
                  ].map(f => (
                    <div key={f.k} style={{ marginBottom: 14 }}>
                      <label style={s.label}>{f.l}</label>
                      <input style={s.input} placeholder={f.p} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} />
                    </div>
                  ))}

                  <div style={{ marginBottom: 14 }}>
                    <label style={s.label}>জেলা / শহর *</label>
                    <select style={s.select} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                      {LOCATIONS.filter(l => l !== "সব জায়গা").map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={s.label}>চাকরির ধরন</label>
                    <select style={s.select} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                      <option>ফুল-টাইম</option><option>পার্ট-টাইম</option><option>শিফট-ভিত্তিক</option><option>চুক্তিভিত্তিক</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={s.label}>লাইসেন্সের ধরন</label>
                    <select style={s.select} value={form.license} onChange={e => setForm({ ...form, license: e.target.value })}>
                      <option>হালকা যানবাহন</option><option>ভারী যানবাহন</option><option>মোটরসাইকেল</option><option>যেকোনো লাইসেন্স</option>
                    </select>
                  </div>

                  {/* DEADLINE FIELD */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={s.label}>আবেদনের শেষ তারিখ (ডেডলাইন) *</label>
                    <input type="date" style={s.input} value={form.deadline} min={new Date().toISOString().split("T")[0]} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                    <div style={{ fontSize: 11, color: C.gray500, marginTop: 4 }}>⚠️ এই তারিখের পর পোস্ট স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে</div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={s.label}>বিস্তারিত বিবরণ</label>
                    <textarea style={s.textarea} placeholder="চাকরির দায়িত্ব, সুবিধা, যোগ্যতা..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <button style={s.btnYellow} onClick={handlePost}>🚀 বিজ্ঞপ্তি প্রকাশ করুন</button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── MY JOBS (Owner) ── */}
        {activeTab === "myjobs" && isOwner && (
          <>
            {/* Stats */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { n: myPostedJobs.filter(j => j.status === "active").length, l: "সক্রিয়", c: C.green },
                { n: myPostedJobs.filter(j => j.status === "hired").length, l: "নিয়োগ হয়েছে", c: "#1d4ed8" },
                { n: myPostedJobs.filter(j => j.status === "expired" || j.status === "inactive").length, l: "বন্ধ", c: C.red },
              ].map((st, i) => (
                <div key={i} style={{ flex: 1, background: C.white, borderRadius: 12, padding: "12px 10px", textAlign: "center", border: `1px solid ${C.gray100}` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: st.c }}>{st.n}</div>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{st.l}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 12 }}>আমার সব বিজ্ঞপ্তি</div>

            {myPostedJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: C.gray500 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                <div>এখনো কোনো বিজ্ঞপ্তি পোস্ট করেননি</div>
              </div>
            )}

            {myPostedJobs.map(job => (
              <div key={job.id} style={{ ...s.card, opacity: job.status === "inactive" || job.status === "expired" ? 0.8 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1, paddingRight: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{job.title}</div>
                    <div style={{ fontSize: 13, color: C.gray500 }}>{job.company}</div>
                  </div>
                  <StatusBadge status={job.status} deadline={job.deadline} />
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.gray500 }}>📍 {job.location}</span>
                  <span style={{ fontSize: 12, color: C.gray500 }}>👥 {job.applicants} আবেদন</span>
                </div>

                {job.deadline && (
                  <div style={{ fontSize: 12, color: isDeadlinePassed(job.deadline) ? C.red : C.gray500, marginBottom: 10, fontWeight: isDeadlinePassed(job.deadline) ? 700 : 400 }}>
                    📅 ডেডলাইন: {formatDate(job.deadline)} {isDeadlinePassed(job.deadline) ? "— মেয়াদ শেষ হয়েছে" : `(${deadlineDaysLeft(job.deadline)} দিন বাকি)`}
                  </div>
                )}

                {job.status === "hired" && (
                  <div style={{ background: "#eff6ff", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>
                    ✅ নিয়োগপ্রাপ্ত: {job.hiredName}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={{ ...s.btn, fontSize: 12, padding: "7px 12px" }} onClick={() => setShowApplicants(job)}>👥 আবেদনকারী</button>

                  {job.status === "active" && (
                    <button style={{ ...s.btnRed, fontSize: 12, padding: "7px 12px" }} onClick={() => setDeactiveConfirm(job)}>⏸ ডিঅ্যাক্টিভ</button>
                  )}
                  {(job.status === "inactive" || job.status === "expired") && (
                    <button style={{ ...s.btnGreen, fontSize: 12, padding: "7px 12px" }} onClick={() => handleReactivate(job.id)}>▶ পুনরায় চালু</button>
                  )}
                  <button style={{ ...s.btnRed, fontSize: 12, padding: "7px 12px", background: "#fff1f2" }} onClick={() => setRemoveConfirm(job)}>🗑 মুছুন</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── APPLIED (Driver) ── */}
        {activeTab === "applied" && !isOwner && (
          <>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 14 }}>আমার আবেদন ({appliedJobs.length}টি)</div>
            {appliedJobs.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 20px", color: C.gray500 }}><div style={{ fontSize: 40, marginBottom: 10 }}>📭</div><div>এখনো কোনো চাকরিতে আবেদন করেননি</div></div>
              : jobs.filter(j => appliedJobs.includes(j.id)).map(job => (
                <div key={job.id} style={s.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: C.gray500 }}>🏢 {job.company}</div>
                    </div>
                    <StatusBadge status={job.status} deadline={job.deadline} />
                  </div>
                  <div style={{ fontSize: 12, color: C.gray500 }}>📍 {job.location} · 💰 {job.salary}</div>
                  {job.deadline && <div style={{ fontSize: 11, color: isDeadlinePassed(job.deadline) ? C.red : C.gray300, marginTop: 6 }}>📅 ডেডলাইন: {formatDate(job.deadline)}</div>}
                  {job.status === "hired" && <div style={{ marginTop: 8, fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>ℹ️ এই পদে নিয়োগ সম্পন্ন হয়েছে</div>}
                  {(job.status === "expired" || job.status === "inactive") && <div style={{ marginTop: 8, fontSize: 12, color: C.red }}>ℹ️ এই বিজ্ঞপ্তিটি বর্তমানে বন্ধ আছে</div>}
                </div>
              ))
            }
          </>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <>
            <div style={{ ...s.card, textAlign: "center", padding: "24px 20px" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>{isOwner ? "🏢" : "🚘"}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>{isOwner ? "রহিম এন্টারপ্রাইজ" : "মো. করিম মিয়া"}</div>
              <div style={{ fontSize: 13, color: C.gray500, marginTop: 4 }}>{isOwner ? "নিয়োগকর্তা · ঢাকা" : "প্রফেশনাল ড্রাইভার · ঢাকা"}</div>
              {isOwner && isActive && <div style={{ marginTop: 10, background: "linear-gradient(135deg,#0f4c2a,#16653a)", borderRadius: 10, padding: "8px 14px", display: "inline-block" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#86efac" }}>👑 প্রিমিয়াম · মেয়াদ {formatDate(subscription.expiry)} পর্যন্ত</div></div>}
              {isOwner && !isActive && <button onClick={() => setShowPaywall(true)} style={{ marginTop: 10, background: `linear-gradient(135deg,${C.yellow},${C.yellowLight})`, border: "none", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: C.navy, cursor: "pointer" }}>👑 প্রিমিয়াম নিন</button>}
            </div>
            <div style={s.card}>
              {[{ l: "ফোন", v: "01711-XXXXXX" }, { l: "ইমেইল", v: isOwner ? "rahim@enterprise.com" : "karim@email.com" }, { l: "ঠিকানা", v: "ঢাকা, বাংলাদেশ" }, ...(!isOwner ? [{ l: "লাইসেন্স", v: "ভারী যানবাহন" }] : [])].map((item, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <label style={s.label}>{item.l}</label>
                  <input style={s.input} defaultValue={item.v} />
                </div>
              ))}
              <button style={s.btnYellow} onClick={() => showToast("✅ প্রোফাইল আপডেট হয়েছে!")}>💾 প্রোফাইল আপডেট করুন</button>
            </div>
          </>
        )}
      </div>

      {/* ── APPLICANTS MODAL ── */}
      {showApplicants && (
        <div style={s.modal} onClick={() => setShowApplicants(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <button style={{ background: C.gray100, border: "none", borderRadius: 50, width: 32, height: 32, float: "right", cursor: "pointer", fontSize: 14 }} onClick={() => setShowApplicants(null)}>✕</button>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 2 }}>আবেদনকারীদের তালিকা</div>
            <div style={{ fontSize: 13, color: C.gray500, marginBottom: 4 }}>{showApplicants.title}</div>
            <StatusBadge status={showApplicants.status} deadline={showApplicants.deadline} />
            <div style={s.divider} />

            {showApplicants.status === "hired" && (
              <div style={{ background: "#eff6ff", borderRadius: 12, padding: "12px 14px", marginBottom: 14, fontSize: 13, color: "#1d4ed8", fontWeight: 600, textAlign: "center" }}>
                ✅ {showApplicants.hiredName} কে নিয়োগ দেওয়া হয়েছে। পোস্ট বন্ধ হয়ে গেছে।
              </div>
            )}

            {MOCK_APPLICANTS.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, background: C.gray50, borderRadius: 14, padding: 14, marginBottom: 10, border: `1px solid ${C.gray100}` }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, display: "flex", alignItems: "center", justifyContent: "center", color: C.yellow, fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{a.name[3]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>⏱ {a.exp} · 🪪 {a.license}</div>
                  <div style={{ fontSize: 12, color: C.green, marginTop: 2 }}>{isActive ? `📞 ${a.phone}` : "📞 01XXX-XXXXXX 🔒"}</div>
                </div>
                {showApplicants.status === "active" && (
                  <button style={{ ...s.btnGreen, fontSize: 12, padding: "7px 10px" }} onClick={() => setHireConfirm({ job: showApplicants, applicant: a })}>✅ Hire</button>
                )}
              </div>
            ))}

            {!isActive && <div style={{ background: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 12, padding: "12px 14px", marginTop: 4, textAlign: "center" }}><div style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>ফোন নম্বর দেখতে প্রিমিয়াম নিন 👑</div><button style={{ ...s.btn, marginTop: 8, background: C.yellow, color: C.navy, padding: "8px 20px" }} onClick={() => { setShowApplicants(null); setShowPaywall(true); }}>মাত্র ৫০ টাকায় দেখুন</button></div>}

            <div style={s.divider} />
            {/* Quick actions from modal */}
            {showApplicants.status === "active" && (
              <button style={{ ...s.btnRed, width: "100%", textAlign: "center" }} onClick={() => { setDeactiveConfirm(showApplicants); setShowApplicants(null); }}>⏸ এই পোস্ট ডিঅ্যাক্টিভ করুন</button>
            )}
            <button style={{ ...s.btnRed, width: "100%", textAlign: "center", marginTop: 8, background: "#fff1f2" }} onClick={() => { setRemoveConfirm(showApplicants); setShowApplicants(null); }}>🗑 পোস্ট মুছে ফেলুন</button>
          </div>
        </div>
      )}

      {/* ── HIRE CONFIRM ── */}
      {hireConfirm && (
        <div style={s.modal} onClick={() => setHireConfirm(null)}>
          <div style={{ ...s.modalBox, padding: "28px 24px" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🤝</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>নিয়োগ নিশ্চিত করুন</div>
              <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6 }}>
                <strong style={{ color: C.navy }}>{hireConfirm.applicant.name}</strong> কে নিয়োগ দিলে<br />এই পোস্টটি স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে।
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: 13, background: C.gray100, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, color: C.gray700, cursor: "pointer" }} onClick={() => setHireConfirm(null)}>বাতিল</button>
              <button style={{ flex: 1, padding: 13, background: `linear-gradient(135deg,#16a34a,#15803d)`, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: C.white, cursor: "pointer" }} onClick={() => handleHire(hireConfirm.job, hireConfirm.applicant)}>✅ নিয়োগ দিন</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DEACTIVATE CONFIRM ── */}
      {deactiveConfirm && (
        <div style={s.modal} onClick={() => setDeactiveConfirm(null)}>
          <div style={{ ...s.modalBox, padding: "28px 24px" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>⏸️</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>পোস্ট ডিঅ্যাক্টিভ করবেন?</div>
              <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6 }}>
                <strong style={{ color: C.navy }}>{deactiveConfirm.title}</strong><br />পোস্টটি চাকরির তালিকা থেকে সরিয়ে নেওয়া হবে। পরে আবার চালু করতে পারবেন।
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: 13, background: C.gray100, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, color: C.gray700, cursor: "pointer" }} onClick={() => setDeactiveConfirm(null)}>বাতিল</button>
              <button style={{ flex: 1, padding: 13, background: `linear-gradient(135deg,${C.orange},#ea580c)`, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: C.white, cursor: "pointer" }} onClick={() => handleDeactivate(deactiveConfirm.id)}>⏸ ডিঅ্যাক্টিভ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* ── REMOVE CONFIRM ── */}
      {removeConfirm && (
        <div style={s.modal} onClick={() => setRemoveConfirm(null)}>
          <div style={{ ...s.modalBox, padding: "28px 24px" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>🗑️</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>পোস্ট মুছে ফেলবেন?</div>
              <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.6 }}>
                <strong style={{ color: C.red }}>{removeConfirm.title}</strong><br />এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: 13, background: C.gray100, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, color: C.gray700, cursor: "pointer" }} onClick={() => setRemoveConfirm(null)}>বাতিল</button>
              <button style={{ flex: 1, padding: 13, background: `linear-gradient(135deg,${C.red},#dc2626)`, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: C.white, cursor: "pointer" }} onClick={() => handleRemove(removeConfirm.id)}>🗑 মুছে ফেলুন</button>
            </div>
          </div>
        </div>
      )}

      {/* ── JOB DETAIL ── */}
      {selectedJob && (
        <div style={s.modal} onClick={() => setSelectedJob(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <button style={{ background: C.gray100, border: "none", borderRadius: 50, width: 32, height: 32, float: "right", cursor: "pointer", fontSize: 14 }} onClick={() => setSelectedJob(null)}>✕</button>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 4 }}>{selectedJob.title}</div>
            <div style={{ fontSize: 13, color: C.gray500, marginBottom: 10 }}>🏢 {selectedJob.company}</div>
            <StatusBadge status={selectedJob.status} deadline={selectedJob.deadline} />
            <div style={s.divider} />
            {[
              { l: "📍 কর্মস্থল", v: `${selectedJob.location}${selectedJob.area ? `, ${selectedJob.area}` : ""}` },
              { l: "💰 বেতন", v: selectedJob.salary },
              { l: "⏰ ধরন", v: selectedJob.type },
              { l: "🪪 লাইসেন্স", v: selectedJob.license },
              { l: "⏱ অভিজ্ঞতা", v: selectedJob.experience },
              { l: "📅 ডেডলাইন", v: formatDate(selectedJob.deadline) },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: C.gray500 }}>{item.l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{item.v}</span>
              </div>
            ))}
            {selectedJob.description && <>
              <div style={s.divider} />
              <div style={{ fontSize: 11, color: C.gray500, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>বিস্তারিত বিবরণ</div>
              <div style={{ fontSize: 14, color: C.gray700, lineHeight: 1.7, marginBottom: 20 }}>{selectedJob.description}</div>
            </>}
            {!isOwner && selectedJob.status === "active" && (
              appliedJobs.includes(selectedJob.id)
                ? <div style={{ background: C.green, color: C.white, textAlign: "center", padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 600 }}>✅ আবেদন সম্পন্ন হয়েছে</div>
                : <button style={s.btnYellow} onClick={() => { setAppliedJobs([...appliedJobs, selectedJob.id]); setSelectedJob(null); showToast("✅ আবেদন সফলভাবে জমা হয়েছে!"); }}>📝 এখনই আবেদন করুন</button>
            )}
            {!isOwner && selectedJob.status !== "active" && (
              <div style={{ background: C.gray100, color: C.gray500, textAlign: "center", padding: 14, borderRadius: 12, fontSize: 14, fontWeight: 600 }}>এই পদে আবেদন বন্ধ হয়ে গেছে</div>
            )}
          </div>
        </div>
      )}

      {/* ── PAYWALL ── */}
      {showPaywall && !showPayment && (
        <div style={s.modal} onClick={() => setShowPaywall(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <button style={{ background: C.gray100, border: "none", borderRadius: 50, width: 32, height: 32, float: "right", cursor: "pointer", fontSize: 14 }} onClick={() => setShowPaywall(false)}>✕</button>
            <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>👑</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6 }}>প্রিমিয়াম প্ল্যান</div>
            </div>
            <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center", color: C.white }}>
              <div style={{ fontSize: 13, opacity: 0.7 }}>৩ মাসের জন্য</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: C.yellow, lineHeight: 1 }}>৳৫০</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>মাত্র ১৬.৬৭ টাকা/মাস</div>
            </div>
            {["✅ আনলিমিটেড চাকরির বিজ্ঞপ্তি পোস্ট", "✅ আবেদনকারীদের ফোন নম্বর দেখুন", "✅ ডেডলাইন ও স্ট্যাটাস ম্যানেজমেন্ট", "✅ ৩ মাস পূর্ণ অ্যাক্সেস"].map((f, i) => <div key={i} style={{ fontSize: 14, color: C.gray700, marginBottom: 10 }}>{f}</div>)}
            <div style={s.divider} />
            <button style={s.btnYellow} onClick={() => setShowPayment(true)}>💳 এখনই পেমেন্ট করুন</button>
          </div>
        </div>
      )}

      {/* ── PAYMENT ── */}
      {showPayment && (
        <div style={s.modal} onClick={() => { if (payStep !== 3) { setShowPayment(false); setPayStep(1); } }}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            {payStep === 1 && (
              <>
                <button style={{ background: C.gray100, border: "none", borderRadius: 50, width: 32, height: 32, float: "right", cursor: "pointer", fontSize: 14 }} onClick={() => { setShowPayment(false); setPayStep(1); }}>✕</button>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 4 }}>পেমেন্ট পদ্ধতি</div>
                <div style={{ fontSize: 13, color: C.gray500, marginBottom: 20 }}>মোট: ৳৫০ · ৩ মাসের প্ল্যান</div>
                {[{ name: "bKash", emoji: "🩷", color: "#e2136e", bg: "#fdf0f6" }, { name: "Nagad", emoji: "🧡", color: "#f05a22", bg: "#fff4f0" }, { name: "Rocket", emoji: "💜", color: "#8b2fc9", bg: "#f7f0fd" }].map(m => (
                  <div key={m.name} onClick={() => setPayStep(2)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: m.bg, borderRadius: 12, marginBottom: 10, cursor: "pointer", border: `1.5px solid ${m.color}22` }}>
                    <span style={{ fontSize: 28 }}>{m.emoji}</span>
                    <div><div style={{ fontSize: 15, fontWeight: 700, color: m.color }}>{m.name}</div><div style={{ fontSize: 12, color: C.gray500 }}>মোবাইল ব্যাংকিং</div></div>
                    <span style={{ marginLeft: "auto", color: m.color, fontSize: 20 }}>›</span>
                  </div>
                ))}
              </>
            )}
            {payStep === 2 && (
              <>
                <button style={{ background: C.gray100, border: "none", borderRadius: 50, width: 32, height: 32, float: "right", cursor: "pointer", fontSize: 14 }} onClick={() => setPayStep(1)}>‹</button>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 16 }}>পেমেন্ট করুন</div>
                <div style={{ background: `linear-gradient(135deg,${C.yellow},${C.yellowLight})`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: C.navy, fontWeight: 600 }}>এই নম্বরে পাঠান</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginTop: 4 }}>01712-345678</div>
                  <div style={{ fontSize: 12, color: C.gray700, marginTop: 2 }}>পরিমাণ: ৳৫০</div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={s.label}>আপনার নম্বর</label>
                  <input style={s.input} placeholder="01XXXXXXXXX" value={bkashNum} onChange={e => setBkashNum(e.target.value)} maxLength={11} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={s.label}>ট্রানজেকশন আইডি</label>
                  <input style={s.input} placeholder="যেমন: TRX8K3P2Q1" />
                </div>
                <button style={s.btnYellow} onClick={handlePay}>✅ কনফার্ম করুন</button>
              </>
            )}
            {payStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8 }}>অভিনন্দন!</div>
                <div style={{ fontSize: 14, color: C.gray500, lineHeight: 1.7 }}>প্রিমিয়াম সফলভাবে সক্রিয় হয়েছে!<br /><strong style={{ color: C.navy }}>মেয়াদ: {formatDate(subscription?.expiry)} পর্যন্ত</strong></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={s.bottomNav}>
        {tabs.map(tab => (
          <button key={tab.id} style={{ flex: 1, padding: "10px 4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", background: "none", border: "none" }}
            onClick={() => { if (tab.id === "post" && !isActive) { setShowPaywall(true); return; } setActiveTab(tab.id); }}>
            <span style={{ fontSize: 22, filter: activeTab === tab.id ? "none" : "grayscale(1) opacity(0.45)" }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? C.navy : C.gray300 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
