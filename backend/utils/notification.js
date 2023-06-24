import moment from "moment";

export default class NotificationUtils {
  // Format the notification - Used in Socket
  static formatNotification(username, text) {
    return {
      username,
      text,
      time: moment().format("h:mm a"),
    };
  }
}
