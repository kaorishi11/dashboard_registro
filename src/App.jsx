import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Navbar from './components/Navbar'

import Alunos from './pages/Alunos'
import Presencas from './pages/Presencas'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/alunos"
          element={<Alunos />}
        />

        <Route
          path="/presencas"
          element={<Presencas />}
        />
      </Routes>

    </BrowserRouter>
  )
}

export default App