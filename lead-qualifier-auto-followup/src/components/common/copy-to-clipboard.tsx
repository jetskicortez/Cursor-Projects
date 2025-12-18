"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyToClipboardProps {
  value: string;
  label: string;
}

export function CopyToClipboard({ value, label }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore failures for MVP
    }
  };

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
      {copied ? "Copied" : label}
    </Button>
  );
}


