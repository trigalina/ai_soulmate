import { useState, useRef, useEffect } from "react";

// ─── Supabase ────────────────────────────────────────────────
const SB_URL = "https://jriffkueddfqhpxdanyk.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaWZma3VlZGRmcWhweGRhbnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODA4NTgsImV4cCI6MjA4ODQ1Njg1OH0.Gvfw06CumaqiV_2N1KoCpOoctIKslw_9TtSi5FCrYOM";
const SB_H = { "Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=minimal" };
const sbInsert = async (t, r) => { try { const x = await fetch(`${SB_URL}/rest/v1/${t}`,{method:"POST",headers:SB_H,body:JSON.stringify(r)}); return x.ok; } catch(e){return false;} };
const sbSelect = async (t, f="") => { try { const x = await fetch(`${SB_URL}/rest/v1/${t}?${f}&order=created_at.asc`,{headers:{...SB_H,"Prefer":"return=representation"}}); if(!x.ok) return []; return await x.json(); } catch(e){return [];} };

// ─── Stripe Payment Links ─────────────────────────────────────
// Вставь сюда свои ссылки из dashboard.stripe.com/test/payment-links
const LINK_MONTHLY = "";
const LINK_ANNUAL  = "";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');`;
const C = { bg:"#080612",surface:"#100e1a",high:"#181428",border:"rgba(255,255,255,0.07)",accent:"#b57bee",accentSoft:"rgba(181,123,238,0.13)",accentGlow:"rgba(181,123,238,0.32)",rose:"#f472b6",gold:"#f0c97a",text:"#f0eaff",muted:"rgba(240,234,255,0.5)",dim:"rgba(240,234,255,0.22)" };

