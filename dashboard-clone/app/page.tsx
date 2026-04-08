"use client";

import Image from "next/image";
import { useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaRegCircleQuestion,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { tableData } from "@/data/table";
import Link from "next/link";
import DownloadModal from "@/components/DownloadModal";

const PAGE_SIZE = 10;

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const filtered = tableData.filter(
    (row) =>
      row.orderId.toLowerCase().includes(search.toLowerCase()) ||
      row.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <main className="p-3 sm:p-8 w-full gap-8 flex flex-col">
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h5 className="font-medium text-xl">Overview</h5>
          <button className="flex items-center gap-3 border rounded px-[14px] py-[6px] bg-white text-[#4D4D4D]">
            This Month <FaChevronDown />
          </button>
        </div>
        <div className="flex gap-5 flex-wrap">
          <div className="rounded-[8px] flex-grow hover:bg-[#0E4F82] bg-[#146EB4] text-white min-w-[300px]">
            <div className="p-5 flex flex-col gap-4">
              <h5 className="flex gap-3 items-center">
                Next Payout <FaRegCircleQuestion />
              </h5>
              <div className="flex justify-between items-center">
                <p className="text-3xl font-medium">₹2,312.23</p>
                <p className="flex items-center font-medium text-base underline">
                  23 Orders <FaChevronRight className="text-lg" />
                </p>
              </div>
            </div>
            <div className="px-6 py-2 bg-[#0E4F82] flex justify-between text-[#F2F2F2] rounded-[8px]">
              <p>Next Payment Date:</p>
              <p>Today, 4:00PM</p>
            </div>
          </div>
          <div className="flex-grow rounded-[8px] bg-white p-5 flex flex-col gap-4 shadow-sm h-fit min-w-[300px]">
            <h5 className="flex gap-3 items-center text-[#4D4D4D]">
              Amount Pending <FaRegCircleQuestion />
            </h5>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-medium">₹92,312.20</p>
              <p className="flex items-center font-medium text-base underline text-[#146EB4]">
                13 Orders <FaChevronRight className="text-lg" />
              </p>
            </div>
          </div>
          <div className="flex-grow rounded-[8px] bg-white p-5 flex flex-col gap-4 shadow-sm h-fit min-w-[300px]">
            <h5 className="flex gap-3 items-center text-[#4D4D4D]">
              Amount Processed <FaRegCircleQuestion />
            </h5>
            <div className="flex justify-between items-center">
              <p className="text-3xl font-medium">₹23,92,312.19</p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <h5 className="font-medium text-[#1A181E] text-xl">
            Transactions | This Month
          </h5>
          <div className="flex gap-3">
            <button className="px-4 py-[6px] bg-[#E6E6E6] text-[#808080] rounded-full">
              Payouts (22)
            </button>
            <button className="px-4 py-[6px] bg-[#146EB4] text-[#FFFFFF] rounded-full">
              Refunds (6)
            </button>
          </div>
        </div>
        <div className="flex flex-col px-3 pt-3 pb-2 gap-3 rounded-[8px] bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-4 py-[6px] border border-[#D9D9D9] text-[#808080] rounded w-full max-w-[300px]">
              <IoSearch className="text-lg" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Order ID or transaction ID"
                className="bg-transparent outline-none w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-[6px] px-3 py-[6px] border border-[#D9D9D9] text-[#4D4D4D] rounded min-w-[75px]">
                Sort{" "}
                <Image
                  src={"/updown.png"}
                  alt="updown icon"
                  width={14}
                  height={14}
                />
              </button>
              <button
                onClick={() => setShowDownloadModal(true)}
                className="flex items-center p-2 border border-[#D9D9D9] text-[#4D4D4D] rounded hover:bg-[#F2F2F2] transition-colors"
              >
                <FiDownload className="text-xl" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <colgroup>
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
              </colgroup>
              <thead className="text-[#4D4D4D]">
                <tr className="bg-[#F2F2F2]">
                  <th className="px-3 py-[10px] text-left text-sm font-medium tracking-wider rounded-l">
                    Order ID
                  </th>
                  <th className="px-3 py-[10px] text-left text-sm font-medium tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-[10px] text-left text-sm font-medium tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-3 py-[10px] text-left text-sm font-medium tracking-wider">
                    Refund Date
                  </th>
                  <th className="px-3 py-[10px] text-right text-sm font-medium tracking-wider rounded-r">
                    Order Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-[#E6E6E6]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-[#808080] text-sm">
                      No results found for &quot;{search}&quot;
                    </td>
                  </tr>
                ) : paginated.map((row, index) => (
                  <tr
                    className={`text-sm ${index !== paginated.length - 1 ? "border-b border-[#E6E6E6]" : ""}`}
                    key={row.orderId}
                  >
                    <td className="px-3 py-[10px] whitespace-nowrap text-[#146EB4] font-medium">
                      {row.orderId}
                    </td>
                    <td className="px-3 py-[10px] whitespace-nowrap text-[#1A181E]">
                      <span className="flex items-center gap-[6px]">
                        <span
                          className={`${
                            row.status === "Successful"
                              ? "bg-green-500"
                              : "bg-[#999999]"
                          } w-[10px] h-[10px] rounded-full shrink-0`}
                        ></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-[10px] whitespace-nowrap text-[#4D4D4D]">
                      {row.transactionId}
                    </td>
                    <td className="px-3 py-[10px] whitespace-nowrap text-[#4D4D4D]">
                      {row.refundDate}
                    </td>
                    <td className="px-3 py-[10px] whitespace-nowrap text-[#1A181E] text-right">
                      {row.orderAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 px-1 py-2 border-t border-[#E6E6E6]">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-[#D9D9D9] text-[#4D4D4D] text-xs disabled:opacity-40 hover:bg-[#F2F2F2] transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 text-xs rounded border transition-colors ${
                    p === currentPage
                      ? "bg-[#146EB4] text-white border-[#146EB4]"
                      : "border-[#D9D9D9] text-[#4D4D4D] hover:bg-[#F2F2F2]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-[#D9D9D9] text-[#4D4D4D] text-xs disabled:opacity-40 hover:bg-[#F2F2F2] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
      {showDownloadModal && <DownloadModal onClose={() => setShowDownloadModal(false)} />}
      <footer className="flex flex-col items-center gap-3 py-4 border-t border-[#E6E6E6]">
        <p className="text-sm text-[#808080]">
          Built with ❤️ by <span className="font-semibold text-[#1A181E]">Manudev</span>
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={"https://x.com/twtMahito"}
            target="_blank"
            className="flex items-center gap-1.5 text-[#4D4D4D] hover:text-[#1A181E] transition-colors text-sm"
          >
            <FaXTwitter className="text-base" /> Twitter
          </Link>
          <span className="text-[#D9D9D9]">|</span>
          <Link
            href={"https://github.com/m4nu-git"}
            target="_blank"
            className="flex items-center gap-1.5 text-[#4D4D4D] hover:text-[#1A181E] transition-colors text-sm"
          >
            <FaGithub className="text-base" /> GitHub
          </Link>
          <span className="text-[#D9D9D9]">|</span>
          <Link
            href={"https://www.linkedin.com/in/manudev99/"}
            target="_blank"
            className="flex items-center gap-1.5 text-[#4D4D4D] hover:text-[#146EB4] transition-colors text-sm"
          >
            <FaLinkedin className="text-base" /> LinkedIn
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default DashboardPage;