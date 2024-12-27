import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from '../pages/Home/Home'
import { TefConfiguration } from '../pages/TefConfiguration/TefConfiguration'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tef-configuration" element={<TefConfiguration />} />
      </Routes>
    </BrowserRouter>
  )
}
