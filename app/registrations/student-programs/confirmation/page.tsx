import Iframe from "react-iframe";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentPrograms() {
    return (
        <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
            <br /><br />
                <h1 className="h1 mb-4">
                    Registration Form Submitted!
                </h1>
                <p className="text-xl text-black-400 mb-8">
                    <br /><br />
                    For the registration process to complete, please pay the fees for the program(s) you've enrolled via zelle<br /><br />
                    donate@imaanmasjid.org<br /><br />
                    Set memo for each payment as the program name!<br /><br />
                    Jazak Allah<br /><br />
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
