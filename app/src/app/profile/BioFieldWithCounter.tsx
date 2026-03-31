"use client";

import { useState } from "react";

type BioFieldWithCounterProps = {
  initialBio: string;
  maxLength: number;
};

export function BioFieldWithCounter({ initialBio, maxLength }: BioFieldWithCounterProps) {
  const [value, setValue] = useState(initialBio);
  const overLimit = value.length > maxLength;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor="bio">
        Bio
      </label>
      <textarea
        id="bio"
        name="bio"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className={overLimit ? "font-medium text-red-600" : "text-gray-500"}>
          {value.length} / {maxLength}
        </span>
        {overLimit && (
          <span className="text-red-600">Over limit; please shorten your bio.</span>
        )}
      </div>
    </div>
  );
}
