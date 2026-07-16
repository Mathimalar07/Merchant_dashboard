import React, { useMemo, useState } from "react";

/* ---------------------------------------------------------
   DESIGN TOKENS
--------------------------------------------------------- */
const T = {
  bg: "#0B0E14",
  panel: "#12161F",
  panel2: "#161B26",
  border: "#232A38",
  borderSoft: "#1B212C",
  text: "#E7EAF0",
  textMuted: "#8A93A6",
  textFaint: "#5A6376",
  accent: "#4C82FF",
  accentSoft: "#4C82FF22",
  critical: "#FF5C6C",
  criticalSoft: "#FF5C6C1A",
  high: "#FF9F45",
  highSoft: "#FF9F451A",
  medium: "#F0C93B",
  mediumSoft: "#F0C93B1A",
  low: "#3ED598",
  lowSoft: "#3ED5981A",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

/* ---------------------------------------------------------
   MERCHANT DATA — hand-authored, realistic small-book-of-business
--------------------------------------------------------- */
const RAW_MERCHANTS = [
  { id: "MX-1042", name: "Kettle & Vine", industry: "F&B / Cafes", segment: "SMB", tenureMonths: 8, planTier: "Growth", gmv30d: 18400, gmvTrendPct: -34, daysSinceLastTxn: 26, loginFrequency30d: 1, paymentFailureRatePct: 11.2, openSupportTickets: 3, negativeSentimentPct: 70, npsScore: -20, renewalInDays: 21, contact: "Priya N." },
  { id: "MX-2091", name: "Northline Hardware", industry: "Retail", segment: "SMB", tenureMonths: 22, planTier: "Standard", gmv30d: 44200, gmvTrendPct: -6, daysSinceLastTxn: 3, loginFrequency30d: 14, paymentFailureRatePct: 2.1, openSupportTickets: 0, negativeSentimentPct: 0, npsScore: 40, renewalInDays: 190, contact: "D. Alvarez" },
  { id: "MX-1876", name: "Verve Studio Fitness", industry: "Fitness", segment: "SMB", tenureMonths: 14, planTier: "Growth", gmv30d: 9800, gmvTrendPct: -41, daysSinceLastTxn: 34, loginFrequency30d: 0, paymentFailureRatePct: 4.5, openSupportTickets: 2, negativeSentimentPct: 55, npsScore: 10, renewalInDays: 9, contact: "R. Okafor" },
  { id: "MX-3310", name: "Bellhaven Dental Group", industry: "Healthcare", segment: "Mid-Market", tenureMonths: 31, planTier: "Pro", gmv30d: 128000, gmvTrendPct: 4, daysSinceLastTxn: 1, loginFrequency30d: 22, paymentFailureRatePct: 1.4, openSupportTickets: 1, negativeSentimentPct: 10, npsScore: 62, renewalInDays: 260, contact: "S. Whitfield" },
  { id: "MX-2214", name: "Paperclip & Co. Stationery", industry: "Retail", segment: "SMB", tenureMonths: 5, planTier: "Standard", gmv30d: 6200, gmvTrendPct: -18, daysSinceLastTxn: 9, loginFrequency30d: 6, paymentFailureRatePct: 9.8, openSupportTickets: 4, negativeSentimentPct: 65, npsScore: -10, renewalInDays: 45, contact: "T. Huang" },
  { id: "MX-4021", name: "Iron & Ember Fabrication", industry: "Manufacturing", segment: "Mid-Market", tenureMonths: 40, planTier: "Pro", gmv30d: 210500, gmvTrendPct: -2, daysSinceLastTxn: 2, loginFrequency30d: 18, paymentFailureRatePct: 0.8, openSupportTickets: 0, negativeSentimentPct: 0, npsScore: 55, renewalInDays: 300, contact: "M. Novak" },
  { id: "MX-1755", name: "Salt & Sage Market", industry: "F&B / Grocery", segment: "SMB", tenureMonths: 11, planTier: "Growth", gmv30d: 21300, gmvTrendPct: -12, daysSinceLastTxn: 5, loginFrequency30d: 9, paymentFailureRatePct: 3.2, openSupportTickets: 1, negativeSentimentPct: 20, npsScore: 25, renewalInDays: 120, contact: "K. Reyes" },
  { id: "MX-2988", name: "Bright Path Tutoring", industry: "Education", segment: "SMB", tenureMonths: 3, planTier: "Standard", gmv30d: 4100, gmvTrendPct: -55, daysSinceLastTxn: 41, loginFrequency30d: 0, paymentFailureRatePct: 6.0, openSupportTickets: 1, negativeSentimentPct: 40, npsScore: 0, renewalInDays: 14, contact: "J. Park" },
  { id: "MX-3467", name: "Coastal Rentals Co.", industry: "Real Estate", segment: "Mid-Market", tenureMonths: 26, planTier: "Pro", gmv30d: 96700, gmvTrendPct: -9, daysSinceLastTxn: 4, loginFrequency30d: 11, paymentFailureRatePct: 2.9, openSupportTickets: 2, negativeSentimentPct: 30, npsScore: 30, renewalInDays: 33, contact: "A. Feldman" },
  { id: "MX-1189", name: "Little Loom Studio", industry: "Retail / Crafts", segment: "SMB", tenureMonths: 6, planTier: "Standard", gmv30d: 2900, gmvTrendPct: -8, daysSinceLastTxn: 6, loginFrequency30d: 10, paymentFailureRatePct: 1.9, openSupportTickets: 0, negativeSentimentPct: 0, npsScore: 45, renewalInDays: 165, contact: "E. Sundberg" },
  { id: "MX-4502", name: "Union Street Barbers", industry: "Personal Care", segment: "SMB", tenureMonths: 18, planTier: "Growth", gmv30d: 13500, gmvTrendPct: -27, daysSinceLastTxn: 17, loginFrequency30d: 3, paymentFailureRatePct: 7.4, openSupportTickets: 2, negativeSentimentPct: 45, npsScore: 5, renewalInDays: 88, contact: "C. Boateng" },
  { id: "MX-2650", name: "Meridian Auto Detailing", industry: "Automotive", segment: "SMB", tenureMonths: 9, planTier: "Standard", gmv30d: 15800, gmvTrendPct: 6, daysSinceLastTxn: 2, loginFrequency30d: 16, paymentFailureRatePct: 2.0, openSupportTickets: 0, negativeSentimentPct: 0, npsScore: 50, renewalInDays: 210, contact: "L. Marceau" },
  { id: "MX-3785", name: "Hearth & Home Interiors", industry: "Home Goods", segment: "Mid-Market", tenureMonths: 15, planTier: "Pro", gmv30d: 61200, gmvTrendPct: -22, daysSinceLastTxn: 12, loginFrequency30d: 4, paymentFailureRatePct: 5.1, openSupportTickets: 3, negativeSentimentPct: 50, npsScore: -5, renewalInDays: 52, contact: "N. Ibrahim" },
  { id: "MX-1923", name: "Glass & Grain Brewing", industry: "F&B / Brewery", segment: "SMB", tenureMonths: 20, planTier: "Growth", gmv30d: 33900, gmvTrendPct: 2, daysSinceLastTxn: 1, loginFrequency30d: 20, paymentFailureRatePct: 1.1, openSupportTickets: 0, negativeSentimentPct: 0, npsScore: 58, renewalInDays: 275, contact: "F. Delgado" },
  { id: "MX-2777", name: "Pinnacle Physical Therapy", industry: "Healthcare", segment: "SMB", tenureMonths: 4, planTier: "Standard", gmv30d: 8700, gmvTrendPct: -19, daysSinceLastTxn: 8, loginFrequency30d: 7, paymentFailureRatePct: 4.0, openSupportTickets: 1, negativeSentimentPct: 25, npsScore: 15, renewalInDays: 335, contact: "G. Petrov" },
  { id: "MX-3199", name: "Wildflower Events Co.", industry: "Events", segment: "SMB", tenureMonths: 13, planTier: "Growth", gmv30d: 27600, gmvTrendPct: -48, daysSinceLastTxn: 23, loginFrequency30d: 1, paymentFailureRatePct: 8.6, openSupportTickets: 3, negativeSentimentPct: 60, npsScore: -15, renewalInDays: 18, contact: "H. Suzuki" },
];

/* ---------------------------------------------------------
   RISK SCORING ENGINE
--------------------------------------------------------- */
const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

function scoreMerchant(m) {
  const inactivity = clamp((m.daysSinceLastTxn / 30) * 100);
  const gmvDecline = m.gmvTrendPct < 0 ? clamp(-m.gmvTrendPct * 2.2) : 0;
  const paymentFriction = clamp(m.paymentFailureRatePct * 8);
  const supportLoad = clamp(m.openSupportTickets * 14 + m.negativeSentimentPct * 0.5);
  const engagementDrop = clamp((1 - m.loginFrequency30d / 22) * 100);
  const npsRisk = clamp((40 - m.npsScore) * 1.1);

  const weighted =
    inactivity * 0.25 +
    gmvDecline * 0.25 +
    paymentFriction * 0.15 +
    supportLoad * 0.15 +
    engagementDrop * 0.1 +
    npsRisk * 0.1;

  const score = Math.round(clamp(weighted));

  let tier = "Low";
  if (score >= 70) tier = "Critical";
  else if (score >= 50) tier = "High";
  else if (score >= 30) tier = "Medium";

  const renewalUrgent = m.renewalInDays <= 60 && score >= 45;

  return {
    score,
    tier,
    renewalUrgent,
    signals: [
      { key: "Inactivity", value: inactivity, weight: 0.25 },
      { key: "GMV decline", value: gmvDecline, weight: 0.25 },
      { key: "Payment friction", value: paymentFriction, weight: 0.15 },
      { key: "Support load", value: supportLoad, weight: 0.15 },
      { key: "Engagement drop", value: engagementDrop, weight: 0.1 },
      { key: "NPS risk", value: npsRisk, weight: 0.1 },
    ],
  };
}

function nextStep(m, risk) {
  if (m.daysSinceLastTxn > 21)
    return {
      title: "Reactivation outreach",
      detail: `No transactions in ${m.daysSinceLastTxn} days. Have ${m.contact}'s CSM call within 48h before the account goes fully dormant.`,
      urgency: "now",
    };
  if (m.paymentFailureRatePct > 7)
    return {
      title: "Fix payment friction",
      detail: `Failure rate at ${m.paymentFailureRatePct.toFixed(1)}%. Loop in integrations to audit declined-transaction logs and checkout flow.`,
      urgency: "now",
    };
  if (m.openSupportTickets >= 2 || m.negativeSentimentPct >= 40)
    return {
      title: "Escalate to CS lead",
      detail: `${m.openSupportTickets} open ticket(s), ${m.negativeSentimentPct}% negative sentiment. Unresolved issues are the likely driver — escalate for direct resolution.`,
      urgency: "soon",
    };
  if (m.npsScore < 10)
    return {
      title: "NPS follow-up call",
      detail: `NPS of ${m.npsScore} signals dissatisfaction not yet voiced through support. Schedule a short feedback call this week.`,
      urgency: "soon",
    };
  if (m.gmvTrendPct < -10)
    return {
      title: "Growth check-in / QBR",
      detail: `GMV down ${Math.abs(m.gmvTrendPct)}% over 30 days. Schedule a quarterly review to understand usage drop-off and surface blockers.`,
      urgency: "soon",
    };
  if (risk.renewalUrgent)
    return {
      title: "Renewal prep call",
      detail: `Contract renews in ${m.renewalInDays} days with an elevated risk score. Get ahead of it with a value-recap call.`,
      urgency: "soon",
    };
  return {
    title: "Monitor",
    detail: "No urgent signal. Keep in the standard quarterly review cadence.",
    urgency: "later",
  };
}

const MERCHANTS = RAW_MERCHANTS.map((m) => {
  const risk = scoreMerchant(m);
  return { ...m, risk, action: nextStep(m, risk) };
}).sort((a, b) => b.risk.score - a.risk.score);

const TIER_COLOR = {
  Critical: T.critical,
  High: T.high,
  Medium: T.medium,
  Low: T.low,
};
const TIER_SOFT = {
  Critical: T.criticalSoft,
  High: T.highSoft,
  Medium: T.mediumSoft,
  Low: T.lowSoft,
};

/* ---------------------------------------------------------
   UI PIECES
--------------------------------------------------------- */
function SignalBar({ signals }) {
  return (
    <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", width: "100%", background: T.borderSoft }}>
      {signals.map((s, i) => {
        const contribution = (s.value * s.weight) || 0.001;
        return (
          <div
            key={i}
            title={`${s.key}: ${Math.round(s.value)}`}
            style={{
              width: `${Math.max(contribution, 1)}%`,
              background: SIGNAL_COLORS[s.key],
              opacity: 0.55 + (s.value / 100) * 0.45,
            }}
          />
        );
      })}
    </div>
  );
}

const SIGNAL_COLORS = {
  "Inactivity": "#FF5C6C",
  "GMV decline": "#FF9F45",
  "Payment friction": "#F0C93B",
  "Support load": "#4C82FF",
  "Engagement drop": "#A78BFA",
  "NPS risk": "#3ED598",
};

function Pill({ tier }) {
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        padding: "3px 9px",
        borderRadius: 999,
        color: TIER_COLOR[tier],
        background: TIER_SOFT[tier],
        border: `1px solid ${TIER_COLOR[tier]}44`,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {tier}
    </span>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: T.panel,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        flex: 1,
        minWidth: 110,
      }}
    >
      <div style={{ fontSize: 11, color: T.textMuted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: color || T.text }}>
        {value}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN DASHBOARD
