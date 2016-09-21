package net.activetheory.nativewebview;

import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class WKInterface {
    private MainActivity _activity;
    private static WebView webview;

    public WKInterface(WebView wv, MainActivity activity) {
        _activity = activity;
        webview = wv;
    }

    @JavascriptInterface
    public void postMessage(String message) throws JSONException {
        JSONObject data = new JSONObject(message);
        Log.d("WKInterface", "Message from JavaScript: "+message);

        _activity.sendNotification(data.getString("title"), data.getString("body"));
    }

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
}
