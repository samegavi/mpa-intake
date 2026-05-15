"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const MPA_OPTIONS = [
  "Strategic partnership",
  "Merger or acquisition",
  "Funding / investment",
  "Capacity building",
  "Network & peer access",
  "Knowledge sharing",
  "Co-delivery of programmes",
  "Shared services",
  "Other",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  role: string;
  organisation: string;
  geography: string;
  legal_status: string;
  impact_delivered: string;
  how_delivers_impact: string;
  impact_measurement: string;
  staff_size: string;
  annual_budget: string;
  strengths: string;
  gaps: string;
  interested_from_mpa: string[];
  ideal_deal: string;
  what_you_offer: string;
  timeline: string;
  culture_description: string;
  junior_culture_description: string;
  admired_organisation: string;
  preventing_work: string;
}

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  organisation: "",
  geography: "",
  legal_status: "",
  impact_delivered: "",
  how_delivers_impact: "",
  impact_measurement: "",
  staff_size: "",
  annual_budget: "",
  strengths: "",
  gaps: "",
  interested_from_mpa: [],
  ideal_deal: "",
  what_you_offer: "",
  timeline: "",
  culture_description: "",
  junior_culture_description: "",
  admired_organisation: "",
  preventing_work: "",
};

export default function IntakeForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function toggleMpa(option: string) {
    setForm((prev) => {
      const current = prev.interested_from_mpa;
      return {
        ...prev,
        interested_from_mpa: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const body = new FormData();

      // Append scalar fields
      for (const [key, value] of Object.entries(form)) {
        if (Array.isArray(value)) {
          value.forEach((v) => body.append(key, v));
        } else {
          body.append(key, value);
        }
      }

      // Append files
      if (files) {
        for (let i = 0; i < files.length; i++) {
          body.append("documents", files[i]);
        }
      }

      const res = await fetch("/api/submit", { method: "POST", body });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Submission failed");

      router.push("/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
          MP&amp;A Partner Intake
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Tell us about your organisation. All fields are optional unless marked
          required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Section 1: About you ─────────────────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">About you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                className="form-input"
                value={form.name}
                onChange={set("name")}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="form-label">Role</label>
              <input
                className="form-input"
                value={form.role}
                onChange={set("role")}
                placeholder="e.g. CEO, Programme Director"
              />
            </div>
            <div>
              <label className="form-label">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => { e.target.setCustomValidity(""); set("email")(e); }}
                onInvalid={(e) => {
                  const el = e.target as HTMLInputElement;
                  if (el.validity.valueMissing) {
                    el.setCustomValidity("Email address is required");
                  } else {
                    el.setCustomValidity("Enter a valid email address, e.g. you@organisation.org");
                  }
                }}
                placeholder="you@organisation.org"
              />
            </div>
            <div>
              <label className="form-label">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                pattern="^\+[0-9\s()\-\.]{6,18}$"
                className="form-input"
                value={form.phone}
                onChange={(e) => { e.target.setCustomValidity(""); set("phone")(e); }}
                onInvalid={(e) => {
                  const el = e.target as HTMLInputElement;
                  if (el.validity.valueMissing) {
                    el.setCustomValidity("Phone number is required");
                  } else if (!el.value.startsWith("+")) {
                    el.setCustomValidity("Please include your country code, e.g. +233 for Ghana or +44 for UK");
                  } else {
                    el.setCustomValidity("Enter a valid phone number with country code, e.g. +233265427212 or +44 7700 900000");
                  }
                }}
                placeholder="e.g. +233265427212"
              />
            </div>
            <div>
              <label className="form-label">Organisation</label>
              <input
                className="form-input"
                value={form.organisation}
                onChange={set("organisation")}
                placeholder="Organisation name"
              />
            </div>
            <div>
              <label className="form-label">Geography</label>
              <input
                className="form-input"
                value={form.geography}
                onChange={set("geography")}
                placeholder="Where you operate"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Legal status</label>
              <input
                className="form-input"
                value={form.legal_status}
                onChange={set("legal_status")}
                placeholder="e.g. Registered charity, CIC, Ltd company"
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Impact ─────────────────────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">Impact</h2>
          <div className="space-y-5">
            <div>
              <label className="form-label">
                What impact does your organisation deliver?
              </label>
              <textarea
                className="form-textarea"
                value={form.impact_delivered}
                onChange={set("impact_delivered")}
                placeholder="Describe the change your organisation creates…"
              />
            </div>
            <div>
              <label className="form-label">How does it deliver that impact?</label>
              <textarea
                className="form-textarea"
                value={form.how_delivers_impact}
                onChange={set("how_delivers_impact")}
                placeholder="Programmes, services, advocacy, etc."
              />
            </div>
            <div>
              <label className="form-label">
                How do you measure impact and what is your current scale of impact?
              </label>
              <textarea
                className="form-textarea"
                value={form.impact_measurement}
                onChange={set("impact_measurement")}
                placeholder="Metrics, reach, outcomes…"
              />
            </div>
          </div>
        </div>

        {/* ── Section 3: Organisation profile ──────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">Organisation profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">What is your staff size?</label>
              <input
                className="form-input"
                value={form.staff_size}
                onChange={set("staff_size")}
                placeholder="e.g. 12 FTE, 5–10 staff"
              />
            </div>
            <div>
              <label className="form-label">What is your annual budget?</label>
              <input
                className="form-input"
                value={form.annual_budget}
                onChange={set("annual_budget")}
                placeholder="e.g. £500k, $1–2M"
              />
            </div>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <label className="form-label">
                What are your organisation&apos;s biggest strengths?
              </label>
              <textarea
                className="form-textarea"
                value={form.strengths}
                onChange={set("strengths")}
                placeholder="What do you do exceptionally well?"
              />
            </div>
            <div>
              <label className="form-label">
                What are your organisation&apos;s gaps?
              </label>
              <textarea
                className="form-textarea"
                value={form.gaps}
                onChange={set("gaps")}
                placeholder="Where do you struggle or lack capacity?"
              />
            </div>
          </div>
        </div>

        {/* ── Section 4: Partnership intent ────────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">Partnership intent</h2>

          <div className="mb-5">
            <label className="form-label">
              What would you be interested in from MP&amp;A?
            </label>
            <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MPA_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition text-sm
                    ${
                      form.interested_from_mpa.includes(opt)
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-gray-200 hover:border-indigo-300 text-gray-600"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={form.interested_from_mpa.includes(opt)}
                    onChange={() => toggleMpa(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="form-label">
                What would your ideal deal bring to you?
              </label>
              <textarea
                className="form-textarea"
                value={form.ideal_deal}
                onChange={set("ideal_deal")}
                placeholder="Describe what success looks like for your organisation…"
              />
            </div>
            <div>
              <label className="form-label">What would you offer to the deal?</label>
              <textarea
                className="form-textarea"
                value={form.what_you_offer}
                onChange={set("what_you_offer")}
                placeholder="Assets, capacity, relationships, IP, etc."
              />
            </div>
            <div>
              <label className="form-label">What timeline are you thinking of?</label>
              <input
                className="form-input"
                value={form.timeline}
                onChange={set("timeline")}
                placeholder="e.g. 6–12 months, by end of year"
              />
            </div>
          </div>
        </div>

        {/* ── Section 5: Culture ────────────────────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">Culture</h2>
          <div className="space-y-5">
            <div>
              <label className="form-label">
                How would you describe your culture?
              </label>
              <textarea
                className="form-textarea"
                value={form.culture_description}
                onChange={set("culture_description")}
                placeholder="Values, ways of working, leadership style…"
              />
            </div>
            <div>
              <label className="form-label">
                How would your most junior staff member describe your culture?
              </label>
              <textarea
                className="form-textarea"
                value={form.junior_culture_description}
                onChange={set("junior_culture_description")}
                placeholder="Be honest — what would they say?"
              />
            </div>
          </div>
        </div>

        {/* ── Section 6: Sector context ─────────────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">Sector context</h2>
          <div className="space-y-5">
            <div>
              <label className="form-label">
                What is an organisation in your sector that you admire?
              </label>
              <input
                className="form-input"
                value={form.admired_organisation}
                onChange={set("admired_organisation")}
                placeholder="Name an org and briefly why you admire them"
              />
            </div>
            <div>
              <label className="form-label">
                What is preventing you from exploring this work without support?
              </label>
              <textarea
                className="form-textarea"
                value={form.preventing_work}
                onChange={set("preventing_work")}
                placeholder="Barriers, risks, uncertainties…"
              />
            </div>
          </div>
        </div>

        {/* ── Section 7: Supporting documents ──────────────────── */}
        <div className="form-section">
          <h2 className="section-heading">Supporting documents</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload any documents that help us understand your organisation
            (annual reports, strategy docs, accounts, etc.). Max 10 MB per file.
          </p>
          <label
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition
              ${files && files.length > 0 ? "border-indigo-400 bg-indigo-50" : "border-gray-300 hover:border-indigo-300 bg-gray-50"}`}
            onClick={() => fileRef.current?.click()}
          >
            <svg
              className="w-8 h-8 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {files && files.length > 0 ? (
              <span className="text-sm font-medium text-indigo-600">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </span>
            ) : (
              <span className="text-sm text-gray-400">
                Click to choose files, or drag &amp; drop
              </span>
            )}
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles(e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg"
            />
          </label>

          {files && files.length > 0 && (
            <ul className="mt-3 space-y-1">
              {Array.from(files).map((f) => (
                <li key={f.name} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="text-indigo-400">✓</span>
                  {f.name}{" "}
                  <span className="text-gray-300">
                    ({(f.size / 1024).toFixed(0)} KB)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Error ─────────────────────────────────────────────── */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ── Submit ────────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                     text-white font-semibold text-base transition disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-md hover:shadow-lg"
        >
          {submitting ? "Submitting…" : "Submit intake form"}
        </button>
      </form>
    </main>
  );
}
