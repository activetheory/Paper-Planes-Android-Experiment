# Native -> Push Notifications

As people catch and throw planes from around the world, push notifications was utilized in the Android app to notify users that their plane has been caught and thrown.

Firebase Cloud Messaging (FCM) is used to send push notifications to the app. The example files demonstrates how Firebase libraries were utilized to receive messages within the Android app.

### Subscribing to Messages

In the `build.gradle` file for the application, import the latest `firebase-core` and `firebase-messaging` libraries.

These libraries manage subscribing to the FCM service to receive push notifications. Once subscribed, a token is provided, and this token is used to let the backend know who to notify when that plane is updated. Once ready, the token can be accessed with the following line of code:

```
FirebaseInstanceId.getInstance().getToken();
```

Extend the `FirebaseInstanceIDService` class to listen for updates to the token as the token may change.

### Handling Messages

See `MyFirebaseMessagingService` class for handling of push notifications. This class extends `FirebaseMessagingService` and is used to handle messages as they are received, as well as send rich local push notifications in the app.

`onMessageReceived` is called when a push notification message is received. If the app is running, rich notifications are generated and displayed to the user with actions to view details of a plane or fold a new plane.

Use `NotificationCompat` to build rich notifications in a backward compatible way.

```
NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
    .setColor(parseColor("#ff959cd5"))
    .setSmallIcon(R.drawable.ic_notification)
    .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_world))
    .setContentTitle(title)
    .setContentText(body)
    .setSubText("Tap to view plane")
    .setNumber(count)
    .setAutoCancel(true)
    .setSound(sound)
    .setContentIntent(viewPlanePendingIntent)
    .addAction(R.drawable.ic_notification, "View Plane", viewPlanePendingIntent)
    .addAction(R.drawable.ic_notification, "Fold New Plane", newPlanePendingIntent);
```

Custom action buttons may be assigned to intents. In this case, an intent is setup to view the plane that was just thrown, as well as to throw a new plane.

### Sending Messages

When a new plane is stamped and thrown from the Android app, this data is saved along with subscriber id via a backend service on App Engine. As those planes are caught and re-thrown, the backend service sends an FCM push notification which routes through to the original creator of the plane.

The notification data payload includes the last city it was thrown from, along with how many cumulative miles it has travelled.
