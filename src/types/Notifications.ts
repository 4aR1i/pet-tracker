export interface INotificationEvent {
  id: number;
  title: string;
  body: string;
  date: string;
  time?: string;
  extra?: Record<string, unknown>;
}