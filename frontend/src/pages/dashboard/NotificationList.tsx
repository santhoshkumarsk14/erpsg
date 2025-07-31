import React, { useEffect, useState } from 'react';
import { getNotificationsForUser, markNotificationAsRead } from '../../services/notificationService';

interface NotificationListProps {
  userId: number;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await getNotificationsForUser(userId);
    setNotifications(res.data);
    setLoading(false);
  };

  const handleMarkAsRead = async (id: number) => {
    await markNotificationAsRead(id);
    fetchNotifications();
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.read ? 'normal' : 'bold' }}>
            [{n.type}] {n.message} ({n.channel})
            {!n.read && <button onClick={() => handleMarkAsRead(n.id)}>Mark as read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList; 