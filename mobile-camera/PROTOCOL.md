# Phase 3 Camera Protocol

The Android client uses a local WebSocket connection to the desktop receiver. The endpoint is entered manually in the app so discovery can be added later without changing the frame transport.

## Connection

```text
ws://DESKTOP_LAN_IP:8765/frames
```

The desktop should bind only to the local network during development. The client sends binary JPEG messages; each message is one camera frame. The default client settings are 1280×720 capture, JPEG quality 0.72, and 5 FPS, with selectable 2/5/10 FPS controls.

The receiver should treat a clean close as a disconnect, report the last frame timestamp, and decode each binary payload into the existing `CameraFrame` abstraction. No camera frame is uploaded to a third-party service.

## Browser-first test

Run the web client before building Android:

```bash
npm install
npm run dev
```

Open the printed local URL in a browser, allow camera access, and enter a reachable desktop WebSocket endpoint. The same `dist/` output is what Capacitor copies into the Android WebView.

## Android build

```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

The generated project targets Android SDK 35 and requires a full JDK (including `javac`), Android SDK platform 35, Android build tools, and `ANDROID_HOME` or `ANDROID_SDK_ROOT` configured. The current sandbox generated the project and Gradle wrapper successfully, but does not include the Android SDK or Java compiler, so APK compilation must be performed on a configured Android build machine.
