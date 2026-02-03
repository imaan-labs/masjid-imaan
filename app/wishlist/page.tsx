import Footer from "../../components/ui/footer";
import React from "react";

export default function WishlistPage() {
  const wishlist = [
    {
      link: "https://a.co/d/aVBVNE0",
      imageURL:
        "https://m.media-amazon.com/images/I/51YalDOHf9L._AC_SL1080_.jpg",
      name: "eufy Security S220 SoloCam 4-Cam Pack with Homebase 3, Solar Security Camera, Wireless Outdoor Camera, Continuous Power, 2K Resolution, Wireless, 2.4 GHz Wi-Fi, No Monthly Fee, HomeBase 3 Compatible",
      price: "$439.98",
    },
    {
      link: "https://a.co/d/9V1ngav",
      imageURL:
        "https://m.media-amazon.com/images/I/5184Tn1k-6L._AC_SL1500_.jpg",
      name: "Floor Lamp For Bedroom Multi Head 5 Light Bright Floor Lamp - Medusa 5 Light Standing Lamp -floor Lamps For Bedroom Spider Lamp 5 Acrylic White Shades Standing Light Spider Lamp Silver Floor Lamp",
      price: "$48.95",
    },
    {
      link: "https://a.co/d/cgsutom",
      imageURL:
        "https://m.media-amazon.com/images/I/511ZkCKgwSL._AC_SL1500_.jpg",
      name: "Westek MLC4BC Indoor Plug-In Motion Activated Light Control, No Size, White",
      price: "$19.95",
    },
    {
      link: "https://www.buildasign.com/retractable-banner-sfp-product-testing-size-based-78-x-33",
      imageURL:
        "https://www.buildasign.com/0064712_retractable-banner-sfp-product-testing-size-based-78-x-33_1200.jpeg?width=720&height=450&fit=cover&dpr=2",
      name: "Retractable Banners",
      price: "$99.49",
    },
  ];

  return (
    <div>
      <section className="bg-white dark:bg-gray-900 mt-24">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            List of Items Needed For Masjid
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            The example of those who spend their wealth in the cause of Allah is
            that of a grain that sprouts into seven ears, each bearing one
            hundred grains. And Allah multiplies ˹the reward even more˺ to
            whoever He wills. For Allah is All-Bountiful, All-Knowing.
          </p>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Surah Al-Baqarah Ayat #261
          </p>
        </div>
      </section>
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="h-56 w-full">
                  <a href={item.link} target="_blank">
                    <img
                      className="mx-auto h-full"
                      src={item.imageURL}
                      alt=""
                    />
                  </a>
                </div>
                <div className="pt-6 flex flex-col justify-between">
                  <a
                    href={item.link}
                    className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                  >
                    {item.name}
                  </a>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                      {item.price}
                    </p>

                    <a href={item.link}>
                      <button
                        type="button"
                        className="inline-flex items-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        <svg
                          className="-ms-2 me-2 h-5 w-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                          />
                        </svg>
                        Donate!
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-screen-sm text-center">
        <a
          href="/"
          className="btn-sm text-white bg-teal-600 hover:bg-teal-700 ml-3"
          >
          Back to Homepage
        </a>
      </div>
      <Footer />
    </div>
  );
}
