import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import EventCreation from './pages/EventCreation'
import { EventProvider } from "./context/EventContext";
import EventDetailsPage from "./pages/EventDetailsPage";

function App() {
  return (
    <>
    <EventProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event-create" element={<EventCreation />} /> 
        <Route path="/event/:id" element={<EventDetailsPage />} />
      </Routes>
      </EventProvider>
    </>
  );
}

export default App;
