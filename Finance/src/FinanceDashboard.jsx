import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── Static data ─── */
const INITIAL_TRANSACTIONS = [
  { id: 1,  date: "2025-01-05", description: "Salary",            amount:  85000, category: "Income",        type: "income"  },
  { id: 2,  date: "2025-01-08", description: "Rent Payment",      amount: -22000, category: "Housing",       type: "expense" },
  { id: 3,  date: "2025-01-12", description: "Grocery Store",     amount:  -3200, category: "Food",          type: "expense" },
  { id: 4,  date: "2025-01-15", description: "Netflix",           amount:   -649, category: "Entertainment", type: "expense" },
  { id: 5,  date: "2025-01-18", description: "Freelance Project", amount:  18000, category: "Income",        type: "income"  },
  { id: 6,  date: "2025-01-20", description: "Electricity Bill",  amount:  -2100, category: "Utilities",     type: "expense" },
  { id: 7,  date: "2025-01-22", description: "Restaurant Dinner", amount:  -1800, category: "Food",          type: "expense" },
  { id: 8,  date: "2025-01-25", description: "Petrol",            amount:  -1400, category: "Transport",     type: "expense" },
  { id: 9,  date: "2025-02-05", description: "Salary",            amount:  85000, category: "Income",        type: "income"  },
  { id: 10, date: "2025-02-07", description: "Rent Payment",      amount: -22000, category: "Housing",       type: "expense" },
  { id: 11, date: "2025-02-10", description: "Grocery Store",     amount:  -2900, category: "Food",          type: "expense" },
  { id: 12, date: "2025-02-14", description: "Valentine's Dinner",amount:  -3200, category: "Food",          type: "expense" },
  { id: 13, date: "2025-02-16", description: "Gym Membership",    amount:  -1500, category: "Health",        type: "expense" },
  { id: 14, date: "2025-02-20", description: "Online Course",     amount:  -4999, category: "Education",     type: "expense" },
  { id: 15, date: "2025-02-22", description: "Freelance Project", amount:  22000, category: "Income",        type: "income"  },
  { id: 16, date: "2025-02-25", description: "Mobile Recharge",   amount:   -599, category: "Utilities",     type: "expense" },
  { id: 17, date: "2025-03-05", description: "Salary",            amount:  85000, category: "Income",        type: "income"  },
  { id: 18, date: "2025-03-07", description: "Rent Payment",      amount: -22000, category: "Housing",       type: "expense" },
  { id: 19, date: "2025-03-10", description: "Grocery Store",     amount:  -3500, category: "Food",          type: "expense" },
  { id: 20, date: "2025-03-13", description: "Doctor Visit",      amount:  -2500, category: "Health",        type: "expense" },
  { id: 21, date: "2025-03-15", description: "Consulting Income", amount:  30000, category: "Income",        type: "income"  },
  { id: 22, date: "2025-03-18", description: "New Shoes",         amount:  -4200, category: "Shopping",      type: "expense" },
  { id: 23, date: "2025-03-20", description: "Electricity Bill",  amount:  -1900, category: "Utilities",     type: "expense" },
  { id: 24, date: "2025-03-22", description: "Movie Tickets",     amount:   -800, category: "Entertainment", type: "expense" },
  { id: 25, date: "2025-03-25", description: "Uber Rides",        amount:  -1200, category: "Transport",     type: "expense" },
];

const CAT_COLORS = {
  Housing: "#534AB7", Food: "#D85A30", Income: "#1D9E75",
  Entertainment: "#D4537E", Utilities: "#BA7517", Health: "#378ADD",
  Education: "#639922", Transport: "#888780", Shopping: "#993556",
};

const ALL_CATEGORIES = ["Housing","Food","Entertainment","Utilities","Health","Education","Transport","Shopping","Income","Other"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmtShort = (n) => {
  const a = Math.abs(n);
  if (a >= 100000) return `₹${(a/100000).toFixed(1)}L`;
  if (a >= 1000)   return `₹${(a/1000).toFixed(1)}K`;
  return `₹${a}`;
};
const fmtFull = (n) =>
  new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

/* ─── Badge ─── */
function Badge({ type }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      background: type === "income" ? "#E1F5EE" : "#FAECE7",
      color:      type === "income" ? "#0F6E56"  : "#993C1D",
    }}>
      {type === "income" ? "↑ Income" : "↓ Expense"}
    </span>
  );
}

