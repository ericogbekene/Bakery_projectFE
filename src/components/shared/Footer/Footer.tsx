import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#C85387] text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-nowy">Address</h3>
          <p className="text-sm">123 Bakery St, Lagos, Nigeria</p>
          <p className="text-sm">+234 800 123 4567</p>
          <p className="text-sm">info@bakery.com</p>
          <ul className="space-y-2">
            <li>
            Phone: 08100009968
            </li>
            <li>
            WhatsApp: +2348100009968
            </li>
            <li>
            Email: Mandccakess@gmail.com
            </li>
          </ul>

        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-nowy">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-nowy">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 font-nowy">Social Media</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Twitter
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                Tiktok
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                LinkedIn
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-gray-400 font-open-sans font-bold text-sm leading-[28px] ">
                YouTube
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-white mt-6">
  &copy; Copyright 2025. M&C Cakes. All Rights Reserved.
</div>
    </footer>
  );
};

export default Footer;
