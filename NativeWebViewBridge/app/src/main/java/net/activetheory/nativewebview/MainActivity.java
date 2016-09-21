package net.activetheory.nativewebview;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v7.app.AppCompatActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.HashMap;
import java.util.Map;

import static android.graphics.Color.parseColor;

public class MainActivity extends AppCompatActivity {

    private WebView _webview;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        _webview = (WebView) findViewById(R.id.webview);

        WebSettings webSettings = _webview.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setDomStorageEnabled(true);

        _webview.setWebViewClient(new WebViewClient());
        _webview.addJavascriptInterface(new WKInterface(_webview, this), "native");

        WebView.setWebContentsDebuggingEnabled(true);

        _webview.loadUrl("file:///android_asset/index.html", null);
    }

    public void sendNotification(String title, String body) {
        Uri sound = Uri.parse("android.resource://net.activetheory.nativewebview/" + R.raw.notification1);
        Bitmap icon = BitmapFactory.decodeResource(getBaseContext().getResources(), R.mipmap.ic_launcher);

        Intent button0Intent = new Intent(this, MainActivity.class);
        button0Intent.putExtra("type", "button0");
        button0Intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent button0PendingIntent = PendingIntent.getActivity(this, 0, button0Intent, PendingIntent.FLAG_UPDATE_CURRENT);

        Intent button1Intent = new Intent(this, MainActivity.class);
        button1Intent.putExtra("type", "button1");
        button1Intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent button1PendingIntent = PendingIntent.getActivity(this, 1, button1Intent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
                .setColor(parseColor("#ff959cd5"))
                .setSmallIcon(R.mipmap.ic_launcher)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setLargeIcon(icon)
                .setContentTitle(title)
                .setContentText(body)
                .setSubText("Tap to open")
                .setNumber(100)
                .setAutoCancel(true)
                .setSound(sound)
                .setContentIntent(button0PendingIntent)
                .addAction(R.mipmap.ic_launcher, "Button 0", button0PendingIntent)
                .addAction(R.mipmap.ic_launcher, "Button 1", button1PendingIntent);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        try {
            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.cancelAll();

            Bundle extras = intent.getExtras();
            if (extras != null) {
                if (extras.containsKey("type")) {
                    String button = extras.getString("type");

                    Map<String, Object> output = new HashMap<String, Object>();
                    output.put("buttonClick", button);
                    WKInterface.send(output);
                }
            }
        } catch(Error e) {

        }

    }
}
