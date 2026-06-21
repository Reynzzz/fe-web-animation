import React from "react";
import { Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#17171b] text-white relative overflow-hidden px-5 md:px-8 pt-16 pb-6">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* TOP CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 xl:gap-14 pb-14">
          {/* BRAND */}
          <div className="relative">
            <Link
              to="/"
              className="text-3xl md:text-4xl font-black tracking-tighter mb-8 block"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AYUTA
              </span>
            </Link>

            <div className="flex items-start gap-4">
              <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-sm">
                Ayuta Samarthya has long been at the forefront of creating
                change and helping companies to leverage their brand campaign
                through our unique approaches.
              </p>
            </div>
          </div>

          {/* OFFICE */}
          <div>
            <h4 className="text-lg font-bold mb-5">Head Office</h4>

            <p className="text-white/80 text-base leading-relaxed mb-10">
              Jl. Taman Betok No 20, Jati,
              <br />
              Pulo Gadung Jakarta Timur,
              <br />
              DKI Jakarta 13220
            </p>

            <h4 className="text-lg font-bold mb-5">Marketing Office</h4>

            <p className="text-white/80 text-base leading-relaxed">
              Jl. Cikini I No 5 Menteng,
              <br />
              Jakarta Pusat, DKI Jakarta 10330
            </p>
          </div>

          {/* INQUIRIES */}
          <div>
            <h4 className="text-lg font-bold mb-5">Work inquiries</h4>

            <p className="text-white/80 text-base leading-relaxed mb-10">
              Interested in working with us?
              <br />

              <a
                href="mailto:mail@ayuta.id"
                className="font-semibold hover:text-[#d154b8] transition-colors"
              >
                mail@ayuta.id
              </a>
            </p>

            <h4 className="text-lg font-bold mb-5">Phone</h4>

            <div className="text-white/80 text-base leading-relaxed font-semibold space-y-1">
              <p>(021) 470 6434</p>
              <p>(021) 470 6435</p>
            </div>
          </div>

          {/* BROCHURE */}
          <div>
            <h4 className="text-lg font-bold mb-5">
              Company Profile Brochure
            </h4>

            <p className="text-white/80 text-base leading-relaxed mb-6">
              Download our Company Profile to understand and connect with us for
              possible synergy.
            </p>

            <div className="text-base font-semibold mb-10 flex flex-wrap gap-2">
              <a
                href="#"
                className="text-[#d154b8] hover:text-white transition-colors"
              >
                Company Profile
              </a>

              <span className="text-white/50">|</span>

              <a
                href="#"
                className="text-[#d154b8] hover:text-white transition-colors"
              >
                Company Video
              </a>
            </div>

            <h4 className="text-lg font-bold mb-5">
              For More Information
            </h4>

            <div className="flex flex-wrap gap-3">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Youtube, href: "#" },
                { Icon: MessageCircle, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#d154b8] hover:border-[#d154b8] transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <p>© 2020 PT. Ayuta Samarthya</p>

          <p>All right reserved.</p>
        </div>
      </div>
    </footer>
  );
}