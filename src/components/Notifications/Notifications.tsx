import styles from "./Notifications.module.css";
import { X } from "lucide-react";
import { useCallback, useState, useEffect, useRef } from "react";
import { useAppDispatch } from "../../hooks/store/useAppDispatch";
import { useAppSelector } from "../../hooks/store/useAppSelector";
import { removeNotification } from "../../store/notifications/notificationsSlice";

export const Notifications = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);
  const [closingIds, setClosingIds] = useState<Set<string>>(new Set());
  const scheduledIds = useRef<Set<string>>(new Set());

  const handleClose = useCallback(
    (id: string) => {
      setClosingIds((prev) => new Set(prev).add(id));

      setTimeout(() => {
        dispatch(removeNotification(id));
        setClosingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        scheduledIds.current.delete(id);
      }, 300);
    },
    [dispatch],
  );

  useEffect(() => {
    notifications
      .filter((n) => n.type === "success" && !scheduledIds.current.has(n.id))
      .forEach((n) => {
        scheduledIds.current.add(n.id);
        setTimeout(() => handleClose(n.id), 3000);
      });
  }, [notifications, handleClose]);

  if (notifications.length === 0) return null;

  return (
    <div className={styles["notifications"]}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles["notification"]} ${styles[`notification_${notification.type}`]} ${closingIds.has(notification.id) ? styles["notification_closing"] : ""}`}
        >
          <span className={styles["notification__message"]}>{notification.message}</span>
          <button
            className={styles["notification__close"]}
            onClick={() => handleClose(notification.id)}
          >
            <X className={styles["notification__close-icon"]} />
          </button>
          {notification.type === "success" && (
            <div className={styles["notification__progress"]} />
          )}
        </div>
      ))}
    </div>
  );
};
