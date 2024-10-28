import { Model, Q } from "@nozbe/watermelondb";
import { date, field, readonly, writer } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";
import { Database } from "@nozbe/watermelondb";

class Notification extends Model {
  static table = TableName.NOTIFICATIONS;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  
  @date("event_at") eventAt!: Date;
  @field("title") title!: string;
  @field("description") description!: string;
  @field("icon_name") iconName?: string;
  @field("is_marked_as_read") isMarkedAsRead!: boolean;

  @writer async markAsRead() {
    await this.update((noti) => {
      noti.isMarkedAsRead = true;
    });
  }
  
  @writer async deleteNoti() {
    await this.destroyPermanently();
  }

  static async countNotifications(database: Database): Promise<number> {
    const notifications = await database.collections
      .get<Notification>(TableName.NOTIFICATIONS)
      .query(Q.where('is_marked_as_read', false))
      .fetch();
    return notifications.length;
  }
}

export default Notification;