/* ─── Editable Stat Card ─── */
function StatCard({ label, value, sub, color, bg, editable, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState("");

  function startEdit() {
    if (!editable) return;
    setDraft(String(Math.abs(value)));
    setEditing(true);
  }
  function commit() {
    const n = parseFloat(draft);
    if (!isNaN(n)) onEdit(n);
    setEditing(false);
  }

  return (
    <div style={{
      background: bg, borderLeft: `4px solid ${color}`,
      borderRadius: 12, padding: "18px 20px", flex: 1, minWidth: 160,
    }}>
      <p style={{ margin:0, fontSize:11, fontWeight:700, letterSpacing:"0.07em",
        textTransform:"uppercase", color, opacity:0.85 }}>{label}</p>

      {editing ? (
        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8 }}>
          <span style={{ fontSize:18, fontWeight:700, color }}>₹</span>
          <input
            autoFocus
            type="number"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key==="Enter") commit(); if (e.key==="Escape") setEditing(false); }}
            style={{
              width:"100%", fontSize:20, fontWeight:700, color,
              background:"transparent", border:"none",
              borderBottom:`2px solid ${color}`, outline:"none", padding:"2px 0",
            }}
          />
        </div>
      ) : (
        <p
          onClick={startEdit}
          title={editable ? "Click to edit" : ""}
          style={{
            margin:"8px 0 2px", fontSize:26, fontWeight:800, color,
            fontFamily:"'DM Mono',monospace", letterSpacing:"-0.02em",
            cursor: editable ? "text" : "default",
            display:"flex", alignItems:"center", gap:6,
          }}
        >
          {fmtShort(value)}
          {editable && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          )}
        </p>
      )}
      {sub && <p style={{ margin:0, fontSize:11, color, opacity:0.65 }}>{sub}</p>}
    </div>
  );
}

/* ─── Chart Tooltip ─── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:"#1a192b", border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:8, padding:"10px 14px", fontSize:12,
    }}>
      <p style={{ margin:"0 0 6px", fontWeight:700, color:"#fff" }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin:"2px 0", color: p.color }}>
          {p.name}: {fmtShort(p.value)}
        </p>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════ */
