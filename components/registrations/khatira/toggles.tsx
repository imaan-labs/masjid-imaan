"use client";

import { useState } from "react";

export default function Toggles() {
  const [volunteer, setVolunteer] = useState(false);
  const [sisterVolunteer, setSisterVolunteer] = useState(false);

  return (
    <div className="">
      <div className="sm:col-span-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value={volunteer.toString()}
            className="sr-only peer"
            onClick={() => setVolunteer(!volunteer)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            I want to volunteer in the brothers section.
          </span>
        </label>

        {volunteer ? (
          <div className="sm:col-span-2 py-4">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              What is the phone number we should contact you at?
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="XXX-XXX-XXXX"
              required
            />
          </div>
        ) : null}
      </div>

      <div className="sm:col-span-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="sisPhone"
            value={sisterVolunteer.toString()}
            className="sr-only peer"
            onClick={() => setSisterVolunteer(!sisterVolunteer)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Sisters in my household want to volunteer in the sisters section.
          </span>
        </label>
      </div>

      {sisterVolunteer ? (
        <div className="sm:col-span-2 py-4">
          <label
            htmlFor="phoneSis"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >
            What is the phone number our sisters should contact you at?
          </label>
          <input
            type="tel"
            id="phoneSis"
            className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
            placeholder="XXX-XXX-XXXX"
            required
          />
        </div>
      ) : null}
    </div>
  );
}
