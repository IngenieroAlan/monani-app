import { NotificationType } from '@/database/models/SentNotification'

export type NotificationData = {
  cattleId: string
  type: NotificationType
  timestamp: number // Needed for iOS.
  foreignId?: string
  timesPerYear?: number // To reschedule notifications like medications.
  extraInfo?: string
}

export type NotificationProps = {
  id?: string
  title: string
  subtitle?: string
  body: string
  data: NotificationData
  triggerTimestamp: number
}

export enum CattleNotificationEventType {
  MARK_AS_READ = 'markAsRead'
}
