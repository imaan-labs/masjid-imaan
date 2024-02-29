"use client";
import { useState } from "react";

export default function SubmissionListAccess(props: {
  data: Record<string, any>[];
  password: string;
}) {
  const [hasAccess, setHasAccess] = useState(false);

  return hasAccess ? (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg pt-32">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Headcount
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Sister Phone
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((data) => (
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {data.name}
              </th>
              <td className="px-6 py-4">{data.email}</td>
              <td className="px-6 py-4">{data.headcount}</td>
              <td className="px-6 py-4">{data.phone}</td>
              <td className="px-6 py-4">{data.sisPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="pt-32 flex flex-col items-center bg-white">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="text"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="what is the password?"
            required
            onChange={(e) => {
              if (e.target.value === props.password) setHasAccess(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}
