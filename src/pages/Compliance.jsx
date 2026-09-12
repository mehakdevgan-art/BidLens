import { useMemo, useState } from "react";
import complianceMock from "../data/complianceMock.js";
import { EvidenceDetail } from "../components/EvidenceDetail.jsx";


/**
 * Expected complianceMock shape — an array of tenders, each self-contained:
 *
 * {
 *   tenders: [
 *     {
 *       id: "GEM/2024/001",
 *       status: "Active",
 *       title: "...",
 *       department: "...",
 *       documentUrl: null, // set once the real RFP PDF is uploaded
 *       bidders: [{ bidder_id, name }, ...],
 *       requirements: [{ requirement_id, name, category }, ...],
 *       evidence: [{ bidder_id, requirement_id, value, unit, document, page, evidence_text }, ...],
 *       results: [{ bidder_id, requirement_id, status, required, found, reason }, ...],
 *     },
 *     ...
 *   ],
 * }
 */

const STATUS_META = {
    COMPLIANT: {
        label: "Compliant",
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        pill: "bg-emerald-50",
    },
    NON_COMPLIANT: {
        label: "Non-Compliant",
        dot: "bg-red-500",
        text: "text-red-700",
        pill: "bg-red-50",
    },
    NEEDS_REVIEW: {
        label: "Review Required",
        dot: "bg-amber-500",
        text: "text-amber-700",
        pill: "bg-amber-50",
    },
};

const OVERALL_META = {
    PASS: "bg-emerald-100 text-emerald-700",
    FAIL: "bg-red-100 text-red-700",
    REVIEW: "bg-amber-100 text-amber-700",
};

// Fake placeholder pages shown until a real tender document is uploaded.
const fakeTenderDocumentPages = [
    {
        heading: "1. Scope of Supply",
        body: "This tender covers the supply of goods/services described in the tender title, in line with the applicable procurement policy.",
    },
    {
        heading: "8. Compliance Requirements",
        body: "Bidders must satisfy all listed policy, legal, financial, and technical requirements to be considered compliant.",
    },
    {
        heading: "12. Eligibility Criteria",
        body: "Bidders must hold valid company registration, tax clearance, and any category-specific certifications required for this tender.",
    },
];

function statusMeta(status) {
    return STATUS_META[status] ?? STATUS_META.NEEDS_REVIEW;
}

function StatusPill({ status, onClick }) {
    const meta = statusMeta(status);
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition hover:brightness-95 ${meta.pill} ${meta.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
        </button>
    );
}

function overallStatusForBidder(results, bidderId) {
    const rows = results.filter((r) => r.bidder_id === bidderId);
    if (rows.some((r) => r.status === "NON_COMPLIANT")) return "FAIL";
    if (rows.some((r) => r.status === "NEEDS_REVIEW")) return "REVIEW";
    return "PASS";
}

