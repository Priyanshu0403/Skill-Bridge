import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background bg-black"></div>
      <main className='min-h-screen container'>
        <Navbar/>
        <Outlet/>
        <Footer/>
      </main>
    </div>
  )
}

export default AppLayout
