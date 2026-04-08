"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { tableData } from "@/data/table";
import DatePicker from "@/components/DatePicker";

type Props = {
  onClose: () => void;
};

export default function DownloadModal({ onClose }: Props) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [error, setError] = useState("");

  const filtered = tableData.filter((row) => {
    if (!fromDate || !toDate) return false;
    return row.date >= fromDate && row.date <= toDate;
  });

  const handleDownload = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both from and to dates.");
      return;
    }
    if (fromDate > toDate) {
      setError("From date cannot be after to date.");
      return;
    }
    if (filtered.length === 0) {
      setError("No transactions found for the selected date range.");
      return;
    }
    setError("");

    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(26, 24, 30);
    doc.text("Dukaan — Transaction Report", 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Date Range: ${fromDate} to ${toDate}   |   Total: ${filtered.length} transaction${filtered.length !== 1 ? "s" : ""}`,
      14,
      26
    );

    autoTable(doc, {
      startY: 32,
      head: [["Order ID", "Status", "Transaction ID", "Refund Date", "Order Amount"]],
      body: filtered.map((row) => [
        row.orderId,
        row.status,
        row.transactionId,
        row.refundDate,
        row.orderAmount,
      ]),
      headStyles: {
        fillColor: [20, 110, 180],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: [26, 24, 30] },
      alternateRowStyles: { fillColor: [242, 242, 242] },
      columnStyles: { 4: { halign: "right" } },
      styles: { cellPadding: 4 },
    });

    doc.save(`transactions_${fromDate}_to_${toDate}.pdf`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[#1A181E] font-semibold text-lg">Download Transactions</h2>
            <p className="text-[#808080] text-xs mt-0.5">Select a date range to export as PDF</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#808080] hover:text-[#1A181E] transition-colors p-1 rounded-full hover:bg-[#F2F2F2]"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Date inputs */}
        <div className="flex flex-col gap-3">
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(v) => { setFromDate(v); setError(""); }}
            placeholder="Pick start date"
          />
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(v) => { setToDate(v); setError(""); }}
            placeholder="Pick end date"
          />
        </div>

        {/* Preview count */}
        {fromDate && toDate && fromDate <= toDate && (
          <p className="text-xs text-[#146EB4] bg-[#EBF4FF] px-3 py-2 rounded-lg">
            {filtered.length === 0
              ? "No transactions found in this range."
              : `${filtered.length} transaction${filtered.length !== 1 ? "s" : ""} will be included in the PDF.`}
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#4D4D4D] border border-[#D9D9D9] rounded-lg hover:bg-[#F2F2F2] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#146EB4] rounded-lg hover:bg-[#0E4F82] transition-colors disabled:opacity-50"
            disabled={!fromDate || !toDate}
          >
            <FiDownload className="text-base" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
