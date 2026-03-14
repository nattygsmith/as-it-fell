import { useState, useEffect, useCallback } from "react";

// ============================================================
//  DEV MODE
//  Set to true to show time/season override dropdowns in the UI.
//  Set to false before pushing to GitHub.
// ============================================================
const DEV_MODE = false;

// ============================================================
//  QUOTE LIBRARY
//  To add quotes: append objects to this array.
//  Required fields:
//    text     — the quote, use \n for line breaks
//    source   — credit string shown to user e.g. "Tam Lin (Child 39)"
//    time     — one or more of: "morning" | "afternoon" | "evening" | "night"
//    season   — one or more of: "spring" | "summer" | "autumn" | "winter"
//               use [] for quotes that work in any season
//  Optional:
//    notes    — modernization notes (not shown in UI, for your records)
// ============================================================
const QUOTES = [
  // --- Riddles Wisely Expounded (Child 1) ---
  {
    text: "He knocked at the lady's gate,
One evening when it was late.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["evening"],
    season: [],
  },
  {
    text: "The youngest sister, fair and bright,
She lay beside him all through the night.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["night"],
    season: [],
  },
  {
    text: "And in the morning, come the day,
She said, 'Young man, will you marry me?'",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["morning"],
    season: [],
  },
  // --- Lady Isabel and the Elf-Knight (Child 4) ---
  {
    text: "Fair lady Isabel sits in her bower sewing,
There she heard an elf-knight blowing his horn,
The first morning in May.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["morning"],
    season: ["spring"],
  },
  {
    text: "They rode till they came to the sweet water side,
Three hours before it was day.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["night"],
    season: [],
  },
  // --- The Fair Flower of Northumberland (Child 9) ---
  {
    text: "Thus rode she all one winter's night,
Till Edenborow they saw in sight.",
    source: "The Fair Flower of Northumberland (Child 9)",
    time: ["night"],
    season: ["winter"],
    // notes: "Child 9 = The Fair Flower of Northumberland (not The Fause Knight, a common mix-up). No modernization needed."
  },
  // --- The Three Ravens (Child 26) ---
  {
    text: "The one of them said to his mate,
'Where shall we our breakfast take?'",
    source: "The Three Ravens (Child 26)",
    time: ["morning"],
    season: [],
  },
  {
    text: "She buried him before the prime,
She died herself ere evening time.",
    source: "The Three Ravens (Child 26)",
    time: ["evening"],
    season: [],
  },
  // --- Allison Gross (Child 35) ---
  {
    text: "But as it fell out on last Halloween,
When the fairy court was riding by,
The queen lighted down on a daisy bank,
Not far from the tree where I used to lie.",
    source: "Allison Gross (Child 35)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- Thomas Rymer (Child 37) ---
  {
    text: "And see not ye that bonny road,
Which winds about the fernie brae?
That is the road to fair Elfland,
Where you and I this night maun gae.",
    source: "Thomas Rymer (Child 37)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 14. No modernization needed."
  },
  // --- Tam Lin (Child 39) ---
  {
    text: "Gloomy, gloomy was the night,
And eerie was the way,
As fair Jenny in her green mantle
To Miles Cross she did go.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
  },
  {
    text: "Just at the mirk and midnight hour,
The fairy folk will ride,
And they that would their true-love win,
At Miles Cross they must bide.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
  },
  {
    text: "Tomorrow is Halloween,
The elfin court will ride,
Through England, and through all Scotland,
And through the world wide.",
    source: "Tam Lin (Child 39)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  {
    text: "O they begin at sky-setting,
Ride all the evening tide;
And she that will her true-love borrow,
At Miles Cross will him bide.",
    source: "Tam Lin (Child 39)",
    time: ["evening"],
    season: ["autumn"],
  },
  // --- Clerk Colvill (Child 42) ---
  {
    text: "And he is on to Clyde's water,
By the lee light of the moon.",
    source: "Clerk Colvill (Child 42)",
    time: ["night"],
    season: [],
    // notes: "Version C stanza 5. 'An'→'And', 'licht'→'light', 'o'→'of'."
  },
  // --- The Broomfield Hill (Child 43) ---
  {
    text: "The one rode early in the morning,
The other in the afternoon.",
    source: "The Broomfield Hill (Child 43)",
    time: ["afternoon"],
    season: [],
  },
  {
    text: "She pulled the blossom of the broom,
The blossom it smells sweet.",
    source: "The Broomfield Hill (Child 43)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  // --- Captain Wedderburn's Courtship (Child 46) ---
  {
    text: "The moon shone bright, and it cast a fair light.",
    source: "Captain Wedderburn's Courtship (Child 46)",
    time: ["night"],
    season: [],
    // notes: "Single-line quote — may wish to expand if a fuller stanza can be confirmed."
  },
  // --- Proud Lady Margaret (Child 47) ---
  {
    text: "Twas on a night, an evening bright,
When the dew began to fall,
Lady Margaret was walking up and down,
Looking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["evening"],
    season: [],
    // notes: "Version A stanza 1. 'fa'→'fall'."
  },
  {
    text: "There was a knight, in a summer's night,
Appeared in a lady's hall,
As she was walking up and down,
Looking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["night"],
    season: ["summer"],
    // notes: "Version B stanza 1. No modernization needed."
  },
  // --- The Bonny Hind (Child 50) ---
  {
    text: "It's May she comes and May she goes,
Down by the garden green,
It's there she spied a good young squire,
As good as e'er she seen.",
    source: "The Bonny Hind (Child 50)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  // --- Sir Patrick Spens (Child 58) ---
  {
    text: "Late late last night I saw the new moon,
With the old moon in her arm;
And I fear, I fear, my dear master,
That we will come to harm.",
    source: "Sir Patrick Spens (Child 58)",
    time: ["night"],
    season: ["winter"],
  },
  // --- Child Waters (Child 63) ---
  {
    text: "Lord John's mother in her bower
Was sitting all alone;
When in the silence of the night
She heard fair Ellen's moan.",
    source: "Child Waters (Child 63)",
    time: ["night"],
    season: [],
  },
  // --- Clerk Saunders (Child 69) ---
  {
    text: "They baith lay still, and slept sound,
Until the sun began to sheen;
She drew the curtains a wee bit,
And dull and drowsy was his een.",
    source: "Clerk Saunders (Child 69)",
    time: ["morning"],
    season: [],
    // notes: "een = Scots for 'eyes'. Light modernisation: sleeped→slept, Untill→Until, drowsie→drowsy."
  },
  // --- Willie and Lady Maisry (Child 70) ---
  {
    text: "You must come into my bower
When the evening bells do ring,
And you must come into my bower
When the evening mass doth sing.",
    source: "Willie and Lady Maisry (Child 70)",
    time: ["evening"],
    season: [],
  },
  // --- The Clerk's Twa Sons o Owsenford (Child 72) ---
  {
    text: "The bonny clerks they died that morn,
Their loves died lang ere noon.",
    source: "The Clerk's Twa Sons o Owsenford (Child 72)",
    time: ["morning"],
    season: [],
    // notes: "'clerks'=scholars/students. 'lang ere noon'=long before noon. No modernization: 'lang' kept for Scots sound."
  },
  // --- Lord Thomas and Annet (Child 73) ---
  {
    text: "Sweet Willie and Fair Annie,
As they sat on yonder hill,
If they had sat from morn 'til evening,
They had not talked their fill.",
    source: "Lord Thomas and Annet (Child 73)",
    time: ["evening"],
    season: [],
  },
  // --- Fair Margaret and Sweet William (Child 74) ---
  {
    text: "As it fell out on a long summer's day,
Two lovers they sat on a hill;
They sat together that long summer's day,
And could not talk their fill.",
    source: "Fair Margaret and Sweet William (Child 74)",
    time: ["afternoon"],
    season: ["summer"],
  },
  // --- The Lass of Roch Royal (Child 76) ---
  {
    text: "Fair Isabell of Rochroyall,
She dreamed where she lay,
She dreamed a dream of her love Gregory,
A little before the day.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: [],
  },
  {
    text: "The night was dark, and the wind blew cold,
And her love was fast asleep,
And the bairn that was in her two arms
Full sore began to weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: ["winter"],
  },
  {
    text: "When the cock had crawn, and day did dawn,
And the sun began to peep,
Then it rose him Love Gregor,
And sorely did he weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["morning"],
    season: [],
    // notes: "Version F. 'raise'→'rose'; 'sair, sair'→'sorely'. New stanza — distinct from existing #18 and #19 from same ballad."
  },
  // --- Sweet William's Ghost (Child 77) ---
  {
    text: "O cocks are crowing at merry midnight,
And the wild fowls herald the day;
Give me my faith and troth again,
And let me fare me on my way.",
    source: "Sweet William's Ghost (Child 77)",
    time: ["night"],
    season: [],
    // notes: "Modernised: 'a merry midnight'→'at merry midnight'; 'are boding day'→'herald the day'."
  },
  // --- The Unquiet Grave (Child 78) ---
  {
    text: "The wind does blow today, my love,
And a few small drops of rain;
I never had but one true-love,
In a cold grave she was lain.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn", "winter"],
  },
  {
    text: "'Tis down in yonder garden green,
Love, where we used to walk,
The finest flower that e'er was seen
Is withered to a stalk.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- The Wife of Usher's Well (Child 79) ---
  {
    text: "The hallow day of Yule are come,
The nights are long and dark.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
  },
  {
    text: "The young cock crew in the merry morning,
And the wild fowl chirped for day;
The elder to the younger did say,
Dear brother, we must away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
  },
  {
    text: "Up then crew the red, red cock,
And up and crew the gray;
The eldest to the youngest said,
'Tis time we were away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
    // notes: "Kept alongside #24 — different stanza, different texture. #24 is warm and narrative; this is abrupt and elegiac."
  },
  {
    text: "It fell about the Martinmas,
When nights are lang and mirk,
The carlin wife's three sons came home,
And their hats were of the birch.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
    // notes: "Replaces retired #22 (two-line fragment). hame→home; o the birk→of the birch. 'carlin'=old woman; 'mirk'=dark. Hats of birch signal the sons have come from Paradise."
  },
  // --- Old Robin of Portingale (Child 80) ---
  {
    text: "And about the middle time of the night
Came twenty-four good knights in;
Sir Gyles he was the foremost man,
So well he knew that gin.",
    source: "Old Robin of Portingale (Child 80)",
    time: ["night"],
    season: [],
    // notes: "Stanza 23. Light spelling modernisation only. 'gin' = scheme/trap."
  },
  // --- Little Musgrave and Lady Barnard (Child 81) ---
  {
    text: "When supper was over, and mass was sung,
And every man bound for bed,
Little Musgrave and that lady
In one chamber were laid.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["evening"],
    season: [],
  },
  {
    text: "Methinks I hear the thresel-cock,
Methinks I hear the jay;
Methinks I hear my lord Barnard,
And I would I were away.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["morning"],
    season: [],
    // notes: "thresel=throstle (song thrush). jaye→jay. Kept 'thresel' for atmosphere."
  },
  // --- The Bonny Birdy (Child 82) ---
  {
    text: "There was a knight, in a summer's night,
Was riding o'er the lee,
And there he saw a bonny birdy,
Was singing upon a tree.",
    source: "The Bonny Birdy (Child 82)",
    time: ["night"],
    season: ["summer"],
    // notes: "Version A stanza 1. 'oer'→'o'er'. Opening line shared with Child 47 Version B (#45) — different ballads, accepted."
  },
  // --- Child Maurice (Child 83) ---
  {
    text: "The one was killed in the morning air,
His mother died at eve,
And ere the morning bells were rung,
The threesome were all gone.",
    source: "Child Maurice (Child 83)",
    time: ["morning", "evening"],
    season: [],
    // notes: "Version D stanza 30. 'mornin'→'morning' (twice); 'een'→'eve'; 'or'→'ere'; 'was rung'→'were rung'; 'a gane'→'all gone'."
  },
  // --- Bonny Barbara Allan (Child 84) ---
  {
    text: "It was in and about the Martinmas time,
When the green leaves were a-falling.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  {
    text: "All in the merry month of May,
When green leaves they were springing,
This young man on his death-bed lay,
For the love of Barbara Allen.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  {
    text: "It fell about the Lammas time,
When the woods grow green and yellow.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
  },
  // --- Lady Alice (Child 85) ---
  {
    text: "Lady Alice was sitting in her bower-window,
Mending her midnight coif,
And there she saw as fine a corpse
As ever she saw in her life.",
    source: "Lady Alice (Child 85)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 1. 'quoif'→'coif'."
  },
  {
    text: "O lay him down gently, ye six men tall,
All on the grass so green,
And tomorrow, when the sun goes down,
Lady Alice a corpse shall be seen.",
    source: "Lady Alice (Child 85)",
    time: ["evening"],
    season: [],
    // notes: "Version A stanza 3. No modernisation needed."
  },
  // --- Young Benjie (Child 86) ---
  {
    text: "And he was stout, and proud-hearted,
And thought it bitterly,
And he's gone by the wan moonlight
To meet his Marjorie.",
    source: "Young Benjie (Child 86)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 4. 'ot'→'it'; 'hes gaen'→'he's gone'."
  },
  // --- Jellon Grame (Child 90) ---
  {
    text: "Win up, my bonny boy, he says,
As quick as ever you may;
For ye maun gang for Lillie Flower,
Before the break of day.",
    source: "Jellon Grame (Child 90)",
    time: ["night"],
    season: [],
    // notes: "Stanza 2. 'eer'→'ever'."
  },
  // --- The Gay Goshawk (Child 96) ---
  {
    text: "And well he knew that lady fair
Among her maidens free,
For the flower that springs in May morning
Was not so sweet as she.",
    source: "The Gay Goshawk (Child 96)",
    time: ["morning"],
    season: ["spring"],
    // notes: "Version E stanza 12. 'kent'→'knew'; 'ladye feir'→'lady fair'."
  },
  // --- Brown Adam (Child 98) ---
  {
    text: "It was late, late in the evening,
Late, late in the afternoon,
There came a knight to Brown Adam's house,
And he was clad all in brown.",
    source: "Brown Adam (Child 98)",
    time: ["evening", "afternoon"],
    season: [],
    // notes: "Opening stanza. No modernisation needed."
  },
  // --- Johnie Scot (Child 99) ---
  {
    text: "O up then rose him Johnie Scot,
An hour before the day,
And he is on to Fair Ellen's bower,
To hear what she did say.",
    source: "Johnie Scot (Child 99)",
    time: ["night"],
    season: [],
    // notes: "Version A. Pre-dawn rising stanza. No modernisation needed."
  },
  // --- Willie o Winsbury (Child 100) ---
  {
    text: "He's mounted her on a milk-white steed,
Himself on a dapple-grey,
And made her a lady of as much land
She could ride in a whole summer day.",
    source: "Willie o Winsbury (Child 100)",
    time: ["morning", "afternoon"],
    season: ["summer"],
  },
  // --- Rose the Red and White Lily (Child 103) ---
  {
    text: "She hadna been in fair France
A twelvemonth and a day,
Till there she heard the morning drum
Beat out at break of day.",
    source: "Rose the Red and White Lily (Child 103)",
    time: ["morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Famous Flower of Serving-Men (Child 106) ---
  {
    text: "She dressed herself in man's array,
And to the king's court took her way,
She rode till she came to the palace gate,
One morning when it was late.",
    source: "The Famous Flower of Serving-Men (Child 106)",
    time: ["morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Baffled Knight (Child 112) ---
  {
    text: "As I went out one May morning,
To view the fields and meadows gay,
I met a maid came out of the wood,
And she had lost her way.",
    source: "The Baffled Knight (Child 112)",
    time: ["morning"],
    season: ["spring"],
    // notes: "No modernisation needed."
  },
  // --- The Great Silkie of Sule Skerry (Child 113) ---
  {
    text: "Then one arose at her bed-foot,
A grumbly guest I'm sure was he.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["night"],
    season: [],
  },
  {
    text: "And it shall come to pass on a summer's day,
When the sun shines hot on every stone.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning", "afternoon"],
    season: ["summer"],
  },
  {
    text: "And he'll go out on a May morning,
And he'll kill both my wee son and me.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning"],
    season: ["spring"],
  },
  // --- Johnie Cock (Child 114) ---
  {
    text: "Johnie rose up in a May morning,
Called for water to wash his hands,
And he has called for his good gray hounds,
That lay bound in iron bands.",
    source: "Johnie Cock (Child 114)",
    time: ["morning"],
    season: ["spring"],
  },
  // --- Robin Hood and the Monk (Child 119) ---
  {
    text: "John early in a May morning,
Looking his shoes upon,
He took him to Nottingham,
To matins all alone.",
    source: "Robin Hood and the Monk (Child 119)",
    time: ["morning"],
    season: ["spring"],
    // notes: "Version A. 'morow'→'morning'. 'Much' (the miller's son) rendered as 'John' in this version."
  },
  // --- Sir Hugh, or, The Jew's Daughter (Child 155) ---
  {
    text: "She's taen him to her cellar dark,
At the hour o midnight keen;
She's stabbed him with a little penknife,
And put him in the well sae deep.",
    source: "Sir Hugh, or, The Jew's Daughter (Child 155)",
    time: ["night"],
    season: [],
    // notes: "Version B. 'o midnight keen' = of sharp/bitter midnight. No modernisation needed."
  },
  // --- Durham Field (Child 159) ---
  {
    text: "The sixth of August the muster was,
Early in a morning clear;
Our English archers their bows did bend,
And many a black blade did appear.",
    source: "Durham Field (Child 159)",
    time: ["morning"],
    season: [],
    // notes: "'black blade' substituted for 'black bill' (a pole weapon with blackened blade) for readability. No other modernisation."
  },
  // --- The Battle of Otterburn (Child 161) ---
  {
    text: "It fell about the Lammas tide,
When the muir-men win their hay,
The doughty Douglas bound him to ride
Into England, to drive a prey.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    // notes: "Version C stanza 1. Lammas = early August harvest festival. No modernisation needed."
  },
  {
    text: "But up then spake a little page,
Before the peep of dawn:
O waken ye, waken ye, my good lord,
For Percy's hard at hand.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["night"],
    season: [],
    // notes: "Version C stanza 17. No modernisation needed."
  },
  {
    text: "This deed was done at Otterburn,
About the breaking of the day;
Earl Douglas was buried at the bracken-bush,
And Percy led captive away.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning"],
    season: [],
    // notes: "Version B stanza 14. No modernisation needed."
  },
  // --- Sir Andrew Barton (Child 167) ---
  {
    text: "As it befell in midsummer-time,
When birds sing sweetly on every tree.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning"],
    season: ["summer"],
  },
  {
    text: "When Flora, with her fragrant flowers,
Bedecked the earth so trim and gay,
And Neptune, with his dainty showers,
Came to present the month of May.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["spring"],
  },
  {
    text: "Lord Howard then, of courage bold,
Went to the sea with pleasant cheer,
Not curbed with winter's piercing cold,
Though it was the stormy time of the year.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["winter"],
  },
  {
    text: "With pikes, and guns, and bowmen bold,
This noble Howard is gone to the sea,
On the day before Midsummer's Eve,
And out at Thames mouth sailed they.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["evening"],
    season: ["summer"],
  },
  // --- Mary Hamilton (Child 173) ---
  {
    text: "Last night Queen Mary had four Maries,
This night she'll have but three;
There was Mary Seaton and Mary Beaton,
And Mary Carmichael, and me.",
    source: "Mary Hamilton (Child 173)",
    time: ["night"],
    season: [],
  },
  {
    text: "Last night I washed Queen Mary's feet,
And bore her to her bed;
This day she's given me my reward,
This gallows-tree to tread.",
    source: "Mary Hamilton (Child 173)",
    time: ["morning", "afternoon"],
    season: [],
  },
  // --- The Death of Parcy Reed (Child 193) ---
  {
    text: "They hunted high, they hunted low,
They hunted up, they hunted down,
Until the day was past the prime,
And it grew late in the afternoon.",
    source: "The Death of Parcy Reed (Child 193)",
    time: ["afternoon"],
    season: [],
  },
  // --- The Gypsy Laddie (Child 200) ---
  {
    text: "Yestreen I lay in a well-made bed,
And my good lord beside me;
This night I'll lie in a tenant's barn,
Whatever shall betide me.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 4. 'yestreen'=last night. No modernisation needed."
  },
  {
    text: "Now when our lord came home at even,
He speired for his fair lady;
The ane she cried, the tither replied,
She's awa wi the gypsy laddie.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["evening"],
    season: [],
    // notes: "Version F stanza 8. 'een'→'even'. 'speired'=asked."
  },
  // --- Jamie Douglas (Child 204) ---
  {
    text: "In the morning when I arose,
My bonnie palace for to see,
I came unto my lord's room-door,
But he would not speak one word to me.",
    source: "Jamie Douglas (Child 204)",
    time: ["morning"],
    season: [],
    // notes: "Version G stanza 6. No modernisation needed."
  },
  {
    text: "O waly, waly up the bank!
And waly, waly down the brae!
And waly, waly by yon burn-side,
Where me and my love were wont to gae!",
    source: "Jamie Douglas (Child 204)",
    time: ["morning", "afternoon"],
    season: [],
    // notes: "Version H stanza 1 ('Waly Waly'). 'waly' = cry of lamentation. No modernisation needed."
  },
  // --- The Braes o Yarrow (Child 214) ---
  {
    text: "Late in the evening, drinking the wine,
Or early in the morning,
They set a combat them between,
To fight it out in the dawning.",
    source: "The Braes o Yarrow (Child 214)",
    time: ["evening", "morning"],
    season: [],
    // notes: "Version F stanza 1. 'eenin'→'evening'."
  },
  // --- The Daemon Lover (Child 243) ---
  {
    text: "O sleep ye, wake ye, my husband?
I wish ye wake in time!
I would not for ten thousand pounds
This night ye knew my mind.",
    source: "The Daemon Lover (Child 243)",
    time: ["night"],
    season: [],
    // notes: "Version C stanza 12. No modernisation needed."
  },
  // --- The Grey Cock (Child 248) ---
  {
    text: "It's now ten at night, and the stars give no light,
And the bells they ring ding, dang;
He's met with some delay that caused him to stay,
But he will be here ere lang.",
    source: "The Grey Cock (Child 248)",
    time: ["night"],
    season: [],
    // notes: "Version A stanza 2. 'gie'→'give'. 'ere lang'=before long."
  },
  {
    text: "Flee, flee up, my bonny grey cock,
And crow when it is day;
Your neck shall be like the bonny beaten gold,
And your wings of the silver grey.",
    source: "The Grey Cock (Child 248)",
    time: ["morning"],
    season: [],
    // notes: "Version A stanza 6. No modernisation needed."
  },
  // --- Henry Martyn (Child 250) ---
  {
    text: "He had not been sailing but a short winter's night,
And part of a short winter's day,
When he espied a lofty ship,
Come sailing all along that way.",
    source: "Henry Martyn (Child 250)",
    time: ["night", "morning", "afternoon"],
    season: ["winter"],
    // notes: "No modernisation needed."
  },
  // --- The Kitchie Boy (Child 252) ---
  {
    text: "The day it is gone, and the night's come on,
And the King's court it is begun;
All the ladies in the court are going to bed,
And it's time that I were gone.",
    source: "The Kitchie Boy (Child 252)",
    time: ["evening"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- Willie's Lyke-Wake (Child 255) ---
  {
    text: "About the dead hour of the night
She heard the bridles ring;
And Janet was as glad of that
As any earthly thing.",
    source: "Willie's Lyke-Wake (Child 255)",
    time: ["night"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Knight's Ghost (Child 265) ---
  {
    text: "She looked over her castle wall,
To see what she might see;
She spied her own dear lord
Come riding over the lee,
At the dead hour of the night.",
    source: "The Knight's Ghost (Child 265)",
    time: ["night"],
    season: [],
    // notes: "'deid'→'dead'. No other modernisation."
  },
  // --- The Suffolk Miracle (Child 272) ---
  {
    text: "A young man riding in the night,
His journey for to take,
He rode until the morning light,
For his true love's sake.",
    source: "The Suffolk Miracle (Child 272)",
    time: ["night", "morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Keach i the Creel (Child 281) ---
  {
    text: "But the night was dark, and the way was sair,
And the morn came up on them unaware.",
    source: "The Keach i the Creel (Child 281)",
    time: ["night", "morning"],
    season: [],
    // notes: "'sair' kept for Scots sound (=sore/hard). No other modernisation."
  },
  // --- Trooper and Maid (Child 299) ---
  {
    text: "When the trumpet sounds to horse and away,
Early in the morning,
Leave thy bed and leave thy beau,
Early in the morning.",
    source: "Trooper and Maid (Child 299)",
    time: ["morning"],
    season: [],
    // notes: "No modernisation needed."
  },
  // --- The Broom of Cowdenknows (Child 305) ---
  {
    text: "There was a troop of merry gentlemen
Were riding tween twa knowes;
They swore they smelled a bonny lass,
As they came by the broom of Cowdenknows.
It's up then spake the foremost man,
Said, I see her standing there;
A bonny lass in a green mantle,
Combing down her yellow hair,
Early on a May morning.",
    source: "The Broom of Cowdenknows (Child 305)",
    time: ["morning"],
    season: ["spring"],
    // notes: "'twa knowes'=two hills. No modernisation needed."
  },
];

// ============================================================
//  HELPERS
// ============================================================
function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getSeason(month) {
  // Meteorological seasons, Northern Hemisphere, 0-indexed month
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

function getPool(timeOfDay, season) {
  // Match on time first; season is a bonus filter if matches exist
  const timeMatch = QUOTES.filter((q) => q.time.includes(timeOfDay));
  const seasonMatch = timeMatch.filter(
    (q) => q.season.length === 0 || q.season.includes(season)
  );
  // Prefer season-aware matches; fall back to time-only if pool is too small
  return seasonMatch.length >= 2 ? seasonMatch : timeMatch;
}

function pickQuote(pool, lastId) {
  if (pool.length === 0) return null;
  const candidates = pool.length > 1 ? pool.filter((q) => q !== lastId) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ============================================================
//  THEME TOKENS  (time × season)
// ============================================================
const THEMES = {
  morning: {
    spring: { bg: "#f0ebe0", ink: "#2c2416", accent: "#7a9e5f", mist: "#d4e8c2" },
    summer: { bg: "#fdf3d0", ink: "#2c2416", accent: "#c07b2a", mist: "#fae89a" },
    autumn: { bg: "#f5e6cc", ink: "#2c2416", accent: "#b5541e", mist: "#e8c998" },
    winter: { bg: "#eaf0f5", ink: "#1a2530", accent: "#4a7a9b", mist: "#c8dde8" },
  },
  afternoon: {
    spring: { bg: "#e8f0dc", ink: "#1e2d14", accent: "#5a8a3a", mist: "#c5dba8" },
    summer: { bg: "#fef0b0", ink: "#2a2010", accent: "#c88a20", mist: "#fad870" },
    autumn: { bg: "#f0dcc0", ink: "#2a1e10", accent: "#a04a18", mist: "#ddb880" },
    winter: { bg: "#dde8f0", ink: "#182230", accent: "#3a6888", mist: "#b0cede" },
  },
  evening: {
    spring: { bg: "#2a3520", ink: "#e8f0d8", accent: "#90c060", mist: "#405030" },
    summer: { bg: "#302818", ink: "#f8e8c0", accent: "#e0a040", mist: "#504028" },
    autumn: { bg: "#2e2010", ink: "#f0d8b0", accent: "#d06820", mist: "#503020" },
    winter: { bg: "#181e28", ink: "#c8d8e8", accent: "#6090b8", mist: "#283040" },
  },
  night: {
    spring: { bg: "#121c10", ink: "#d0e8c0", accent: "#70a850", mist: "#1e2e18" },
    summer: { bg: "#181408", ink: "#f0e0a0", accent: "#c89030", mist: "#282010" },
    autumn: { bg: "#140e08", ink: "#e8c890", accent: "#b06020", mist: "#221408" },
    winter: { bg: "#080c14", ink: "#b0c8e0", accent: "#4878a8", mist: "#101828" },
  },
};

const TIME_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

const SEASON_LABELS = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

// Decorative glyphs per time of day
const TIME_GLYPHS = {
  morning: "☀",
  afternoon: "◑",
  evening: "☽",
  night: "✦",
};

// ============================================================
//  COMPONENT
// ============================================================
export default function FolkClock() {
  const [now, setNow] = useState(new Date());
  const [quote, setQuote] = useState(null);
  const [lastQuote, setLastQuote] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [devTime, setDevTime] = useState(getTimeOfDay(new Date().getHours()));
  const [devSeason, setDevSeason] = useState(getSeason(new Date().getMonth()));

  const hour = now.getHours();
  const month = now.getMonth();
  const timeOfDay = DEV_MODE ? devTime : getTimeOfDay(hour);
  const season = DEV_MODE ? devSeason : getSeason(month);
  const theme = THEMES[timeOfDay][season];
  const pool = getPool(timeOfDay, season);

  const refresh = useCallback(
    (currentLastQuote) => {
      const next = pickQuote(pool, currentLastQuote);
      if (next) {
        setQuote(next);
        setLastQuote(next);
        setFadeKey((k) => k + 1);
      }
    },
    [pool]
  );

  // Initial pick
  useEffect(() => {
    refresh(null);
  }, []);

  // Auto-refresh at top of each hour
  useEffect(() => {
    const next = new Date(now);
    next.setHours(next.getHours() + 1, 0, 0, 0);
    const ms = next - now;
    const t = setTimeout(() => {
      setNow(new Date());
    }, ms);
    return () => clearTimeout(t);
  }, [now]);

  // Re-pick when time slot changes
  useEffect(() => {
    if (quote) refresh(null);
  }, [timeOfDay, season]);

  if (!quote) return null;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: ${theme.bg};
      transition: background 1.2s ease;
    }

    .folk-root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 1.75rem 1.5rem;
      font-family: 'IM Fell English', Georgia, serif;
      color: ${theme.ink};
      position: relative;
      overflow: hidden;
      transition: color 1.2s ease;
    }

    .folk-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 20%, ${theme.mist}88 0%, transparent 60%),
        radial-gradient(ellipse at 80% 80%, ${theme.mist}55 0%, transparent 55%);
      pointer-events: none;
      transition: background 1.2s ease;
    }

    .folk-root::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      background-size: 200px 200px;
      pointer-events: none;
      opacity: 0.6;
    }

    /* Header: pinned top */
    .header {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      flex-shrink: 0;
      padding-bottom: 1rem;
    }

    .time-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      opacity: 0.7;
      text-transform: uppercase;
    }

    .glyph { font-size: 1rem; }

    .info-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: ${theme.ink};
      opacity: 0.5;
      padding: 0.25rem 0.5rem;
      text-transform: uppercase;
      transition: opacity 0.2s;
    }
    .info-btn:hover { opacity: 1; }

    /* Ornamental rule */
    .rule {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0.3;
      flex-shrink: 0;
    }
    .rule-line {
      flex: 1;
      height: 1px;
      background: ${theme.ink};
    }
    .rule-diamond {
      width: 5px;
      height: 5px;
      background: ${theme.accent};
      transform: rotate(45deg);
      flex-shrink: 0;
      transition: background 1.2s ease;
    }

    /* Quote: vertically centered in remaining space */
    .quote-section {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .quote-wrap {
      animation: fadeUp 0.7s ease forwards;
      text-align: center;
      width: 100%;
    }

    blockquote {
      font-size: clamp(1.125rem, 4vw, 2rem);
      line-height: 2;
      font-style: normal;
      color: ${theme.ink};
      transition: color 1.2s ease;
    }

    .attribution {
      margin-top: 1.1rem;
      font-size: 1.125rem;
      font-family: 'IM Fell English SC', serif;
      letter-spacing: 0.08em;
      opacity: 0.6;
      font-style: normal;
    }

    /* Footer: pinned bottom */
    .footer {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;
      padding-top: 1rem;
    }

    .btn-another {
      background: none;
      border: 1px solid ${theme.accent};
      color: ${theme.accent};
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 0.5rem 1.4rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .btn-another:hover {
      background: ${theme.accent};
      color: ${theme.bg};
    }

    .pool-note {
      font-size: 0.75rem;
      opacity: 0.4;
      font-family: 'IM Fell English SC', serif;
      letter-spacing: 0.08em;
    }

    /* Info overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg};
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      animation: fadeUp 0.4s ease;
    }

    .info-box {
      max-width: 440px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-title {
      font-family: 'IM Fell English SC', serif;
      font-size: 1.1rem;
      letter-spacing: 0.1em;
      color: ${theme.accent};
    }

    .info-body {
      font-size: 0.9rem;
      line-height: 1.8;
      font-style: normal;
    }

    .info-body p + p { margin-top: 0.75rem; }

    .info-close {
      background: none;
      border: 1px solid ${theme.accent};
      color: ${theme.accent};
      font-family: 'IM Fell English SC', serif;
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      padding: 0.5rem 1.4rem;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      align-self: center;
    }
    .info-close:hover {
      background: ${theme.accent};
      color: ${theme.bg};
    }

    /* Dev toggle */
    .dev-bar {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 20;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      background: ${theme.bg};
      border: 1px solid ${theme.accent};
      padding: 0.4rem 0.75rem;
      opacity: 0.7;
    }
    .dev-bar:hover { opacity: 1; }
    .dev-bar label {
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.ink};
      text-transform: uppercase;
    }
    .dev-bar select {
      background: none;
      border: none;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.accent};
      cursor: pointer;
      text-transform: uppercase;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="folk-root">

        {/* Header */}
        <div className="header">
          <div className="time-badge">
            <span className="glyph">{TIME_GLYPHS[timeOfDay]}</span>
            {TIME_LABELS[timeOfDay]} · {SEASON_LABELS[season]}
          </div>
          <button className="info-btn" onClick={() => setShowInfo(true)}>
            About
          </button>
        </div>

        {/* Top rule */}
        <div className="rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>

        {/* Quote: centered in flex space */}
        <div className="quote-section">
          <div key={fadeKey} className="quote-wrap">
            <blockquote>
              {quote.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < quote.text.split("\n").length - 1 && <br />}
                </span>
              ))}
            </blockquote>
            <p className="attribution">— {quote.source}</p>
          </div>
        </div>

        {/* Bottom rule */}
        <div className="rule">
          <div className="rule-line" />
          <div className="rule-diamond" />
          <div className="rule-line" />
        </div>

        {/* Footer */}
        <div className="footer">
          <button className="btn-another" onClick={() => refresh(lastQuote)}>
            Another
          </button>
          <p className="pool-note">
            {pool.length} verse{pool.length !== 1 ? "s" : ""} for this {timeOfDay}
          </p>
        </div>

        {/* Info overlay */}
        {showInfo && (
          <div className="overlay" onClick={() => setShowInfo(false)}>
            <div className="info-box" onClick={(e) => e.stopPropagation()}>
              <div className="info-title">About This Collection</div>
              <div className="info-body">
                <p>
                  These verses are drawn from the Child Ballads—305 traditional English
                  and Scottish folk songs collected by Francis James Child between
                  1882 and 1898. They are among the oldest surviving songs in the
                  English language.
                </p>
                <p>
                  Each verse is chosen to match the time of day and season where you are.
                  The words have been lightly modernised where needed.
                </p>
                <p>
                  A new verse appears every hour, or tap ANOTHER whenever you like.
                </p>
              </div>
              <button className="info-close" onClick={() => setShowInfo(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Dev toggle — remove DEV_MODE flag before deploying */}
        {DEV_MODE && (
          <div className="dev-bar">
            <label>Time</label>
            <select value={devTime} onChange={(e) => { setDevTime(e.target.value); setFadeKey((k) => k + 1); }}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
            <label>Season</label>
            <select value={devSeason} onChange={(e) => { setDevSeason(e.target.value); setFadeKey((k) => k + 1); }}>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        )}

      </div>
    </>
  );
}
