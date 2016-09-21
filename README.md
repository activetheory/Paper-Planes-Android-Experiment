# Paper Planes Android Experiment
Paper Planes started as a simple thought - “What if you could throw a paper plane from one screen to another?”

The heart of our concept was to bring people together from all over the world, using the power of the web - an instant connection to one another. Modern web technology, specifically JavaScript and WebGL, powered the experience on every screen.

Paper Planes was initially featured at Google I/O 2016 on May 18th, 2016 as a pre-Keynote event, connecting attendees and outside viewers for 30 minutes preceding Sundar Pichai’s address.

For public launch on Peace Day 2016, we created an Android application to augment the existing web technology with native Android features such as rich notifications when a plane is caught elsewhere in the world.

### The Android App
The Paper Planes Android Experiment uses the same WebGL rendering but is integrated as a WebView within a native Android app that extends its functionality to take advantage of additional features such as Android N rich push notifications and background service intents.

Since Paper Planes is a living application with a functioning back-end infrastructure and a codebase that covers multiple incarnations of the experience, it's not possible to open source the entire project in a way that is secure and be digestible.

Instead, we have created this repository to cover 4 interesting features:

* Flocking: How we used multiple threads in JavaScript to calculate the plane flocking simulation
* Pinch to Open: How we used three.js and morph targets to create an animated folding plane
* Push Notifications: How we utilized firebase and Android N rich notifications
* WebView Native Bridge: A full code example of how to create an app with a full screen WebView as the view layer, along with how to communicate from Java <-> JavaScript

[Paper Planes Desktop](https://paperplanes.world)

[Paper Planes Android Experiment](https://www.androidexperiments.com/experiment/paper-planes)
