import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserUrls } from "@/api/getUser";

function History() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getUserUrls,
  });


  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  if (isLoading) return <p className="text-gray-400">Loading...</p>;
  if (isError) return <p className="text-red-400">Failed to load history</p>;

  return (
    <div className="w-full max-w-5xl mt-10">
      <h2 className="text-xl font-semibold text-gray-200 mb-5 px-2">
        🔗 Your URL History
      </h2>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
              <th className="px-4 py-3 text-left w-[45%]">Full URL</th>
              <th className="px-4 py-3 text-left w-[30%]">Short URL</th>
              <th className="px-4 py-3 text-center w-[15%]">Clicks</th>
              <th className="px-4 py-3 text-right w-[10%]">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.data.data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-800 transition rounded-lg"
              >
                {/* Full URL */}
                <td className="px-4 py-3 max-w-[250px] truncate">
                  <a
                    href={item.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:underline"
                  >
                    {item.fullUrl}
                  </a>
                </td>

                {/* Short URL */}
                <td className="px-4 py-3 break-all">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 font-medium hover:underline"
                  >
                    {item.shortUrl}
                  </a>
                </td>

                {/* Clicks */}
                <td className="px-4 py-3 text-center text-gray-300 font-medium">
                  {item.clicks}
                </td>

                {/* Copy */}
                <td className="px-4 py-3 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(item.shortUrl)}
                    className="text-gray-400 hover:text-white cursor-pointer h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="space-y-3 md:hidden">
        {data.data.data.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow hover:bg-gray-800 transition"
          >
            <p className="text-xs text-gray-500 mb-1">Full URL</p>
            <a
              href={item.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 truncate block hover:underline"
            >
              {item.fullUrl}
            </a>

            <p className="text-xs text-gray-500 mt-2 mb-1">Short URL</p>
            <a
              href={item.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 font-medium break-all block hover:underline"
            >
              {item.shortUrl}
            </a>

            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-400 text-sm">
                Clicks: <b>{item.clicks}</b>
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(item.shortUrl)}
                className="text-gray-400 hover:text-white cursor-pointer h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
