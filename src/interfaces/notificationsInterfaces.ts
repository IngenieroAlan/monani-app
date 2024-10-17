export interface Notification {
  id: number;
  eventAt: Date;
  title: string;
  description: string;
  iconName: string;
  isMarkedAsRead: boolean;
}
