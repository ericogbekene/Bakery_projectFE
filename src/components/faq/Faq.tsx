import React from "react";
import Image from "next/image";
import icon1 from "../../../public/icon1.png";
import icon2 from "../../../public/iconTwo.png";
import icon3 from "../../../public/iconThree.png";
import icon4 from "../../../public/iconFour.png";
import icon5 from "../../../public/iconFive.png";
import icon6 from "../../../public/iconSix.png";
import icon7 from "../../../public/icon7.png";
import icon8 from "../../../public/icon8.png";
import icon9 from "../../../public/icon9.png";
import icon10 from "../../../public/iconTen.png";
import icon11 from "../../../public/icon11.png";

export default function Faq() {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 font-nowy">
      <div className="w-full max-w-6xl">
        <div className="text-center p-2 m-2 bg-[#F4DDE7] w-full max-w-[1200px] mb-3">
          <h1 className=" text-4xl py-2 font-extrabold">
            Frequently Asked Questions
          </h1>
          <p className="  p-6">
            These FAQs and answers have been curated to answer all the basic and
            important questions you have about our product. If you still have
            further questions after reading this, you can contact our customer
            care line and we wil be there to answer.
          </p>
        </div>
        <section>
          <div  className="flex flex-col md:flex-row gap-4 p-2">
            <ul className="space-y-5 w-full md:w-1/2">
              <li className="font-extrabold">
                <Image src={icon1} alt="icon" className="inline mx-2" />
                What types of baked goods do you offer?
                <p className="font-normal text-md">
                  We offer a variety of items including breads, cakes, pastries,
                  cookies, muffins, and seasonal specialties. Check our menu for
                  a full list of products.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon2} alt="icon" className="inline mx-2" />
                Do you offer custom cakes or personalized orders?
                <p className="font-normal text-md">
                  Yes, we offer custom cakes for birthdays, weddings, and other
                  special occasions. Please contact us at least 2 weeks in
                  advance to discuss your design and flavor preferences.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon3} alt="icon" className="inline mx-2" />
                What are your store hours?
                <p className="font-normal text-md">
                  Our bakery is open Mondays to Saturdays from 8am to 7pm. For
                  holiday hours or special closures, please visit our website or
                  contact us directly.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon4} alt="icon" className="inline mx-2" />
                Do you offer delivery?
                <p className="font-normal text-md">
                  We offer delivery within Abuja for orders over 10,000 naira.
                  For delivery outside this region, please contact us to discuss
                  options.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon5} alt="icon" className="inline mx-2" />
                How should I store your baked goods?
                <p className="font-normal text-md">
                  To keep our baked goods fresh, store them in an airtight
                  container at room temperature. For items with cream or custard
                  refrigeration is recommended.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon6} alt="icon" className="inline mx-2" />
                Do you have a loyalty program or discounts?
                <p className="font-normal text-md">
                  Yes, we have a loyalty program where you can earn points with
                  each purchase. We also offer occasional discounts and
                  promotions, so be sure to follow us on all our social media
                  platforms for latest updates.
                </p>
              </li>
            </ul>
            <ul className="space-y-5 w-full md:w-1/2">
              <li className="font-extrabold">
                <Image src={icon7} alt="icon" className="inline mx-2" />
                Can I place an order in advance?
                <p className="font-normal text-md">
                  Yes, you can place orders in advance for pickup or delivery.
                  For custom cakes, we recommend placing your order at least 2
                  weeks in advance.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon8} alt="icon" className="inline mx-2" />
                What payment methods do you accept?
                <p className="font-normal text-md">
                  We accept major credit cards, debit cards, and cash.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon9} alt="icon" className="inline mx-2" />
                Do you accommodate special dietary requests?
                <p className="font-normal text-md">
                  We strive to accommodate various dietary needs. Please inform
                  us of any allergies or dietary restrictions when placing your
                  order, and we will do our best to assist you.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon10} alt="icon" className="inline mx-2" />
                What types of Nigerian baked goods do you offer?
                <p className="font-normal text-md">
                  We offer a variety of traditional Nigerian pastries and cakes
                  such as chin chin, puff puff, meat pies, sausage rolls, and
                  Nigerian-style cakes.
                </p>
              </li>
              <li className="font-extrabold">
                <Image src={icon11} alt="icon" className="inline mx-2" />
                Do you offer custom orders for Nigerian events?
                <p className="font-normal text-md">
                  Yes, we can customize cakes and pastries for events like
                  weddings, birthdays, and traditional ceremonies. Please
                  contact us in advance to discuss your needs.
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
