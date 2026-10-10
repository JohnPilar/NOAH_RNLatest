## NOAH Mobile App running version 0.81

### General Project Notes

- JDK Version: 20.0.2
- NodeJS Version: 22.19.0 (LTS)
- Some libraries are downgraded due to some issues with the new RN version
- NewArch IS DISABLED

### Modules Notes

- **react-native-vision-camera (version 4.7.2)**  
  Edit the file located here:  
  _/node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/react/CameraDevicesManager.kt_  
  This fixes app crashing when the app is reloaded

```kotlin
   fun sendAvailableDevicesChangedEvent() {
      //remove these lines
     val eventEmitter = reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
     val devices = getDevicesJson()
     eventEmitter.emit("CameraDevicesChanged", devices)
      //replace them with these
     if (reactContext.hasActiveReactInstance()) {
       val eventEmitter = reactContext.getJSModule(RCTDeviceEventEmitter::class.java)
       val devices = getDevicesJson()
       eventEmitter.emit("CameraDevicesChanged", devices)
     }
   }
```

### Mobile App Notes

- **app.config.tsxx**  
  Different clients have different needs, please copy the current enabled configs in the _Config_ then modify them as needed, then just comment out the previous config.

```javascript
// EXAMPLE MODIFICATION (ALWAYS INCLUDE THE CLIENT NAME ABOVE)

  // NOAH/SCMS STANDARD
  // APP_ENABLE_NOTIFICATION: true,
  // APP_INCLUDE_DEMO_V1: true,
  // HOME_SHOW_ANNOUNCEMENT: true,
  // HOME_SHOW_NEWS: true,
  // HOME_CLOCKINGSYSTEM: false,

  // FPMC CONFIG
  APP_ENABLE_NOTIFICATION: false,
  APP_INCLUDE_DEMO_V1: false,
  HOME_SHOW_ANNOUNCEMENT: false,
  HOME_SHOW_NEWS: false,
  HOME_CLOCKINGSYSTEM: false,
```

- **iOS Podfile**  
  Insert inside **target 'NOAH' do** below **config = use_native_modules!** before running **pod install**

```
use_frameworks! :linkage => :static
$RNFirebaseAsStaticFramework = true
use_modular_headers!
```
