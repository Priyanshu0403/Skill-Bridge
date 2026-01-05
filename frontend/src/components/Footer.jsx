import React from 'react'

const Footer = () => {
  return (
    <div>
      <div className="p-10 text-center -mt-10">
        <div className="container mx-auto px-4 text-center text-sm">
          © Copyright {new Date().getFullYear()} HireX •{" "}
          <a
            href="https://github.com/Priyanshu0403"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            (Priyanshu Sarvaiyya)
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