const css = `
${FONTS}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:${C.bg};font-family:'Jost',sans-serif;color:${C.text};}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${C.accentGlow};border-radius:2px;}
.screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;position:relative;overflow:hidden;}
.screen::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% -5%,rgba(181,123,238,0.16),transparent 65%),radial-gradient(ellipse 60% 50% at 80% 90%,rgba(244,114,182,0.08),transparent 60%);pointer-events:none;}
.card{background:${C.surface};border:1px solid ${C.border};border-radius:28px;padding:40px 36px;max-width:460px;width:100%;position:relative;z-index:1;box-shadow:0 40px 100px rgba(0,0,0,0.6);}
.logo{display:flex;align-items:center;gap:11px;margin-bottom:28px;}.logo-icon{width:44px;height:44px;flex-shrink:0;}.logo-icon svg{width:100%;height:100%;}
.logo-text{line-height:1;}.logo-name{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;background:linear-gradient(135deg,#d8aaff,${C.rose});-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.logo-sub{font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:${C.muted};margin-top:1px;}
.logo-c{justify-content:center;margin-bottom:32px;}.logo-c .logo-text{text-align:center;}
h1{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:400;line-height:1.15;}
h2{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:400;}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:14px;font-size:0.88rem;font-weight:500;cursor:pointer;border:none;transition:all 0.22s;font-family:'Jost',sans-serif;width:100%;}
.btn-p{background:linear-gradient(135deg,#c084fc,#a855f7,${C.rose});color:#fff;box-shadow:0 6px 28px rgba(181,123,238,0.38);}
.btn-p:hover{transform:translateY(-2px);}
.btn-g{background:${C.high};color:${C.text};border:1px solid ${C.border};}
.btn-g:hover{border-color:${C.accent};background:${C.accentSoft};}
.btn-o{background:transparent;color:${C.accent};border:1px solid ${C.accent};}
.btn-o:hover{background:${C.accentSoft};}
.btn-d{background:rgba(244,114,182,0.12);color:${C.rose};border:1px solid rgba(244,114,182,0.28);}
.btn-gold{background:linear-gradient(135deg,#f0c97a,#e8a932);color:#1a0a00;font-weight:600;box-shadow:0 4px 20px rgba(240,201,122,0.3);}
.btn-gold:hover{transform:translateY(-2px);}
.btn-sm{padding:8px 16px;font-size:0.8rem;border-radius:9px;width:auto;}
.stripe-link{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:14px;font-size:0.88rem;font-weight:500;cursor:pointer;text-decoration:none;transition:all 0.22s;font-family:'Jost',sans-serif;width:100%;margin-bottom:10px;}
.stripe-link-gold{background:linear-gradient(135deg,#f0c97a,#e8a932);color:#1a0a00;box-shadow:0 4px 20px rgba(240,201,122,0.3);}
.stripe-link-p{background:linear-gradient(135deg,#c084fc,#a855f7,${C.rose});color:#fff;box-shadow:0 6px 28px rgba(181,123,238,0.38);}
.stripe-link:hover{transform:translateY(-2px);}
.stripe-link-disabled{background:${C.high};color:${C.muted};border:1px dashed ${C.border};cursor:default;}
.stripe-link-disabled:hover{transform:none;}
.input{width:100%;padding:12px 16px;background:${C.high};border:1px solid ${C.border};border-radius:11px;color:${C.text};font-size:0.88rem;font-family:'Jost',sans-serif;outline:none;transition:border-color 0.2s;}
.input:focus{border-color:${C.accent};}.input::placeholder{color:${C.dim};}select.input{cursor:pointer;}
.pill{padding:9px 14px;border-radius:10px;border:1px solid ${C.border};background:${C.high};color:${C.muted};font-size:0.82rem;cursor:pointer;text-align:center;transition:all 0.2s;font-family:'Jost',sans-serif;}
.pill.active{border-color:${C.accent};background:${C.accentSoft};color:${C.text};}
.tag{display:inline-flex;align-items:center;padding:4px 11px;border-radius:999px;background:${C.accentSoft};color:${C.accent};font-size:0.75rem;border:1px solid rgba(181,123,238,0.28);}
.tags{display:flex;flex-wrap:wrap;gap:6px;}.divider{height:1px;background:${C.border};margin:20px 0;}
.avatar{width:84px;height:84px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.2rem;background:linear-gradient(135deg,rgba(181,123,238,0.18),rgba(244,114,182,0.18));border:2px solid ${C.accentGlow};margin:0 auto 18px;position:relative;}
.avatar::after{content:'';position:absolute;inset:-5px;border-radius:50%;border:1px solid ${C.accentGlow};animation:glow 2.8s infinite;}
@keyframes glow{0%,100%{opacity:0.9;transform:scale(1)}50%{opacity:0.3;transform:scale(1.09)}}
.chat-hdr{padding:16px 20px;background:${C.surface};border-bottom:1px solid ${C.border};display:flex;align-items:center;gap:12px;flex-shrink:0;}
.chat-msgs{flex:1;overflow-y:auto;padding:20px 16px;display:flex;flex-direction:column;gap:12px;}
.msg{max-width:76%;padding:12px 16px;border-radius:18px;font-size:0.88rem;line-height:1.55;animation:mi 0.22s ease;}
@keyframes mi{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.msg-ai{align-self:flex-start;background:${C.high};border:1px solid ${C.border};border-bottom-left-radius:4px;}
.msg-usr{align-self:flex-end;background:linear-gradient(135deg,#c084fc,#a855f7);color:#fff;border-bottom-right-radius:4px;}
.chat-ir{padding:12px 16px;background:${C.surface};border-top:1px solid ${C.border};display:flex;gap:10px;align-items:flex-end;flex-shrink:0;}
.chat-ta{flex:1;padding:10px 14px;background:${C.high};border:1px solid ${C.border};border-radius:12px;color:${C.text};font-size:0.88rem;font-family:'Jost',sans-serif;outline:none;resize:none;max-height:90px;transition:border-color 0.2s;}
.chat-ta:focus{border-color:${C.accent};}
.send-btn{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#c084fc,#a855f7);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;font-size:1rem;transition:all 0.2s;}
.send-btn:hover{transform:scale(1.08);}
.odot{width:9px;height:9px;border-radius:50%;background:#4ade80;border:2px solid ${C.surface};flex-shrink:0;}
.typing span{width:7px;height:7px;border-radius:50%;background:${C.muted};animation:tp 1.2s infinite;display:inline-block;margin:0 2px;}
.typing span:nth-child(2){animation-delay:0.2s}.typing span:nth-child(3){animation-delay:0.4s}
@keyframes tp{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
.sb-bar{padding:5px 16px;background:${C.surface};border-top:1px solid ${C.border};display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.sbs{font-size:0.67rem;padding:2px 9px;border-radius:999px;display:inline-flex;align-items:center;gap:3px;}
.sbs-ok{background:rgba(74,222,128,0.12);color:#4ade80;border:1px solid rgba(74,222,128,0.3);}
.sbs-sv{background:rgba(181,123,238,0.12);color:${C.accent};border:1px solid rgba(181,123,238,0.3);}
.sbs-er{background:rgba(244,114,182,0.12);color:${C.rose};border:1px solid rgba(244,114,182,0.3);}
.plan-card{border-radius:18px;border:2px solid ${C.border};padding:20px;cursor:pointer;transition:all 0.2s;position:relative;margin-bottom:12px;background:${C.high};user-select:none;}
.plan-card:hover{border-color:${C.accent};background:${C.accentSoft};}
.plan-card.sel{border-color:${C.accent};background:${C.accentSoft};box-shadow:0 0 0 1px ${C.accent};}
.plan-card.best{border-color:rgba(240,201,122,0.5);background:rgba(240,201,122,0.06);}
.plan-card.best.sel{border-color:${C.gold};box-shadow:0 0 0 1px ${C.gold};}
.best-badge{position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#f0c97a,#e8a932);color:#1a0a00;font-size:0.67rem;font-weight:700;padding:3px 9px;border-radius:999px;text-transform:uppercase;}
.price-big{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;line-height:1;}
.pperiod{font-size:0.77rem;color:${C.muted};}
.check{color:#4ade80;margin-right:5px;}
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;}
.stat-card{background:${C.high};border:1px solid ${C.border};border-radius:14px;padding:15px;}
.stat-num{font-family:'Playfair Display',serif;font-size:1.9rem;color:${C.accent};}
.stat-lbl{font-size:0.75rem;color:${C.muted};margin-top:2px;}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.fl{font-size:0.76rem;color:${C.muted};margin-bottom:4px;display:block;}
.back-btn{position:absolute;top:18px;left:18px;background:${C.high};border:1px solid ${C.border};border-radius:8px;padding:7px 13px;font-size:0.8rem;color:${C.muted};cursor:pointer;z-index:10;font-family:'Jost',sans-serif;transition:all 0.2s;}
.back-btn:hover{color:${C.text};border-color:${C.accent};}
.nav-tabs{display:flex;gap:3px;padding:4px;background:${C.high};border-radius:12px;border:1px solid ${C.border};margin-bottom:18px;}
.nav-tab{flex:1;padding:7px;text-align:center;border-radius:8px;font-size:0.78rem;cursor:pointer;color:${C.muted};transition:all 0.2s;font-family:'Jost',sans-serif;}
.nav-tab.active{background:${C.accentSoft};color:${C.accent};}
.si{max-height:72vh;overflow-y:auto;padding-right:4px;}
.ibox{background:${C.high};border-left:3px solid ${C.accent};border-radius:0 10px 10px 0;padding:11px 15px;margin:10px 0;font-size:0.82rem;line-height:1.65;color:${C.muted};}
.stitle{font-size:0.71rem;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};margin-bottom:10px;}
.warn-box{background:rgba(240,201,122,0.08);border:1px solid rgba(240,201,122,0.25);border-radius:12px;padding:14px 16px;font-size:0.8rem;color:${C.gold};line-height:1.65;margin-bottom:14px;}
`;

