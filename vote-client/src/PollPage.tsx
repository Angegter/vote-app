import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from './api';
import { cable } from './cable';
import { Poll, Vote } from './types'; 

function PollPage() {
  const { id } = useParams<{ id: string }>(); 
  
  // Мы должны сбросить состояние, чтобы показать "Loading..." при смене ID
  const [poll, setPoll] = useState<Poll | null>(null); 
  const pollId = id ? parseInt(id) : null;

  // 2. Загрузка данных голосования
  useEffect(() => {
    // 💡 1. Проверяем, что ID изменился и пришел в useEffect
    console.log(`useEffect triggered with Poll ID: ${pollId}`);
    
    if (!pollId) return;

    // 💡 2. СБРОС СОСТОЯНИЯ: Очищаем старые данные, чтобы показать "Loading..."
    // Это гарантирует, что мы не будем отображать Poll 1, когда пытаемся загрузить Poll 2.
    setPoll(null); 
    
    // 3. Отправляем новый запрос
    api.get<Poll>(`/polls/${pollId}`)
      .then((res) => {
        setPoll(res.data);
        console.log(`Successfully loaded Poll ID: ${pollId}`);
      })
      .catch((error) => console.error(`Failed to load Poll ID ${pollId}:`, error));
      
  }, [pollId]); // Зависимость от pollId гарантирует, что эффект сработает при смене ID

  // ... (Остальная логика подписки и голосования остается без изменений)

  // 3. Подписка на ActionCable
  useEffect(() => {
    if (!poll) return;
    
    // Отписываемся от старого ID и подписываемся на новый,
    // когда состояние poll обновится новым объектом.
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

    return () => {
        console.log(`Unsubscribing from Poll ID: ${poll.id}`);
        subscription.unsubscribe();
    }
  }, [poll?.id]);

  // 4. Логика голосования и подсчета... (остается без изменений)

  const handleVote = (option: string) => {
    api.post('/votes', {
      vote: { poll_id: poll?.id, option },
    });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Loading...</p>;

  // Опции для голосования берем из votes, как было в оригинале
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
