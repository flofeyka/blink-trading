"use client";

import { useState } from "react";

export default function Switch() {
  const [isOn, setIsOn] = useState(false);

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOn}
        onChange={() => setIsOn(!isOn)}
      />
      <div className="w-7 h-3 bg-[#716F7A] peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[-3px] after:left-[-2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all"></div>
    </label>
  );
}
