import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (
    <main id="Home" className="flex flex-col gap-10 sm:gap-20 sm:py-20 py-10">
      <section className="text-center ">
        <h3 className="text-2xl">Hi, Priyanshu 👋</h3>
        <h1  className="flex flex-col items-center justify-center gradient-title font-extrabold text-2xl sm:text-3xl lg:text-7xl tracking-tighter py-3">
          Find Your Dream Job
          <span className="flex items-center gap-2 sm:gap-6">
            and get
            <p className="bg-gradient-to-t from-blue-200 to-blue-500 bg-clip-text text-transparent;">
              Hired
            </p>
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        {/* <Link to={"/jobs"}>
          <Button variant="blue" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to={"/post-job"}>
          <Button variant="white" size="xl">
            Post a Job
          </Button>
        </Link> */}
      </div>
      


      
              <img src="/banner.jpeg" className="w-full" />
           
      

      <section id="AboutUs" className="text-center gradient-title ">
        <div>
          <h2 className="text-3xl font-bold mb-4 sm:mt-24 bg-gradient-to-t from-blue-200 to-blue-500 bg-clip-text text-transparent;">
            About Us
          </h2>
          <p className="text-gray-300 sm:text-lg max-w-3xl mx-auto">
            Hirex is a modern job portal designed to bridge the gap between
            recruiters and job seekers. Whether you're looking for your next
            dream role or seeking top talent, we've got your back. With advanced
            filtering, real-time updates, and easy communication tools, finding
            or posting jobs has never been easier.
          </p>
        </div>
        <div className=" grid grid-cols-1 py-3 md:grid-cols-2 gap-4">
          
        </div>
      </section>

     
    </main>
  
  )
}

export default LandingPage
