# Pinch To Open
![](https://media.giphy.com/media/mmQAzKfYggLTO/giphy.gif)

Documentation of the pinch-to-open mechanic inside of Paper Planes, by Active Theory.

## Relevant Files

- planeFold.json
- PlaneFold.vs
- PlaneFold.fs
- PlaneCaught.js
- PlanePinch.js
- PlaneFoldAnimation.js
- PlaneFoldGeometry.js
- PinchMechanism.js

## Description

The pinch-to-open mechanic consisted of a progress variable managed by a pinching interactive class, and a morph target animation created using the WebGL library, Threejs. As a user pinches outwards or inwards ontop of a folded plane, the plane animates itself unfolding and folding. It was very important to us to keep these elements intertwined, so that a user could play with the animation, scrubbing back and forth as they see fit, instead of just triggering an animation as the user starts to interact. These kinds of one-to-one interactions help a great deal in making an application feel responsive and fun.

## Details

The functionality for this section first begins in PlaneCaught.js. This class handles the whole sequence once a plane has been caught, but for our intents has been restricted to just the pinching mechanics. The class begins by initiating or recycling a PlaneFoldGeometry.js class, and resetting it to the required state.

PlaneFoldGeometry.js handles the generation of the geometry and materials. The raw geometry can be found in planeFold.json, containing all of the animation keyframes as separate morph targets (blend shapes). The folding plane actually consists of two objects, with their faces pointing in opposite directions - this allowed us to use the same geometry and animation, yet have two sides to the object with differing materials. Therefore when a user stamps the plane, as it's folded, the backside doesn't also show the stamp, but just a faint bleed of the paper's border through from the other side. The shaders used in the materials can be found under PlaneFold.vs and PlaneFold.fs.

PlanePinch.js handles the communication between folding interaction and folding animation. The interaction is contained inside of PinchMechanism.js, and the animation is maintained inside of PlaneFoldAnimation.js.

PinchMechanism.js tracks the finger positions when two are touching the screen simaltaneously. Then, depending on a max value, derides the progress by comparing the distance between the fingers against this value.

PlaneFoldAnimation.js takes the raw morph targets and creates a scrubbable animation timeline. The progress value from the pinching mechanic is then fed in, updating the animation to the relative point in time.