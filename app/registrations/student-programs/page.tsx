import Iframe from "react-iframe";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentPrograms() {
    return (
        <section className="">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
                {/* <Iframe
                url="https://f7e6686a.sibforms.com/serve/MUIFAMcSDj7z0R8SiDqo_guGUdxfDddLVRLSjlWnzJj2XvJDA0FtFR1JQ81EttF2Bv10jUNIGWpiQz26YHUofFspk_YA29aFpxuWNquzd1H6XMDu8fWMhC1_XQanfcxyr0eoiYiVEGw5TJcseLD3HxXb4_LCLTk68L8TMSrmJVyirPQfa6LQPQAFKUPYOmZj9EzgFW6CYx8vLuNq"
                id="brevo"
                className="min-h-screen w-full"
                display="block"
                position="relative"
                width="540px"
                height="1720px"
                scrolling="auto"
                /> */}

                <h1 className="h1 mb-4">
                    Registrations are not open yet!
                </h1>
                <p className="text-xl text-black-400 mb-8">
                    <br /><br />
                    There are no active programs by the Masjid at the moment<br /><br />
                    Please contact the Masjid staff for updates at shura@imaanmasjid.org<br /><br />
                    If there are any programs available through the volunteers, those may have their own registration process.<br /><br />
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
