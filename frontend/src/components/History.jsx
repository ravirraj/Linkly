import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

function History() {
  const [history, setHistory] = useState([
    {
      id: 1,
      fullUrl: "https://example.com/long-url-1",
      shortUrl: "sho.rt/abc123",
      clicks: 42,
    },
    {
      id: 2,
      fullUrl: "https://example.com/long-url-2",
      shortUrl: "sho.rt/xyz789",
      clicks: 13,
    },
  ]);

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-4 px-1">
        History
      </h2>

      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-12 text-sm font-medium text-gray-400 border-b border-gray-700 pb-2 mb-2">
        <div className="col-span-5">Full URL</div>
        <div className="col-span-3">Short URL</div>
        <div className="col-span-2">Clicks</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="grid sm:grid-cols-12 gap-2 sm:gap-0 items-center text-sm bg-gray-900 border border-gray-800 rounded-lg px-3 py-3 hover:bg-gray-800 transition"
          >
            {/* Full URL */}
            <a
              href={item.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-5 text-gray-400 truncate hover:underline"
              title={item.fullUrl}
            >
              {item.fullUrl}
            </a>

            {/* Short URL */}
            <a
              href={item.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-3 font-medium text-indigo-400 hover:underline break-all"
            >
              {item.shortUrl}
            </a>

            {/* Clicks */}
            <div className="sm:col-span-2 text-gray-300 font-medium">
              {item.clicks}
            </div>

            {/* Actions */}
            <div className="sm:col-span-2 flex gap-2 justify-start sm:justify-end">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleCopy(item.shortUrl)}
                className="text-gray-400 hover:text-white cursor-pointer h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-600 cursor-pointer h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
