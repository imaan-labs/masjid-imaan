import Iframe from "react-iframe";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentPrograms() {
    return (
        <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
                <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                    Registration Form Submitted!
                </h1>
                <p className="mb-4 text-3xl tracking-tight font-bold text-white md:text-4xl dark:text-white">
                    For the registration process to complete, please pay the fees for the program(s) you've enrolled via zelle<br /><br />
                    donate@imaanmasjid.org<br /><br />
                    Set memo for each payment as the program name! Jazak Allah
                </p>

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
