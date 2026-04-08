"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

type Props = {
  value: string; // "YYYY-MM-DD"
  onChange: (val: string) => void;
  label: string;
  placeholder?: string;
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDisplay(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function DatePicker({ value, onChange, label, placeholder = "Select date" }: Props) {
  const today = new Date();
  const initYear = value ? parseInt(value.split("-")[0]) : today.getFullYear();
  const initMonth = value ? parseInt(value.split("-")[1]) - 1 : today.getMonth();

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const toISO = (d: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const isToday = (d: number) => toISO(d) === today.toISOString().slice(0, 10);
  const isSelected = (d: number) => toISO(d) === value;

  const select = (d: number) => {
    onChange(toISO(d));
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      <label className="text-xs font-medium text-[#4D4D4D]">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between border rounded-lg px-3 py-2.5 text-sm transition-all outline-none ${
          open
            ? "border-[#146EB4] ring-2 ring-[#146EB4]/20"
            : "border-[#D9D9D9] hover:border-[#146EB4]"
        } ${value ? "text-[#1A181E]" : "text-[#B3B3B3]"}`}
      >
        <span>{value ? formatDisplay(value) : placeholder}</span>
        <svg className={`w-4 h-4 text-[#808080] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-xl shadow-xl border border-[#E6E6E6] w-[300px] p-4 select-none">
          {/* Month / Year navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F2F2F2] text-[#4D4D4D] transition-colors"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <span className="text-sm font-semibold text-[#1A181E]">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F2F2F2] text-[#4D4D4D] transition-colors"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-[#B3B3B3] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const selected = isSelected(day);
              const todayCell = isToday(day);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => select(day)}
                  className={`
                    mx-auto w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all
                    ${selected
                      ? "bg-[#146EB4] text-white shadow-sm"
                      : todayCell
                      ? "border border-[#146EB4] text-[#146EB4] hover:bg-[#EBF4FF]"
                      : "text-[#1A181E] hover:bg-[#F2F2F2]"
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 pt-3 border-t border-[#F2F2F2] flex justify-center">
            <button
              type="button"
              onClick={() => {
                const iso = today.toISOString().slice(0, 10);
                onChange(iso);
                setOpen(false);
              }}
              className="text-xs text-[#146EB4] font-medium hover:underline"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
