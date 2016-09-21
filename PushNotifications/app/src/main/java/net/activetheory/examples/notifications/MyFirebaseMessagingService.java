package net.activetheory.examples.notifications;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;

import static android.graphics.Color.parseColor;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    /**
     * Called when message is received.
     */
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

        int count = 0;
        String planeId = "";

        // Check if message contains a data payload.
        if (remoteMessage.getData().size() > 0) {
            planeId = remoteMessage.getData().get("id");
            count = Integer.parseInt(remoteMessage.getData().get("count"));
        }

        // Check if message contains a notification payload.
        if (remoteMessage.getNotification() != null) {
        }

        // If app is open, send local notification
        sendNotification(planeId, remoteMessage.getNotification().getTitle(), remoteMessage.getNotification().getBody(), count);
    }

    /**
     * Create and show a simple notification containing the received FCM message.
     */
    private void sendNotification(String planeId, String title, String body, Integer count) {
        // Intent to open plane
        Intent viewPlaneIntent = new Intent(this, MainActivity.class);
        viewPlaneIntent.putExtra("path", "plane/" +  planeId);
        viewPlaneIntent.putExtra("type", "view");
        viewPlaneIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        // Intent to fold new plane
        Intent newPlaneIntent = new Intent(this, MainActivity.class);
        newPlaneIntent.putExtra("path", "new");
        newPlaneIntent.putExtra("type", "new");
        newPlaneIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent viewPlanePendingIntent = PendingIntent.getActivity(PushNotificationsActivity, 0, viewPlaneIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        PendingIntent newPlanePendingIntent = PendingIntent.getActivity(PushNotificationsActivity, 1, newPlaneIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        // Use custom sound for notification
        Uri sound = Uri.parse("android.resource://net.activetheory.paperplanes/" + R.raw.notification);

        // Build notification
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

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }
}
