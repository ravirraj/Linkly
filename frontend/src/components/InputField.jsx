import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiousInstance from "../utils/axiousInstance";
import api from "../utils/axiousInstance";
import { queryClient } from "@/main";

export default function UrlShortener() {
  const [fullUrl, setFullUrl] = useState("");
  const [customSlug, setCustomSlug] = useState(""); // ✅ custom slug
  const [shortUrl, setShortUrl] = useState(""); // ✅ created short url

  // validation
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");

  const isValidUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleChange = (val) => {
    setFullUrl(val);
    if (!val.trim()) {
      setIsValid(true);
      setError("");
      return;
    }
    const ok = isValidUrl(val.trim());
    setIsValid(ok);
    setError(ok ? "" : "Please enter a valid URL (http:// or https://)");
  };

  const handleShorten = async () => {
    const trimmed = fullUrl.trim();
    if (!trimmed) {
      setIsValid(false);
      setError("URL cannot be empty");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setIsValid(false);
      setError("Please enter a valid URL (http:// or https://)");
      return;
    }

    try {
      const payload = { fullUrl: trimmed };
      if (customSlug.trim()) payload.slug = customSlug.trim(); // ✅ slug add

      const res = await api.post("/api/url/create", payload);
      console.log(payload)

      // ✅ short url save in state
      setShortUrl(res.data.data.shortUrl);
      queryClient.invalidateQueries({queryKey : ["userUrls"]}); // Invalidate the URLs query to refresh the list
      setError("");
      setIsValid(true);
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError(
        err.response?.data?.message || "Failed to shorten URL. Try again."
      );
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-gray-800 bg-gray-900">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-white">
          🔗 URL Shortener
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 flex flex-col gap-4">
        {/* Long URL */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="Enter a long URL..."
              value={fullUrl}
              onChange={(e) => handleChange(e.target.value)}
              aria-invalid={!isValid}
              className={`w-full bg-gray-800 text-white placeholder-gray-400 h-10 sm:h-11 ${
                !isValid
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-700"
              }`}
            />
            {error && (
              <p className="mt-1 text-xs text-red-300" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Custom Slug */}
        <Input
          type="text"
          placeholder="Custom slug (optional)"
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          className="bg-gray-800 text-white placeholder-gray-400 h-10 sm:h-11 border-gray-700"
        />

        <Button
          onClick={handleShorten}
          disabled={!fullUrl.trim() || !isValid}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 cursor-pointer h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Shorten
        </Button>

        {/* Display Result */}
        {shortUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">Your short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline font-mono break-all"
            >
              {shortUrl}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
