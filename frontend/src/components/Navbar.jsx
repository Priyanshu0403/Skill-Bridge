import React from 'react'
import { Link, Links } from 'react-router-dom'


const Navbar = () => {
  return (
    <div className="py-11">
      <div className="w-full flex justify-center fixed top-0 z-50">
        <nav
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 
                   w-[92%] max-w-8xl h-20 px-6 flex items-center justify-between 
                   rounded-xl shadow-lg border border-white/10 
                   bg-blue/30 backdrop-blur-md transition-all duration-300"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba( 20,60,120,0.5)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src="/logo.png" className="h-16" alt="Hirrd Logo" />
            </Link>
          </div>

          {/* Nav links - desktop only */}
          <div className="hidden md:flex flex-1 justify-center gap-6 text-sm text-neutral-300 font-medium">
            <Link to="/">
              <button
                // onClick={() => scrollToId("Home")}
                className="hover:text-white hover:scale-105 transition duration-200"
              >
                Home
              </button>
            </Link>
            <button
              // onClick={() => scrollToId("AboutUs")}
              className="hover:text-white hover:scale-105 transition duration-200"
            >
              About Us
            </button>
            <button
              // onClick={() => scrollToId("faqs")}
              className="hover:text-white hover:scale-105 transition duration-200"
            >
              FAQs
            </button>
            <button
              // onClick={() => scrollToId("ContactUs")}
              className="hover:text-white hover:scale-105 transition duration-200"
            >
              Contact Us
            </button>
          </div>

          
          {/* Right buttons */}
          {/* Right section */}
         
          {/* Always visible on all screens */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              
            </div>
          </div>
        </nav>


      </div>
    </div>
  )
}

export default Navbar
