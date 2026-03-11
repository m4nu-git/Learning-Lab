import { useState } from "react";
import data from "./data";

const ChevronUp = () => (
  <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7"/>
  </svg>
);

const ChevronDown = () => (
  <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
  </svg>
);

function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [effect, setEffect] = useState(false);
  const [multi, setMulti] = useState<string[]>([]);

  const handleClick = (id: string) => {
    // Toggle selected item in multi-selection mode
    setMulti((prevMulti) =>
      effect ? (prevMulti.includes(id) ? prevMulti.filter((item) => item !== id) : [...prevMulti, id]) : []
    );

    // Toggle selected item in single selection mode
    setSelected((prevSelected) => (effect ? prevSelected : prevSelected === id ? null : id));
  };

  const effectClick = () => {
    // Toggle multi-selection mode
    setEffect((prevEffect) => !prevEffect);

    // Reset selections when switching modes
    setSelected(null);
    setMulti([]);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md mt-16">
        <div className="flex justify-center">
          <button
            onClick={effectClick}
            className={`px-6 py-3 mb-6 rounded-full font-semibold tracking-wide text-sm shadow-lg transition-all duration-300 border ${
              effect
                ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white border-violet-700 shadow-violet-300 hover:shadow-violet-400 hover:scale-105"
                : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-gray-200 hover:shadow-gray-400 hover:scale-105"
            }`}
          >
            Multi Selection{" "}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${effect ? "bg-white text-violet-600" : "bg-gray-700 text-white"}`}>
              {effect ? "ON" : "OFF"}
            </span>
          </button>
        </div>
        {data && data.length > 0 ? (
          data.map((dataItem) => (
            <div
              key={dataItem.id}
              className="border border-gray-300 rounded-lg mb-4"
            >
              <div
                onClick={() => handleClick(dataItem.id)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer bg-gray-100"
              >
                <h3 className="font-semibold">{dataItem.question}</h3>
                {effect ? (
                  multi.includes(dataItem.id) ? <ChevronUp /> : <ChevronDown />
                ) : (
                  selected === dataItem.id ? <ChevronUp /> : <ChevronDown />
                )}
              </div>
              {(effect && multi.includes(dataItem.id)) || (!effect && selected === dataItem.id) ? (
                <div className="px-4 py-3 bg-white">
                  <p className="text-gray-700">{dataItem.answer}</p>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg">
            No data found
          </div>
        )}
      </div>
    </div>
  );
}

export default App;