# Native -> WebView Communication
An extremely powerful feature of Android is the fact that Chrome is built into the operating system and can be used to build apps that extend the power of the web with native features of Android.

This repository demonstrates creating a fullscreen WebView app with Java <-> JavaScript communication in order to send data and fire a native Android 7 notification.

### Getting started
This project was created with a default "Empty Activity" Android Studio template. The first step with a new Android Studio project is to replace the contents of ```res/layout/activity_main.xml``` with a single WebView element:

```
<WebView xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webview"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent">
</WebView>
```

In  ```AndroidManifest``` we also need to make some modifications to ```activity```.
```
<activity
    android:launchMode="singleTop"
    android:configChanges="orientation|screenSize"
    android:name=".MainActivity" >
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```
The key line being ```android:launchMode="singleTop"``` which tells Android to only ever create one instance of this Activity. Without this, Android would re-create the MainActivity and WebView when a notification is pressed or the user changes device orientation.

### MainActivity
In ```onCreate``` in MainActivity, a reference is created to the WebView view. Default parameters are set that would be useful in an app, such as telling the WebView to use JavaScript, allow access to local files, allow local storage, and enable inspection via Desktop Chrome Inspector.

```
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
```

To communicate from Java <-> JavaScript, we create an instance of  ``WKInterface`` which will send and receive messages.

### Communication to and from WebView
In ```WKInterface``` the ```JavascriptInterface``` exposes the postMessage method to JavaScript

```
@JavascriptInterface
public void postMessage(String message) throws JSONException {
    JSONObject data = new JSONObject(message);
    Log.d("WKInterface", "Message from JavaScript: "+message);

    _activity.sendNotification(data.getString("title"), data.getString("body"));
}
```
Messages can be sent back to JavaScript by calling the static method ```send``` and passing in a Map which is converted to a JSON string that can be evaluated in JavaScript.

```
public static void send(Map<String, Object> data) {
    JSONObject json = new JSONObject(data);
    final String jsonString = json.toString();

    webview.post(new Runnable() {
        @Override
        public void run() {
            webview.evaluateJavascript("window.messageFromJava("+jsonString+")", null);
        }
    });
}
```

```webview.post``` is used since the WebView exists on the UI thread.

### Example Interaction
To put this all into action, a simple JavaScript app is served from the android_asset directory. A simple 3D scene is created, demonstrating how to set up and render WebGL within the app, and on user touch an event is sent to Java in order to fire a native notification with data from JavaScript.

In order to establish communication from JavaScript -> Java, the ```sendToNative``` function receives an object and passes it as a string to the ```postMessage``` Java function. A global method is also exposed to be able to receive incoming data from Java.

```
function sendToNative(object) {
    window.native.postMessage(JSON.stringify(object));
}

window.messageFromJava = function(message) {
    console.log('Message from Java', message);
}
```

When a tap is registered on the screen, data is sent to Java with details for the push notification via
```sendToNative({title: 'Title from JavaScript', body: 'Body from JavaScript'});```

### Notification Builder
In ```WKInterface```, when a message is received from Java, public ```sendNotification``` method is called on ```MainActivity``` which will build the notification to be sent to the system.

```
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
```

Within a notification intent, extra data is supplied which can be read later when a user interacts with the notification.
```button0Intent.putExtra("type", "button0");```

A few more methods in ``MainActivity`` will handle when a notification has been tapped and route the appropriate data back to the WebView.

```
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
```
