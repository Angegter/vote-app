import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Потрібно імпортувати useParams
// Зверніть увагу: ми припускаємо, що ці імпорти доступні у вашому проекті
import { api } from './api'; 
import { cable } from './cable';
import { Poll, Vote } from './types'; 

function PollPage() {
  // 1. Отримуємо ID голосування з URL
function PollPage() {
  // 1. Отримуємо ID голосування з URL
  const { id } = useParams<{ id: string }>(); // Це рядок, наприклад '2'
  
  // Парсимо його в число
  const pollId = id ? parseInt(id) : null; 
  
  // При зміні ID, скидаємо попередній стан Poll
  const [poll, setPoll] = useState<Poll | null>(null);

  // 2. Завантаження даних голосування
useEffect(() => {
    if (!pollId) {
      setPoll(null); // Якщо ID немає, очищаємо стан
      return;
    }
    
    // Скидаємо стан перед новим запитом, щоб показати, що дані змінюються
    setPoll(null); 
    
    api.get<Poll>(`/polls/${pollId}`)
      .then((res) => setPoll(res.data))
      .catch((error) => console.error("Error fetching poll data:", error));
      
  }, [pollId]);

  // 3. Підписка на ActionCable
  useEffect(() => {
    if (!poll) return;

    const subscription = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (data: Vote) => {
          setPoll((prev) => {
            if (!prev) return prev;
            return { ...prev, votes: [...prev.votes, data] };
          });
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [poll?.id]);

  // 4. Логіка голосування
  const handleVote = (option: string) => {
    api.post('/votes', {
      vote: { poll_id: poll?.id, option },
    });
  };

  // 5. Логіка підрахунку голосів
  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Loading...</p>;

  // Опції для голосування беремо з votes, як було в оригіналі
  // (Хоча зазвичай їх беруть з poll.options, як в API)
  const uniqueOptions = Array.from(new Set(poll.votes.map((v) => v.option)));

  return (
    <div>
      <h1>{poll.title}</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {uniqueOptions.map((option) => (
          <button key={option} onClick={() => handleVote(option)}>
            {option} ({getCount(option)})
          </button>
        ))}
      </div>
    </div>
  );
}


export default PollPage;

