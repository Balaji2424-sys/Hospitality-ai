import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import { useApp } from "../context/AppContext.jsx";
import api, { withToken } from "../lib/api.js";

export default function NotificationsPage() {
  const { auth } = useApp();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = () => {
      api
        .get(`/notifications/${auth.user._id}`, withToken(auth.token))
        .then(({ data }) => setNotifications(data.notifications));
    };

    load();
    const intervalId = setInterval(load, 5000);

    return () => clearInterval(intervalId);
  }, [auth]);

  return (
    <Card title="Inbox notifications">
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item._id} className="rounded-3xl border border-slate-200 p-4">
            <div className="font-semibold">{item.title}</div>
            <div className="mt-1 text-sm text-slate-600">{item.message}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