function Compliance() {
    const tenders = complianceMock.tenders ?? [];

    const [selectedTenderId, setSelectedTenderId] = useState(tenders[0]?.id ?? null);
    const [selectedCell, setSelectedCell] = useState(null); // { requirement_id, bidder_id }
    const [showTenderDoc, setShowTenderDoc] = useState(false);
    const [docPageIndex, setDocPageIndex] = useState(0);

    const tender = tenders.find((t) => t.id === selectedTenderId) ?? tenders[0];

    const { bidders = [], requirements = [], evidence = [], results = [] } =
        tender ?? {};

    const resultsByKey = useMemo(() => {
        const map = new Map();
        results.forEach((r) => map.set(`${r.bidder_id}_${r.requirement_id}`, r));
        return map;
    }, [results]);

    const evidenceByKey = useMemo(() => {
        const map = new Map();
        evidence.forEach((e) => map.set(`${e.bidder_id}_${e.requirement_id}`, e));
        return map;
    }, [evidence]);

    const bidderName = (bidderId) =>
        bidders.find((b) => b.bidder_id === bidderId)?.name ?? bidderId;

    const selectedDetail = useMemo(() => {
        if (!selectedCell) return null;
        const key = `${selectedCell.bidder_id}_${selectedCell.requirement_id}`;
        return {
            requirement: requirements.find(
                (r) => r.requirement_id === selectedCell.requirement_id
            ),
            result: resultsByKey.get(key),
            evidence: evidenceByKey.get(key),
        };
    }, [selectedCell, requirements, resultsByKey, evidenceByKey]);

    // Maps real result/evidence/requirement data into the EvidenceDetail
    // shape. tenderClause/bidderDocument body text is fake placeholder
    // content until the backend renders real clause + document pages.
    const evidenceDetailData = useMemo(() => {
        if (!selectedDetail?.requirement || !selectedCell || !tender) return null;
        const { requirement, result, evidence: ev } = selectedDetail;

        const appliedRule = !result
            ? "—"
            : result.status === "COMPLIANT"
                ? `${result.found} satisfies ${result.required} → Satisfied`
                : result.status === "NEEDS_REVIEW"
                    ? `${result.found} → Needs Manual Review`
                    : `${result.found} fails ${result.required} → Not Satisfied`;

        return {
            tenderId: tender.id,
            requirementName: `${requirement.name}${result?.required ? ` (${result.required})` : ""}`,
            status: result?.status,
            bidderName: bidderName(selectedCell.bidder_id),
            clauseRef: requirement.source?.clause ?? "—",
            clausePage: requirement.source?.page ?? ev?.page ?? "—",
            requirementText:
                requirement.description ??
                `Requirement: ${requirement.name}${result?.required ? ` — must be ${result.required}.` : "."}`,
            extractedValue: result?.found ?? `${ev?.value ?? "—"}${ev?.unit ? ` ${ev.unit}` : ""}`,
            extractedSourceLabel: ev?.document ?? "Evidence document",
            extractedSourcePage: ev?.page ?? "—",
            appliedRule,
            systemFinding: result?.reason ?? ev?.evidence_text ?? "No finding recorded.",
            tenderClause: {
                page: requirement.source?.page ?? ev?.page ?? 1,
                totalPages: 32,
                heading: requirement.name,
                body: "Full clause text will be rendered here once the backend provides it. Requirement: ",
                highlight: result?.required ?? "",
                bodyEnd: ".",
            },
            bidderDocument: {
                page: ev?.page ?? 1,
                totalPages: 12,
                heading: ev?.document ?? "Bidder document",
                body: ev?.evidence_text ?? "Full extracted document text will be rendered here.",
                highlight: "",
                bodyEnd: "",
            },
        };
    }, [selectedDetail, selectedCell, tender]);

    if (evidenceDetailData) {
        return (
            <EvidenceDetail
                detail={evidenceDetailData}
                onBack={() => setSelectedCell(null)}
            />
        );
    }

    if (!tender) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fcf8f6] text-gray-500">
                No tenders available.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf8f6] p-6">
            {/* TENDER PICKER */}
            <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Tenders
                    <span className="mx-2">›</span>
                    <span className="font-medium text-gray-700">{tender.id}</span>
                </div>

                <select
                    value={selectedTenderId}
                    onChange={(e) => {
                        setSelectedTenderId(e.target.value);
                        setSelectedCell(null);
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-amber-500"
                >
                    {tenders.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.id} — {t.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* TENDER HEADER */}
            <div className="mb-5 flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">{tender.id}</h1>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {tender.status}
                        </span>
                    </div>

                    <p className="mt-2 font-semibold text-gray-800">{tender.title}</p>

                    <p className="mt-1 text-sm text-gray-500">
                        {tender.department}
                        <span className="mx-2">|</span>
                        {bidders.length} Bids Received
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (tender.documentUrl) {
                            window.open(tender.documentUrl, "_blank", "noopener,noreferrer");
                        } else {
                            setDocPageIndex(0);
                            setShowTenderDoc(true);
                        }
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    📄 View Tender Document
                </button>
            </div>

            {/* TOTAL BIDDERS */}
            <div className="mb-6 text-sm font-semibold text-gray-700">
                Total Bidders: <span className="text-amber-700">{bidders.length}</span>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex items-start gap-6">
                {/* MATRIX */}
                <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* MATRIX HEADER */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Compliance Matrix</h2>
                            <p className="text-sm text-gray-500">
                                Comparison of all bidders against approved requirements.
                            </p>
                        </div>

                        {/* LEGEND */}
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
                            {Object.entries(STATUS_META).map(([key, meta]) => (
                                <span key={key} className="flex items-center gap-1.5">
                                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                                    {meta.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                                        Requirement
                                    </th>
                                    {bidders.map((b) => (
                                        <th
                                            key={b.bidder_id}
                                            className="px-5 py-4 text-left text-xs font-semibold uppercase text-gray-500"
                                        >
                                            {b.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {requirements.map((req) => (
                                    <tr
                                        key={req.requirement_id}
                                        className="border-t border-gray-100 transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4 font-semibold text-gray-800">
                                            {req.name}
                                        </td>

                                        {bidders.map((b) => {
                                            const result = resultsByKey.get(
                                                `${b.bidder_id}_${req.requirement_id}`
                                            );
                                            return (
                                                <td key={b.bidder_id} className="px-5 py-4">
                                                    {result ? (
                                                        <StatusPill
                                                            status={result.status}
                                                            onClick={() =>
                                                                setSelectedCell({
                                                                    requirement_id: req.requirement_id,
                                                                    bidder_id: b.bidder_id,
                                                                })
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-300">—</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}

                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* TENDER DOCUMENT MODAL — fake preview until a real file is uploaded */}
            {showTenderDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
                    <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                        {/* MODAL HEADER */}
                        <div className="flex items-center justify-between border-b border-gray-100 p-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Tender Document</h2>
                                <p className="text-xs text-gray-500">
                                    {tender.id} · Preview only — upload the real RFP PDF to replace this
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTenderDoc(false)}
                                className="text-xl text-gray-400 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {/* TOOLBAR */}
                        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                            <button
                                type="button"
                                disabled={docPageIndex === 0}
                                onClick={() => setDocPageIndex((i) => Math.max(0, i - 1))}
                                className="disabled:opacity-30"
                            >
                                ←
                            </button>
                            <span>
                                Page {docPageIndex + 1} / {fakeTenderDocumentPages.length}
                            </span>
                            <button
                                type="button"
                                disabled={docPageIndex === fakeTenderDocumentPages.length - 1}
                                onClick={() =>
                                    setDocPageIndex((i) =>
                                        Math.min(fakeTenderDocumentPages.length - 1, i + 1)
                                    )
                                }
                                className="disabled:opacity-30"
                            >
                                →
                            </button>
                            <span className="ml-auto">100%</span>
                        </div>

                        {/* PAGE CONTENT */}
                        <div className="flex-1 overflow-y-auto bg-gray-900 p-8">
                            <div className="mx-auto max-w-md rounded-md bg-white p-6 text-sm leading-6 text-gray-800 shadow-lg">
                                <p className="mb-3 font-bold">
                                    {fakeTenderDocumentPages[docPageIndex].heading}
                                </p>
                                <p>{fakeTenderDocumentPages[docPageIndex].body}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Compliance;