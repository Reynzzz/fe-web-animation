import React from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#111114] text-white px-5 md:px-8 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-14">
          {/* LEFT: HEADLINE + EMAIL */}
          <div className="lg:pt-1">
            <h2 className="text-4xl md:text-6xl font-extralight leading-[1.05] tracking-tight">
              READY WHEN
              <br />
              YOU ARE.
            </h2>
            <p className="text-white/60 text-base md:text-lg mt-4">
              Let&apos;s talk about what&apos;s next.
            </p>

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
                Phone
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                (021) 470 6434
                <br />
                (021) 470 6435
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
                    className="group flex items-start gap-2 text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="text-sm leading-relaxed">
                      Instagram
                      <br />
                      @ayuta.id
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="https://youtube.com/@ayutasamarthya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="text-sm leading-relaxed">
                      YouTube
                      <br />
                      ayutasamarthya
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="https://linkedin.com/company/ayuta-samarthya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-white/80 hover:text-[#d154b8] transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="text-sm leading-relaxed">
                      LinkedIn
                      <br />
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