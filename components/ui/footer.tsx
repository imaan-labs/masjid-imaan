import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
const WHATSAPP_FORM =
  "https://docs.google.com/forms/d/1aQT8UFFkeKrnGlhWZCJ5KrTdQM1OcqaGD5ijvXumkz8";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-slate-100 print:hidden [&_a]:transition-all [&_a]:duration-200 [&_button]:transition-all [&_button]:duration-200">
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top area: Blocks */}
          <div className="grid md:grid-cols-12 gap-8 lg:gap-20 mb-8 md:mb-12">
            {/* 1st block */}
            <div className="md:col-span-4 lg:col-span-5">
              <div className="mb-2">
                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-3">
                  <Image
                    src={Logo}
                    alt=""
                    className="h-14 w-auto"
                    style={{ width: "auto", height: "3.5rem" }}
                  />
                  <span>
                    <span className="block text-lg font-semibold text-white">
                      Imaan Masjid
                    </span>
                    <span className="block text-xs text-emerald-200">Melissa, TX</span>
                  </span>
                </Link>
              </div>
              <div className="text-emerald-100/80">
                No matter who you are, you are a guest of Allah when you come to
                Imaan Masjid in Melissa. Please don't hesitate to join us today!
              </div>
              <a
                href="mailto:shura@imaanmasjid.org"
                className="mt-3 inline-block text-sm font-semibold text-emerald-50 hover:text-white"
              >
                shura@imaanmasjid.org
              </a>
            </div>

            {/* 2nd, 3rd and 4th blocks */}
            <div className="md:col-span-8 lg:col-span-7 grid sm:grid-cols-2 gap-8">
              <div className="text-sm">
                <h6 className="text-emerald-200 font-medium mb-1">Resources</h6>
                <ul>
                  <li className="mb-1">
                    <Link href="/#donate" className="text-emerald-50 hover:text-white">
                      Donate
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/prayer-times" className="text-emerald-50 hover:text-white">
                      Daily Prayer & Jumu&apos;ah
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/bulletin" className="text-emerald-50 hover:text-white">
                      Community Bulletin
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/calendar" className="text-emerald-50 hover:text-white">
                      Hilāl Calendar
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/excuse-letters" className="text-emerald-50 hover:text-white">
                      Excuse Letters
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/gallery" className="text-emerald-50 hover:text-white">
                      Photo Gallery
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 4th block */}
              <div className="text-sm">
                <h6 className="text-emerald-200 font-medium mb-1">Company</h6>
                <ul>
                  <li className="mb-1">
                    <a
                      href="https://www.al-imaan.org"
                      className="text-emerald-50 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Parent Entity
                    </a>
                  </li>
                  <li className="mb-1">
                    <Link href="/privacy" className="text-emerald-50 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link href="/terms" className="text-emerald-50 hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li className="mb-1">
                    <a
                      href="https://maps.app.goo.gl/8Jn9t21YQ51UicqH8"
                      className="text-emerald-50 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Location
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between">
            {/* Social links */}
            <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
              <li>
                <a
                  href={WHATSAPP_FORM}
                  className="flex justify-center items-center text-purple-600 bg-gray-800 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Request WhatsApp invite"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current">
                    <path
                      d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </li>

              <li className="ml-4">
                <a
                  href="https://www.instagram.com/imaan_masjid"
                  className="flex justify-center items-center text-purple-600 bg-gray-800 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Instagram"
                  target="_blank"
                >
                  <svg
                    className="w-8 h-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="20.145" cy="11.892" r="1" />
                    <path d="M16 20c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4zm0-6c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" />
                    <path d="M20 24h-8c-2.056 0-4-1.944-4-4v-8c0-2.056 1.944-4 4-4h8c2.056 0 4 1.944 4 4v8c0 2.056-1.944 4-4 4zm-8-14c-.935 0-2 1.065-2 2v8c0 .953 1.047 2 2 2h8c.935 0 2-1.065 2-2v-8c0-.935-1.065-2-2-2h-8z" />
                  </svg>
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://www.facebook.com/imaanmasjidmelissa"
                  className="flex justify-center items-center text-purple-600 bg-gray-800 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Facebook"
                  target="_blank"
                >
                  <svg
                    className="w-8 h-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
                  </svg>
                </a>
              </li>
              <li className="ml-4">
                <a
                  href="https://twitter.com/IMAAN_masjid"
                  className="flex justify-center items-center text-purple-600 bg-gray-800 hover:text-gray-100 hover:bg-purple-600 rounded-full transition duration-150 ease-in-out"
                  aria-label="Twitter"
                  target="_blank"
                >
                  <svg
                    className="w-8 h-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                  </svg>
                </a>
              </li>
            </ul>

            {/* Copyrights note */}
            <div className="text-emerald-100/70 text-sm mr-4">
              &copy; IMAAN™ - All rights reserved. IMAAN is a tax-exempt non-profit organization registered in the State of Texas, that has been formed exclusively for community building, educational, and religious purposes. It is registered with the Internal Revenue Service under revenue code 501(c)(3).
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
