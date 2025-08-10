import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { type INotificationEvent } from 'src/types';

interface ScheduleOptions {
  daysBefore?: number[];
  defaultTime?: string;
}

export const useLocalNotifications = () => {
  const scheduleMultipleNotifications = async (
    event: INotificationEvent,
    options: ScheduleOptions = {},
  ) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') return;

      const { daysBefore = [3, 1], defaultTime = '13:00' } = options;

      const [day, month, year] = event.date.split('.');
      const eventTime = event.time || defaultTime;
      const eventDate = new Date(`${year}-${month}-${day}T${eventTime}`);

      const notificationsToSchedule = [];

      for (const day of daysBefore) {
        const notifyDate = new Date(eventDate);
        notifyDate.setDate(notifyDate.getDate() - day);

        if (notifyDate > new Date()) {
          notificationsToSchedule.push({
            title: event.title,
            body: event.body,
            id: event.id + day,
            schedule: { at: notifyDate },
            sound: 'default',
            extra: {
              eventId: event.id,
              type: `reminder_${day}days`,
              ...event.extra,
            },
          });
        }
      }

      if (notificationsToSchedule.length > 0) {
        await LocalNotifications.schedule({ notifications: notificationsToSchedule });
      }
    } catch (error) {
      console.error('Ошибка при планировании уведомлений:', error);
    }
  };

  const cancelEventNotification = async (eventId: number, daysBefore: number[] = [3, 1]) => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const notificationIds = daysBefore.map((day) => eventId + day);
      await LocalNotifications.cancel({
        notifications: notificationIds.map((id) => ({ id })),
      });
    } catch (error) {
      console.error('Ошибка при отмене уведомлений:', error);
    }
  };

  

  return {
    scheduleMultipleNotifications,
    cancelEventNotification,
  };
};