export default function FinanceDashboard() {
  const [role,           setRole]           = useState("viewer");
  const [activeTab,      setActiveTab]      = useState("overview");
  const [transactions,   setTransactions]   = useState(INITIAL_TRANSACTIONS);
  const [filterType,     setFilterType]     = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortField,      setSortField]      = useState("date");
  const [sortDir,        setSortDir]        = useState("desc");
  const [search,         setSearch]         = useState("");
  const [showModal,      setShowModal]      = useState(false);
  const [editTx,         setEditTx]         = useState(null);
  const [form, setForm] = useState({ date:"", description:"", amount:"", category:"Food", type:"expense" });

  const isAdmin = role === "admin";

  /* derived */
  const totalIncome   = useMemo(() => transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0),          [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+Math.abs(t.amount),0),[transactions]);
  const balance       = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? Math.round((balance/totalIncome)*100) : 0;

  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const d   = new Date(t.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!map[key]) map[key] = { month: MONTHS[d.getMonth()], income:0, expenses:0, year:d.getFullYear() };
      if (t.type==="income") map[key].income   += t.amount;
      else                   map[key].expenses += Math.abs(t.amount);
    });
    return Object.values(map)
      .sort((a,b)=>a.year-b.year || MONTHS.indexOf(a.month)-MONTHS.indexOf(b.month))
      .map(m=>({...m, balance: m.income-m.expenses}));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t=>t.type==="expense").forEach(t=>{
      map[t.category] = (map[t.category]||0) + Math.abs(t.amount);
    });
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  }, [transactions]);

  const allCategories = useMemo(()=>[...new Set(transactions.map(t=>t.category))],[transactions]);

  const filteredTx = useMemo(() => {
    let list = [...transactions];
    if (filterType!=="all")     list = list.filter(t=>t.type===filterType);
    if (filterCategory!=="all") list = list.filter(t=>t.category===filterCategory);
    if (search) list = list.filter(t=>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a,b)=>{
      let av=a[sortField], bv=b[sortField];
      if (sortField==="amount"){ av=Math.abs(av); bv=Math.abs(bv); }
      return sortDir==="asc"?(av<bv?-1:av>bv?1:0):(av>bv?-1:av<bv?1:0);
    });
    return list;
  }, [transactions,filterType,filterCategory,search,sortField,sortDir]);

  /* handlers */
  function handleSort(f){
    if (sortField===f) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortField(f); setSortDir("desc"); }
  }
  function openAdd(){
    setEditTx(null);
    setForm({date:"",description:"",amount:"",category:"Food",type:"expense"});
    setShowModal(true);
  }
  function openEdit(tx){
    setEditTx(tx);
    setForm({date:tx.date,description:tx.description,amount:String(Math.abs(tx.amount)),category:tx.category,type:tx.type});
    setShowModal(true);
  }
  function handleSave(){
    if (!form.date||!form.description||!form.amount) return;
    const amount = parseFloat(form.amount)*(form.type==="expense"?-1:1);
    if (editTx) setTransactions(ts=>ts.map(t=>t.id===editTx.id?{...t,...form,amount}:t));
    else        setTransactions(ts=>[...ts,{id:Date.now(),...form,amount}]);
    setShowModal(false);
  }
  function handleDelete(id){ setTransactions(ts=>ts.filter(t=>t.id!==id)); }

  /* inline card edit: scale transactions proportionally */
  function editIncome(n){
    const scale = totalIncome>0 ? n/totalIncome : 1;
    setTransactions(ts=>ts.map(t=>t.type==="income"?{...t,amount:Math.round(t.amount*scale)}:t));
  }
  function editExpenses(n){
    const scale = totalExpenses>0 ? n/totalExpenses : 1;
    setTransactions(ts=>ts.map(t=>t.type==="expense"?{...t,amount:Math.round(t.amount*scale)}:t));
  }
  function editBalance(n){
    const diff=n-balance, newInc=totalIncome+diff;
    const scale=totalIncome>0?newInc/totalIncome:1;
    setTransactions(ts=>ts.map(t=>t.type==="income"?{...t,amount:Math.round(t.amount*scale)}:t));
  }

  /* theme tokens */
  const NAV_BG  = "#0f0e17";
  const SIDEBAR = "#13121f";
  const CONTENT = "#1a192b";
  const CARD    = "#211f33";
  const BORDER  = "rgba(255,255,255,0.07)";
  const TEXT    = "#e8e6f0";
  const MUTED   = "#8b89a0";

  const tabBtn = (t) => ({
    display:"flex", alignItems:"center", gap:8,
    padding:"10px 14px", borderRadius:8, border:"none",
    cursor:"pointer", width:"100%", textAlign:"left",
    fontWeight: activeTab===t?700:400, fontSize:13,
    background: activeTab===t?"rgba(83,74,183,0.25)":"transparent",
    color:      activeTab===t?"#a89cf7":MUTED,
    transition:"all .15s",
  });

  const inputStyle = {
    width:"100%", border:`1px solid ${BORDER}`, borderRadius:8,
    padding:"9px 12px", fontSize:13, background:"rgba(255,255,255,0.05)",
    color:TEXT, boxSizing:"border-box", outline:"none",
  };

  const thS = (f) => ({
    padding:"10px 12px", fontSize:11, fontWeight:700, letterSpacing:"0.06em",
    textTransform:"uppercase", color:MUTED, cursor:"pointer",
    userSelect:"none", whiteSpace:"nowrap", textAlign:"left",
    background: sortField===f?"rgba(83,74,183,0.12)":"transparent",
  });

  const navIcons = {
    overview:     "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
    transactions: null,
    insights:     null,
  };

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      height:"100vh", width:"100vw",
      background:NAV_BG, fontFamily:"'DM Sans',system-ui,sans-serif",
      color:TEXT, overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:4px;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        tbody tr:hover td{background:rgba(255,255,255,0.025);}
        select option{background:#1a192b;color:#e8e6f0;}
      `}</style>

      {/* ── TOP NAVBAR ── */}
      <header style={{
        background:NAV_BG, borderBottom:`1px solid ${BORDER}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px", height:52, flexShrink:0, zIndex:10,
      }}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,background:"#534AB7",borderRadius:7,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em"}}>FinTrack</span>
        </div>

        {/* Centre pills */}
        <div style={{display:"flex",gap:8}}>
          {[
            {label:"Balance", val:balance,       color:"#a89cf7"},
            {label:"Income",  val:totalIncome,   color:"#5DD4A8"},
            {label:"Expense", val:totalExpenses, color:"#F08060"},
          ].map(p=>(
            <div key={p.label} style={{
              background:"rgba(255,255,255,0.05)",border:`1px solid ${BORDER}`,
              borderRadius:20,padding:"3px 12px",display:"flex",gap:6,alignItems:"center",
            }}>
              <span style={{fontSize:10,color:MUTED,fontWeight:700,letterSpacing:"0.05em"}}>{p.label}</span>
              <span style={{fontSize:12,fontWeight:800,color:p.color,fontFamily:"DM Mono"}}>{fmtShort(p.val)}</span>
            </div>
          ))}
        </div>

        {/* Role selector */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:MUTED}}>Role:</span>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{
            background:"rgba(255,255,255,0.08)",border:`1px solid ${BORDER}`,
            borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:700,color:TEXT,cursor:"pointer",
          }}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          {isAdmin&&<span style={{
            background:"rgba(83,74,183,0.35)",color:"#a89cf7",
            fontSize:9,fontWeight:800,padding:"3px 8px",borderRadius:20,letterSpacing:"0.08em",
          }}>ADMIN</span>}
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* SIDEBAR */}
        <aside style={{
          width:190,background:SIDEBAR,borderRight:`1px solid ${BORDER}`,
          display:"flex",flexDirection:"column",padding:"14px 10px",flexShrink:0,
        }}>
          <p style={{fontSize:9,fontWeight:800,color:MUTED,letterSpacing:"0.1em",
            textTransform:"uppercase",marginBottom:8,paddingLeft:4}}>Menu</p>

          {[
            {id:"overview",    label:"Overview",     icon:<><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>},
            {id:"transactions",label:"Transactions",  icon:<><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/></>},
            {id:"insights",    label:"Insights",      icon:<><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2"/></>},
          ].map(({id,label,icon})=>(
            <button key={id} onClick={()=>setActiveTab(id)} style={tabBtn(id)}>
              <svg width="14" height="14" viewBox="0 0 24 24">{icon}</svg>
              {label}
            </button>
          ))}

          <div style={{marginTop:"auto",paddingTop:14,borderTop:`1px solid ${BORDER}`}}>
            <p style={{fontSize:9,fontWeight:800,color:MUTED,letterSpacing:"0.1em",
              textTransform:"uppercase",marginBottom:8,paddingLeft:4}}>Quick Stats</p>
            {[
              {l:"Total Txns",  v:transactions.length},
              {l:"Categories",  v:allCategories.length},
              {l:"Savings",     v:`${savingsRate}%`},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",
                padding:"5px 4px",fontSize:11}}>
                <span style={{color:MUTED}}>{s.l}</span>
                <span style={{fontWeight:700,color:TEXT}}>{s.v}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <main style={{flex:1,overflowY:"auto",background:CONTENT,padding:"20px"}}>

          {/* ══ OVERVIEW ══ */}
          {activeTab==="overview" && (
            <div>
              {/* Stat cards */}
              <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
                <StatCard label="Total Balance"  value={balance}       sub={`${savingsRate}% savings rate`}
                  color="#a89cf7" bg="rgba(83,74,183,0.15)" editable={isAdmin} onEdit={editBalance}/>
                <StatCard label="Total Income"   value={totalIncome}   sub={`${transactions.filter(t=>t.type==="income").length} txns`}
                  color="#5DD4A8" bg="rgba(29,158,117,0.15)" editable={isAdmin} onEdit={editIncome}/>
                <StatCard label="Total Expenses" value={totalExpenses} sub={`${transactions.filter(t=>t.type==="expense").length} txns`}
                  color="#F08060" bg="rgba(216,90,48,0.15)" editable={isAdmin} onEdit={editExpenses}/>
                <StatCard label="Net Cashflow"   value={balance}       sub={balance>=0?"Positive cashflow":"Deficit period"}
                  color={balance>=0?"#5DD4A8":"#F08060"} bg={balance>=0?"rgba(29,158,117,0.12)":"rgba(216,90,48,0.12)"}
                  editable={false} onEdit={()=>{}}/>
              </div>

              {/* Charts row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {/* Line */}
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"16px 16px 10px"}}>
                  <p style={{fontWeight:700,fontSize:13,color:TEXT,marginBottom:12}}>Monthly Trend</p>
                  <ResponsiveContainer width="100%" height={190}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                      <XAxis dataKey="month" tick={{fontSize:10,fill:MUTED}} axisLine={false} tickLine={false}/>
                      <YAxis tickFormatter={fmtShort} tick={{fontSize:10,fill:MUTED}} axisLine={false} tickLine={false} width={46}/>
                      <Tooltip content={<ChartTooltip/>}/>
                      <Line type="monotone" dataKey="income"   stroke="#5DD4A8" strokeWidth={2} dot={{r:3}} name="Income"/>
                      <Line type="monotone" dataKey="expenses" stroke="#F08060" strokeWidth={2} dot={{r:3}} name="Expenses"/>
                      <Line type="monotone" dataKey="balance"  stroke="#a89cf7" strokeWidth={2.5} strokeDasharray="5 3" dot={{r:3}} name="Balance"/>
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{display:"flex",gap:12,marginTop:8}}>
                    {[["Income","#5DD4A8"],["Expenses","#F08060"],["Balance","#a89cf7"]].map(([l,c])=>(
                      <span key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:MUTED}}>
                        <span style={{width:8,height:8,borderRadius:2,background:c}}/>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pie */}
                <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"16px 16px 10px"}}>
                  <p style={{fontWeight:700,fontSize:13,color:TEXT,marginBottom:12}}>Spending Breakdown</p>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <ResponsiveContainer width="45%" height={180}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={68}
                          paddingAngle={2} dataKey="value">
                          {categoryData.map(e=>(
                            <Cell key={e.name} fill={CAT_COLORS[e.name]||"#888"}/>
                          ))}
                        </Pie>
                        <Tooltip formatter={v=>fmtFull(v)}
                          contentStyle={{background:"#1a192b",border:`1px solid ${BORDER}`,borderRadius:8}}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
                      {categoryData.slice(0,7).map(d=>(
                        <div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{width:7,height:7,borderRadius:2,flexShrink:0,background:CAT_COLORS[d.name]||"#888"}}/>
                            <span style={{fontSize:10,color:MUTED}}>{d.name}</span>
                          </div>
                          <span style={{fontSize:10,fontWeight:700,color:TEXT,fontFamily:"DM Mono"}}>{fmtShort(d.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"16px 16px 10px"}}>
                <p style={{fontWeight:700,fontSize:13,color:TEXT,marginBottom:12}}>Monthly Comparison</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={monthlyData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                    <XAxis dataKey="month" tick={{fontSize:10,fill:MUTED}} axisLine={false} tickLine={false}/>
                    <YAxis tickFormatter={fmtShort} tick={{fontSize:10,fill:MUTED}} axisLine={false} tickLine={false} width={46}/>
                    <Tooltip content={<ChartTooltip/>}/>
                    <Bar dataKey="income"   fill="#5DD4A8" radius={[4,4,0,0]} name="Income"/>
                    <Bar dataKey="expenses" fill="#F08060" radius={[4,4,0,0]} name="Expenses"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ══ TRANSACTIONS ══ */}
          {activeTab==="transactions" && (
            <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 52px - 40px)"}}>
              {/* Filters */}
              <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search by name or category..."
                  style={{...inputStyle,flex:1,minWidth:180}}/>
                <select value={filterType} onChange={e=>setFilterType(e.target.value)}
                  style={{...inputStyle,width:"auto",cursor:"pointer"}}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select value={filterCategory} onChange={e=>setFilterCategory(e.target.value)}
                  style={{...inputStyle,width:"auto",cursor:"pointer"}}>
                  <option value="all">All Categories</option>
                  {allCategories.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                {isAdmin&&(
                  <button onClick={openAdd} style={{
                    background:"#534AB7",color:"#fff",border:"none",
                    borderRadius:8,padding:"9px 18px",fontSize:13,fontWeight:700,
                    cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,
                  }}>+ Add Transaction</button>
                )}
              </div>

              {/* Table */}
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,
                overflow:"hidden",flex:1,display:"flex",flexDirection:"column"}}>
                {filteredTx.length===0?(
                  <div style={{flex:1,display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",color:MUTED}}>
                    <p style={{fontSize:34,marginBottom:8}}>🔍</p>
                    <p style={{fontWeight:700,fontSize:15,color:TEXT}}>No transactions found</p>
                    <p style={{fontSize:12,marginTop:4}}>Try adjusting your filters</p>
                  </div>
                ):(
                  <div style={{overflowX:"auto",overflowY:"auto",flex:1}}>
                    <table style={{width:"100%",borderCollapse:"collapse",minWidth:560}}>
                      <thead style={{position:"sticky",top:0,background:CARD,zIndex:2}}>
                        <tr style={{borderBottom:`1px solid ${BORDER}`}}>
                          {[["date","Date"],["description","Description"],["category","Category"],
                            ["type","Type"],["amount","Amount"]].map(([f,l])=>(
                            <th key={f} style={thS(f)} onClick={()=>handleSort(f)}>
                              {l}{sortField===f?(sortDir==="asc"?" ↑":" ↓"):""}
                            </th>
                          ))}
                          {isAdmin&&<th style={{...thS(""),cursor:"default"}}>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTx.map(tx=>(
                          <tr key={tx.id} style={{borderBottom:`1px solid ${BORDER}`}}>
                            <td style={{padding:"10px 12px",fontSize:12,color:MUTED,fontFamily:"DM Mono",whiteSpace:"nowrap"}}>
                              {new Date(tx.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                            </td>
                            <td style={{padding:"10px 12px",fontSize:13,color:TEXT,fontWeight:500}}>{tx.description}</td>
                            <td style={{padding:"10px 12px"}}>
                              <span style={{
                                fontSize:11,padding:"2px 8px",borderRadius:4,fontWeight:700,
                                background:(CAT_COLORS[tx.category]||"#888")+"28",
                                color:CAT_COLORS[tx.category]||"#888",
                              }}>{tx.category}</span>
                            </td>
                            <td style={{padding:"10px 12px"}}><Badge type={tx.type}/></td>
                            <td style={{padding:"10px 12px",fontSize:13,fontWeight:800,
                              fontFamily:"DM Mono",textAlign:"right",whiteSpace:"nowrap",
                              color:tx.type==="income"?"#5DD4A8":"#F08060"}}>
                              {tx.type==="income"?"+":"-"}{fmtFull(Math.abs(tx.amount))}
                            </td>
                            {isAdmin&&(
                              <td style={{padding:"10px 12px",whiteSpace:"nowrap"}}>
                                <button onClick={()=>openEdit(tx)} style={{
                                  background:"rgba(83,74,183,0.2)",border:"1px solid rgba(83,74,183,0.35)",
                                  color:"#a89cf7",borderRadius:6,padding:"3px 10px",
                                  fontSize:11,fontWeight:600,cursor:"pointer",marginRight:6,
                                }}>Edit</button>
                                <button onClick={()=>handleDelete(tx.id)} style={{
                                  background:"rgba(240,128,96,0.15)",border:"1px solid rgba(240,128,96,0.3)",
                                  color:"#F08060",borderRadius:6,padding:"3px 10px",
                                  fontSize:11,fontWeight:600,cursor:"pointer",
                                }}>Delete</button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <p style={{fontSize:11,color:MUTED,marginTop:7}}>
                Showing {filteredTx.length} of {transactions.length} transactions
              </p>
            </div>
          )}

          {/* ══ INSIGHTS ══ */}
          {activeTab==="insights"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>

              {/* Top category */}
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
                <p style={{fontSize:9,fontWeight:800,color:MUTED,letterSpacing:"0.1em",
                  textTransform:"uppercase",marginBottom:4}}>Top Spending Category</p>
                {categoryData[0]?(()=>{
                  const top=categoryData[0];
                  const pct=Math.round((top.value/totalExpenses)*100);
                  return(
                    <>
                      <p style={{fontSize:30,fontWeight:800,color:CAT_COLORS[top.name]||"#888",
                        fontFamily:"DM Mono",margin:"10px 0 2px"}}>{fmtShort(top.value)}</p>
                      <p style={{fontSize:14,color:TEXT,fontWeight:600}}>on {top.name}</p>
                      <p style={{fontSize:11,color:MUTED,margin:"4px 0 12px"}}>{pct}% of total expenses</p>
                      <div style={{height:5,background:"rgba(255,255,255,0.08)",borderRadius:4}}>
                        <div style={{height:"100%",borderRadius:4,
                          background:CAT_COLORS[top.name]||"#888",width:`${pct}%`}}/>
                      </div>
                    </>
                  );
                })():<p style={{color:MUTED}}>No data</p>}
              </div>

              {/* Savings health */}
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20}}>
                <p style={{fontSize:9,fontWeight:800,color:MUTED,letterSpacing:"0.1em",
                  textTransform:"uppercase",marginBottom:4}}>Savings Health</p>
                {(()=>{
                  const [lbl,clr]=savingsRate>=30?["Excellent","#5DD4A8"]:
                    savingsRate>=20?["Good","#a89cf7"]:
                    savingsRate>=10?["Fair","#F0C060"]:["Needs Work","#F08060"];
                  return(
                    <>
                      <p style={{fontSize:30,fontWeight:800,color:clr,fontFamily:"DM Mono",margin:"10px 0 2px"}}>{savingsRate}%</p>
                      <p style={{fontSize:14,color:TEXT,fontWeight:600}}>savings rate — {lbl}</p>
                      <p style={{fontSize:11,color:MUTED,margin:"4px 0 12px"}}>
                        Saving {fmtShort(balance)} of {fmtShort(totalIncome)} earned
                      </p>
                      <div style={{height:5,background:"rgba(255,255,255,0.08)",borderRadius:4}}>
                        <div style={{height:"100%",borderRadius:4,background:clr,
                          width:`${Math.min(savingsRate,100)}%`}}/>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Month-over-month */}
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,gridColumn:"1/-1"}}>
                <p style={{fontSize:9,fontWeight:800,color:MUTED,letterSpacing:"0.1em",
                  textTransform:"uppercase",marginBottom:14}}>Month-over-Month</p>
                {monthlyData.map((m,i)=>{
                  const prev=monthlyData[i-1];
                  const expChg=prev?Math.round(((m.expenses-prev.expenses)/prev.expenses)*100):null;
                  return(
                    <div key={m.month} style={{
                      display:"flex",alignItems:"center",padding:"9px 0",gap:14,flexWrap:"wrap",
                      borderBottom:i<monthlyData.length-1?`1px solid ${BORDER}`:"none",
                    }}>
                      <span style={{width:30,fontSize:13,fontWeight:800,color:TEXT}}>{m.month}</span>
                      <span style={{fontSize:12,color:"#5DD4A8"}}>↑ {fmtShort(m.income)}</span>
                      <span style={{fontSize:12,color:"#F08060"}}>↓ {fmtShort(m.expenses)}</span>
                      <span style={{fontSize:13,fontWeight:800,marginLeft:"auto",fontFamily:"DM Mono",
                        color:m.balance>=0?"#a89cf7":"#F08060"}}>
                        Net {m.balance>=0?"+":""}{fmtShort(m.balance)}
                      </span>
                      {expChg!==null&&(
                        <span style={{
                          fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:800,
                          background:expChg>0?"rgba(240,128,96,0.15)":"rgba(93,212,168,0.15)",
                          color:expChg>0?"#F08060":"#5DD4A8",
                        }}>
                          {expChg>0?"+":""}{expChg}% vs prev
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* All categories */}
              <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:20,gridColumn:"1/-1"}}>
                <p style={{fontSize:9,fontWeight:800,color:MUTED,letterSpacing:"0.1em",
                  textTransform:"uppercase",marginBottom:16}}>All Spending Categories</p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {categoryData.map(d=>(
                    <div key={d.name}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <div style={{display:"flex",alignItems:"center",gap:7}}>
                          <span style={{width:8,height:8,borderRadius:2,background:CAT_COLORS[d.name]||"#888"}}/>
                          <span style={{fontSize:13,color:TEXT,fontWeight:500}}>{d.name}</span>
                        </div>
                        <span style={{fontSize:13,fontWeight:800,fontFamily:"DM Mono",
                          color:CAT_COLORS[d.name]||"#888"}}>{fmtFull(d.value)}</span>
                      </div>
                      <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:4}}>
                        <div style={{height:"100%",borderRadius:4,
                          background:CAT_COLORS[d.name]||"#888",
                          width:`${Math.round((d.value/categoryData[0].value)*100)}%`,
                          transition:"width .4s ease"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══ MODAL ══ */}
      {showModal&&(
        <div style={{
          position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16,
        }}>
          <div style={{
            background:"#1e1c30",border:`1px solid ${BORDER}`,borderRadius:16,
            padding:28,width:"100%",maxWidth:420,
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <p style={{fontWeight:800,fontSize:16,color:TEXT}}>
                {editTx?"Edit Transaction":"New Transaction"}
              </p>
              <button onClick={()=>setShowModal(false)}
                style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:MUTED,lineHeight:1}}>
                ×
              </button>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {label:"Description",key:"description",type:"text",   placeholder:"e.g. Grocery Store"},
                {label:"Date",       key:"date",       type:"date",   placeholder:""},
                {label:"Amount (₹)", key:"amount",     type:"number", placeholder:"0"},
              ].map(({label,key,type,placeholder})=>(
                <div key={key}>
                  <label style={{display:"block",fontSize:10,fontWeight:800,color:MUTED,
                    marginBottom:5,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>
                  <input type={type} value={form[key]}
                    onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                    placeholder={placeholder} style={{...inputStyle,borderColor:BORDER}}/>
                </div>
              ))}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[
                  {label:"Type",     key:"type",     options:[["expense","Expense"],["income","Income"]]},
                  {label:"Category", key:"category", options:ALL_CATEGORIES.map(c=>[c,c])},
                ].map(({label,key,options})=>(
                  <div key={key}>
                    <label style={{display:"block",fontSize:10,fontWeight:800,color:MUTED,
                      marginBottom:5,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>
                    <select value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                      style={{...inputStyle,cursor:"pointer"}}>
                      {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:10,marginTop:22}}>
              <button onClick={()=>setShowModal(false)} style={{
                flex:1,border:`1px solid ${BORDER}`,borderRadius:8,padding:"10px",
                fontSize:13,cursor:"pointer",background:"transparent",color:MUTED,fontWeight:600,
              }}>Cancel</button>
              <button onClick={handleSave} style={{
                flex:2,background:"#534AB7",border:"none",borderRadius:8,
                padding:"10px",fontSize:13,fontWeight:800,cursor:"pointer",color:"#fff",
              }}>{editTx?"Save Changes":"Add Transaction"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}