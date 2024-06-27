import Iframe from "react-iframe";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentPrograms() {
    return (
        <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
                <Iframe
                url="https://f7e6686a.sibforms.com/serve/MUIFAHIAQidbbDBanz1JQz5hYwBdt8JcYCaZzzcM9xNh00HRNrJkpvApvXFE4ryPK9pSmLh5HGAp8XlZmWzTWG-B0NwwKjwIma_uJW8FRIBrw7P3BeSr9_lU3RugMvyEFKHR9adJPHZRK9WNzYxEPOi9YzqWldPsFUpqqkQ_16E5VcT_EswuwZb3wWdATfWfgMxtUXokysouegRg"
                id="brevo"
                className="min-h-screen w-full"
                display="block"
                position="relative"
                width="540px"
                height="1675px"
                scrolling="auto"
                />

                <Link
                href="/"
                className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                >
                Back to Homepage
                </Link>
            </div>
        </div>
        </section>
  );
}
