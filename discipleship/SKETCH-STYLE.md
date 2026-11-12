# Dave's Sketch Style (house style for story art, from Nov 12, 2026)

Dave prefers his first images over polished, fully rendered charcoal art. The models to match are `images/good-samaritan-story.jpg`, `images/jesus-sends-72.jpg`, `images/202-07-two-coins-bw.jpg`, and `images/emmaus-bread-seq-1.jpg`. Always attach two or three of these as reference images when generating new art, because the reference images do more to set the style than the words do.

Before drawing anything, check `discipleship/images` for an existing picture of the story. If Dave already has one, use it or build from it instead of drawing a new one.

### The style prompt

Use this text as the base and add the scene after it:

> Loose, quick black marker sketch on plain white paper, in the same hand as the reference images. Bold scribbled diagonal hatching for shadows and gray marker tone, confident gestural ink lines, unfinished edges that fade into white paper. People drawn simply, with little facial detail and no polished rendering. Lots of white space. No color, no text, no border, not a cartoon, not a finished painting.

Then describe the scene in one or two plain sentences: who is there, what they are doing, and the one object that matters most (the bread, the coins). Name the time period clearly, for example robes, low tables, cushions, and stone steps, and say "no chairs" or "no modern items" when needed. Spell out who each person is (for example "an elderly woman in a head covering") because the generator sometimes swaps them.

### Color

The default is black and white. Color is allowed only as one small accent on the key object, such as copper coins or a soft glow, and only when Dave asks for it.

### One movement: four-frame scroll sequences

When one object carries the story, make a four-frame scroll sequence where only that object moves and everything else stays locked. Build the frames from one approved image. Frame 1 is the starting state and frame 4 is the end state. Generate new versions with the approved image as reference, then paste only the small region that changes (the bread and hands, or the coins) onto the approved frame with a soft feathered mask, so the rest of the picture never shifts between frames. For a simple object like coins, cut the object out and move it by hand instead of regenerating. Use stops `[0, 0.18, 0.34, 0.5]` and the sequence block format in [story-image.md](story-image.md). Current examples are emmaus-bread-seq (203-03) and 202-07-two-coins-seq (202-07).

### Sizes and checks

Generate at 16:9. Either keep it at 1280x720 or crop it to 3:2 at 1248x832 to match the lesson's other frames. Save as JPG, then run `npm ci` and `node scripts/build_lesson_images.js`. Show Dave the image or a contact sheet before opening a PR. He approves all art.
