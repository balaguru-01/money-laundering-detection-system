import { useState, useEffect } from "react";
import "./ReportsSection.css";
import ReportViewer from "./ReportViewer";

const ReportsSection = () => {
    const [reports, setReports] = useState([
        {
            id: 1,
            name: "Daily Transaction Report",
            generated: "2025-01-05",
            status: "Completed",
        },
        {
            id: 2,
            name: "Suspicious Activity Analysis",
            generated: "2025-01-04",
            status: "Completed",
        },
        {
            id: 3,
            name: "Risk Assessment Report",
            generated: "2025-01-03",
            status: "Processing",
        },
        {
            id: 4,
            name: "Compliance Check Report",
            generated: "2025-01-02",
            status: "Completed",
        },
    ]);

    const [openReport, setOpenReport] = useState(null);

    // Simulate background processing -> completed (one-time per processing report)
    useEffect(() => {
        // For each processing report, schedule a completion once
        const timers = [];
        setReports((prev) =>
            prev.map((r) => ({ ...r, _scheduled: r._scheduled ?? (r.status === "Processing") }))
        );

        reports.forEach((r, idx) => {
            if (r.status === "Processing") {
                const t = setTimeout(() => {
                    setReports((prev) =>
                        prev.map((it) =>
                            it.id === r.id
                                ? { ...it, status: "Completed", _scheduled: false }
                                : it
                        )
                    );
                }, 2500 + idx * 800);
                timers.push(t);
            }
        });
        return () => timers.forEach(clearTimeout);
        // We only want to schedule on mount; eslint disabled intentionally
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDownload = (report) => {
        try {
            const payload = {
                title: report.name,
                generated: report.generated,
                status: report.status,
                exportedAt: new Date().toISOString(),
                summary: "Simulated report export for demonstration purposes.",
                data: [],
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const safeName = String(report.name || "report").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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

    return (
        <div className="reports-section">
            <h2>Reports</h2>
            <div className="reports-grid">
                {reports.map((report) => {
                    const isCompleted = String(report.status).toLowerCase() === "completed";
                    return (
                        <div key={report.id} className="report-card">
                            <h3>{report.name}</h3>
                            <div className="report-meta">
                                <p>Generated: {report.generated}</p>
                                <span className={`report-status ${report.status.toLowerCase()}`}>
                                    {report.status}
                                </span>
                            </div>
                            <div className="report-actions">
                                <button
                                    className="report-button"
                                    onClick={() => setOpenReport(report)}
                                >
                                    View Report
                                </button>
                                <button
                                    className="report-button secondary"
                                    onClick={() => handleDownload(report)}
                                    disabled={!isCompleted}
                                    title={isCompleted ? "Download report as JSON" : "Report not ready yet"}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {openReport && (
                <ReportViewer report={openReport} onClose={() => setOpenReport(null)} />
            )}
        </div>
    );
};

export default ReportsSection;
