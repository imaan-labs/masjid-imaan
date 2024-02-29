import { SubmitButton } from "@/components/registrations/Submit";
import Toggles from "@/components/registrations/bayyan/toggles";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export default async function BayyanForm() {
  async function onSubmit(form: FormData) {
    "use server";
    // const formData = new FormData(event.currentTarget);
    const name = form.get("name") as string;
    const headcount = form.get("headcount") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const sisPhone = form.get("sisPhone") as string;

    if (!name || !headcount || !email) return;
    if (
      typeof name !== "string" ||
      typeof headcount !== "string" ||
      typeof email !== "string"
    )
      return;
    if (phone && typeof phone !== "string") return;
    if (sisPhone && typeof sisPhone !== "string") return;

    await prisma.khatiraEventRSVP.create({
      data: {
        name: name,
        headcount: Number(headcount),
        email: email,
        phone,
        sisPhone,
      },
    });

    redirect("/");
  }

  const registered = await prisma.khatiraEventRSVP
    .findMany()
    .then((all) => all.reduce((acc, event) => acc + event.headcount, 0));

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-16 md:py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
          Bayyan Registration March 9th 2024
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          Join us for a short lecture from Shaykh Moulana Raheel Syed and dinner
          provided for everyone! Meet and greet the community of muslims near
          you!
        </p>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          {registered.toLocaleString()} people registered!
        </p>
        <form action={onSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="name@imaanmasjid.org"
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="Full Name Here"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="headcount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              How many family members will join you? Please provide an accurate
              estimate so that we can arrange the dinner accordingly. A baby who
              does not need their own plate of food should not be included in
              the count
            </label>
            <input
              type="number"
              id="headcount"
              name="headcount"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
              placeholder="1"
              required
            />
          </div>
          <Toggles />
          <SubmitButton className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" />
        </form>
      </div>
    </section>
  );
}
