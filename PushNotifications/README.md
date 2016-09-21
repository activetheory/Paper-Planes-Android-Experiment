# Native -> Push Notifications

As people catch and throw planes from around the world, push notifications was utilized in the Android app to notify users that their plane has been caught and thrown.

Firebase Cloud Messaging (FCM) was used to send push notifications to the app. This example demonstrates utilizing Firebase libraries to receive push notifications within the Android app.

### Subscribing to FCM

In `build.gradle` file for the application, both `firebase-core` and `firebase-messaging` libraries have been imported.

The Firebase libraries manage registering and subscribing to the FCM service to receive push notifications via FCM. Once a client token is ready, it can be accessed with the following line of code:

```
FirebaseInstanceId.getInstance().getToken();
```

The `FirebaseInstanceIDService` can be extended to listen for updates to the token. Once a token has been received, this token is used by the app to associate a plane with that client.

### Handling Messages 

See `MyFirebaseMessagingService` for handling of push notifications. This class extends `FirebaseMessagingService` and will fire off event handlers when messages are received. 

`onMessageReceived` is called when a push notification message is received. If the app is running, rich notifications are generated and displayed to the user with actions to view details of a plane or fold a new plane.

The following code can be used to build rich notifications:

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

### Sending Messages

When a new plane is stamped and thrown, this data is saved via a backend service on App Engine.

As planes are caught and re-thrown, the backend service sends a push notification to the original plane creator. The notification data payload includes the last city it was thrown from, along with how many cumulative miles it has travelled.