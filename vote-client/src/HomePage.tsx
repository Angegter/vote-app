import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 1. Інтерфейс для типування даних
interface Poll {
  id: number;
  title: string;
  created_at: string;
  options: string[];
}

// 2. Дані-заглушки (якщо API не працює)
// Використовуємо дані з опису завдання:
const MOCK_POLLS: Poll[] = [
  { id: 1, title: "Your favorite programming language?", created_at: "2025-12-01T10:00:00Z", options: ["Ruby", "JS", "Python"] },
  { id: 2, title: "Best frontend framework?", created_at: "2025-12-02T11:00:00Z", options: ["React", "Vue", "Angular"] },
  // Додамо третє голосування, яке ви додали до seed:
  { id: 3, title: "Which day is best for deployment?", created_at: "2025-12-03T12:00:00Z", options: ["Monday", "Friday", "Saturday"] }
];

const HomePage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const API_URL = 'http://localhost:3000/polls';

  useEffect(() => {
    // 3. Спроба завантажити дані з API
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API is not available, using mock data.');
        return res.json();
      })
      .then(data => setPolls(data))
      .catch(error => {
        // Якщо API недоступний, використовуємо заглушки
        console.error("Using mock data:", error.message);
        setPolls(MOCK_POLLS);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 All Polls</h1>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Title</th>
            <th>Options Count</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {polls.map(poll => (
            <tr key={poll.id}>
              <td>{poll.title}</td>
              <td>{poll.options.length}</td>
              <td>{new Date(poll.created_at).toLocaleDateString()}</td>
              <td>
                {/* Посилання на сторінку деталізації (Task 3) */}
                <Link to={`/polls/${poll.id}`}>View Poll</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;