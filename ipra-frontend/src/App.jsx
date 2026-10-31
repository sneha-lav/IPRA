import React, { useState } from "react";
import {
  Scale,
  Search,
  FileText,
  History,
  Settings,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Globe,
  Sparkles,
  CheckCircle2,
  Clock,
  Info
} from "lucide-react";

import "./App.css";

function App() {
  const [page, setPage] = useState("research");
  const [menuOpen, setMenuOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("India");
  const [category, setCategory] = useState("All Categories");

  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  // Evidence data will be received from Tanishka's backend
const [citations, setCitations] = useState([]);
const [confidenceScore, setConfidenceScore] = useState(null);
const [evidenceQuality, setEvidenceQuality] = useState("Not assessed");
  const [history, setHistory] = useState([]);

  const sources = [
    {
      name: "India Code",
      description: "Official repository of Indian laws and legislation.",
      url: "https://www.indiacode.nic.in/"
    },
    {
      name: "IP India",
      description: "Official Indian Intellectual Property Office.",
      url: "https://ipindia.gov.in/"
    },
    {
      name: "WIPO",
      description: "World Intellectual Property Organization.",
      url: "https://www.wipo.int/"
    },
    {
      name: "e-Gazette of India",
      description: "Official government publications and notifications.",
      url: "https://egazette.gov.in/"
    },
    {
      name: "MoEFCC",
      description: "Ministry of Environment, Forest and Climate Change.",
      url: "https://moef.gov.in/"
    }
  ];

  function navigate(section) {
    setPage(section);
    setMenuOpen(false);
  }

  function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      alert("Please enter your research question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    setTimeout(() => {
      const demoAnswer =
        "Your research query has been successfully received. This is a demonstration response from the IPRA frontend. The complete application will retrieve relevant legal documents, analyse evidence and generate a detailed answer after the Python backend is connected.";

      setAnswer(demoAnswer);

      setHistory((previous) => [
        {
          question: query,
          date: new Date().toLocaleString(),
          jurisdiction,
          category
        },
        ...previous
      ]);

      setLoading(false);
    }, 1200);
  }

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>

        <div className="brand">

          <div className="brand-icon">
            <Scale size={25} />
          </div>

          <div>
            <h2>IPRA</h2>
            <span>Intelligent Research Assistant</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>

        </div>

        <div className="workspace-label">
          WORKSPACE
        </div>

        <nav>

          <button
            className={`nav-link ${page === "research" ? "active" : ""}`}
            onClick={() => navigate("research")}
          >
            <Search size={19} />
            Research Assistant
          </button>

          <button
            className={`nav-link ${page === "sources" ? "active" : ""}`}
            onClick={() => navigate("sources")}
          >
            <BookOpen size={19} />
            Sources & References
          </button>

          <button
            className={`nav-link ${page === "history" ? "active" : ""}`}
            onClick={() => navigate("history")}
          >
            <History size={19} />
            Research History
          </button>

          <button
            className={`nav-link ${page === "settings" ? "active" : ""}`}
            onClick={() => navigate("settings")}
          >
            <Settings size={19} />
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">
          <ShieldCheck size={20} />

          <div>
            <strong>Evidence-based research</strong>
            <p>Designed for reliable IP research</p>
          </div>
        </div>

      </aside>

      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="topbar">

          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>

          <div className="topbar-title">
            <span>IPRA WORKSPACE</span>

            <h3>
              {page === "research" && "Research Assistant"}
              {page === "sources" && "Sources & References"}
              {page === "history" && "Research History"}
              {page === "settings" && "Settings"}
            </h3>
          </div>

          <div className="topbar-status">
            <span className="status-dot"></span>
            Demo Mode
          </div>

        </header>

        {/* RESEARCH ASSISTANT */}

        {page === "research" && (

          <section className="page-content">

            <div className="welcome-section">

              <div>

                <span className="eyebrow">
                  <Sparkles size={15} />
                  INTELLIGENT LEGAL RESEARCH
                </span>

                <h1>
                  Explore knowledge.
                  <br />
                  Discover evidence.
                </h1>

                <p>
                  Research patents, intellectual property and
                  regulatory information with IPRA.
                </p>

              </div>

            </div>

            {/* SEARCH FORM */}

            <div className="research-card">

              <h2>What would you like to research?</h2>

              <p>
                Enter your question to begin your research.
              </p>

              <form onSubmit={handleSearch}>

                <label>Research Query</label>

                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Example: What are the patent requirements in India?"
                  rows="5"
                />

                <div className="form-options">

                  <div className="form-group">

                    <label>Jurisdiction</label>

                    <select
                      value={jurisdiction}
                      onChange={(event) =>
                        setJurisdiction(event.target.value)
                      }
                    >
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>European Union</option>
                      <option>International</option>
                    </select>

                  </div>

                  <div className="form-group">

                    <label>Research Category</label>

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                    >
                      <option>All Categories</option>
                      <option>Patents</option>
                      <option>Trademarks</option>
                      <option>Traditional Knowledge</option>
                      <option>Biodiversity Regulations</option>
                      <option>Copyright</option>
                      <option>Government Policies</option>
                    </select>

                  </div>

                </div>

                <button
                  className="search-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Researching..." : "Start Research"}
                  <ArrowRight size={18} />
                </button>

              </form>

            </div>

            {/* LOADING STATE */}

            {loading && (

              <div className="result-card">

                <div className="result-heading">
                  <Clock size={21} />
                  <h2>Research in progress</h2>
                </div>

                <p>
                  Processing your query. Please wait...
                </p>

              </div>

            )}

            {/* PROFESSIONAL ANSWER DISPLAY */}

           {answer && (
  <div className="result-card">

    {/* ANSWER HEADER */}
    <div className="result-heading">
      <FileText size={23} />
      <div>
        <h2>Research Answer</h2>
        <span>Evidence-based research results</span>
      </div>
    </div>

    <div className="result-meta">
      <span>Jurisdiction: {jurisdiction}</span>
      <span>Category: {category}</span>
    </div>

    {/* RESEARCH OVERVIEW */}
    <div className="answer-section">
      <h3>Research Overview</h3>
      <p>{answer}</p>
    </div>

    {/* INTERACTIVE CITATION CARDS */}
    <div className="citation-section">

      <div className="citation-title">
        <BookOpen size={21} />
        <div>
          <h3>Citations & References</h3>
          <p>Supporting legal documents and sources</p>
        </div>
      </div>

      {citations.length === 0 ? (

        <div className="citation-empty">
          <Info size={22} />
          <div>
            <strong>Awaiting verified citations</strong>
            <p>
              Document titles, sections and page numbers
              will appear here when backend data is connected.
            </p>
          </div>
        </div>

      ) : (

        citations.map((citation, index) => (

          <div className="citation-card" key={index}>

            <div className="citation-card-top">
              <div className="citation-file-icon">
                <FileText size={22} />
              </div>

              <span className={
                citation.verified
                  ? "verification verified"
                  : "verification pending"
              }>
                {citation.verified
                  ? "Verified"
                  : "Pending verification"}
              </span>
            </div>

            <h4>{citation.documentTitle}</h4>

            <div className="citation-details">
              <div>
                <span>Section</span>
                <strong>{citation.section || "Not provided"}</strong>
              </div>

              <div>
                <span>Page</span>
                <strong>{citation.page || "Not provided"}</strong>
              </div>

              <div>
                <span>Source</span>
                <strong>{citation.source || "Not provided"}</strong>
              </div>
            </div>

            {citation.url && (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="citation-link"
              >
                View source document
                <ExternalLink size={15} />
              </a>
            )}

          </div>

        ))

      )}

    </div>

    {/* EVIDENCE CONFIDENCE */}
    <div className="confidence-card">

      <div className="confidence-header">
        <div>
          <h3>Evidence Confidence</h3>
          <p>Based on retrieved and verified evidence</p>
        </div>

        <span className={
          confidenceScore === null
            ? "confidence-status pending"
            : "confidence-status assessed"
        }>
          {confidenceScore === null
            ? "Not assessed"
            : `${confidenceScore}%`}
        </span>
      </div>

      <div className="confidence-track">
        <div
          className="confidence-fill"
          style={{
            width: confidenceScore === null
              ? "0%"
              : `${Math.max(0, Math.min(100, confidenceScore))}%`
          }}
        />
      </div>

      <div className="quality-row">
        <span>Evidence quality</span>
        <strong>{evidenceQuality}</strong>
      </div>

      {confidenceScore === null && (
        <p className="confidence-note">
          Confidence score and evidence quality will be
          displayed after backend integration.
        </p>
      )}

    </div>

    <div className="info-card">
      <ShieldCheck size={22} />
      <div>
        <strong>Evidence verification</strong>
        <p>
          Only backend-verified documents should be
          presented as verified citations.
        </p>
      </div>
    </div>

  </div>
)}  
                

            {/* GENERAL INFORMATION */}

            <div className="info-card">

              <ShieldCheck size={23} />

              <div>

                <strong>Evidence-grounded research</strong>

                <p>
                  IPRA is designed to connect research answers
                  with verified documents and source references.
                </p>

              </div>

            </div>

          </section>

        )}

        {/* SOURCES PAGE */}

        {page === "sources" && (

          <section className="page-content">

            <div className="page-heading">

              <h1>Sources & References</h1>

              <p>
                Explore official intellectual property and
                regulatory information resources.
              </p>

            </div>

            <div className="sources-grid">

              {sources.map((source) => (

                <div
                  className="source-card"
                  key={source.name}
                >

                  <div className="source-icon">
                    <Globe size={23} />
                  </div>

                  <h3>{source.name}</h3>

                  <p>{source.description}</p>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit official website
                    <ExternalLink size={15} />
                  </a>

                </div>

              ))}

            </div>

            <div className="info-card">

              <ShieldCheck size={23} />

              <div>

                <strong>Source Directory</strong>

                <p>
                  These are general official research resources.
                  They are not query-specific citations generated
                  by the current demonstration.
                </p>

              </div>

            </div>

          </section>

        )}

        {/* HISTORY PAGE */}

        {page === "history" && (

          <section className="page-content">

            <div className="page-heading">

              <h1>Research History</h1>

              <p>
                Your research queries from this browser session.
              </p>

            </div>

            {history.length === 0 ? (

              <div className="empty-card">

                <History size={35} />

                <h3>No research history yet</h3>

                <p>
                  Your submitted queries will appear here.
                </p>

                <button
                  onClick={() => navigate("research")}
                >
                  Start Research
                </button>

              </div>

            ) : (

              history.map((item, index) => (

                <div
                  className="history-card"
                  key={index}
                >

                  <h3>{item.question}</h3>

                  <p>{item.date}</p>

                  <span>
                    {item.jurisdiction} · {item.category}
                  </span>

                </div>

              ))

            )}

          </section>

        )}

        {/* SETTINGS PAGE */}

        {page === "settings" && (

          <section className="page-content">

            <div className="page-heading">

              <h1>Settings</h1>

              <p>IPRA application information.</p>

            </div>

            <div className="settings-card">

              <h3>Application</h3>

              <p>
                IPRA – Intelligent Research Assistant
              </p>

              <p>Frontend: React + Vite</p>

              <p>Interface: Responsive dashboard</p>

              <p>Current status: Demonstration mode</p>

            </div>

            <div className="settings-card">

              <h3>Backend Connection</h3>

              <p>
                AI research, document retrieval and verified
                citations require connection to the project backend.
              </p>

              <span className="demo-label">
                Not connected
              </span>

            </div>

          </section>

        )}

        {/* FOOTER */}

        <footer className="footer">

          <span>IPRA © 2026</span>

          <span>
            Intelligent Patent & Regulatory Research Assistant
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;