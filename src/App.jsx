import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Auth from './pages/Auth'
import SenderDashboard from './pages/Sender/SenderDashboard'
import CreateDelivery from './pages/Sender/CreateDelivery'
import RiderDashboard from './pages/Rider/RiderDashboard'
import RecipientOTP from './pages/Recipient/RecipientOTP'
import AdminDashboard from './pages/Admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sender" element={<SenderDashboard />} />
        <Route path="/sender/create" element={<CreateDelivery />} />
        <Route path="/rider" element={<RiderDashboard />} />
        <Route path="/confirm/:deliveryId" element={<RecipientOTP />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App