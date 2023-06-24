import "./Notification.css";
const Notification = ({ notification }) => {
  return (
    <div className="notification-text">
      [{notification.time}] {notification.username}: {notification.text}
    </div>
  );
};

export default Notification;
