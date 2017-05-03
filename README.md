### Name and Project Name

Submariner - Jason Tang, Ray Dongho Kim, Santiago Buenahora, Kunal Garg, Tim Clancy

### Link to Demo

You can view our prototype demo reel [here](https://www.youtube.com/watch?v=E1o_stj1ScQ).

### Techniques used, and why those techniques.

We used a Node.js/SocketIO server so that our puzzle logic can be coded in JavaScript on the server. We use a C++ class to generate the puzzles, and we also have some C++ code in our post-processing material for the radar. We had a blueprint interface to make the items be intractable in similar way.

We used these techniques to make our game easily scalable. For example, adding a new room of the submarine is almost trivial with this setup; the use of SocketIO and our server framework makes it so multiplayer can be extended to many different rooms simply sharing a common sub-wide state. These methods also allow us to easily add objects for the player to more closely interact with.

### How to play (using a controller or HMD)

When you start the game, you first need to enter the server ip address. Then, you will be directed into a lobby, where you can choose to play in single player or a team of four. In that team:

The Captain sees the instructions and the amount of tries left. His job is to relay the instructions to the team. He also is the one who sees information such as depth, direction, and required torpedo.

The Engineer adjusts the depth of the submarine. He also has to look around and check if there are any leaking pipes. If there’s one and he couldn’t fix it in time, it would be one strike to the submarine as it gets more unstable.

The Navigator steers the direction of the submarine per Captain’s orders. The room goes into a sonar effect periodically, which can be quite confounding for the Navigator. They need to carefully plan how they are going to rotate their two levers in advance.

The Gunner loads the torpedo. He also has a rifle used to keep the torpedo clear of a barnacle infestation. Just like with the Engineer, if these barnacles are left unchecked then they will damage the ship.

The Lone Wolf mode for single player is basically a simpler version of all four players combined. He will have to adjust the depth, direction and shoots the torpedo all by himself. All requisite equipment is all in the same room for the Lone Wolf.

### When in VR mode, did you feel any motion sickness? Why and why not?

We don’t experience any motion sickness as most of our interactions do not require too much movement of the character. There is also teleportation available in the lobby, and we blink every time the player moves as such. Previous iterations did certainly have their fair share of nausea-inducing bugs, however.

### What was the hardest part of the assignment?

The most frustrating part of this assignment definitely was the 90 degrees rotation of the arms, which confounded us for weeks. We were also unable to test with the full capacity of four players that frequently. However, the inclusion of Lone Wolf allowed for any number of players to work together. We also wasted a lot of time trying to troubleshoot and workaround a known flaw in our critical library, detailed below.

### What do you wish you’d done differently?

We should’ve started with the VR template first and then start working on the project on top of the working teleportation. Porting working VR assets into our project proved quite difficult, but in the end we achieved very satisfying results for the VR movement.

We also discovered too late to change course (approximately 10 days into the project, after all of the work on the project plan had been written and we’d fallen in love with the idea of Submariner) that there’s a known bug in getnamo’s community SocketIO plugin which prevents clients from disconnecting without crashing in a packaged project. For us, this means that players cannot switch levels in a game which has been packaged. As such, we need to demonstrate from the editor.

### What do you wish we had done differently?
	
Nothing. This was an excellent assignment with requirements both structured enough to meet and free-form enough to allow for really challenging, ambitious games like Submariner.

Credits: Realistic M1 Garand by Karl Schecht is licensed under CC Attribution.
