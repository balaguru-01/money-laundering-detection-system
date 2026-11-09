import React from "react";
import "./ReportViewer.css";

const ReportViewer = ({ report, onClose }) => {
  if (!report) return null;

  const handleDownload = () => {
    try {
      const payload = {
        title: report.name,
        generated: report.generated,
        status: report.status,
        exportedAt: new Date().toISOString(),
        summary: "Simulated report export for demonstration purposes.",
        data: [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safeName = String(report.name || "report")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      a.href = url;
      a.download = `${safeName}-${report.generated || "report"}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download report:", e);
    }
  };

  const canDownload = String(report.status).toLowerCase() === "completed";

  return (
    <div className="rv-overlay" role="dialog" aria-modal="true">
      <div className="rv-card">
        <header className="rv-header">
          <div>
            <h3 className="rv-title">{report.name}</h3>
            <div className="rv-meta">
              Generated: {report.generated} •{" "}
              <span className={`rv-status ${report.status.toLowerCase()}`}>
                {report.status}
              </span>
            </div>
          </div>
          <button
            className="rv-close"
            onClick={onClose}
            aria-label="Close report viewer"
          >
            ✕
          </button>
        </header>

        <main className="rv-body">
          <p className="rv-intro">
            This preview shows metadata and a sample of the selected report.
            Replace this area with the real report rendering (PDF viewer,
            charts, tables, etc.).
          </p>

          <section className="rv-content">
            <div className="rv-placeholder">
              <p>
                Report contents would render here — charts, tables, or embedded
                PDF.
              </p>
            </div>
          </section>
        </main>

        <footer className="rv-footer">
          <button
            className="rv-download"
            onClick={handleDownload}
            disabled={!canDownload}
            title={canDownload ? "Download report as JSON" : "Report not ready yet"}
          >
            {canDownload ? "Download Report" : "Preparing..."}
          </button>
          <button className="rv-close-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ReportViewer;
