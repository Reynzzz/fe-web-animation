import React from "react";
import { ArrowUpRight, ChevronRight, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#111114] text-white px-5 md:px-8 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-14">
          {/* LEFT: HEADLINE + EMAIL */}
          <div className="lg:pt-1">
            <h2 className="text-4xl md:text-6xl font-extralight leading-[1.05] tracking-tight">
              READY TO
              <br />
             BUILD YOUR CASE?
            </h2>
            <p className="text-white/60 text-base md:text-lg mt-4">
            Let’s map your commercial objectives to an
            </p>
<p> experience your finance team can see, and your audience won’t forget.</p>
            <a
              href="mailto:mail@ayuta.id"
              className="group inline-flex items-center gap-2 text-xl md:text-2xl font-semibold whitespace-nowrap hover:text-[#d154b8] transition-colors mt-8"
            >
              mail@ayuta.id
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          {/* RIGHT: ADDRESS / FOLLOW / NAV */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-14 md:gap-20">
            {/* OUR ADDRESS */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4">
                Our Address
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Rukan Permata Senayan
                <br />
                Jl. Tentara Pelajar No.16
                <br />
                Blok C No.15
                <br />
                RT.1/RW.7, Grogol Utara
                <br />
                Kebayoran Lama
                <br />
                South Jakarta
              </p>

              <h4 className="text-xs font-bold tracking-widest text-white/50 uppercase mt-8 mb-3">
                WhatsApp
              </h4>
             <p className="text-white/80 text-sm leading-relaxed">
  <a 
    href="https://wa.me/6285773672611" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:text-[#d154b8] transition-colors group"
  >
    <WhatsAppIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
    0857-7367-2611
  </a>
</p>
            </div>

            {/* FOLLOW US */}
            <div>
              <h4 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4">
                Follow Us
              </h4>

              <ul className="space-y-4">
                <li>
                  <a
                    href="https://instagram.com/ayuta.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    <Instagram className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="text-sm leading-relaxed">
                      @ayuta.id
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="https://youtube.com/@ayutasamarthya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    <Youtube className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="text-sm leading-relaxed">
                      ayutasamarthya
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="https://linkedin.com/company/ayuta-samarthya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    <Linkedin className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="text-sm leading-relaxed">
                      Ayuta Samarthya
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* NAV */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#d154b8] transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#d154b8]" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/works"
                    className="text-sm font-semibold text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="text-sm font-semibold text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm font-semibold text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm font-semibold text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-semibold text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    Press &amp; News
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-semibold text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}