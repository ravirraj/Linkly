import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Trash2 } from "lucide-react";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
 

  return (
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-gray-800 bg-gray-900">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-white">
            🔗 URL Shortener
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Enter a long URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-10 sm:h-11"
            />
            <Button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto cursor-pointer h-10 sm:h-11">
              Shorten
            </Button>
          </div>
        </CardContent>
      </Card>

  );
}