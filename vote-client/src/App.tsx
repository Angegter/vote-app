import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import PollPage from './PollPage'; // Потрібно створити цей файл для Завдання 3

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
        <Routes>
          {/* Завдання 2: Головна сторінка зі списком голосувань */}
          <Route path="/" element={<HomePage />} />
          
          {/* Завдання 3: Детальна сторінка голосування, яка отримує ID з URL */}
          <Route path="/polls/:id" element={<PollPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
