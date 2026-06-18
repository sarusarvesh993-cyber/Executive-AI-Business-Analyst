import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BarChart3,
  Brain,
  Building2,
  Download,
  FileText,
  Globe2,
  LineChart,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const examplePrompts = [
  "Analyze Swiggy vs Zomato in the Indian food delivery market",
  "Analyze Tesla's competitive position in the EV market",
  "Compare Netflix and Disney+ in the global streaming market",
  "Analyze Apple vs Samsung in the premium smartphone market",
];

function App() {
  const [question, setQuestion] = useState(
    "Analyze Swiggy vs Zomato in the Indian food delivery market"
  );
  const [analysisType, setAnalysisType] = useState("competitor_analysis");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");
  const [sources, setSources] = useState([]);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    if (!question.trim()) {
      setError("Please enter a business question.");
      return;
    }

    setLoading(true);
    setError("");
    setReport("");
    setSources([]);

    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        question,
        analysis_type: analysisType,
      });

      setReport(response.data.report || "");
      setSources(response.data.sources || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Could not connect to backend. Make sure FastAPI is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "business_analysis_report.md";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen text-slate-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col border-r border-white/10 bg-black/35 backdrop-blur-xl p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shadow-glow">
              <Brain className="text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Executive AI</h1>
              <p className="text-xs text-emerald-300">Business Analyst</p>
            </div>
          </div>

          <div className="space-y-5">
            <SidebarItem icon={<Search size={18} />} title="Market Research" />
            <SidebarItem icon={<Building2 size={18} />} title="Competitor Analysis" />
            <SidebarItem icon={<Target size={18} />} title="SWOT Strategy" />
            <SidebarItem icon={<ShieldCheck size={18} />} title="Risk Signals" />
          </div>

          <div className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
            <p className="text-sm font-bold text-white mb-2">Agent Workflow</p>
            <ol className="space-y-3 text-sm text-slate-300">
              <li>1. Search market context</li>
              <li>2. Gather source snippets</li>
              <li>3. Run analyst agents</li>
              <li>4. Generate strategy report</li>
            </ol>
          </div>

          <div className="mt-auto text-xs text-slate-500">
            Project 4 · AI Engineer Portfolio
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-6 lg:px-10">
          {/* Hero */}
          <section className="rounded-[2rem] border border-emerald-400/20 bg-white/[0.045] backdrop-blur-xl shadow-card p-8 lg:p-10 mb-8 overflow-hidden relative">
            <div className="absolute right-0 top-0 h-72 w-72 bg-emerald-400/10 blur-3xl" />

            <div className="relative z-10 max-w-5xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200 mb-5">
                <Sparkles size={16} />
                Multi-Agent Business Intelligence Dashboard
              </div>

              <h2 className="text-4xl lg:text-6xl font-black tracking-tight text-white mb-5">
                Executive AI Business Analyst
              </h2>

              <p className="text-lg text-slate-300 leading-8 max-w-4xl">
                Turn a business question into an executive-style report with market
                context, competitor analysis, SWOT insights, strategic recommendations,
                risks, opportunities, and source URLs.
              </p>
            </div>
          </section>

          {/* Metric cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <MetricCard icon={<Globe2 />} label="Research" value="Live Web" />
            <MetricCard icon={<BarChart3 />} label="Analysis" value="Multi-Agent" />
            <MetricCard icon={<LineChart />} label="Output" value="Strategy Report" />
            <MetricCard icon={<FileText />} label="Format" value="Markdown" />
          </section>

          {/* Input dashboard */}
          <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] backdrop-blur-xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-2xl bg-emerald-400/15 border border-emerald-400/25 flex items-center justify-center">
                  <Search className="text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Business Question</h3>
                  <p className="text-sm text-slate-400">
                    Ask for market, company, or competitor analysis.
                  </p>
                </div>
              </div>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full h-40 rounded-3xl border border-white/10 bg-black/35 p-5 text-slate-100 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/10"
                placeholder="Example: Analyze Swiggy vs Zomato in the Indian food delivery market"
              />

              <div className="mt-4">
                <label className="text-sm text-slate-400">Analysis Type</label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/45 p-4 text-slate-100 outline-none focus:border-emerald-400/60"
                >
                  <option value="competitor_analysis">Competitor Analysis</option>
                  <option value="market_research">Market Research</option>
                  <option value="company_analysis">Company Analysis</option>
                  <option value="strategy_brief">Strategy Brief</option>
                </select>
              </div>

              <button
                onClick={runAnalysis}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-400 px-6 py-4 font-black text-black hover:from-emerald-400 hover:to-lime-300 transition disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Running Analyst Agents...
                  </>
                ) : (
                  <>
                    <TrendingUp />
                    Generate Business Report
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] backdrop-blur-xl p-6 shadow-card">
              <h3 className="text-2xl font-black text-white mb-4">Example Prompts</h3>
              <div className="space-y-3">
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setQuestion(prompt)}
                    className="w-full text-left rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300 hover:border-emerald-400/40 hover:bg-emerald-400/10 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
                <h4 className="font-black text-white mb-2">Designed for</h4>
                <p className="text-sm text-slate-300 leading-6">
                  Analysts, students, founders, consultants, and job seekers who need
                  structured first-draft business intelligence reports.
                </p>
              </div>
            </div>
          </section>

          {/* Report */}
          {report && (
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] backdrop-blur-xl p-6 lg:p-8 shadow-card mb-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-3xl font-black text-white">Executive Report</h3>
                  <p className="text-slate-400 text-sm">
                    Generated by the AI business analyst workflow.
                  </p>
                </div>

                <button
                  onClick={downloadReport}
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-emerald-200 font-bold hover:bg-emerald-400/20 transition flex items-center gap-2"
                >
                  <Download size={18} />
                  Download Markdown
                </button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/35 p-6 text-slate-200 leading-7">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="text-3xl font-black text-white mb-6 mt-2">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-black text-emerald-200 mt-8 mb-4">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-bold text-white mt-6 mb-3">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="text-slate-300 mb-4 leading-8">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="list-disc pl-6 space-y-2 mb-5 text-slate-300">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal pl-6 space-y-2 mb-5 text-slate-300">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="leading-7">
          {children}
        </li>
      ),
      strong: ({ children }) => (
        <strong className="text-white font-black">
          {children}
        </strong>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto my-6 rounded-2xl border border-emerald-400/20">
          <table className="w-full text-left text-sm">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="bg-emerald-400/10 text-emerald-200">
          {children}
        </thead>
      ),
      th: ({ children }) => (
        <th className="px-4 py-3 font-black border-b border-emerald-400/20">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-3 border-b border-white/10 text-slate-300 align-top">
          {children}
        </td>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-300 hover:text-emerald-200 underline"
        >
          {children}
        </a>
      ),
    }}
  >
    {report}
  </ReactMarkdown>
</div>

              {sources.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xl font-black text-white mb-3">
  Agent-Collected Source URLs
</h4>
                  <div className="space-y-2">
                    {sources.map((source, index) => (
                      <a
                        key={index}
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-2xl border border-white/10 bg-black/30 p-3 text-emerald-300 hover:bg-emerald-400/10"
                      >
                        {source}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-slate-300">
      <span className="text-emerald-300">{icon}</span>
      <span className="font-semibold">{title}</span>
    </div>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl p-5 shadow-card">
      <div className="h-11 w-11 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mb-4">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-black">
        {label}
      </p>
      <p className="text-xl font-black text-white mt-1">{value}</p>
    </div>
  );
}

export default App;