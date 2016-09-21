# Flocking
![](http://i.imgur.com/X8dl0jz.jpg)

Documentation of the flocking behaviour inside of Paper Planes, by Active Theory.

## Relevant Files

- plane.json
- PlaneCPUInstance.vs
- PlaneCPUInstance.fs
- World.js
- IntroMobile.js
- PlaneFlocking.js
- PlaneInstance.js
- PlaneFlockingCPU.js
- PlaneFlockingChunk.js
- PlaneFlockingThread.js
- PlaneFlockingThreadConverter.js
- FlockingBehavior.js
- FlockingAlignment.js
- FlockingAttract.js
- FlockingCohesion.js
- FlockingRotation.js
- FlockingSeparation.js

## Description

The flocking of the paper planes around the Earth was achieved utilising multi-threading to handle the simulations of each plane's location. This kept the main thread free to manage the application's animations and interactions.

Threejs was utilised to generate an instanced geometry, combining all of the planes into one draw call, allowing much complexity while keeping communication to a minimum. Each thread consisted of a separate simulation, dealing each with only a selection of planes; a segment of the geometry. On receiving the updated positions and orientations from each thread, the geometry's buffers are updated to reflect the location of each plane accordingly.

![](https://media.giphy.com/media/1Vhy5H1k7Gny8/giphy.gif)

## Details

Starting inside of IntroMobile.js, we can see the flocking module being initialised and added to the Threejs scene, which itself is created inside of World.js; any manipulation with the WebGL renderer or scene is done via this class.

The initialisation of PlaneFlocking.js first starts with the creation of the necessary Threejs elements. PlaneInstance.js handles this, by first loading the individual plane geometry (plane.json), generating the required amount of instances (nominated through the '_numInstances' variable), and then creating and attaching the corresponding material. The material is a Threejs 'ShaderMaterial' type, in which the Vertex and Fragment shaders are partially custom. The relevant shader files can be found under PlaneCPUInstance.vs and PlaneCPUInstance.fs accordingly. They handle the designation of the different positions and orientations to their relevant plane geometry segments, and then the updating of the lighting information of each face to reflect these changes.

![](http://i.imgur.com/9TdaeH1.jpg)

Next the simulation is instantiated through the use of PlaneFlockingCPU.js. Initially, there was also a GPGPU version written, upon the thinking that it would far outstrip the capabilities of the CPU version, which would still be necessary for many unsupported devices. However, we soon found that utilising threads could handle the required amount of planes while achieving the same performance, and was therefore the only version put into production.

PlaneFlockingCPU.js generated the required amount of 'chunks' (PlaneFlockingChunk.js), each of which serves as the direct communication between a separate thread. Each chunk would then activate a thread, passing through all of the required modules needed to be run. This is achieved through the calls ``.importScript()`` and ``.importClass()``. The earlier generated geometry is also passed down unto the chunks, so that they can in turn update the geometry's buffers immediately upon receiving the updated simulation data. This can be seen occuring inside of the ``updateGeometry()`` function. Each chunk knows which portion of the buffers to update, allowing them to work asynchonously.

The threads themselves (PlaneFlockingThread.js) instantiates each simulation, applies the different behavior modules (found in FlockingBehavior.js). On each update, the thread converts the simulation's javascript objects into a transferable object using PlaneFlockingThreadConverter.js, and then communicates directly with the chunk. On both sides of communication, recycling of objects is used to great effect. Otherwise, passing geometry buffers back and forth would create an enormous amount of garbage and visible hitches on the main thread would be visible.