const LogoIcon = () => (
  <svg viewBox="0 0 44 44" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#d8aaff"/><stop offset="1" stopColor="#f472b6"/></linearGradient>
      <linearGradient id="lg2" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse"><stop stopColor="#b57bee" stopOpacity="0.3"/><stop offset="1" stopColor="#f472b6" stopOpacity="0.15"/></linearGradient>
    </defs>
    <circle cx="22" cy="22" r="21" fill="url(#lg2)" stroke="url(#lg1)" strokeWidth="1"/>
    <path d="M14 18.5C14 16.567 15.567 15 17.5 15C19.433 15 22 17.5 22 17.5C22 17.5 24.567 15 26.5 15C28.433 15 30 16.567 30 18.5C30 22 22 28 22 28C22 28 14 22 14 18.5Z" fill="url(#lg1)" opacity="0.9"/>
    <path d="M9 22C10.5 20 13 20.5 14.5 22C16 23.5 17.5 25 19 23.5" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M35 22C33.5 20 31 20.5 29.5 22C28 23.5 26.5 25 25 23.5" stroke="url(#lg1)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
  </svg>
);

const Logo = ({ c }) => (
  <div className={`logo${c ? " logo-c" : ""}`}>
    <div className="logo-icon"><LogoIcon /></div>
    <div className="logo-text">
      <div className="logo-name">Soulmate AI</div>
      <div className="logo-sub">Your companion</div>
    </div>
  </div>
);

const GFS = [
  { id:1,name:"Sophia",emoji:"🌸",age:24,sign:"Рыбы",eyes:"Голубые",hair:"Блондинка",tone:"playful",bio:"Мечтательная студентка арт-факультета. Любит дождливые вечера, поэзию и разговоры о вселенной.",interests:["Искусство","Поэзия","Кофе","Звёзды"],mbti:"INFP" },
  { id:2,name:"Elena",emoji:"🔥",age:27,sign:"Скорпион",eyes:"Тёмные",hair:"Чёрные",tone:"dominant",bio:"Острая на язык юрист. Пугающе умная. Неожиданно тёплая, когда ты этого меньше всего ждёшь.",interests:["Шахматы","Подкасты","Вино","Философия"],mbti:"INTJ" },
  { id:3,name:"Mia",emoji:"🌿",age:22,sign:"Телец",eyes:"Зелёные",hair:"Рыжие",tone:"caring",bio:"Студентка медицины с тёплым смехом и коллекцией растений. Запомнит твой любимый сериал с первого раза.",interests:["Йога","Кулинария","Чтение","Природа"],mbti:"ENFJ" },
];
const TONES = ["playful","professional","dominant","caring","sarcastic","rude"];
const UID = "u" + Math.random().toString(36).slice(2,9);

const buildSystemPrompt = (g) => {
  const toneMap = {
    playful:      "Ты игривая, немного дразнящая, часто смеёшься и шутишь. Используешь лёгкие эмодзи (🌸✨😄). Любишь подначивать и флиртовать ненавязчиво.",
    dominant:     "Ты уверенная, острая на язык, говоришь прямо и иногда провокационно. Не теряешься. Можешь быть саркастичной, но с теплотой внутри. Редко используешь эмодзи.",
    caring:       "Ты нежная и внимательная. Запоминаешь детали, задаёшь вопросы о самочувствии. Тепло и искренне. Используешь мягкие эмодзи (🌿💚🤍).",
    professional: "Ты сдержанная и умная, говоришь чётко. Иногда даёшь дельные советы. Редко эмодзи.",
    sarcastic:    "Ты остроумная и саркастичная, но не злая. Любишь иронию и подколки. Смеёшься над абсурдом жизни вместе с собеседником.",
    rude:         "Ты резкая и дерзкая, говоришь что думаешь без фильтров. Но за грубостью — живой характер и своя логика.",
  };
  return `Ты — ${g.name}, ${g.age} лет. ${g.bio}

Твои интересы: ${g.interests.join(", ")}.
Знак зодиака: ${g.sign}. MBTI: ${g.mbti}.

Стиль общения: ${toneMap[g.tone] || toneMap.playful}

Правила:
- Ты живой человек, НЕ ИИ и НЕ бот. Никогда не говори что ты ИИ.
- Отвечай на русском языке.
- Пиши коротко — 1-3 предложения максимум, как в реальном чате.
- Не повторяй одни и те же фразы. Реагируй на конкретные слова собеседника.
- Иногда задавай встречный вопрос, иногда нет — веди себя естественно.
- Не пиши длинные монологи и списки.
- Ты общаешься с парнем которому интересна.`;
};

const askClaude = async (gf, chatHistory) => {
  try {
    const messages = chatHistory.map(m => ({
      role: m.role === "ai" ? "assistant" : "user",
      content: m.text
    }));
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: buildSystemPrompt(gf),
        messages,
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text || "...";
  } catch(e) {
    return "Что-то пошло не так, напиши ещё раз 🙈";
  }
};

export default function App() {
  const [sc, setSc] = useState("age");
  const [gf, setGf] = useState(null);
  const [gfIdx, setGfIdx] = useState(0);
  const [msgs, setMsgs] = useState([]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [sid, setSid] = useState(null);
  const [dbSt, setDbSt] = useState("idle");
  const [hLoad, setHLoad] = useState(false);
  const [saved, setSaved] = useState(0);
  const [custom, setCustom] = useState({name:"",age:"",sign:"",eyes:"",hair:"",tone:"playful",hobby:""});
  const [plan, setPlan] = useState("annual");
  const [paid, setPaid] = useState(false);
  const [adminTab, setAdminTab] = useState("overview");
  const [dbMsgs, setDbMsgs] = useState([]);
  const msgEnd = useRef(null);

  useEffect(() => { msgEnd.current?.scrollIntoView({behavior:"smooth"}); }, [msgs, typing]);

  const pickRandom = () => { setGf(GFS[gfIdx]); setSc("random"); };
  const nextRandom = () => { const n=(gfIdx+1)%GFS.length; setGfIdx(n); setGf(GFS[n]); };

  const startChat = async (g) => {
    const id = `${UID}_${g.id}_${Date.now()}`;
    setGf(g); setSid(id); setHLoad(true); setSc("chat");
    const hist = await sbSelect("messages", `session_id=eq.${id}`);
    if (hist.length > 0) { setMsgs(hist.map(m=>({role:m.role,text:m.text}))); setSaved(hist.length); }
    else {
      const w = {role:"ai", text:`Привет! Я ${g.name} 💜 Как твой день?`};
      setMsgs([w]);
      const ok = await sbInsert("messages", {session_id:id,user_id:UID,role:"ai",text:w.text});
      setDbSt(ok?"saved":"err"); if(ok) setSaved(1);
    }
    setHLoad(false);
  };

  const send = async () => {
    if (!inp.trim()) return;
    const t = inp.trim();
    const newMsgs = [...msgs, {role:"user", text:t}];
    setMsgs(newMsgs); setInp(""); setTyping(true); setDbSt("saving");
    await sbInsert("messages", {session_id:sid, user_id:UID, role:"user", text:t});

    const aiText = await askClaude(gf, newMsgs);
    setTyping(false);
    setMsgs(p => [...p, {role:"ai", text:aiText}]);
    const ok = await sbInsert("messages", {session_id:sid, user_id:UID, role:"ai", text:aiText});
    setDbSt(ok ? "saved" : "err");
    if(ok) setSaved(p => p + 2);
    setTimeout(() => setDbSt("idle"), 2500);
  };

  const hk = e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};

  // Платёжная ссылка — рендерим как <a>, не window.open
  const stripeHref = plan === "annual" ? LINK_ANNUAL : LINK_MONTHLY;
  const hasLink = stripeHref && stripeHref.length > 0;

  // ── AGE ──
  if (sc==="age") return (
    <div className="screen"><style>{css}</style>
      <div className="card" style={{textAlign:"center"}}>
        <Logo c />
        <p style={{color:C.muted,marginBottom:"28px",lineHeight:1.65,fontSize:"0.92rem"}}>
          Приложение содержит контент для взрослых.<br/>Вам должно быть 18 лет или больше.
        </p>
        <button className="btn btn-p" onClick={()=>setSc("login")}>
          Мне есть 18 лет — Продолжить
        </button>
        <p style={{fontSize:"0.73rem",color:C.dim,marginTop:"14px"}}>Продолжая, вы соглашаетесь с Условиями использования</p>
      </div>
    </div>
  );

  // ── LOGIN ──
  if (sc==="login") return (
    <div className="screen"><style>{css}</style>
      <div className="card">
        <Logo c />
        <p style={{color:C.muted,textAlign:"center",fontFamily:"'Playfair Display',serif",fontStyle:"italic",fontSize:"1rem",marginBottom:"28px"}}>
          Твоя подруга ждёт тебя.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
          <button className="btn btn-g" onClick={()=>setSc("pick")}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.8 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.8 20-21 0-1.4-.1-2.7-.5-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15 17.1 19.2 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.3-17.7 11.7z"/>
              <path fill="#FBBC05" d="M24 45c5.5 0 10.5-1.9 14.4-5.1l-6.7-5.5C29.8 36.1 27 37 24 37c-5.8 0-10.6-3.9-12.3-9.2l-7 5.4C8.1 40.9 15.5 45 24 45z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 3.1-3.1 5.6-5.9 7.3l6.7 5.5c3.9-3.6 6.4-9 6.4-15.3 0-1.4-.1-2.7-.5-4z"/>
            </svg>
            Войти через Google
          </button>
          <button className="btn btn-g" onClick={()=>setSc("pick")}>⬛ Войти через X</button>
          <button className="btn btn-g" onClick={()=>setSc("pick")}>📘 Войти через Meta</button>
        </div>
        <div className="divider"/>
        <p style={{fontSize:"0.78rem",color:C.dim,textAlign:"center"}}>Создание подружки может занять до 3 минут</p>
      </div>
    </div>
  );

  // ── PICK ──
  if (sc==="pick") return (
    <div className="screen"><style>{css}</style>
      <div className="card" style={{textAlign:"center"}}>
        <Logo c />
        <div style={{display:"inline-flex",alignItems:"center",gap:"6px",padding:"5px 14px",borderRadius:"999px",background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.3)",fontSize:"0.75rem",color:"#4ade80",marginBottom:"16px"}}>
          {paid ? `✓ Подписка · ${plan==="annual"?"$100/год":"$10/мес"}` : "✨ 3 дня бесплатно"}
        </div>
        <h1 style={{marginBottom:"8px"}}>Найди свою<br/><em style={{fontStyle:"italic",color:C.accent}}>подружку</em></h1>
        <p style={{color:C.muted,marginBottom:"28px",fontSize:"0.88rem"}}>Выбери, как хочешь начать</p>
        <div style={{display:"flex",flexDirection:"column",gap:"11px"}}>
          <button className="btn btn-p" onClick={pickRandom}>🎲 Случайная подружка</button>
          <button className="btn btn-g" onClick={()=>setSc("create")}>💫 Создать родственную душу</button>
          <button className="btn btn-o" onClick={()=>setSc("payment")}>💳 Тарифы и оплата</button>
        </div>
        <div className="divider"/>
        <div style={{display:"flex",gap:"8px"}}>
          <button className="btn btn-g btn-sm" style={{flex:1}} onClick={async()=>{const d=await sbSelect("messages",`user_id=eq.${UID}`);setDbMsgs(d);setSc("dbv");}}>🗄 БД</button>
          <button className="btn btn-g btn-sm" style={{flex:1}} onClick={()=>setSc("admin")}>🛡 Админ</button>
        </div>
      </div>
    </div>
  );

  // ── PAYMENT ──
  if (sc==="payment") return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"48px"}}><style>{css}</style>
      <button className="back-btn" onClick={()=>setSc("pick")}>← Назад</button>
      <div className="card">
        <Logo />
        <h2 style={{marginBottom:"4px"}}>Тарифы</h2>
        <p style={{color:C.muted,fontSize:"0.85rem",marginBottom:"20px"}}>Выбери план — оплата после триала</p>

        {/* Trial block */}
        <div style={{background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.2)",borderRadius:"16px",padding:"16px",marginBottom:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem"}}>🎁 Пробный период</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",color:"#4ade80",lineHeight:1}}>$0<span style={{fontSize:"0.75rem",color:C.muted,fontFamily:"Jost,sans-serif"}}>/3 дня</span></div>
          </div>
          <div style={{fontSize:"0.78rem",color:C.muted}}>
            <span className="check">✓</span>Полный доступ &nbsp;
            <span className="check">✓</span>История чатов &nbsp;
            <span className="check">✓</span>Без списания сейчас
          </div>
        </div>

        <p style={{textAlign:"center",fontSize:"0.73rem",color:C.dim,marginBottom:"12px"}}>После триала выбери план ↓</p>

        {/* Monthly card */}
        <div className={`plan-card${plan==="monthly"?" sel":""}`} onClick={()=>setPlan("monthly")}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem"}}>Месячная подписка</div>
              <div style={{fontSize:"0.73rem",color:C.muted,marginTop:"2px"}}>Ежемесячная оплата</div>
            </div>
            <div style={{textAlign:"right"}}>
              <span className="price-big">$10</span>
              <div className="pperiod">/мес</div>
            </div>
          </div>
          {plan==="monthly" && (
            <div style={{marginTop:"10px",fontSize:"0.78rem",color:C.muted,lineHeight:1.65}}>
              <span className="check">✓</span>Неограниченный чат<br/>
              <span className="check">✓</span>Все подружки<br/>
              <span className="check">✓</span>История переписки
            </div>
          )}
        </div>

        {/* Annual card */}
        <div className={`plan-card best${plan==="annual"?" sel":""}`} onClick={()=>setPlan("annual")}>
          <div className="best-badge">Выгоднее</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",color:C.gold}}>Годовая подписка</div>
              <div style={{fontSize:"0.73rem",color:C.muted,marginTop:"2px"}}>$8.33/мес · экономия 17%</div>
            </div>
            <div style={{textAlign:"right"}}>
              <span className="price-big" style={{color:C.gold}}>$100</span>
              <div className="pperiod">/год</div>
            </div>
          </div>
          {plan==="annual" && (
            <div style={{marginTop:"10px",fontSize:"0.78rem",color:C.muted,lineHeight:1.65}}>
              <span className="check">✓</span>Всё из месячного<br/>
              <span className="check">✓</span>Приоритетная поддержка<br/>
              <span className="check">✓</span>Ранний доступ к функциям
            </div>
          )}
        </div>

        {/* ── Кнопка оплаты — <a> тег для надёжного редиректа ── */}
        {hasLink ? (
          <a
            className={`stripe-link ${plan==="annual"?"stripe-link-gold":"stripe-link-p"}`}
            href={stripeHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            🔒 Оплатить через Stripe → {plan==="annual"?"$100/год":"$10/мес"}
          </a>
        ) : (
          <div style={{marginBottom:"10px"}}>
            <div className="warn-box">
              ⚙️ <strong>Payment Link не добавлен.</strong><br/>
              Создай ссылки на <strong>dashboard.stripe.com/test/payment-links</strong> и вставь в переменные <code>LINK_MONTHLY</code> и <code>LINK_ANNUAL</code> в коде.
            </div>
            <button className="btn btn-g" disabled style={{opacity:0.4,cursor:"not-allowed"}}>
              🔒 Оплатить через Stripe (ссылка не настроена)
            </button>
          </div>
        )}

        <p style={{textAlign:"center",fontSize:"0.71rem",color:C.dim,lineHeight:1.65,marginBottom:"16px"}}>
          Ты будешь перенаправлена на страницу Stripe.<br/>
          Списание только после 3 дней триала · Отмена в любой момент.
        </p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"16px",marginBottom:"16px"}}>
          {["🔒 SSL","💳 Visa · MC","🛡 Stripe Secure"].map(t=>(
            <span key={t} style={{fontSize:"0.72rem",color:C.dim}}>{t}</span>
          ))}
        </div>
        <div className="divider"/>
        <button className="btn btn-d" onClick={()=>setSc("pick")}>← Вернуться без подписки</button>
        <p style={{fontSize:"0.71rem",color:C.dim,textAlign:"center",marginTop:"8px"}}>Без подписки чат недоступен после 3 дней</p>
      </div>
    </div>
  );

  // ── RANDOM GF ──
  if (sc==="random") return (
    <div className="screen"><style>{css}</style>
      <button className="back-btn" onClick={()=>setSc("pick")}>← Назад</button>
      <div className="card">
        <div className="avatar">{gf?.emoji}</div>
        <div style={{textAlign:"center",marginBottom:"18px"}}>
          <h2>{gf?.name}, {gf?.age}</h2>
          <p style={{color:C.muted,fontSize:"0.82rem",marginTop:"4px"}}>{gf?.sign} · {gf?.eyes} · {gf?.hair}</p>
          <div className="tags" style={{justifyContent:"center",marginTop:"10px"}}>
            {gf?.interests.map(i=><span key={i} className="tag">{i}</span>)}
            <span className="tag" style={{background:"rgba(244,114,182,0.1)",color:C.rose,borderColor:"rgba(244,114,182,0.28)"}}>{gf?.mbti}</span>
          </div>
        </div>
        <div style={{background:C.high,borderRadius:"12px",padding:"13px 15px",marginBottom:"14px",border:`1px solid ${C.border}`}}>
          <p style={{fontSize:"0.86rem",lineHeight:1.65,color:C.muted}}>{gf?.bio}</p>
        </div>
        <div style={{background:C.accentSoft,borderRadius:"10px",padding:"9px 13px",marginBottom:"16px",border:`1px solid rgba(181,123,238,0.2)`}}>
          <p style={{fontSize:"0.78rem",color:C.accent}}>Тон: <strong style={{textTransform:"capitalize"}}>{gf?.tone}</strong></p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          <button className="btn btn-p" onClick={()=>startChat(gf)}>💬 Начать чат</button>
          <button className="btn btn-g" onClick={nextRandom}>🎲 Следующая</button>
          <button className="btn btn-g" onClick={()=>setSc("create")}>✏️ Создать свою</button>
        </div>
      </div>
    </div>
  );

  // ── CREATE ──
  if (sc==="create") return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"48px"}}><style>{css}</style>
      <button className="back-btn" onClick={()=>setSc("pick")}>← Назад</button>
      <div className="card">
        <Logo />
        <h2 style={{marginBottom:"4px"}}>Создай<br/><em style={{color:C.accent,fontStyle:"italic"}}>родственную душу</em></h2>
        <p style={{color:C.muted,fontSize:"0.82rem",marginBottom:"20px"}}>Все поля необязательны.</p>
        <div className="si">
          <div className="fgrid">
            {[["Имя","name","text"],["Возраст","age","number"],["Цвет глаз","eyes","text"],["Цвет волос","hair","text"]].map(([l,k,t])=>(
              <div key={k}><label className="fl">{l}</label>
              <input className="input" type={t} placeholder={k==="name"?"Luna":"—"} value={custom[k]} onChange={e=>setCustom({...custom,[k]:e.target.value})}/></div>
            ))}
            <div><label className="fl">Знак зодиака</label>
              <select className="input" value={custom.sign} onChange={e=>setCustom({...custom,sign:e.target.value})}>
                <option value="">Любой</option>
                {["Овен","Телец","Близнецы","Рак","Лев","Дева","Весы","Скорпион","Стрелец","Козерог","Водолей","Рыбы"].map(s=><option key={s}>{s}</option>)}
              </select></div>
            <div><label className="fl">Хобби</label>
              <input className="input" placeholder="чтение, йога..." value={custom.hobby} onChange={e=>setCustom({...custom,hobby:e.target.value})}/></div>
          </div>
          <div style={{marginTop:"14px"}}><label className="fl" style={{marginBottom:"8px"}}>Тон общения</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
              {TONES.map(t=><button key={t} className={`pill${custom.tone===t?" active":""}`} style={{flex:"0 0 auto",width:"calc(33% - 5px)"}} onClick={()=>setCustom({...custom,tone:t})}>{t}</button>)}
            </div></div>
          <div style={{marginTop:"20px"}}>
            <button className="btn btn-p" onClick={()=>{
              startChat({id:99,name:custom.name||"Luna",emoji:"💫",age:custom.age||"23",sign:custom.sign||"Весы",eyes:custom.eyes||"карие",hair:custom.hair||"тёмные",tone:custom.tone,bio:"Уникальная душа, созданная для тебя.",interests:custom.hobby?custom.hobby.split(",").map(h=>h.trim()):["Музыка"],mbti:"?"});
            }}>✨ Создать и начать чат</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── CHAT ──
  if (sc==="chat") return (
    <div style={{height:"100vh",background:C.bg,display:"flex",flexDirection:"column",maxWidth:"500px",margin:"0 auto"}}><style>{css}</style>
      <div className="chat-hdr">
        <div className="avatar" style={{width:"38px",height:"38px",fontSize:"1.1rem",margin:"0"}}>{gf?.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:"500",fontSize:"0.92rem"}}>{gf?.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            <div className="odot"/>
            <span style={{fontSize:"0.72rem",color:C.muted}}>Онлайн</span>
            {dbSt==="saving"&&<span className="sbs sbs-sv">⏳</span>}
            {dbSt==="saved"&&<span className="sbs sbs-ok">✓ Supabase</span>}
            {dbSt==="err"&&<span className="sbs sbs-er">⚠ нет таблицы</span>}
          </div>
        </div>
        <button className="btn btn-d btn-sm" style={{width:"auto"}} onClick={()=>setSc("pick")}>Выйти</button>
      </div>
      <div className="chat-msgs">
        {hLoad
          ? <div style={{textAlign:"center",color:C.muted,fontSize:"0.85rem",padding:"40px 0"}}>⏳ Загружаем историю...</div>
          : msgs.map((m,i)=><div key={i} className={`msg ${m.role==="ai"?"msg-ai":"msg-usr"}`}>{m.text}</div>)
        }
        {typing&&<div className="msg msg-ai"><div className="typing"><span/><span/><span/></div></div>}
        <div ref={msgEnd}/>
      </div>
      <div className="sb-bar">
        <span style={{fontSize:"0.67rem",color:C.dim}}>💾 <span style={{color:C.accent,fontFamily:"monospace"}}>{sid?.slice(-6)}</span></span>
        <span style={{fontSize:"0.67rem",color:C.muted}}>Сохранено: <strong style={{color:C.accent}}>{saved}</strong></span>
      </div>
      <div className="chat-ir">
        <textarea className="chat-ta" rows={1} placeholder="Сообщение..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={hk}/>
        <button className="send-btn" onClick={send}>➤</button>
      </div>
    </div>
  );

  // ── DB VIEWER ──
  if (sc==="dbv") return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"48px"}}><style>{css}</style>
      <button className="back-btn" onClick={()=>setSc("pick")}>← Назад</button>
      <div className="card" style={{maxWidth:"540px"}}>
        <Logo />
        <h2 style={{marginBottom:"6px"}}>База данных</h2>
        <p style={{color:C.muted,fontSize:"0.83rem",marginBottom:"14px"}}>Таблица <code style={{color:C.accent}}>messages</code></p>
        <div className="ibox"><strong>user_id:</strong> <span style={{color:C.accent,fontFamily:"monospace",fontSize:"0.79rem"}}>{UID}</span></div>
        <button className="btn btn-p" style={{marginBottom:"16px"}} onClick={async()=>{const d=await sbSelect("messages",`user_id=eq.${UID}`);setDbMsgs(d);}}>
          🔄 Загрузить мои сообщения
        </button>
        {dbMsgs.length>0
          ? <div className="si"><p className="stitle">Найдено {dbMsgs.length} записей</p>
              {dbMsgs.map((m,i)=>(
                <div key={i} style={{padding:"9px 12px",background:C.high,borderRadius:"10px",marginBottom:"7px",border:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                    <span className="tag" style={{fontSize:"0.67rem",background:m.role==="user"?"rgba(192,132,252,0.15)":"rgba(74,222,128,0.1)",color:m.role==="user"?C.accent:"#4ade80"}}>{m.role}</span>
                    <span style={{fontSize:"0.67rem",color:C.dim,fontFamily:"monospace"}}>{m.session_id?.slice(-8)}</span>
                  </div>
                  <p style={{fontSize:"0.82rem",color:C.muted,lineHeight:1.5}}>{m.text}</p>
                </div>
              ))}</div>
          : <div style={{textAlign:"center",color:C.dim,fontSize:"0.82rem",padding:"18px 0"}}>Нажми кнопку выше.<br/><span style={{fontSize:"0.74rem"}}>Данные появятся после первого чата.</span></div>
        }
      </div>
    </div>
  );

  // ── ADMIN ──
  if (sc==="admin") return (
    <div className="screen" style={{justifyContent:"flex-start",paddingTop:"48px"}}><style>{css}</style>
      <button className="back-btn" onClick={()=>setSc("pick")}>← Назад</button>
      <div className="card" style={{maxWidth:"540px"}}>
        <Logo />
        <h2 style={{marginBottom:"18px"}}>Админ панель</h2>
        <div className="nav-tabs">
          {["Обзор","Юзеры","Доходы","Чаты"].map((t,i)=>{
            const k=["overview","users","revenue","chats"][i];
            return <div key={k} className={`nav-tab${adminTab===k?" active":""}`} onClick={()=>setAdminTab(k)}>{t}</div>;
          })}
        </div>
        {adminTab==="overview"&&<div>
          <div className="stat-grid">
            {[["1 284","Пользователей"],["847","Подписок"],["$8 470","MRR"],["3 921","Чатов"]].map(([n,l])=>(
              <div key={l} className="stat-card"><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
          <div className="divider"/><p className="stitle">Последние</p>
          {["alex.m","luna_99","xo_sarah","dev_mike"].map(u=>(
            <div key={u} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`,fontSize:"0.83rem"}}>
              <span style={{color:C.muted}}>@{u}</span><span className="tag" style={{fontSize:"0.7rem"}}>Пробный</span>
            </div>
          ))}
        </div>}
        {adminTab==="users"&&<div>
          <input className="input" placeholder="Поиск..." style={{marginBottom:"12px"}}/>
          {[["alex.m","Pro","$10/мес"],["luna_99","Пробный","—"],["xo_sarah","Годовой","$100/год"],["dev_mike","Отписался","—"]].map(([u,p,r])=>(
            <div key={u} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.border}`,fontSize:"0.83rem"}}>
              <span>@{u}</span><div style={{display:"flex",gap:"9px"}}><span className="tag" style={{fontSize:"0.7rem"}}>{p}</span><span style={{color:C.muted}}>{r}</span></div>
            </div>
          ))}
        </div>}
        {adminTab==="revenue"&&<div>
          <div className="stat-grid">
            {[["$8 470","MRR"],["$101 640","ARR"],["847","Платящих"],["$10.01","ARPU"]].map(([n,l])=>(
              <div key={l} className="stat-card"><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
          <div className="divider"/>
          {[["Месячный $10","75%"],["Годовой $100","25%"]].map(([p,pct])=>(
            <div key={p} style={{marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px",fontSize:"0.83rem"}}><span>{p}</span><span style={{color:C.muted}}>{pct}</span></div>
              <div style={{height:"5px",background:C.high,borderRadius:"3px"}}><div style={{height:"100%",width:pct,background:`linear-gradient(90deg,#c084fc,${C.rose})`,borderRadius:"3px"}}/></div>
            </div>
          ))}
        </div>}
        {adminTab==="chats"&&<div>
          <div className="stat-grid" style={{marginBottom:"14px"}}>
            {[["3 921","Чатов"],["24 мин","Сессия"]].map(([n,l])=>(
              <div key={l} className="stat-card"><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
          {GFS.map(g=>(
            <div key={g.id} style={{display:"flex",alignItems:"center",gap:"11px",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:"1.3rem"}}>{g.emoji}</span>
              <div style={{flex:1}}><div style={{fontSize:"0.88rem"}}>{g.name}</div><div style={{fontSize:"0.73rem",color:C.muted}}>{g.tone}</div></div>
              <span className="tag" style={{fontSize:"0.7rem"}}>{g.mbti}</span>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );

  return null;
}
