'use client'

import React, { useState, useRef } from "react";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Image from "next/image";
import Logo from "@/public/images/logo.png";

export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/" className="block" aria-label="Cruip">
              <Image src={Logo} height={64} width={64} alt="logo" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  className="btn-sm text-white bg-teal-600 hover:bg-teal-700 ml-3"
                  href="/#donate"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/letters"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Absent/Excuse Letters
                </Link>
              </li>
              <li>

                <DropdownButton />
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

const DropdownButton = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        buttonRef.current &&
        !(buttonRef.current as any).contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={buttonRef}>
      <button
        type="button"
        className="text-black hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200"
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        More...
        <svg
          className="w-2.5 h-2.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {open && (
        <div
          className="origin-top-left absolute left-0 mt-2 w-44 rounded-lg shadow z-50 bg-white divide-y divide-gray-100 dark:bg-gray-700"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
            <li>
              <Link
                href="/wishlist"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-150"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                href="/registrations/student-programs"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-150"
              >
                Student Programs
              </Link>
            </li>
            <li>
              <a
                className="font-medium text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-4 py-3 flex items-center transition duration-150 ease-in-out"
                href="https://chat.whatsapp.com/FcehoEQjFcsE89qLVrfMQV"
                target="_blank"
                rel="noreferrer"
              >
                Join Whatsapp
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