--------------------------------------------------------- */
export default function ChurnDashboard() {
  const [tierFilter, setTierFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(MERCHANTS[0].id);

  const counts = useMemo(() => {
    const c = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    MERCHANTS.forEach((m) => c[m.risk.tier]++);
    return c;
  }, []);

  const gmvAtRisk = useMemo(
    () =>
      MERCHANTS.filter((m) => m.risk.tier === "Critical" || m.risk.tier === "High")
        .reduce((sum, m) => sum + m.gmv30d, 0),
    []
  );

  const filtered = useMemo(() => {
    return MERCHANTS.filter((m) => {
      const tierOk = tierFilter === "All" || m.risk.tier === tierFilter;
      const qOk =
        query.trim() === "" ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.id.toLowerCase().includes(query.toLowerCase());
      return tierOk && qOk;
    });
  }, [tierFilter, query]);

  const selected = MERCHANTS.find((m) => m.id === selectedId) || filtered[0];

  return (
    <div
      style={{
        background: T.bg,
        color: T.text,
        fontFamily: "'Inter', sans-serif",
        minHeight: "100%",
        padding: "22px 22px 40px",
      }}
    >
      <style>{FONTS}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: T.accent, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" }}>
            Merchant Health · Churn Risk
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, margin: 0 }}>
            Retention Control Tower
          </h1>
        </div>
        <div style={{ fontSize: 12, color: T.textFaint, fontFamily: "'IBM Plex Mono', monospace" }}>
          {MERCHANTS.length} merchants tracked · scored on 6 signals
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <StatCard label="Critical" value={counts.Critical} color={T.critical} />
        <StatCard label="High" value={counts.High} color={T.high} />
        <StatCard label="Medium" value={counts.Medium} color={T.medium} />
        <StatCard label="Low" value={counts.Low} color={T.low} />
        <StatCard label="30d GMV at risk" value={`$${(gmvAtRisk / 1000).toFixed(0)}k`} color={T.text} />
      </div>

      {/* Layout: table + detail */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Table panel */}
        <div style={{ flex: "1 1 560px", background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 8, padding: "12px 14px", borderBottom: `1px solid ${T.border}`, flexWrap: "wrap", alignItems: "center" }}>
            {["All", "Critical", "High", "Medium", "Low"].map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11.5,
                  padding: "5px 10px",
                  borderRadius: 7,
                  border: `1px solid ${tierFilter === t ? T.accent : T.border}`,
                  background: tierFilter === t ? T.accentSoft : "transparent",
                  color: tierFilter === t ? T.accent : T.textMuted,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search merchant or ID…"
              style={{
                marginLeft: "auto",
                background: T.panel2,
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                padding: "6px 10px",
                color: T.text,
                fontSize: 12.5,
                outline: "none",
                width: 190,
              }}
            />
          </div>

          <div style={{ maxHeight: 560, overflowY: "auto" }}>
            {filtered.map((m) => {
              const isSel = selected && m.id === selected.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 14px",
                    borderBottom: `1px solid ${T.borderSoft}`,
                    cursor: "pointer",
                    background: isSel ? T.panel2 : "transparent",
                    borderLeft: isSel ? `3px solid ${T.accent}` : "3px solid transparent",
                  }}
                >
                  <div style={{ minWidth: 34, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: TIER_COLOR[m.risk.tier] }}>
                    {m.risk.score}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</span>
                      <Pill tier={m.risk.tier} />
                      {m.risk.renewalUrgent && (
                        <span style={{ fontSize: 10, color: T.high, fontFamily: "'IBM Plex Mono', monospace" }}>⏱ renewal {m.renewalInDays}d</span>
                      )}
                    </div>
                    <SignalBar signals={m.risk.signals} />
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: T.textFaint, textAlign: "right", whiteSpace: "nowrap" }}>
                    {m.id}
                    <br />
                    {m.segment}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: T.textFaint, fontSize: 13 }}>No merchants match this filter.</div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ flex: "1 1 320px", maxWidth: 380, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, position: "sticky", top: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>{selected.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textFaint, marginTop: 2 }}>
                  {selected.id} · {selected.industry} · {selected.segment}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: TIER_COLOR[selected.risk.tier], lineHeight: 1 }}>
                  {selected.risk.score}
                </div>
                <Pill tier={selected.risk.tier} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "16px 0" }}>
              {[
                ["30d GMV", `$${selected.gmv30d.toLocaleString()}`],
                ["GMV trend", `${selected.gmvTrendPct > 0 ? "+" : ""}${selected.gmvTrendPct}%`],
                ["Last txn", `${selected.daysSinceLastTxn}d ago`],
                ["Logins /30d", selected.loginFrequency30d],
                ["Payment fails", `${selected.paymentFailureRatePct}%`],
                ["Open tickets", selected.openSupportTickets],
                ["NPS", selected.npsScore],
                ["Renewal", `${selected.renewalInDays}d`],
              ].map(([label, val]) => (
                <div key={label} style={{ background: T.panel2, border: `1px solid ${T.borderSoft}`, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: T.textFaint, textTransform: "uppercase", letterSpacing: 0.4, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 0.4 }}>
                Signal composition
              </div>
              {selected.risk.signals.map((s) => (
                <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: SIGNAL_COLORS[s.key], flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: T.textMuted, flex: 1 }}>{s.key}</div>
                  <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: T.text }}>{Math.round(s.value)}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: selected.action.urgency === "now" ? T.criticalSoft : T.accentSoft,
                border: `1px solid ${selected.action.urgency === "now" ? T.critical + "55" : T.accent + "55"}`,
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: selected.action.urgency === "now" ? T.critical : T.accent, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>
                Recommended next step
              </div>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 5 }}>{selected.action.title}</div>
              <div style={{ fontSize: 12.5, color: T.textMuted, lineHeight: 1.5 }}>{selected.action.detail}</div>
              <div style={{ fontSize: 11, color: T.textFaint, marginTop: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                Owner: {selected.contact} · Plan: {selected.planTier}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
