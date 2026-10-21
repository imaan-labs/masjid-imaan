"use client";

import { useEffect, useState } from "react";
import {
  buildExcuseLetter,
  imaanSignature,
  lettersFor,
  type Audience,
  type LetterId,
} from "@/src/lib/excuseLetters";

const inputClass =
  "mt-1 w-full rounded-xl border border-[#E6D3B0] bg-white px-3 py-2 text-[#3F3428] outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/30";

export default function ExcuseLetters() {
  const [audience, setAudience] = useState<Audience>("student");
  const [letterId, setLetterId] = useState<LetterId>("eid-fitr-student");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [dates, setDates] = useState("");
  const [issuedOn, setIssuedOn] = useState("");

  useEffect(() => {
    setIssuedOn(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  const options = lettersFor(audience);
  const selected = options.find((option) => option.id === letterId) ?? options[0];
  const letter = buildExcuseLetter(selected.id, { name, institution, dates });
  const institutionLabel = audience === "student" ? "School" : "Employer";

  return (
    <div className="excuse-page bg-[#F3EAD7] px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <style>{`
        @media print {
          @page { margin: 0.7in; }
          body * { visibility: hidden; }
          .letter-sheet, .letter-sheet * { visibility: visible; }
          .letter-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            max-width: none !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>

      <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <form
          className="no-print rounded-2xl border border-[#E6D3B0] bg-[#FFF8EC] p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            window.print();
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A7843F]">
            Imaan Masjid
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#047857]">
            Excuse Letters
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#5C5146]">
            Choose a school or workplace letter, then enter the name, institution, and date(s).
            The letter updates as you type.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2" role="group" aria-label="Letter audience">
            {(
              [
                ["student", "School / Students"],
                ["employee", "Workplace / Adults"],
              ] as const
            ).map(([value, label]) => {
              const selectedAudience = audience === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selectedAudience}
                  onClick={() => {
                    const next = lettersFor(value);
                    setAudience(value);
                    setLetterId(next[0].id);
                  }}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    selectedAudience
                      ? "bg-emerald-800 text-white"
                      : "border border-[#E6D3B0] bg-white text-[#3F3428] hover:border-emerald-800"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <label className="mt-5 block text-sm font-semibold" htmlFor="letter-type">
            Letter
            <select
              id="letter-type"
              value={selected.id}
              onChange={(event) => setLetterId(event.target.value as LetterId)}
              className={inputClass}
            >
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-2 text-xs leading-5 text-[#5C5146]">{selected.summary}</p>

          <label className="mt-4 block text-sm font-semibold" htmlFor="person-name">
            Full Name
            <input
              id="person-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              className={inputClass}
              placeholder="Amina Rahman"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold" htmlFor="institution">
            {institutionLabel}
            <input
              id="institution"
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
              className={inputClass}
              placeholder={audience === "student" ? "Melissa High School" : "Employer name"}
            />
          </label>

          <label className="mt-4 block text-sm font-semibold" htmlFor="dates">
            Date(s)
            <input
              id="dates"
              value={dates}
              onChange={(event) => setDates(event.target.value)}
              className={inputClass}
              placeholder={selected.dateHint}
            />
          </label>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
          >
            Print / Save as PDF
          </button>
          <p className="mt-2 text-xs leading-5 text-[#5C5146]">
            In the print dialog, choose Save as PDF to download the letter.
          </p>
        </form>

        <article className="letter-sheet rounded-sm border border-[#E6D3B0] bg-white px-6 py-8 text-[#1C1917] shadow-md sm:px-10 sm:py-10">
          <header className="flex items-center gap-4 border-b-2 border-[#047857] pb-4">
            <img
              src="/images/logo.png"
              alt="Imaan Masjid"
              className="h-20 w-20 object-contain"
            />
            <div>
              <p className="text-lg font-semibold tracking-[0.14em] text-[#047857]">
                IMAAN MASJID
              </p>
              <p className="text-sm text-[#3F3428]">Melissa, Texas</p>
              <p className="text-sm text-[#5C5146]">
                1010 Milrany Ln, Melissa, TX 75454
              </p>
              <p className="text-sm text-[#5C5146]">
                shura@imaanmasjid.org
              </p>
            </div>
          </header>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-3 text-sm">
            <p>
              <span className="font-semibold">To:</span>{" "}
              {institution.trim() || "____________________"}
            </p>
            <p>{issuedOn}</p>
          </div>

          <p className="mt-6 font-semibold">Subject: {letter.subject}</p>
          <p className="mt-4">{letter.salutation}</p>

          <div className="mt-4 space-y-4 text-[15px] leading-7">
            {letter.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <p>{letter.closing}</p>
          </div>

          <p className="mt-8">Sincerely,</p>
          <div className="mt-8 text-sm leading-6">
            {imaanSignature.map((line) => (
              <p key={line} className={line === "Administration" ? "font-semibold" : ""}>
                {line}
              </p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
