const r={id:"river-1",title:"Meet Frida",description:"Meet Frida, the 3-hopper",type:"free-exploration",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,promptText:`Meet Frida, the 3-hopper! She can jump 3 lily pads at a time.

Try hopping left and right to see where she can go.`,successMessage:"Ready for the next challenge?",requireExplicitAnswer:!0,answerType:"continue",autoContinueAfterMs:2e4}},o={id:"river-2",title:"Addition Discovery",description:"Can Frida reach 51?",type:"guided-challenge",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,highlightPads:[24,27],targetPad:51,promptText:"Frida can reach lilypad 24 and 27. Can you reach lilypad 51?",requireExplicitAnswer:!0,answerType:"yes-no",successCondition:e=>e.frogIdx===51,successMessage:"You did it! You reached 51 from 24 and 27."},unlocksAfter:["river-1"]},t={id:"river-2b",title:"How It Works",description:"Understanding 24 + 27",type:"explanation",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,highlightPads:[24,51],promptText:`Here's the key insight:

Frida can reach pad 24 (somehow).
Frida can reach pad 27 (somehow).

So if she goes to 24 first...
Then pretends 24 is the origin...
And hops 27 more pads forward...

She reaches 24 + 27 = 51!`,cameraSequence:[{targetPad:24,durationMs:2500,message:"First: Frida can reach pad 24"},{targetPad:24,durationMs:2500,message:"Now pretend 24 is the origin (pad 0)"},{targetPad:24,durationMs:2e3,message:"Relabel: what was 51 is now '27 pads away'"},{targetPad:51,durationMs:3e3,message:"From this new origin, hop 27 more → 51!"},{targetPad:51,durationMs:2e3,message:"So 24 + 27 = 51"}],skipIntroButton:!1,successMessage:"This pattern works for ANY pads she can reach!",requireExplicitAnswer:!0,answerType:"continue"},unlocksAfter:["river-2"]},i={id:"river-3",title:"Subtraction Discovery",description:"Reach 57 from 99 and 42",type:"guided-challenge",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,highlightPads:[99,42],targetPad:57,promptText:`Frida can reach lilypad 99.
She can also reach lilypad 42.

Can you reach lilypad 57?`,hintText:"57 = 99 - 42",cameraSequence:[{targetPad:0,durationMs:1e3},{targetPad:99,durationMs:2e3,message:"Lilypad 99"},{targetPad:42,durationMs:2e3,message:"Lilypad 42"},{targetPad:57,durationMs:2e3,message:"Can you reach 57?"},{targetPad:0,durationMs:2500}],skipIntroButton:!0,successCondition:e=>e.frogIdx===57,successMessage:"Nice! Start at 99, hop backwards past 42, and you land on 57."},unlocksAfter:["river-2"]},a={id:"river-3b",title:"The Pattern",description:"General addition and subtraction",type:"free-exploration",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,promptText:`If Frida can reach lilypads a and b...

Can she reach a + b? What about a - b?

Try it with different values!`,requireExplicitAnswer:!0,answerType:"continue",successMessage:"Yes! If you can reach a and b, you can always reach a + b and a - b.",autoContinueAfterMs:3e4},unlocksAfter:["river-3"]},n={id:"river-3c",title:"What About Unreachable Pads?",description:"Testing the pattern",type:"guided-challenge",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,highlightPads:[10,11],promptText:`Frida CANNOT reach lilypad 10.
She also CANNOT reach lilypad 11.

Can we conclude she cannot reach lilypad 10 + 11 = 21?`,requireExplicitAnswer:!0,answerType:"yes-no",cameraSequence:[{targetPad:10,durationMs:2e3,message:"Can't reach 10..."},{targetPad:11,durationMs:2e3,message:"Can't reach 11..."},{targetPad:21,durationMs:2e3,message:"What about 21?"},{targetPad:0,durationMs:2e3}],skipIntroButton:!0,successCondition:e=>e.frogIdx===21,successMessage:`No! Even though Frida can't reach 10 OR 11, she CAN reach 21!

The pattern only works for pads she CAN reach.`},unlocksAfter:["river-3b"]},s={id:"river-4",title:"Enter the 6-hopper",description:"Can the 3-hopper match it?",type:"comparison",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,otherHoppers:[{hopSize:6,label:"6-hopper",color:"#4CAF50"}],highlightPads:[18],promptText:`A 6-hopper can reach lilypad 18.

Can your 3-hopper reach lilypad 18?`,successCondition:e=>e.frogIdx===18,successMessage:"Yes! The 3-hopper can do it too."},unlocksAfter:["river-3b"]},p={id:"river-5",title:"Reverse Challenge",description:"Can the 6-hopper match the 3-hopper?",type:"comparison",config:{mode:"single",fixedHopSize:6,hideHopSelector:!0,otherHoppers:[{hopSize:3,label:"3-hopper",color:"#2196F3"}],highlightPads:[9],promptText:`Your 3-hopper can reach lilypad 9.

Can the 6-hopper reach lilypad 9?`,successMessage:"No! The 6-hopper can't reach every pad the 3-hopper can.",autoContinueAfterMs:15e3},unlocksAfter:["river-4"]},c={id:"river-6",title:"Introducing Mimicry",description:"What does mimicry mean?",type:"explanation",config:{mode:"single",fixedHopSize:3,hideHopSelector:!0,otherHoppers:[{hopSize:6,label:"6-hopper",color:"#4CAF50"}],promptText:`The 3-hopper can reach ANY pad the 6-hopper reaches.
But the 6-hopper can't reach every pad the 3-hopper reaches.

We say: 'The 3-hopper can MIMIC the 6-hopper.'
But the 6-hopper cannot mimic the 3-hopper.`,successMessage:"Now you understand mimicry!",relatedConcepts:["mimicry"]},unlocksAfter:["river-5"]},d={id:"river-7",title:"More Hoppers",description:"Explore different hop sizes",type:"free-exploration",config:{mode:"single",allowedHopSizes:[0,1,2,3,4,5,6,7,8,9,10],promptText:`Now you can explore more hoppers! Try different hop sizes and see which pads they reach.

(Don't miss the 0-hopper!)`,successMessage:"So many hoppers to explore!",relatedConcepts:["pads","fly-set"],autoContinueAfterMs:6e4},unlocksAfter:["river-6"]},h={id:"river-8",title:"Mimicry Question",description:"Which hoppers can mimic a 6-hopper?",type:"multi-select",config:{mode:"single",allowedHopSizes:[1,2,3,4,5,6,7,8,9,10],promptText:`Which hoppers can mimic a 6-hopper?

Explore and find ALL of them.`,successMessage:"The 1, 2, 3, and 6-hoppers can all mimic the 6-hopper!",autoContinueAfterMs:45e3},unlocksAfter:["river-7"]},l={id:"river-9",title:"Partial Mimicry?",description:"Can a 4-hopper mimic a 6-hopper?",type:"comparison",config:{mode:"single",fixedHopSize:4,hideHopSelector:!0,otherHoppers:[{hopSize:6,label:"6-hopper",color:"#4CAF50"}],highlightPads:[12,6],promptText:`Can a 4-hopper mimic a 6-hopper?

Check if it can reach pads 6 and 12.`,successMessage:"Sometimes isn't good enough! For mimicry, you must reach EVERY pad."},unlocksAfter:["river-8"]},u={id:"river-10",title:"Special Hoppers",description:"Find hoppers with unique properties",type:"multi-select",config:{mode:"single",allowedHopSizes:[2,3,4,5,6,7,8,9,10,11],promptText:`Find hoppers that can only be mimicked by themselves and the 1-hopper.

Try the 2-hopper, 3-hopper, 4-hopper, 5-hopper...`,successMessage:"These special frogs are called IMMIMICABLES!",autoContinueAfterMs:6e4},unlocksAfter:["river-9"]},m={id:"river-11",title:"Prime Discovery",description:"What are immimicables?",type:"explanation",config:{mode:"single",fixedHopSize:7,hideHopSelector:!0,promptText:`Immimicables have a special property: they can only be mimicked by themselves and the 1-hopper.

In math, these are called PRIME NUMBERS.`,successMessage:"You've discovered primes!",relatedConcepts:["primes"]},unlocksAfter:["river-10"]},g={id:"river-12",title:"Is 9 Immimicable?",description:"Test if 9 is prime",type:"guided-challenge",config:{mode:"single",allowedHopSizes:[1,2,3,4,5,6,7,8,9,10],promptText:`Is the 9-hopper immimicable?

Find a hopper (other than 1 or 9) that can mimic it.`,hintText:"Try the 3-hopper!",successCondition:e=>e.frogIdx===9,successMessage:"The 3-hopper can mimic the 9-hopper! So 9 is NOT immimicable (not prime)."},unlocksAfter:["river-11"]},f={id:"river-13",title:"Escape the 6-hopper",description:"You're a fly!",type:"fly-survival",config:{mode:"single",flyMode:!0,predatorHopSizes:[6],promptText:`You're a fly! 🪰 There's a 6-hopper hunting you.

Click a lilypad to hide.

(Pads the 6-hopper can't reach are safe)`,successMessage:"Safe! The 6-hopper can't reach that pad."},unlocksAfter:["river-12"]},y={id:"river-14",title:"Two Predators",description:"Hide from two frogs",type:"fly-survival",config:{mode:"single",flyMode:!0,predatorHopSizes:[6,4],promptText:`Now there's BOTH a 6-hopper AND a 4-hopper hunting you!

Where can you hide?`,successMessage:"You found a pad safe from both! These pads are not divisible by 2 OR 3."},unlocksAfter:["river-13"]},v={id:"river-15",title:"Safe Havens",description:"Explore safe pads",type:"free-exploration",config:{mode:"single",allowedHopSizes:[2,3,4,6],promptText:`Are there many pads safe from both hoppers?

Explore the river and see!`,successMessage:"Tons of safe pads! (Primes, and numbers like 5, 7, 11, 13, 25, 35...)",autoContinueAfterMs:45e3},unlocksAfter:["river-14"]},T={id:"river-16",title:"The Baby - Part 1",description:"Plot twist!",type:"fly-survival",config:{mode:"single",flyMode:!0,promptText:`Plot twist: The 6-hopper and 4-hopper had a baby... 🥚

The baby is a (6, 4)-MULTIHOPPER!

You hid on pad 10. Are you safe?`,successMessage:"The baby caught you! It went +6, then +4."},unlocksAfter:["river-15"]},M={id:"river-17",title:"The Baby - Part 2",description:"Even more surprising",type:"fly-survival",config:{mode:"single",flyMode:!0,promptText:`You try again. This time you hide on pad 2.

Are you safe now?`,successMessage:`Oh no! The baby can reach pads NEITHER parent could reach alone!

Which pads CAN it reach?`},unlocksAfter:["river-16"]},x={id:"river-18",title:"To Be Continued...",description:"The adventure continues",type:"explanation",config:{mode:"multi",promptText:`The multihopper can reach amazing places!

Explore the Multi-hopper Trail to discover more...`,successMessage:"River Trail Complete! 🎉"},unlocksAfter:["river-17"]},A={id:"river",name:"River Mysteries",emoji:"🏞️",description:"Discover the secrets of single-hopper frogs",nodes:[r,o,t,i,a,n,s,p,c,d,h,l,u,m,g,f,y,v,T,M,x]};export{A as riverTrail};
