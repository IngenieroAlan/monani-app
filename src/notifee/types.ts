import { NotificationType } from '@/database/models/Notification'

export type NotificationData = {
  cattleId: string
  type: NotificationType
  timestamp: number // Needed for iOS.
  foreignId?: string
  monthInterval?: number // To reschedule notifications like medications.
  extraInfo?: string
}

export enum CattleNotificationEventType {
  MARK_AS_READ = 'markAsRead'
}
