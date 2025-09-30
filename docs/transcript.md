
Transcript-Meeting

Got it, Jas. Below is a best-effort diarized transcript based on your recording and the provided reference text. If you want, I can quickly adjust any speaker attributions you spot as off.
Jason: Okay. We are meeting today to talk about the features, the benefit, the user experience, technical considerations and dependencies of our new fitness tracker that's going to be primarily used for walking, cycling, riding and other fitness activities. So let's start with features.
Colin: Be able to integrate to Strava, pulling in any of the activities such as walking, cycling, the steps, any other additional information such as temperature and calories. People wearing heart rate monitors provide input for heart rate over time, including peak and average heart rate and calories. Estimated calories burnt.
Jason: Yep. So heart rate data, steps taken, GPS data.
Jason: Right. With your phone GPS, it's got to record where you've walked or run, elevation. If the device, the physical device you've got, does it integrate with Strava, integrate with Garmin, integrate with Apple iWatch?
Jason: It should have a—
Colin: And if it's a—if it's a cycling activity, you've got power. Power data as well. Power monitor.
Jason: Yeah. And do we want to have a live, live map and a live speedo when you're on your cycling? Some people use the phone, some people I know use other devices. Do you look at your phone to see how fast you're walking?
Saranya: No. What I probably would—I mean, I haven't explored this—but what I wanted to have is like to suggest me similar routes based on the patterns.
Jason: There you go.
Saranya: Because I usually walk in a circuit, but if there are similar circuits across, probably that's something which Strava can recommend. And another which I have noticed is in some of the apps, although we can go manually pause something, the distance keeps ticking. So there should be an auto pause when there is not much activity happening, so it captures the exact distance we have walked or cycled.
Jason: Okay. So auto pause integration, track your mapping. We want the UI to be able to show us where we walked. And I guess basic stats—we should set our own targets as well. Fitness targets.
Colin: Oh, yeah. Weekly or monthly targets.
Jason: Yep, good one. And we should get notifications when we've met our targets. And we can do gold, silver, bronze in terms of our achievements.
Colin: Yeah, yeah.
Jason: It should track your personal best and other times on your various routes and suggest other routes, as you said. Similar—similar routes, similar distance, similar elevation.
Saranya: Yes. And maybe it can suggest extending your training to keep progressing.
Jason: All right, that's probably enough to get us started. So the benefits—what are we doing this for? Why are we doing this? What would be the benefits to our users?
Colin: Motivation.
Jason: Yeah. What has tracking done? Yeah. Being able to set achievable goals and be able to measure them. And whether that's losing weight or fitness or increasing distance over time—whether you're walking, running, or cycling—you want to build up to 100k, you want to build up to a marathon, you’ve got to start, you’ve got to track it, right?
Colin: Yeah.
Jason: Anything else—might be good data for if you were tracking a health issue and you want to share that with your doctor. I remember taking the—what was the other one—the one Google bought—Fitbit. The Fitbit data. I remember taking that to a doctor once because I was investigating something. He didn't look at it, didn't want to know. He's like, whatever, just take that PDF away from me.
Jason: Okay. Any other benefits? What do you use Strava for? What benefit do you get?
Saranya: It just motivates me, number one. And probably the auto-pause thing, which would help sustain the pace in which I move. Because sometimes different apps, different things. You know, that's actually live feedback. When I'm running—if I'm running fast, then it might be like, oh, I'm actually running close to a PB, maybe I'll try a bit harder. Or you're riding and you can see that you're on a good pace, or no—wind's heavy today, you're on a slow pace. It can be demotivating too, at times.
Jason: All right, that'll do for benefits. User experience. It's got to be well structured. Right? You want to be able to easily find what your current stat is, what your current activity is in terms of what it's doing, what is achieved, what's next—if it's on a planned route.
Jason: And yeah, notifications—if you've got any notifications during your current activities, like which ones have you already hit or achieved.
Jason: So visual and audio—if it's feedback while you're going—make it clear. You don't want it to be too small, so you're riding or you're running and you're trying to look at your phone—what does that say? You know, slow down a bit so you can read your phone.
Jason: What would be really good is if multiple people had these—that were actually doing the same course/route—or the app tells you where they are live.
Colin: Yeah.
Saranya: And also when the app is suggesting certain routes, if it can probably tell us, you know, the reviews which are coming from people who are running and walking there—probably it could help you make—
Jason: Almost another feature.
Saranya: Yeah, exactly.
Jason: Okay. Another good feature would be nutrition prompts in terms of drinking—and this is how much food and how much carbs, how much energy and how much water you need to drink.
Colin: Yeah, that's a good one actually, particularly with the cycling because—yeah, you can feel pretty depleted after a long time on the bike in the Singapore weather.
Jason: So we want—from the live perspective—we want all that feedback. Once you're not running or riding, you want things like the nutrition and you want a bit of a—
Colin: You want the nutrition while you're riding.
Jason: You want it while you're riding too. It's a prompt—"You need to take on another—" Yeah, it's time to eat another gel or a bar, just like we have in the watch.
Colin: Right. Like time to get up and stretch yourself.
Jason: Something like that.
Jason: Yeah, I turned that off. I was like, I'm working out and it's telling me to get off the couch.
Jason: And the app should be smart enough—you know, based on your body weight and your effort, the temperature that you're operating in—it will calculate how much water and carbohydrates/protein you need to take on board.
Colin: Yep.
Jason: So it should be fairly—it should use that biometric data coupled with the live data that's getting from the device you're wearing.
Saranya: And talking about that—like, if you can integrate—like we have apps to input what you intake for a day, for example if you're on a calorie deficit diet—and if that can probably integrate. Based on, like, you go walk for 4 km but today have walked like 6 km or 7 km—so if that is going to have some kind of balance and suggestions, I think, you know, calorie—
Saranya: How many calories did you use? If this is—it's an optional feature. If people want to integrate those two, that could be quite helpful as well.
Saranya: Okay. Because I do that sometimes, you know—when I walk Fubo, I think, okay, I can probably eat more today or something. I think so.
Jason: Okay. And the final—I mean, I guess when you're all said and done for the day and you're looking at your stats, you're looking at how far you rode—you want to see how far you rode, how far you—over the week, over the month—maybe you want to be able to compare to your mates and just compare back to yourself, see if you're improving.
Jason: Yeah. So it gives you a week by week, month by month, and year on year total stats and comparison.
Jason: Okay, I think that'll do. Remembering we're trying to build this today.
Jason: All right, tech considerations. So first version we need to work on Samsung because there's two Samsungs here and one Apple. But essentially what we should probably aim for is an app that is not native to any of the platforms, but works on just a web app, essentially. So it can be pulled up on either an Android or an Apple or whatever else they have.
Colin: Yes.
Jason: So we're talking about—it will run on any phone or any desktop. So there'll be two interfaces, one for a mobile device and one for a desktop device.
Colin: Yep, yep.
Jason: I guess we'll start with the—at least—yeah, we'll start with one of them. It should be two significant arms from a technical perspective because you're also going to need the visuals on the phone, but then you're also going to need to have the measurements and the live elements. So it should be probably quite a different UI.
Jason: When it comes to integration, then you're going to have—maybe we start with one integration with Strava and then you expand because there's dozens of things it could integrate with. But Strava and Garmin are the two common ones. There's a few others.
Jason: So I guess from a dependency perspective we'll need all their API docs, authentication patterns. Most phones have some type of health app—Samsung Health, Google bought Fitbit.
Colin: Yeah.
Jason: And the big phone manufacturers also make digital watches with heart rate tracking.
Colin: Yeah.
Saranya: Yeah, mine does.
Jason: Apple has a Garmin—it's not a phone one.
Jason: Yeah. So we need to integrate with Apple Health, Samsung Health, Garmin, Strava and Fitbit, I guess. Did Google get rid of Fitbit or did they get rid of the Google Health? Can't remember which.
Colin: They did.
Jason: Now there's others as well. Any other dependencies you think of? Language or country?
Saranya: Yes, I guess it starts in English, but probably be good if it could do other—or at least have the main UI, maybe the web UI, to second languages.
Jason: Yeah. Some of this information is classified as personal. Right. So we need to have ability to data disclosure. Right. And whether people are happy to share it.
Colin: Share it?
Jason: Yeah, yeah. Your name and—well, your location is very sensitive.
Colin: Really? Especially if you have a mistress.
Jason: Yes. Well, you don't want people knowing where you live. Right. So if they look at all your runs over the past two years and you're like, right, oh, I know which house they're in. So you got to have some approach to dealing with that.
Jason: Okay, I think that'll get us started. Let's build what was designed and then iterate.
Colin: Yep.
Saranya: Sure.
 
