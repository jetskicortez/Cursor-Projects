"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

type Step = 1 | 2 | 3;

export default function LeadIntakeForm() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const intentionalSubmitRef = useRef(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    persona: "owner",
    requestType: "sell",
    locationText: "",
    propertyType: "",
    sizeSfText: "",
    budgetText: "",
    timelineText: "",
    notes: "",
    website: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow submission if it was intentionally triggered by the submit button
    if (!intentionalSubmitRef.current) {
      return;
    }
    
    // Reset the flag
    intentionalSubmitRef.current = false;
    
    // Only allow submission on step 3
    if (step !== 3) return;
    
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (submitted) {
    return (
      <div className="space-y-3 text-sm">
        <p className="font-medium text-slate-900">
          Thanks — we&apos;ll reach out shortly.
        </p>
        <p className="text-slate-600">
          Your details are on their way to the brokerage team. If your timing is
          urgent, you can also follow up directly using the contact info on
          jlcortez.com.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        // Prevent ALL Enter key submissions - only allow button click
        if (e.key === "Enter") {
          const target = e.target as HTMLElement;
          // Only allow Enter if it's explicitly the submit button
          if (target !== submitButtonRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
            step === 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          1
        </span>
        <span>Contact</span>
        <span className="h-px flex-1 bg-slate-200" />
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
            step === 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          2
        </span>
        <span>What you need</span>
        <span className="h-px flex-1 bg-slate-200" />
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
            step === 3 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          3
        </span>
        <span>Timing & notes</span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Phone <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Company <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => update("company", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              I am a...
            </label>
            <select
              value={form.persona}
              onChange={(e) => update("persona", e.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            >
              <option value="owner">Property owner</option>
              <option value="landlord">Landlord</option>
              <option value="business_owner">Business owner</option>
              <option value="broker">Broker</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              I need help with...
            </label>
            <select
              value={form.requestType}
              onChange={(e) => update("requestType", e.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            >
              <option value="sell">Selling a property</option>
              <option value="lease_out">Leasing out space</option>
              <option value="lease_space">Leasing space for my business</option>
              <option value="buy">Buying a property</option>
              <option value="unsure">Not sure yet</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Location(s) of interest
            </label>
            <input
              type="text"
              placeholder="Neighborhoods, corridors, or specific addresses"
              value={form.locationText}
              onChange={(e) => update("locationText", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Property type
            </label>
            <input
              type="text"
              placeholder="Office, retail, industrial, mixed-use, land, etc."
              value={form.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Size (approx. SF)
            </label>
            <input
              type="text"
              placeholder="e.g. 2,000–4,000 SF"
              value={form.sizeSfText}
              onChange={(e) => update("sizeSfText", e.target.value)}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Budget / rent range
            </label>
            <input
              type="text"
              placeholder="Monthly rent, purchase range, or &quot;still estimating&quot;"
              value={form.budgetText}
              onChange={(e) => update("budgetText", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Timing
            </label>
            <input
              type="text"
              placeholder="e.g. &quot;ideally this quarter&quot; or &quot;12–18 months&quot;"
              value={form.timelineText}
              onChange={(e) => update("timelineText", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }}
              className="h-9 rounded-md border border-slate-300 px-3 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-medium text-slate-700">
              Anything else that&apos;s helpful
            </label>
            <textarea
              rows={4}
              placeholder="Context about your business, current lease, decision makers, or properties you already have in mind."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              onKeyDown={(e) => {
                // Allow Enter in textarea for multi-line input, but prevent Ctrl+Enter from submitting
                if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                }
              }}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/5 focus:border-slate-900 focus:ring-2"
            />
          </div>
          {/* Honeypot field */}
          <div className="hidden">
            <label>
              Website
              <input
                type="text"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 1 || submitting}
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button
            type="button"
            disabled={submitting}
            onClick={() => setStep((s) => (s < 3 ? ((s + 1) as Step) : s))}
          >
            Next
          </Button>
        ) : (
          <Button
            ref={submitButtonRef}
            type="button"
            disabled={submitting}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Mark this as an intentional submission
              intentionalSubmitRef.current = true;
              // Trigger form submission programmatically
              const form = e.currentTarget.closest("form");
              if (form) {
                form.requestSubmit();
              }
            }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </form>
  );
}


