import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Trash2 } from "lucide-react";

function History() {
     const [history, setHistory] = useState([
    { id: 1, fullUrl: "https://example.com/long-url-1", shortUrl: "sho.rt/abc123" },
    { id: 2, fullUrl: "https://example.com/long-url-2", shortUrl: "sho.rt/xyz789" },
  ]);
  return (
    <>
    <div className="w-full max-w-2xl mt-6 sm:mt-8 lg:mt-10">
        <h2 className="text-base sm:text-lg font-medium text-gray-300 mb-3 sm:mb-4 px-1">
          History
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {history.map((item) => (
            <Card
              key={item.id}
              className="shadow-sm border border-gray-800 bg-gray-900 hover:shadow-md transition rounded-xl"
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:h-1">
                  <div className="flex flex-col gap-1 overflow-hidden min-w-0 flex-1">
                    <a
                      href={item.fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-gray-400 truncate block"
                      title={item.fullUrl}
                    >
                      {item.fullUrl}
                    </a>
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-sm sm:text-base text-indigo-400 hover:underline break-all sm:break-normal"
                    >
                      {item.shortUrl}
                    </a>
                  </div>
                  <div className="flex gap-1 sm:gap-2 justify-end sm:justify-center flex-shrink-0 mt-1 sm:mt-0">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-black cursor-pointer h-9 w-9"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-400 hover:text-black-300 cursor-pointer h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default History