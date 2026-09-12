import { useState } from "react";


const STATUS_META = {
    COMPLIANT: { label: "Compliant", pill: "bg-emerald-50", text: "text-emerald-700" },
    NON_COMPLIANT: { label: "Non-Compliant", pill: "bg-red-50", text: "text-red-700" },
    NEEDS_REVIEW: { label: "Review Required", pill: "bg-amber-50", text: "text-amber-700" },
};

function InfoBlock({ label, corner, children }) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {corner && <p className="text-xs text-gray-400">{corner}</p>}
            </div>
            {children}
        </div>
    );
}

function DocumentViewer({ doc }) {
    if (!doc) return null;
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            {/* TOOLBAR */}
            <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <span>☰</span>
                <span>
                    {doc.page} / {doc.totalPages}
                </span>
                <span className="mx-1 text-gray-300">|</span>
                <span>←</span>
                <span>100%</span>
                <span>→</span>
                <span className="ml-auto flex items-center gap-3">
                    <span>⤢</span>
                    <span>⟳</span>
                    <span>⋮</span>
                </span>
            </div>

            {/* PAGE */}
            <div className="bg-gray-900 p-8">
                <div className="mx-auto max-w-sm rounded-md bg-white p-6 text-sm leading-6 text-gray-800 shadow-lg">
                    <p className="mb-3 font-bold">{doc.heading}</p>
                    <p>
                        {doc.body}
                        <span className="bg-amber-300 px-0.5 font-semibold">{doc.highlight}</span>
                        {doc.bodyEnd}
                    </p>
                </div>
            </div>
        </div>
    );
}

function EvidenceDetail({ detail, onBack }) {
    const [activeDocTab, setActiveDocTab] = useState("clause"); // "clause" | "document"
    const meta = STATUS_META[detail.status] ?? STATUS_META.NEEDS_REVIEW;

    return (
        <div className="min-h-screen bg-[#fcf8f6] p-6">
            {/* BREADCRUMB */}
            <div className="mb-4 text-sm text-gray-500">
                Tenders
                <span className="mx-2">›</span>
                {detail.tenderId}
                <span className="mx-2">›</span>
                Evaluation Matrix
            </div>

            {/* HEADER */}
            <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{detail.requirementName}</h1>
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.pill} ${meta.text}`}
                    >
                        {meta.label}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-amber-700"
                >
                    ← Back to Matrix
                </button>
            </div>

            <p className="mb-6 text-sm text-gray-500">{detail.bidderName}</p>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* LEFT: INFO CARDS */}
                <div className="space-y-4">
                    <InfoBlock
                        label="Tender Requirement"
                        corner={`Clause ${detail.clauseRef}, Page ${detail.clausePage}`}
                    >
                        <p className="text-sm text-gray-700">{detail.requirementText}</p>
                    </InfoBlock>

                    <InfoBlock
                        label="Bidder's Extracted Value"
                        corner={`${detail.extractedSourceLabel}, Page ${detail.extractedSourcePage}`}
                    >
                        <p className="text-lg font-bold text-gray-900">{detail.extractedValue}</p>
                    </InfoBlock>

                    <InfoBlock label="Applied Rule">
                        <p className="text-sm font-semibold text-gray-800">{detail.appliedRule}</p>
                    </InfoBlock>

                    <InfoBlock label="System Finding">
                        <p className="text-sm text-gray-700">{detail.systemFinding}</p>
                    </InfoBlock>
                </div>

                {/* RIGHT: DOCUMENT VIEWER */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex gap-6 border-b border-gray-100 pb-3">
                        <button
                            type="button"
                            onClick={() => setActiveDocTab("clause")}
                            className={`text-sm font-semibold ${activeDocTab === "clause"
                                ? "text-gray-900"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Tender Clause (Page {detail.tenderClause.page})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveDocTab("document")}
                            className={`text-sm font-semibold ${activeDocTab === "document"
                                ? "text-gray-900"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Bidder Document (Page {detail.bidderDocument.page})
                        </button>
                    </div>

                    <DocumentViewer
                        doc={activeDocTab === "clause" ? detail.tenderClause : detail.bidderDocument}
                    />
                </div>
            </div>
        </div>
    );
}

// --- Demo/fake data matching the reference screenshot ---
export const demoEvidenceDetail = {
    tenderId: "GEM/2024/001",
    requirementName: "Local Content (>= 50%)",
    status: "NON_COMPLIANT",
    bidderName: "Bharat Supplies Ltd",
    clauseRef: "8.2",
    clausePage: 14,
    requirementText: "Minimum local content shall be 50% as per Make in India policy.",
    extractedValue: "43%",
    extractedSourceLabel: "Local Content Declaration",
    extractedSourcePage: 6,
    appliedRule: "43 < 50 → Not Satisfied",
    systemFinding: "The declared local content (43%) is below the required threshold of 50%.",
    tenderClause: {
        page: 14,
        totalPages: 32,
        heading: "8.2  Local Content",
        body: "Bidders must ensure a minimum local content of ",
        highlight: "50%",
        bodyEnd:
            " in the offered goods, in line with the Public Procurement (Preference to Make in India) Order.",
    },
    bidderDocument: {
        page: 6,
        totalPages: 12,
        heading: "Local Content Declaration",
        body: "The bidder declares a local content of ",
        highlight: "43%",
        bodyEnd: " for the offered goods, calculated in accordance with the prescribed formula.",
    },
};

export default function EvidenceDetailDemo() {
    return <EvidenceDetail detail={demoEvidenceDetail} onBack={() => alert("Back to matrix")} />;
}

export { EvidenceDetail };