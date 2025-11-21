import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import PostGig from './pages/PostGig'
import SkillExchange from './pages/SkillExchange'
import Profile from './pages/Profile'
import GigList from './pages/GigList'


function App() {

  return (
    <main>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/post-gig" element={<PostGig/>}/>
          <Route path="/skill-exchage" element={<SkillExchange/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/gig-list" element={<GigList/>}/>
        </Routes>
      </div>
    </main>
  )
}

export default App
