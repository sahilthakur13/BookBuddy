import React from 'react';

const Footer = () => {
  // Function to handle coming soon alerts
  const handleComingSoon = (e) => {
    e.preventDefault();
    alert("This page is coming soon! Stay tuned.");
  };

  return (
    <footer className="w-full bg-blue-700 text-neutral-300 py-8 px-4 sm:py-10 sm:px-6 lg:py-12 lg:px-8 border-t border-neutral-800 font-sans rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">
        
        {/* Left Side: Brand Section */}
        <div className="flex-1 min-w-0 lg:min-w-[250px]">
          <h1 className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-neutral-900 border-2 border-neutral-700 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl tracking-tight">
            <span className="text-lg sm:text-xl font-black text-white leading-tight">
              TICKET BOOK{" "}
              <span className="bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-md font-mono italic">
                BUDDY
              </span>
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 text-sm text-white max-w-xs leading-relaxed">
            Your premium destination for effortless event planning and seamless booking solutions.
          </p>
        </div>

        {/* Right Side: Links and Details Grid */}
        <div className="flex-[2] grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          
          {/* About Us Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">
              About Us
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={handleComingSoon}
                  className="hover:text-white/70 transition-colors duration-200 text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  Support
                </button>
              </li>
              <li>
                <button
                  onClick={handleComingSoon}
                  className="hover:text-white/70 transition-colors duration-200 text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={handleComingSoon}
                  className="hover:text-white/70 transition-colors duration-200 text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  Pricing and refund
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={handleComingSoon}
                  className="hover:text-white/70 transition-colors duration-200 text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  Review
                </button>
              </li>
              <li>
                <button
                  onClick={handleComingSoon}
                  className="hover:text-white/70 transition-colors duration-200 text-left bg-transparent border-none p-0 cursor-pointer"
                >
                  Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="xs:col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3 sm:mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="leading-relaxed">
                <span className="font-medium text-white block sm:inline">Online: </span>
                11am to 6pm
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-white block sm:inline">Gmail: </span>
                <a
                  href="mailto:thakur13092003@gmail.com"
                  className="hover:text-white/70 transition-colors duration-200 break-all"
                >
                  sahilthakurdev13@gmail.com
                </a>
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-white block sm:inline">Phone: </span>
                <a
                  href="tel:8091792553"
                  className="hover:text-white/70 transition-colors duration-200"
                >
                  8091792553
                </a>
              </li>
              <li className="leading-relaxed">
                <span className="font-medium text-white block sm:inline">Address: </span>
                South extension R.K. Puram, Delhi
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-8 sm:mt-10 lg:mt-12 pt-5 sm:pt-6 border-t border-neutral-800 text-center text-xs text-white">
        &copy; {new Date().getFullYear()} Ticket Book Buddy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;