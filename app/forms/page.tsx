import Footer from "@/components/ui/footer";
import Link from "next/link";

export default function FormsPage() {
  const forms = [
    {
      name: "Eid Al Adha 2024 Student Excusal Letter",
      description:
        "A signed excusal letter from Imaan for kids to attend Eid Al Adha.",
      filename: "letters/Students Eid-ul-Adha Excuse Letter.pdf",
    },
    {
      name: "Eid Al Fitr 2024 Student Excusal Letter",
      description:
        "A signed excusal letter from Imaan for kids to attend Eid Al Fitr.",
      filename: "letters/Students Eid-ul-Fitr Excuse Letter.pdf",
    },
    {
      name: "Eid Al Adha 2024 Employee Excusal Letter",
      description:
        "A signed excusal letter from Imaan for work to attend Eid Al Adha.",
      filename: "letters/Employee Eid-ul-Adha Excuse Letter.pdf",
    },
    {
      name: "Eid Al Fitr 2024 Employee Excusal Letter",
      description:
        "A signed excusal letter from Imaan for adults to be excused from work to attend Eid Al Fitr.",
      filename: "letters/Employee Eid-ul-Fitr Excuse Letter.pdf",
    },

    {
      name: "Students Jummah Excusal Letter",
      description:
        "A signed excusal letter from Imaan for kids to be excused from school to attend Jummah.",
      filename: "letters/Students Jummah Excuse Letter.pdf",
    },
    {
      name: "Students Ramadan Fasting Excuse Letter",
      description:
        "A signed letter from Imaan for kids school to be excused from physical activities.",
      filename: "letters/Students Ramadan Fasting Excuse Letter.pdf",
    },
  ];

  return (
    <div>
      <div className="pt-32 flex flex-wrap items-center justify-center">
        {forms.map((form, index) => (
          <div
            key={index}
            className="m-2 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
          >
            <Link href={form.filename}>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {form.name}
              </h5>
            </Link>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {form.description}
            </p>
            <Link
              href={form.filename}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Download
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </div>
        ))}

        <Link
          href="/"
          className="btn-sm text-white bg-teal-600 hover:bg-teal-700 ml-3"
          >
          Back to Homepage
        </Link>
      </div>

      <Footer />
    </div>
  );
}