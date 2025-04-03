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
                className="btn-sm text-white bg-teal-600 hover:bg-teal-700 ml-3"
                >
                Back to Homepage
                </Link>
            </div>
        </div>
        </section>
  );
}
