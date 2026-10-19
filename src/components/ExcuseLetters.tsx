"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  buildExcuseLetter,
  excuseLetterOptions,
  imaanSignature,
  type LetterId,
} from "@/src/lib/excuseLetters";

const inputClass =
  "mt-1 w-full rounded-xl border border-[#E6D3B0] bg-white px-3 py-2 text-[#3F3428] outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/30";

export default function ExcuseLetters() {
  const [letterId, setLetterId] = useState<LetterId>("eid-fitr");
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

  const selected = excuseLetterOptions.find((option) => option.id === letterId)!;
  const letter = buildExcuseLetter(letterId, { name, institution, dates });

  return (
    <div className="excuse-page min-h-screen bg-[#F3EAD7] px-4 pb-16 pt-28 text-[#3F3428] sm:px-6">
      <style>{`
        @media print {
          @page { margin: 0.7in; }
          .excuse-page { padding: 0 !important; background: white !important; }
          .no-print { display: none !important; }
          .letter-sheet {
            border: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            max-width: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
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
            Choose a letter, then enter the name, institution, and date(s).
            The letter updates as you type.
          </p>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-[#047857]">
              Letter
            </legend>
            <div className="mt-2 space-y-2">
              {excuseLetterOptions.map((option) => {
                const active = option.id === letterId;
                return (
                  <label
                    key={option.id}
                    className={`block cursor-pointer rounded-xl border px-3 py-2 ${
                      active
                        ? "border-[#047857] bg-[#047857] text-[#F6F0E6]"
                        : "border-[#E6D3B0] bg-white text-[#3F3428]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="letter"
                      value={option.id}
                      checked={active}
                      onChange={() => setLetterId(option.id)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-semibold">
                      {option.title}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs leading-5 ${
                        active ? "text-[#E7D7B8]" : "text-[#5C5146]"
                      }`}
                    >
                      {option.summary}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-semibold" htmlFor="person-name">
            Student/Employee Name
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
            School/Institution Name
            <input
              id="institution"
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
              className={inputClass}
              placeholder="Melissa High School"
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
            className="mt-5 w-full rounded-full bg-[#047857] px-4 py-3 text-sm font-semibold text-[#F6F0E6] hover:bg-[#065F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
          >
            Print / Save as PDF
          </button>
          <p className="mt-2 text-xs leading-5 text-[#5C5146]">
            In the print dialog, choose Save as PDF to download the letter.
          </p>
          <p className="mt-4 text-xs leading-5 text-[#5C5146]">
            Pre-signed blank copies are still available on the{" "}
            <Link href="/letters" className="font-semibold text-[#047857] underline">
              original letters page
            </Link>
            .
          </p>
        </form>

        <article className="letter-sheet rounded-sm border border-[#E6D3B0] bg-white px-6 py-8 text-[#1C1917] shadow-md sm:px-10 sm:py-10">
          <header className="flex items-center gap-4 border-b-2 border-[#047857] pb-4">
            <img
              src="/images/logo.jpeg"
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
                shura@imaanmasjid.org · imaanmasjid.org
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
