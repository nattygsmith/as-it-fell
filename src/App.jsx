import React, { useState, useEffect, useCallback } from "react";

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
  // ── child-ballads (─────────────────────────────────────)
  // --- Riddles Wisely Expounded (Child 1) ---
  {
    text: "He knocked at the lady's gate,\nOne evening when it was late.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["evening"],
    season: [],
    lyricsKey: "child1",
    stanzaIndex: 3,
  },
  {
    text: "The youngest sister, fair and bright,\nShe lay beside him all through the night.",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["night"],
    season: [],
    lyricsKey: "child1",
    stanzaIndex: 6,
  },
  {
    text: "And in the morning, come the day,\nShe said, 'Young man, will you marry me?'",
    source: "Riddles Wisely Expounded (Child 1)",
    time: ["morning"],
    season: [],
    lyricsKey: "child1",
    stanzaIndex: 7,
  },
  // --- Lady Isabel and the Elf-Knight (Child 4) ---
  {
    text: "Fair lady Isabel sits in her bower sewing,\nThere she heard an elf-knight blowing his horn,\nThe first morning in May.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child4",
    stanzaIndex: 0,
  },
  {
    text: "They rode till they came to the sweet water side,\nThree hours before it was day.",
    source: "Lady Isabel and the Elf-Knight (Child 4)",
    time: ["night"],
    season: [],
    lyricsKey: "child4",
    stanzaIndex: 13,
  },
  // --- The Three Ravens (Child 26) ---
  {
    text: "The one of them said to his mate,\n'Where shall we our breakfast take?'",
    source: "The Three Ravens (Child 26)",
    time: ["morning"],
    season: [],
    lyricsKey: "child26",
    stanzaIndex: 0,
  },
  {
    text: "She buried him before the prime,\nShe died herself ere evening time.",
    source: "The Three Ravens (Child 26)",
    time: ["evening"],
    season: [],
    lyricsKey: "child26",
    stanzaIndex: 8,
  },
  // --- Allison Gross (Child 35) ---
  {
    text: "But as it fell out on last Halloween,\nWhen the fairy court was riding by,\nThe queen lighted down on a daisy bank,\nNot far from the tree where I used to lie.",
    source: "Allison Gross (Child 35)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child35",
    stanzaIndex: 11,
  },
  // --- Tam Lin (Child 39) ---
  {
    text: "Gloomy, gloomy was the night,\nAnd eerie was the way,\nAs fair Jenny in her green mantle\nTo Miles Cross she did go.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 36,
  },
  {
    text: "Just at the mirk and midnight hour,\nThe fairy folk will ride,\nAnd they that would their true-love win,\nAt Miles Cross they must bide.",
    source: "Tam Lin (Child 39)",
    time: ["night"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 25,
  },
  {
    text: "Tomorrow is Halloween,\nThe elfin court will ride,\nThrough England, and through all Scotland,\nAnd through the world wide.",
    source: "Tam Lin (Child 39)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 24,
  },
  {
    text: "O they begin at sky-setting,\nRide all the evening tide;\nAnd she that will her true-love borrow,\nAt Miles Cross will him bide.",
    source: "Tam Lin (Child 39)",
    time: ["evening"],
    season: ["autumn"],
    lyricsKey: "child39",
    stanzaIndex: 26,
  },
  // --- The Broomfield Hill (Child 43) ---
  {
    text: "The one rode early in the morning,\nThe other in the afternoon.",
    source: "The Broomfield Hill (Child 43)",
    time: ["afternoon"],
    season: [],
    lyricsKey: "child43",
    stanzaIndex: 0,
  },
  {
    text: "She pulled the blossom of the broom,\nThe blossom it smells sweet.",
    source: "The Broomfield Hill (Child 43)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child43",
    stanzaIndex: 7,
  },
  // --- Sir Patrick Spens (Child 58) ---
  {
    text: "Late late last night I saw the new moon,\nWith the old moon in her arm;\nAnd I fear, I fear, my dear master,\nThat we will come to harm.",
    source: "Sir Patrick Spens (Child 58)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child58",
    stanzaIndex: 6,
  },
  // --- Lord Thomas and Annet (Child 73) ---
  {
    text: "Sweet Willie and Fair Annie,\nAs they sat on yonder hill,\nIf they had sat from morn 'til evening,\nThey had not talked their fill.",
    source: "Lord Thomas and Annet (Child 73)",
    time: ["evening"],
    season: [],
    lyricsKey: "child73",
    stanzaIndex: 30,
  },
  // --- Fair Margaret and Sweet William (Child 74) ---
  {
    text: "As it fell out on a long summer's day,\nTwo lovers they sat on a hill;\nThey sat together that long summer's day,\nAnd could not talk their fill.",
    source: "Fair Margaret and Sweet William (Child 74)",
    time: ["afternoon"],
    season: ["summer"],
    lyricsKey: "child74",
    stanzaIndex: 0,
  },
  // --- The Lass of Roch Royal (Child 76) ---
  {
    text: "Fair Isabell of Rochroyall,\nShe dreamed where she lay,\nShe dreamed a dream of her love Gregory,\nA little before the day.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: [],
    lyricsKey: "child76",
    stanzaIndex: 0,
  },
  {
    text: "The night was dark, and the wind blew cold,\nAnd her love was fast asleep,\nAnd the bairn that was in her two arms\nFull sore began to weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child76",
    stanzaIndex: 6,
  },
  // --- The Unquiet Grave (Child 78) ---
  {
    text: "The wind does blow today, my love,\nAnd a few small drops of rain;\nI never had but one true-love,\nIn a cold grave she was lain.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn", "winter"],
    lyricsKey: "child78",
    stanzaIndex: 0,
  },
  {
    text: "'Tis down in yonder garden green,\nLove, where we used to walk,\nThe finest flower that e'er was seen\nIs withered to a stalk.",
    source: "The Unquiet Grave (Child 78)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child78",
    stanzaIndex: 5,
  },
  // --- The Wife of Usher's Well (Child 79) ---
  {
    text: "The hallow day of Yule are come,\nThe nights are long and dark.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child79",
    stanzaIndex: 3,
  },
  {
    text: "The young cock crew in the merry morning,\nAnd the wild fowl chirped for day;\nThe elder to the younger did say,\nDear brother, we must away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
    lyricsKey: "child79",
    stanzaIndex: 7,
  },
  // --- Little Musgrave and Lady Barnard (Child 81) ---
  {
    text: "When supper was over, and mass was sung,\nAnd every man bound for bed,\nLittle Musgrave and that lady\nIn one chamber were laid.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["evening"],
    season: [],
    lyricsKey: "child81",
    stanzaIndex: 13,
  },
  // --- Bonny Barbara Allan (Child 84) ---
  {
    text: "It was in and about the Martinmas time,\nWhen the green leaves were a-falling.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child84",
    stanzaIndex: 0,
  },
  {
    text: "All in the merry month of May,\nWhen green leaves they were springing,\nThis young man on his death-bed lay,\nFor the love of Barbara Allen.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child84",
    stanzaIndex: 9,
  },
  {
    text: "It fell about the Lammas time,\nWhen the woods grow green and yellow.",
    source: "Bonny Barbara Allan (Child 84)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child84",
    stanzaIndex: 10,
  },
  // --- Willie o Winsbury (Child 100) ---
  {
    text: "He's mounted her on a milk-white steed,\nHimself on a dapple-grey,\nAnd made her a lady of as much land\nShe could ride in a whole summer day.",
    source: "Willie o Winsbury (Child 100)",
    time: ["morning", "afternoon"],
    season: ["summer"],
    lyricsKey: "child100",
    stanzaIndex: 12,
  },
  // --- The Great Silkie of Sule Skerry (Child 113) ---
  {
    text: "Then one arose at her bed-foot,\nA grumbly guest I'm sure was he.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["night"],
    season: [],
    lyricsKey: "child113",
    stanzaIndex: 1,
  },
  {
    text: "And it shall come to pass on a summer's day,\nWhen the sun shines hot on every stone.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning", "afternoon"],
    season: ["summer"],
    lyricsKey: "child113",
    stanzaIndex: 5,
  },
  {
    text: "And he'll go out on a May morning,\nAnd he'll kill both my wee son and me.",
    source: "The Great Silkie of Sule Skerry (Child 113)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child113",
    stanzaIndex: 6,
  },
  // --- Johnie Cock (Child 114) ---
  {
    text: "Johnie rose up in a May morning,\nCalled for water to wash his hands,\nAnd he has called for his good gray hounds,\nThat lay bound in iron bands.",
    source: "Johnie Cock (Child 114)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child114",
    stanzaIndex: 0,
  },
  // --- Sir Andrew Barton (Child 167) ---
  {
    text: "As it befell in midsummer-time,\nWhen birds sing sweetly on every tree.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "child167",
    stanzaIndex: 0,
  },
  {
    text: "When Flora, with her fragrant flowers,\nBedecked the earth so trim and gay,\nAnd Neptune, with his dainty showers,\nCame to present the month of May.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child167",
    stanzaIndex: 1,
  },
  {
    text: "Lord Howard then, of courage bold,\nWent to the sea with pleasant cheer,\nNot curbed with winter's piercing cold,\nThough it was the stormy time of the year.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["morning", "afternoon"],
    season: ["winter"],
    lyricsKey: "child167",
    stanzaIndex: 3,
  },
  {
    text: "With pikes, and guns, and bowmen bold,\nThis noble Howard is gone to the sea,\nOn the day before Midsummer's Eve,\nAnd out at Thames mouth sailed they.",
    source: "Sir Andrew Barton (Child 167)",
    time: ["evening"],
    season: ["summer"],
    lyricsKey: "child167",
    stanzaIndex: 4,
  },
  // --- Mary Hamilton (Child 173) ---
  {
    text: "Last night Queen Mary had four Maries,\nThis night she'll have but three;\nThere was Mary Seaton and Mary Beaton,\nAnd Mary Carmichael, and me.",
    source: "Mary Hamilton (Child 173)",
    time: ["night"],
    season: [],
    lyricsKey: "child173",
    stanzaIndex: 0,
  },
  {
    text: "Last night I washed Queen Mary's feet,\nAnd bore her to her bed;\nThis day she's given me my reward,\nThis gallows-tree to tread.",
    source: "Mary Hamilton (Child 173)",
    time: ["morning", "afternoon"],
    season: [],
    lyricsKey: "child173",
    stanzaIndex: 1,
  },
  // --- The Death of Parcy Reed (Child 193) ---
  {
    text: "They hunted high, they hunted low,\nThey hunted up, they hunted down,\nUntil the day was past the prime,\nAnd it grew late in the afternoon.",
    source: "The Death of Parcy Reed (Child 193)",
    time: ["afternoon"],
    season: [],
    lyricsKey: "child193",
    stanzaIndex: 3,
  },
  // --- Thomas Rymer (Child 37) ---
  {
    text: "And see not ye that bonny road,\nWhich winds about the fernie brae?\nThat is the road to fair Elfland,\nWhere you and I this night maun gae.",
    source: "Thomas Rymer (Child 37)",
    time: ["night"],
    season: [],
    lyricsKey: "child37",
    stanzaIndex: 13,
    // notes: "Version A stanza 14. No modernization needed."
  },
  // --- The Fair Flower of Northumberland (Child 9) ---
  {
    text: "Thus rode she all one winter's night,\nTill Edenborow they saw in sight.",
    source: "The Fair Flower of Northumberland (Child 9)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child9",
    stanzaIndex: 17,
    // notes: "Child 9 = The Fair Flower of Northumberland (not The Fause Knight, a common mix-up). No modernization needed."
  },
  // --- Clerk Colvill (Child 42) ---
  {
    text: "And he is on to Clyde's water,\nBy the lee light of the moon.",
    source: "Clerk Colvill (Child 42)",
    time: ["night"],
    season: [],
    lyricsKey: "child42",
    stanzaIndex: 12,
    // notes: "Version C stanza 5. 'An'→'And', 'licht'→'light', 'o'→'of'."
  },
  // --- Proud Lady Margaret (Child 47) ---
  {
    text: "Twas on a night, an evening bright,\nWhen the dew began to fall,\nLady Margaret was walking up and down,\nLooking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["evening"],
    season: [],
    lyricsKey: "child47",
    stanzaIndex: 0,
    // notes: "Version A stanza 1. 'fa'→'fall'."
  },
  {
    text: "There was a knight, in a summer's night,\nAppeared in a lady's hall,\nAs she was walking up and down,\nLooking o'er her castle wall.",
    source: "Proud Lady Margaret (Child 47)",
    time: ["night"],
    season: ["summer"],
    lyricsKey: "child47",
    stanzaIndex: 18,
    // notes: "Version B stanza 1. No modernization needed."
  },
  // --- The Bonny Hind (Child 50) ---
  {
    text: "It's May she comes and May she goes,\nDown by the garden green,\nIt's there she spied a good young squire,\nAs good as e'er she seen.",
    source: "The Bonny Hind (Child 50)",
    time: ["morning", "afternoon"],
    season: ["spring"],
    lyricsKey: "child50",
    stanzaIndex: 0,
  },
  // --- Child Waters (Child 63) ---
  {
    text: "Lord John's mother in her bower\nWas sitting all alone;\nWhen in the silence of the night\nShe heard fair Ellen's moan.",
    source: "Child Waters (Child 63)",
    time: ["night"],
    season: [],
    lyricsKey: "child63",
    stanzaIndex: 7,
  },
  // --- Clerk Saunders (Child 69) ---
  {
    text: "They baith lay still, and slept sound,\nUntil the sun began to sheen;\nShe drew the curtains a wee bit,\nAnd dull and drowsy was his een.",
    source: "Clerk Saunders (Child 69)",
    time: ["morning"],
    season: [],
    lyricsKey: "child69",
    stanzaIndex: 16,
    // notes: "een = Scots for 'eyes'. Light modernisation: sleeped→slept, Untill→Until, drowsie→drowsy."
  },
  // --- Willie and Lady Maisry (Child 70) ---
  {
    text: "You must come into my bower\nWhen the evening bells do ring,\nAnd you must come into my bower\nWhen the evening mass doth sing.",
    source: "Willie and Lady Maisry (Child 70)",
    time: ["evening"],
    season: [],
    lyricsKey: "child70",
    stanzaIndex: 3,
  },
  // --- Sweet William's Ghost (Child 77) ---
  {
    text: "O cocks are crowing at merry midnight,\nAnd the wild fowls herald the day;\nGive me my faith and troth again,\nAnd let me fare me on my way.",
    source: "Sweet William's Ghost (Child 77)",
    time: ["night"],
    season: [],
    lyricsKey: "child77",
    stanzaIndex: 9,
    // notes: "Modernised: 'a merry midnight'→'at merry midnight'; 'are boding day'→'herald the day'."
  },
  // --- The Wife of Usher's Well (Child 79) ---
  {
    text: "Up then crew the red, red cock,\nAnd up and crew the gray;\nThe eldest to the youngest said,\n'Tis time we were away.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["morning"],
    season: [],
    lyricsKey: "child79",
    stanzaIndex: 8,
    // notes: "Kept alongside #24 — different stanza, different texture. #24 is warm and narrative; this is abrupt and elegiac."
  },
  {
    text: "It fell about the Martinmas,\nWhen nights are lang and mirk,\nThe carlin wife's three sons came home,\nAnd their hats were of the birch.",
    source: "The Wife of Usher's Well (Child 79)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "child79",
    stanzaIndex: 0,
    // notes: "Replaces retired #22 (two-line fragment). hame→home; o the birk→of the birch. 'carlin'=old woman; 'mirk'=dark. Hats of birch signal the sons have come from Paradise."
  },
  // --- Little Musgrave and Lady Barnard (Child 81) ---
  {
    text: "Methinks I hear the thresel-cock,\nMethinks I hear the jay;\nMethinks I hear my lord Barnard,\nAnd I would I were away.",
    source: "Little Musgrave and Lady Barnard (Child 81)",
    time: ["morning"],
    season: [],
    lyricsKey: "child81",
    stanzaIndex: 14,
    // notes: "thresel=throstle (song thrush). jaye→jay. Kept 'thresel' for atmosphere."
  },
  // --- The Clerk's Twa Sons o Owsenford (Child 72) ---
  {
    text: "The bonny clerks they died that morn,\nTheir loves died lang ere noon.",
    source: "The Clerk's Twa Sons o Owsenford (Child 72)",
    time: ["morning"],
    season: [],
    lyricsKey: "child72",
    stanzaIndex: 13,
    // notes: "'clerks'=scholars/students. 'lang ere noon'=long before noon. No modernization: 'lang' kept for Scots sound."
  },
  // --- The Bonny Birdy (Child 82) ---
  {
    text: "There was a knight, in a summer's night,\nWas riding o'er the lee,\nAnd there he saw a bonny birdy,\nWas singing upon a tree.",
    source: "The Bonny Birdy (Child 82)",
    time: ["night"],
    season: ["summer"],
    lyricsKey: "child82",
    stanzaIndex: 0,
    // notes: "Version A stanza 1. 'oer'→'o'er'. Opening line shared with Child 47 Version B (#45) — different ballads, accepted."
  },
  // --- Young Benjie (Child 86) ---
  {
    text: "And he was stout, and proud-hearted,\nAnd thought it bitterly,\nAnd he's gone by the wan moonlight\nTo meet his Marjorie.",
    source: "Young Benjie (Child 86)",
    time: ["night"],
    season: [],
    lyricsKey: "child86",
    stanzaIndex: 3,
    // notes: "Version A stanza 4. 'ot'→'it'; 'hes gaen'→'he's gone'."
  },
  // --- Child Maurice (Child 83) ---
  {
    text: "The one was killed in the morning air,\nHis mother died at eve,\nAnd ere the morning bells were rung,\nThe threesome were all gone.",
    source: "Child Maurice (Child 83)",
    time: ["morning", "evening"],
    season: [],
    lyricsKey: "child83",
    stanzaIndex: 22,
    // notes: "Version D stanza 30. 'mornin'→'morning' (twice); 'een'→'eve'; 'or'→'ere'; 'was rung'→'were rung'; 'a gane'→'all gone'."
  },
  // --- Lady Alice (Child 85) ---
  {
    text: "Lady Alice was sitting in her bower-window,\nMending her midnight coif,\nAnd there she saw as fine a corpse\nAs ever she saw in her life.",
    source: "Lady Alice (Child 85)",
    time: ["night"],
    season: [],
    lyricsKey: "child85",
    stanzaIndex: 0,
    // notes: "Version A stanza 1. 'quoif'→'coif'."
  },
  {
    text: "O lay him down gently, ye six men tall,\nAll on the grass so green,\nAnd tomorrow, when the sun goes down,\nLady Alice a corpse shall be seen.",
    source: "Lady Alice (Child 85)",
    time: ["evening"],
    season: [],
    lyricsKey: "child85",
    stanzaIndex: 2,
    // notes: "Version A stanza 3. No modernisation needed."
  },
  // --- The Lass of Roch Royal (Child 76) ---
  {
    text: "When the cock had crawn, and day did dawn,\nAnd the sun began to peep,\nThen it rose him Love Gregor,\nAnd sorely did he weep.",
    source: "The Lass of Roch Royal (Child 76)",
    time: ["morning"],
    season: [],
    lyricsKey: "child76",
    stanzaIndex: 9,
    // notes: "Version F. 'raise'→'rose'; 'sair, sair'→'sorely'. New stanza — distinct from existing #18 and #19 from same ballad."
  },
  // --- Old Robin of Portingale (Child 80) ---
  {
    text: "And about the middle time of the night\nCame twenty-four good knights in;\nSir Gyles he was the foremost man,\nSo well he knew that gin.",
    source: "Old Robin of Portingale (Child 80)",
    time: ["night"],
    season: [],
    lyricsKey: "child80",
    stanzaIndex: 22,
    // notes: "Stanza 23. Light spelling modernisation only. 'gin' = scheme/trap."
  },
  // --- Jellon Grame (Child 90) ---
  {
    text: "Win up, my bonny boy, he says,\nAs quick as ever you may;\nFor ye maun gang for Lillie Flower,\nBefore the break of day.",
    source: "Jellon Grame (Child 90)",
    time: ["night"],
    season: [],
    lyricsKey: "child90",
    stanzaIndex: 1,
    // notes: "Stanza 2. 'eer'→'ever'."
  },
  // --- The Gay Goshawk (Child 96) ---
  {
    text: "And well he knew that lady fair\nAmong her maidens free,\nFor the flower that springs in May morning\nWas not so sweet as she.",
    source: "The Gay Goshawk (Child 96)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child96",
    stanzaIndex: 11,
    // notes: "Version E stanza 12. 'kent'→'knew'; 'ladye feir'→'lady fair'."
  },
  // --- The Battle of Otterburn (Child 161) ---
  {
    text: "It fell about the Lammas tide,\nWhen the muir-men win their hay,\nThe doughty Douglas bound him to ride\nInto England, to drive a prey.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning", "afternoon"],
    season: ["autumn"],
    lyricsKey: "child161",
    stanzaIndex: 0,
    // notes: "Version C stanza 1. Lammas = early August harvest festival. No modernisation needed."
  },
  {
    text: "But up then spake a little page,\nBefore the peep of dawn:\nO waken ye, waken ye, my good lord,\nFor Percy's hard at hand.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["night"],
    season: [],
    lyricsKey: "child161",
    stanzaIndex: 13,
    // notes: "Version C stanza 17. No modernisation needed."
  },
  {
    text: "This deed was done at Otterburn,\nAbout the breaking of the day;\nEarl Douglas was buried at the bracken-bush,\nAnd Percy led captive away.",
    source: "The Battle of Otterburn (Child 161)",
    time: ["morning"],
    season: [],
    lyricsKey: "child161",
    stanzaIndex: 17,
    // notes: "Version B stanza 14. No modernisation needed."
  },
  // --- Jamie Douglas (Child 204) ---
  {
    text: "In the morning when I arose,\nMy bonnie palace for to see,\nI came unto my lord's room-door,\nBut he would not speak one word to me.",
    source: "Jamie Douglas (Child 204)",
    time: ["morning"],
    season: [],
    lyricsKey: "child204",
    stanzaIndex: 5,
    // notes: "Version G stanza 6. No modernisation needed."
  },
  {
    text: "O waly, waly up the bank!\nAnd waly, waly down the brae!\nAnd waly, waly by yon burn-side,\nWhere me and my love were wont to gae!",
    source: "Jamie Douglas (Child 204)",
    time: ["morning", "afternoon"],
    season: [],
    lyricsKey: "child204",
    stanzaIndex: 0,
    // notes: "Version H stanza 1 ('Waly Waly'). 'waly' = cry of lamentation. No modernisation needed."
  },
  // --- The Braes o Yarrow (Child 214) ---
  {
    text: "Late in the evening, drinking the wine,\nOr early in the morning,\nThey set a combat them between,\nTo fight it out in the dawning.",
    source: "The Braes o Yarrow (Child 214)",
    time: ["evening", "morning"],
    season: [],
    lyricsKey: "child214",
    stanzaIndex: 0,
    // notes: "Version F stanza 1. 'eenin'→'evening'."
  },
  // --- The Daemon Lover (Child 243) ---
  {
    text: "O sleep ye, wake ye, my husband?\nI wish ye wake in time!\nI would not for ten thousand pounds\nThis night ye knew my mind.",
    source: "The Daemon Lover (Child 243)",
    time: ["night"],
    season: [],
    lyricsKey: "child243",
    stanzaIndex: 11,
    // notes: "Version C stanza 12. No modernisation needed."
  },
  // --- The Grey Cock (Child 248) ---
  {
    text: "It's now ten at night, and the stars give no light,\nAnd the bells they ring ding, dang;\nHe's met with some delay that caused him to stay,\nBut he will be here ere lang.",
    source: "The Grey Cock (Child 248)",
    time: ["night"],
    season: [],
    lyricsKey: "child248",
    stanzaIndex: 1,
    // notes: "Version A stanza 2. 'gie'→'give'. 'ere lang'=before long."
  },
  {
    text: "Flee, flee up, my bonny grey cock,\nAnd crow when it is day;\nYour neck shall be like the bonny beaten gold,\nAnd your wings of the silver grey.",
    source: "The Grey Cock (Child 248)",
    time: ["morning"],
    season: [],
    lyricsKey: "child248",
    stanzaIndex: 5,
    // notes: "Version A stanza 6. No modernisation needed."
  },
  // --- The Gypsy Laddie (Child 200) ---
  {
    text: "Yestreen I lay in a well-made bed,\nAnd my good lord beside me;\nThis night I'll lie in a tenant's barn,\nWhatever shall betide me.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["night"],
    season: [],
    lyricsKey: "child200",
    stanzaIndex: 3,
    // notes: "Version A stanza 4. 'yestreen'=last night. No modernisation needed."
  },
  {
    text: "Now when our lord came home at even,\nHe speired for his fair lady;\nThe ane she cried, the tither replied,\nShe's awa wi the gypsy laddie.",
    source: "The Gypsy Laddie (Child 200)",
    time: ["evening"],
    season: [],
    lyricsKey: "child200",
    stanzaIndex: 7,
    // notes: "Version F stanza 8. 'een'→'even'. 'speired'=asked."
  },
  // --- Brown Adam (Child 98) ---
  {
    text: "It was late, late in the evening,\nLate, late in the afternoon,\nThere came a knight to Brown Adam's house,\nAnd he was clad all in brown.",
    source: "Brown Adam (Child 98)",
    time: ["evening", "afternoon"],
    season: [],
    lyricsKey: "child98",
    stanzaIndex: 0,
    // notes: "Opening stanza. No modernisation needed."
  },
  // --- Johnie Scot (Child 99) ---
  {
    text: "O up then rose him Johnie Scot,\nAn hour before the day,\nAnd he is on to Fair Ellen's bower,\nTo hear what she did say.",
    source: "Johnie Scot (Child 99)",
    time: ["night"],
    season: [],
    lyricsKey: "child99",
    stanzaIndex: 2,
    // notes: "Version A. Pre-dawn rising stanza. No modernisation needed."
  },
  // --- Rose the Red and White Lily (Child 103) ---
  {
    text: "She hadna been in fair France\nA twelvemonth and a day,\nTill there she heard the morning drum\nBeat out at break of day.",
    source: "Rose the Red and White Lily (Child 103)",
    time: ["morning"],
    season: [],
    lyricsKey: "child103",
    stanzaIndex: 13,
    // notes: "No modernisation needed."
  },
  // --- Sir Hugh, or, The Jew's Daughter (Child 155) ---
  {
    text: "She's taen him to her cellar dark,\nAt the hour o midnight keen;\nShe's stabbed him with a little penknife,\nAnd put him in the well sae deep.",
    source: "Sir Hugh, or, The Jew's Daughter (Child 155)",
    time: ["night"],
    season: [],
    lyricsKey: "child155",
    stanzaIndex: 7,
    // notes: "Version B. 'o midnight keen' = of sharp/bitter midnight. No modernisation needed."
  },
  // --- The Famous Flower of Serving-Men (Child 106) ---
  {
    text: "She dressed herself in man's array,\nAnd to the king's court took her way,\nShe rode till she came to the palace gate,\nOne morning when it was late.",
    source: "The Famous Flower of Serving-Men (Child 106)",
    time: ["morning"],
    season: [],
    lyricsKey: "child106",
    stanzaIndex: 4,
    // notes: "No modernisation needed."
  },
  // --- The Baffled Knight (Child 112) ---
  {
    text: "As I went out one May morning,\nTo view the fields and meadows gay,\nI met a maid came out of the wood,\nAnd she had lost her way.",
    source: "The Baffled Knight (Child 112)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child112",
    stanzaIndex: 0,
    // notes: "No modernisation needed."
  },
  // --- Robin Hood and the Monk (Child 119) ---
  {
    text: "John early in a May morning,\nLooking his shoes upon,\nHe took him to Nottingham,\nTo matins all alone.",
    source: "Robin Hood and the Monk (Child 119)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child119",
    stanzaIndex: 8,
    // notes: "Version A. 'morow'→'morning'. 'Much' (the miller's son) rendered as 'John' in this version."
  },
  // --- Durham Field (Child 159) ---
  {
    text: "The sixth of August the muster was,\nEarly in a morning clear;\nOur English archers their bows did bend,\nAnd many a black blade did appear.",
    source: "Durham Field (Child 159)",
    time: ["morning"],
    season: [],
    lyricsKey: "child159",
    stanzaIndex: 0,
    // notes: "'black blade' substituted for 'black bill' (a pole weapon with blackened blade) for readability. No other modernisation."
  },
  // --- Henry Martyn (Child 250) ---
  {
    text: "He had not been sailing but a short winter's night,\nAnd part of a short winter's day,\nWhen he espied a lofty ship,\nCome sailing all along that way.",
    source: "Henry Martyn (Child 250)",
    time: ["night", "morning", "afternoon"],
    season: ["winter"],
    lyricsKey: "child250",
    stanzaIndex: 2,
    // notes: "No modernisation needed."
  },
  // --- The Kitchie Boy (Child 252) ---
  {
    text: "The day it is gone, and the night's come on,\nAnd the King's court it is begun;\nAll the ladies in the court are going to bed,\nAnd it's time that I were gone.",
    source: "The Kitchie Boy (Child 252)",
    time: ["evening"],
    season: [],
    lyricsKey: "child252",
    stanzaIndex: 9,
    // notes: "No modernisation needed."
  },
  // --- Willie's Lyke-Wake (Child 255) ---
  {
    text: "About the dead hour of the night\nShe heard the bridles ring;\nAnd Janet was as glad of that\nAs any earthly thing.",
    source: "Willie's Lyke-Wake (Child 255)",
    time: ["night"],
    season: [],
    lyricsKey: "child255",
    stanzaIndex: 9,
    // notes: "No modernisation needed."
  },
  // --- The Knight's Ghost (Child 265) ---
  {
    text: "She looked over her castle wall,\nTo see what she might see;\nShe spied her own dear lord\nCome riding over the lee,\nAt the dead hour of the night.",
    source: "The Knight's Ghost (Child 265)",
    time: ["night"],
    season: [],
    lyricsKey: "child265",
    stanzaIndex: 0,
    // notes: "'deid'→'dead'. No other modernisation."
  },
  // --- The Suffolk Miracle (Child 272) ---
  {
    text: "A young man riding in the night,\nHis journey for to take,\nHe rode until the morning light,\nFor his true love's sake.",
    source: "The Suffolk Miracle (Child 272)",
    time: ["night", "morning"],
    season: [],
    lyricsKey: "child272",
    stanzaIndex: 0,
    // notes: "No modernisation needed."
  },
  // --- The Keach i the Creel (Child 281) ---
  {
    text: "But the night was dark, and the way was sair,\nAnd the morn came up on them unaware.",
    source: "The Keach i the Creel (Child 281)",
    time: ["night", "morning"],
    season: [],
    lyricsKey: "child281",
    stanzaIndex: 6,
    // notes: "'sair' kept for Scots sound (=sore/hard). No other modernisation."
  },
  // --- Trooper and Maid (Child 299) ---
  {
    text: "When the trumpet sounds to horse and away,\nEarly in the morning,\nLeave thy bed and leave thy beau,\nEarly in the morning.",
    source: "Trooper and Maid (Child 299)",
    time: ["morning"],
    season: [],
    lyricsKey: "child299",
    stanzaIndex: 0,
    // notes: "No modernisation needed."
  },
  // --- The Broom of Cowdenknows (Child 305) ---
  {
    text: "There was a troop of merry gentlemen\nWere riding tween twa knowes;\nThey swore they smelled a bonny lass,\nAs they came by the broom of Cowdenknows.\nIt's up then spake the foremost man,\nSaid, I see her standing there;\nA bonny lass in a green mantle,\nCombing down her yellow hair,\nEarly on a May morning.",
    source: "The Broom of Cowdenknows (Child 305)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "child305",
    stanzaIndex: 0,
    // notes: "'twa knowes'=two hills. No modernisation needed."
  },
  // ── sharp (─────────────────────────────────────────────)
  // --- Blow Away the Morning Dew (Sharp 19) ---
  {
    text: "There was a farmer's son, kept sheep all on the hill,\nAnd he walked out one May morning to see what he could kill.",
    source: "Blow Away the Morning Dew (Sharp 19)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp19",
    stanzaIndex: 0,
    // notes: "Opening stanza. Sharp's version of Child 112 / The Baffled Knight."
  },
  // --- The Lark in the Morn (Sharp 62) ---
  {
    text: "The lark in the morning she rises from her nest,\nShe mounts into the air with the dew round her breast;\nAnd at night she will return to her own nest again.",
    source: "The Lark in the Morn (Sharp 62)",
    time: ["morning", "night"],
    season: [],
    lyricsKey: "sharp62",
    stanzaIndex: 1,
    // notes: "Chorus stanza. Morning rise and night return both explicit."
  },
  // --- Searching for Lambs (Sharp 48) ---
  {
    text: "As I went out one May morning,\nOne May morning betime,\nI met a maid, from home had strayed\nJust as the sun did shine.",
    source: "Searching for Lambs (Sharp 48)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp48",
    stanzaIndex: 0,
    // notes: "Opening stanza. 'betime' = early."
  },
  // --- The Sweet Primeroses (Sharp 51) ---
  {
    text: "As I walked out one midsummer's morning\nFor to view the fields and to take the air,\nDown by the banks of the sweet primeroses,\nThere I beheld a most lovely fair.",
    source: "The Sweet Primeroses (Sharp 51)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "sharp51",
    stanzaIndex: 0,
    // notes: "Opening stanza. Explicit morning and midsummer."
  },
  // --- The Seeds of Love (Sharp 33) ---
  {
    text: "I sowed the seeds of love,\nAnd I sowed them in the spring;\nI gathered them up in the morning so soon,\nWhile the small birds so sweetly sing.",
    source: "The Seeds of Love (Sharp 33)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp33",
    stanzaIndex: 0,
    // notes: "Opening stanza. First song Sharp ever collected (1903)."
  },
  // --- The Cuckoo (Sharp 35) ---
  {
    text: "The cuckoo is a pretty bird, she singeth as she flies,\nShe bringeth us good tidings, she telleth us no lies;\nShe sucketh white flowers to make her voice clear,\nAnd the more she cries 'cuckoo,' the summer draweth near.",
    source: "The Cuckoo (Sharp 35)",
    time: [],
    season: ["spring"],
    lyricsKey: "sharp35",
    stanzaIndex: 0,
    // notes: "Opening stanza. Cuckoo as herald of approaching summer; tagged spring."
  },
  // --- The Trees They Do Grow High (Sharp 25) ---
  {
    text: "And so early in the morning, at the dawning of the day,\nThey went out into the hayfield to have some sport and play.",
    source: "The Trees They Do Grow High (Sharp 25)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "sharp25",
    stanzaIndex: 4,
    // notes: "Mid-narrative stanza. Hayfield = summer context. Works as standalone morning image."
  },
  // --- Green Bushes (Sharp 40) ---
  {
    text: "As I was walking one morning in May,\nTo hear the birds whistle and the nightingales sing,\nI saw a young damsel, so sweetly sang she,\nDown by the green bushes he thinks to meet me.",
    source: "Green Bushes (Sharp 40)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp40",
    stanzaIndex: 0,
    // notes: "Opening stanza. Explicit morning and May."
  },
  // --- Dabbling in the Dew (Sharp 44) ---
  {
    text: "Oh, where are you going to, my pretty little dear,\nWith your red rosy cheeks and your coal black hair?\nI'm going a-milking, kind sir, she answered me,\nAnd it's dabbling in the dew makes the milkmaids fair.",
    source: "Dabbling in the Dew (Sharp 44)",
    time: ["morning"],
    season: [],
    lyricsKey: "sharp44",
    stanzaIndex: 0,
    // notes: "Opening stanza. Morning tagged by strong dew/milkmaid-at-dawn cultural association."
  },
  // --- I'm Seventeen Come Sunday (Sharp 61) ---
  {
    text: "As I walked out on a May morning,\nOn a May morning so early,\nI overtook a pretty fair maid\nJust as the day was a-dawning.",
    source: "I'm Seventeen Come Sunday (Sharp 61)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "sharp61",
    stanzaIndex: 0,
    // notes: "Opening stanza. Sharp's cleaned-up version. Explicit morning and May."
  },
  // --- Farewell Nancy (Sharp 30) ---
  {
    text: "Fare you well, my dearest Nancy,\nFor now I must leave you,\nAll across the salt seas\nI am bound for to go;\nDon't let my long absence\nTrouble and grieve you,\nFor I shall return in the spring,\nAs you know.",
    source: "Farewell Nancy (Sharp 30)",
    time: [],
    season: ["spring"],
    lyricsKey: "sharp30",
    stanzaIndex: 0,
    // notes: "Opening stanza. 'Return in the spring' is the emotional core and seasonal marker."
  },
  // --- The Low Low Lands of Holland (Sharp 23) ---
  {
    text: "There's not a swathe goes round my waist,\nNor a comb goes in my hair,\nNeither firelight nor candlelight\nCan ease my heart's despair.",
    source: "The Low Low Lands of Holland (Sharp 23)",
    time: ["night"],
    season: [],
    lyricsKey: "sharp23",
    stanzaIndex: 3,
    // notes: "Night tagged via firelight/candlelight imagery — domestic evening scene being renounced."
  },
  // --- John Barleycorn (Sharp 84) ---
  {
    text: "They let him stand till midsummer day,\nTill he looked both pale and wan.\nAnd little Sir John he growed a long beard\nAnd so become a man.",
    source: "John Barleycorn (Sharp 84)",
    time: [],
    season: ["summer"],
    lyricsKey: "sharp84",
    stanzaIndex: 2,
    // notes: "Third stanza. Shepherd Hayden's version collected Bampton, Oxfordshire, 1909. Midsummer day explicit."
  },
  // --- Wassail Song (Sharp 92) ---
  {
    text: "We know by the moon that we are not too soon,\nAnd we know by the sky that we are not too high.\nWe know by the stars that we are not too far,\nAnd we know by the ground that we are within sound.",
    source: "Wassail Song (Sharp 92)",
    time: ["night"],
    season: ["winter"],
    lyricsKey: "sharp92",
    stanzaIndex: 4,
    // notes: "Fifth stanza. Night tagged via moon and stars. Winter via wassailing context."
  },
  // --- It's a Rosebud in June (Sharp 93) ---
  {
    text: "It's a rosebud in June, and violets in full bloom,\nAnd the small birds singing love songs on each spray.",
    source: "It's a Rosebud in June (Sharp 93)",
    time: [],
    season: ["summer"],
    lyricsKey: "sharp93",
    stanzaIndex: 0,
    // notes: "Opening couplet. William King's version collected Mendip, Somerset, 1904. June explicit."
  },
  // ── campbell-sharp (────────────────────────────────────)
  // --- Pretty Saro (Campbell/Sharp 1917, No. 76) ---
  {
    text: "Well, if I were a turtle dove, had wings and could fly,\nI would fly to my love's lodging and there I'd draw nigh.\nAnd in her lily white arms all night I would lay\nAnd watch those little winders till the dawning of day.",
    source: "Pretty Saro (Campbell/Sharp 1917, No. 76)",
    time: ["night", "morning"],
    season: [],
    lyricsKey: "campbellsharp76",
    stanzaIndex: 3,
    // notes: "Fourth stanza (order varies by version). Night tagged via 'all night'; morning via 'dawning of day'. Text from the Appalachian tradition Sharp collected; multiple versions in the 1917 edition. lyricsKey stub needed."
  },
  // --- Come All You Fair and Tender Ladies (Campbell/Sharp 1917, No. 65) ---
  {
    text: "Come all you fair and tender ladies,\nTake warning how you court young men.\nThey're like a bright star on a summer's morning,\nFirst they appear and then they're gone.",
    source: "Come All You Fair and Tender Ladies (Campbell/Sharp 1917, No. 65)",
    time: ["morning"],
    season: ["summer"],
    lyricsKey: "campbellsharp65",
    stanzaIndex: 0,
    // notes: "Opening stanza. Morning and summer both explicit. Sharp collected 18 versions; this stanza appears consistently across them. lyricsKey stub needed."
  },
  // --- Early, Early in the Spring (Campbell/Sharp 1917, No. 72) ---
  {
    text: "It was early, early all in a spring,\nI went on board for to serve the king,\nI left my dearest dearie behind,\nThat often told me her heart was mine.",
    source: "Early, Early in the Spring (Campbell/Sharp 1917, No. 72)",
    time: ["morning"],
    season: ["spring"],
    lyricsKey: "campbellsharp72",
    stanzaIndex: 0,
    // notes: "Opening stanza. Spring explicit; 'early, early' implies pre-dawn departure. Confirmed in 1917 edition. lyricsKey stub needed."
  },
  // --- Awake! Awake! (Campbell/Sharp 1917, No. 47) ---
  {
    text: "Awake! Awake! You drowsy sleeper,\nAwake! Awake! For it's almost day,\nWhy do you lie there in your slumber,\nWhen your true-love is going away?",
    source: "Awake! Awake! (Campbell/Sharp 1917, No. 47)",
    time: ["morning"],
    season: [],
    lyricsKey: "campbellsharp47",
    stanzaIndex: 0,
    // notes: "Opening stanza. 'Almost day' explicit morning marker. Collected from Mary Sands, Allanstand, Madison County NC, August 1916. Confirmed in 1917 edition. lyricsKey stub needed."
  },
];

// ============================================================
//  LYRICS LIBRARY
//  Each key matches the lyricsKey on a quote object.
//  stanzas: array of strings, one per stanza (use \n for line breaks within a stanza).
//  The stanzaIndex on each quote points into this array — that stanza is highlighted.
//
//  To add a ballad:
//    1. Add an entry here with title, version, and stanzas array.
//    2. Add lyricsKey and stanzaIndex to every quote from that ballad in QUOTES above.
// ============================================================
const LYRICS = {
  "child26": {
    title: "The Three Ravens",
    childNumber: "Child 26",
    version: "Traditional (Percy's Reliques, 1765)",
    stanzas: [
      "There were three ravens sat on a tree,
Down a down, hay down, hay down,
There were three ravens sat on a tree,
With a down,
There were three ravens sat on a tree,
They were as black as they might be,
With a down, derry, derry, derry, down, down.",
      "The one of them said to his mate,
'Where shall we our breakfast take?'
With a down, derry, derry, derry, down, down.",
      "'Down in yonder green field,
There lies a knight slain under his shield.'",
      "'His hounds they lie down at his feet,
So well they can their master keep.'",
      "'His hawks they fly so eagerly,
No other fowl dare him come nigh.'",
      "Down there comes a fallow doe,
As great with fawn as she might go.",
      "She lifted up his bleeding head,
And kissed his wounds that were so red.",
      "She got him up upon her back,
And carried him to earthen lake.",
      "She buried him before the prime,
She died herself ere evening time.",
      "God send every gentleman,
Such hawks, such hounds, and such a leman.",
    ],
  },

  "child1": {
    title: "Riddles Wisely Expounded",
    childNumber: "Child 1",
    version: "Version A (Broadside, Rawlinson Collection)",
    stanzas: [
      "There was a lady of the North Country,
And she had lovely daughters three.",
      "There was a knight of noble worth
Which also lived in the North.",
      "The knight, of courage stout and brave,
A wife he did desire to have.",
      "He knocked at the lady's gate,
One evening when it was late.",
      "The eldest sister let him in,
And pinned the door with a silver pin.",
      "The second sister she made his bed,
And laid soft pillows under his head.",
      "The youngest daughter that same night,
She went to bed to this young knight.",
      "And in the morning, when it was day,
These words unto him she did say:
'Now you have had your will,' quoth she,
'I pray, sir knight, will you marry me?'",
      "The young brave knight to her replied,
'Thy suit, fair maid, shall not be denied.
If thou canst answer me questions three,
This very day will I marry thee.'",
      "'Kind sir, in love, O then,' quoth she,
'Tell me what your three questions be.'",
      "'O what is longer than the way,
Or what is deeper than the sea?
Or what is louder than the horn,
Or what is sharper than a thorn?
Or what is greener than the grass,
Or what is worse than a woman was?'",
      "'O love is longer than the way,
And hell is deeper than the sea.
And thunder is louder than the horn,
And hunger is sharper than a thorn.
And poison is greener than the grass,
And the Devil is worse than woman was.'",
      "When she these questions answered had,
The knight became exceeding glad.
And having truly tried her wit,
He much commended her for it.",
      "And after, as it is verified,
He made of her his lovely bride.
So now, fair maidens all, adieu,
This song I dedicate to you.",
      "I wish that you may constant prove
Unto the man that you do love.",
    ],
  },

  "child4": {
    title: "Lady Isabel and the Elf-Knight",
    childNumber: "Child 4",
    version: "Version A / Version F composite",
    stanzas: [
      "Fair lady Isabel sits in her bower sewing,
There she heard an elf-knight blowing his horn,
The first morning in May.",
      "'If I had yon horn that I hear blowing,
And yon elf-knight to sleep in my bosom.'",
      "This maiden had scarcely these words spoken,
Till in at her window the elf-knight has leapt.",
      "'It's a very strange matter, fair maiden,' said he,
'I cannot blow my horn but ye call on me.'",
      "'But will ye go to yon greenwood side?
If ye canna gang, I will cause you to ride.'",
      "He leapt on a horse, and she on another,
And they rode on to the greenwood together.",
      "'Light down, light down, lady Isabel,' said he,
'We are come to the place where ye are to die.'",
      "'Have mercy, have mercy, kind sir, on me,
Till once my dear father and mother I see.'",
      "'Seven kings' daughters here have I slain,
And ye shall be the eighth of them.'",
      "'O sit down a while, lay your head on my knee,
That we may have some rest before that I die.'",
      "She stroked him sae fast, and she stroked him sae slee,
That she stroked him fast on to sleep.",
      "Then she took up his bright shining sword,
And laid it across her own white knee.",
      "She rode on his steed and she led the grey,
And she rode till she came to her father's ha.",
      "She rode till she came to the sweet river side,
Three hours before it was day.",
    ],
  },

  "child9": {
    title: "The Fair Flower of Northumberland",
    childNumber: "Child 9",
    version: "Version A (Deloney's Jack of Newbury, 1597)",
    stanzas: [
      "It was a knight in Scotland born,
Was taken prisoner, and left forlorn,
Even by the good Earl of Northumberland.",
      "Then was he cast in prison strong,
Where he could not walk nor lie along,
Even by the good Earl of Northumberland.",
      "And as in sorrow thus he lay,
The Earl's sweet daughter walked that way,
And she the fair flower of Northumberland.",
      "And passing by, like an angel bright,
The prisoner had of her a sight,
And she the fair flower of Northumberland.",
      "And loud to her this knight did cry,
The salt tears standing in his eye,
And she the fair flower of Northumberland.",
      "'Fair lady, take pity on me,
And let me not in prison die,
And you the fair flower of Northumberland.'",
      "'Fair Sir, how should I take pity on thee,
Thou being a foe to our country,
And I the fair flower of Northumberland?'",
      "'Fair lady, I am no foe,' he said,
'Through thy sweet love here was I stayed,
For thee, the fair flower of Northumberland.'",
      "'Why shouldst thou come here for love of me,
Having wife and children in thy country?
And I the fair flower of Northumberland.'",
      "'I swear by the blessed Trinity,
I have no wife nor children, I,
Nor dwelling at home in merry Scotland.'",
      "'If courteously you will set me free,
I vow that I will marry thee,
So soon as I come in fair Scotland.'",
      "'Thou shalt be a lady of castles and towers,
And sit like a queen in princely bowers,
When I am at home in fair Scotland.'",
      "Then parted hence this lady gay,
And got her father's ring away,
To help this knight into fair Scotland.",
      "She got the keys of the prison strong,
And released him who had lain so long,
This knight from the Earl of Northumberland.",
      "A gallant steed he did bestride,
And with the lady away did ride,
And she the fair flower of Northumberland.",
      "They rode till they came to a water clear:
'Good Sir, how should I follow you here,
And I the fair flower of Northumberland?'",
      "The lady pricked her wanton steed,
And over the river swam with speed,
And she the fair flower of Northumberland.",
      "Thus rode she all one winter's night,
Till Edenborough they saw in sight,
And she the fair flower of Northumberland.",
      "Now he had a wife and children five,
In Edinburgh city who did thrive,
In spite of the fair flower of Northumberland.",
      "'Go get thee home, thou false knight's whore,
Of me thou shalt obtain no more,
Go get thee home to Northumberland.'",
      "She fell down humbly on her knee,
Crying, 'Courteous knight, take pity on me,
And I the fair flower of Northumberland.'",
      "At length two knights came riding by,
Two gallant knights of fair England,
And they the fair flowers of England.",
      "She fell down humbly on her knee,
Saying, 'Courteous knights, take pity on me,
And I the fair flower of Northumberland.'",
      "They took her up behind them then,
And brought her to her father again,
And he the good Earl of Northumberland.",
      "'All you fair maidens be warned by me,
Scots were never true, nor never will be,
To lord, nor lady, nor fair England.'",
    ],
  },

  "child35": {
    title: "Allison Gross",
    childNumber: "Child 35",
    version: "Version A (Mrs Brown of Falkland, c.1783)",
    stanzas: [
      "O Allison Gross, that lives in yon tower,
The ugliest witch in the north country,
Has tristed me one day up till her bower,
And many fair speech she made to me.",
      "She stroked my head, and she combed my hair,
And she set me down softly on her knee;
Says, 'Gin ye will be my leman so true,
Sae many braw things as I would ye gi.'",
      "She showed me a mantle of red scarlet,
With golden flowers and fringes fine;
Says, 'Gin ye will be my leman so true,
This goodly gift it shall be thine.'",
      "'Away, away, ye ugly witch,
Hold far away and let me be;
I never will be your leman so true,
And I wish I were out of your company.'",
      "She next brought a sark of the softest silk,
Well wrought with pearls about the band;
Says, 'Gin you will be my ain true love,
This goodly gift you shall command.'",
      "She showed me a cup of the good red gold,
Well set with jewels so fair to see;
Says, 'Gin you will be my leman so true,
This goodly gift I will you gi.'",
      "'Away, away, ye ugly witch,
Hold far away and let me be;
For I would not once kiss your ugly mouth
For all the gifts that ye could gi.'",
      "She's turned her right and round about,
And thrice she blew on a grass-green horn;
And she swore by the moon and the stars above
That she'd make me rue the day I was born.",
      "Then out she has taken a silver wand,
And she's turned me three times round and round;
She's muttered such words till my strength it failed,
And she's laid me down on the cold green ground.",
      "She turned me into an ugly worm,
And made me toddle about the tree;
And ay on every Saturday's night
My sister Maisry came to me,",
      "With silver basin and silver comb,
To comb my head upon her knee;
But before I had kissed her ugly mouth
I'd sooner have toddled about the tree.",
      "But as it fell out on last Halloween,
When the fairy court was riding by,
The queen lighted down on a daisy bank,
Not far from the tree where I used to lie.",
      "She took me up in her milk-white hand,
And she stroked me three times over her knee;
She changed me again to my ain proper shape,
And I no more shall toddle about the tree.",
    ],
  },

  "child37": {
    title: "Thomas Rymer",
    childNumber: "Child 37",
    version: "Version A (Mrs Brown of Falkland, c.1800)",
    stanzas: [
      "True Thomas lay over yond grassy bank,
And he beheld a lady gay,
A lady that was brisk and bold,
Come riding over the fernie brae.",
      "Her skirt was of the grass-green silk,
Her mantle of the velvet fine;
At every lock of her horse's mane
Hung fifty silver bells and nine.",
      "True Thomas he took off his hat,
And bowed him low down till his knee:
'All hail, thou mighty Queen of Heaven!
For your peer on earth I never did see.'",
      "'O no, O no, True Thomas,' she says,
'That name does not belong to me;
I am but the queen of fair Elfland,
And I'm come here for to visit thee.'",
      "'But ye maun go wi me now, Thomas,
True Thomas, ye maun go wi me,
For ye maun serve me seven years,
Through weal or woe as may chance to be.'",
      "She turned about her milk-white steed,
And took True Thomas up behind,
And aye whenever her bridle rang,
The steed flew swifter than the wind.",
      "For forty days and forty nights
He waded through red blood to the knee,
And he saw neither sun nor moon,
But heard the roaring of the sea.",
      "O they rode on, and further on,
Until they came to a garden green:
'Light down, light down, ye lady free,
Some of that fruit let me pull to thee.'",
      "'O no, O no, True Thomas,' she says,
'That fruit may not be touched by thee,
For all the plagues that are in hell
Light on the fruit of this country.'",
      "'But I have a loaf here in my lap,
Likewise a bottle of claret wine,
And now ere we go farther on,
We'll rest a while, and ye may dine.'",
      "When he had eaten and drunk his fill,
'Lay down your head upon my knee,'
The lady said, 'ere we climb yon hill,
And I will show you wonders three.'",
      "'O see not ye yon narrow road,
So thick beset with thorns and briars?
That is the path of righteousness,
Though after it but few enquires.'",
      "'And see not ye that broad, broad road,
That lies across yon lily leven?
That is the path of wickedness,
Though some call it the road to heaven.'",
      "'And see not ye that bonny road,
Which winds about the fernie brae?
That is the road to fair Elfland,
Where you and I this night maun gae.'",
      "'But Thomas, ye maun hold your tongue,
Whatever you may hear or see,
For if one word you should chance to speak,
You will never get back to your own country.'",
      "He has gotten a coat of the even cloth,
And a pair of shoes of velvet green,
And till seven years were past and gone
True Thomas on earth was never seen.",
    ],
  },

  "child42": {
    title: "Clerk Colvill",
    childNumber: "Child 42",
    version: "Version A / Version C composite",
    stanzas: [
      "Clerk Colvill and his lusty dame
Were walking in the garden green;
The belt around her stately waist
Cost Clerk Colvill of pounds fifteen.",
      "'O promise me now, Clerk Colvill,
Or it will cost ye muckle strife,
Ride never by the wells of Slane,
If ye would live and keep your life.'",
      "'Now speak no more, my lusty dame,
Now speak no more of that to me;
Did I never see a fair woman,
But I would sin with her body?'",
      "He's taken leave of his gay lady,
Nought minding what his lady said,
And he's ridden by the wells of Slane,
Where washing was a bonny maid.",
      "'Wash on, wash on, my bonny maid,
That wash so clean your sark of silk;'
'And well fare you, fair gentleman,
Your body whiter than the milk.'",
      "Then loud cried the Clerk Colvill,
'O my head it pains me sore;'
'Then take, then take,' the maiden said,
'And from my sark you'll cut a gore.'",
      "Then she's given him a little bone-knife,
And from her sark he cut a share;
She's tied it round his pale white face,
But aye his head it ached more.",
      "Then louder cried the Clerk Colvill,
'O sorer, sorer aches my head;'
'And sorer, sorer ever will,'
The maiden cries, 'till you be dead.'",
      "Out then he drew his shining blade,
Thinking to strike her where she stood,
But she was vanished to a fish,
And swam far off, a fair mermaid.",
      "'O mother, mother, braid my hair;
My lusty lady, make my bed;
O brother, take my sword and spear,
For I have seen the false mermaid.'",
      "'Forbidden gin ye wad be, love Colin,
Forbidden gin ye wad be,
And gang no more to Clyde's water,
To court yon gay ladie.'",
      "'Forbid me from your hall, mother,
Forbid me from your bower,
But forbid me not from yon ladie;
She's fair as any flower.'",
      "And he is on to Clyde's water,
By the lee light of the moon;
And when he came to the Clyde's water
He lighted lowly down.",
      "And there he saw the mermaiden,
Washing silk upon a stone.
'Come down, come down now, Clerk Colin,
Come down and fish with me.'",
      "'O mother, mother, make my bed,
And, sister, lay me down;
And brother, take my bow and shoot,
For my shooting is done.'",
      "'Will ye lie there and die, Clerk Colin,
Will ye lie there and die?
Or will ye gang to Clyde's water
To fish in flood with me?'
'I will lie here and die,' he said,
'I will lie here and die;
In spite of all the devils in hell
I will lie here and die.'",
    ],
  },

  "child43": {
    title: "The Broomfield Hill",
    childNumber: "Child 43",
    version: "Version A (Herd's Manuscripts, 1769)",
    stanzas: [
      "There was a knight and a lady bright,
Had a true tryst at the broom;
The one rode early in the morning,
The other in the afternoon.",
      "And aye she sat in her mother's bower door,
And aye she made her moan:
'O whether should I gang to the Broomfield Hill,
Or should I stay at home?'",
      "'For if I gang to the Broomfield Hill,
My maidenhead is gone;
And if I chance to stay at home,
My love will call me mansworn.'",
      "Up then spoke a witch-woman,
Ay from the room above:
'O ye may gang to the Broomfield Hill,
And yet come maiden home.'",
      "'For when ye gang to the Broomfield Hill,
You'll find your love asleep,
With a silver belt about his head,
And a broom-bough at his feet.'",
      "'Take ye the blossom of the broom,
The blossom it smells sweet,
And strew it at your true-love's head,
And likewise at his feet.'",
      "'Take ye the rings off your fingers,
Put them on his right hand,
To let him know, when he doth awake,
His love was at his command.'",
      "She pulled the blossom of the broom,
The blossom it smells sweet,
And strewed it at her true-love's head,
And likewise at his feet.",
      "And she's taken the rings off her fingers,
And put them on his right hand,
To let him know, when he did awake,
His love was at his command.",
      "She pulled his sword from out the sheath,
And thrust it in the ground,
And took the steed from under him,
And rode away full sound.",
      "Now when he woke from out his sleep,
An angry man was he;
He looked east, he looked west,
He wept full bitterly.",
      "'Where were ye, my good grey hawk,
That I did love so dear,
That ye didna wake me from my sleep
When my true love was here?'",
      "'I clapped my wings, my master dear,
Your slumber was so deep;
I struck my talons in the bough
But still ye would not wake.'",
      "'I'm now so far from Broomfield Hill,
And cannot turn again;
He'll know his rings when he awakes,
And he'll never have me slain.'",
    ],
  },

  "child39": {
    title: "Tam Lin",
    childNumber: "Child 39",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "O I forbid you, maidens all,
That wear gowd on your hair,
To come or gae by Carterhaugh,
For young Tam Lin is there.",
      "There's none that gaes by Carterhaugh
But they leave him a wad,
Either their rings, or green mantles,
Or else their maidenhead.",
      "Janet has kilted her green kirtle
A little aboon her knee,
And she has braided her yellow hair
A little aboon her bree,
And she's awa to Carterhaugh,
As fast as she can hie.",
      "When she came to Carterhaugh
Tam Lin was at the well,
And there she fand his steed standing,
But away was himsel.",
      "She had na pu'd a double rose,
A rose but only tway,
Till up then started young Tam Lin,
Says, Lady, thou's pu nae mae.",
      "'Why pu's thou the rose, Janet,
And why breaks thou the wand?
Or why comes thou to Carterhaugh
Without my command?'",
      "'Carterhaugh, it is my ain,
My daddy gave it me;
I'll come and gang by Carterhaugh,
And ask nae leave at thee.'",
      "Janet has kilted her green kirtle
A little aboon her knee,
And she has braided her yellow hair
A little aboon her bree,
And she is to her father's ha,
As fast as she can hie.",
      "Four and twenty ladies fair
Were playing at the ba,
And out then cam the fair Janet,
The flower amang them a'.",
      "Four and twenty ladies fair
Were playing at the chess,
And out then cam the fair Janet,
As green as onie glass.",
      "Out then spak an auld grey knight,
Lay o'er the castle wa,
And says, 'Alas, fair Janet, for thee
But we'll be blamed a'.'",
      "'Haud your tongue, ye auld fac'd knight,
Some ill death may ye die!
Father my bairn on whom I will,
I'll father nane on thee.'",
      "Out then spak her father dear,
And he spak meek and mild;
'And ever alas, sweet Janet,' he says,
'I think thou gaes wi child.'",
      "'And if I gae wi child, father,
Mysel maun bear the blame;
There's ne'er a laird about your ha
Shall get the bairn's name.",
      "'If my love were an earthly knight,
As he's an elfin grey,
I wad na gie my ain true-love
For nae lord that ye hae.",
      "'The steed that my true-love rides on
Is lighter than the wind;
Wi siller he is shod before,
Wi burning gowd behind.'",
      "Janet has kilted her green kirtle
A little aboon her knee,
And she has braided her yellow hair
A little aboon her bree,
And she's awa to Carterhaugh,
As fast as she can hie.",
      "When she cam to Carterhaugh,
Tam Lin was at the well,
And there she fand his steed standing,
But away was himsel.",
      "She had na pu'd a double rose,
A rose but only tway,
Till up then started young Tam Lin,
Says, 'Lady, thou's pu nae mae.'",
      "'Why pu's thou the rose, Janet,
Amang the groves sae green,
And a' to kill the bonie babe
That we gat us between?'",
      "'O tell me, tell me, Tam Lin,' she says,
'For's sake that died on tree,
If e'er ye was in holy chapel,
Or Christendom did see?'",
      "'Roxbrugh he was my grandfather,
Took me with him to bide,
And ance it fell upon a day
That wae did me betide.",
      "'And ance it fell upon a day,
A cauld day and a snell,
When we were frae the hunting come,
That frae my horse I fell;
The queen o Fairies she caught me
In yon green hill to dwell.",
      "'And pleasant is the fairy land,
But, an eerie tale to tell,
Ay at the end of seven years
We pay a tiend to hell;
I am sae fair and fu o flesh,
I'm feard it be mysel.",
      "'But the night is Halloween, lady,
The morn is Hallowday;
Then win me, win me, an ye will,
For weel I wat ye may.",
      "'Just at the mirk and midnight hour
The fairy folk will ride,
And they that wad their true-love win,
At Miles Cross they maun bide.'",
      "'O they begin at sky-setting,
Ride all the evening tide;
And she that will her true-love borrow,
At Miles Cross will him bide.'",
      "'But how shall I thee ken, Tam Lin,
Or how my true-love know,
Amang sae mony unco knights
The like I never saw?'",
      "'O first let pass the black, lady,
And syne let pass the brown,
But quickly run to the milk-white steed,
Pull ye his rider down.",
      "'For I'll ride on the milk-white steed,
And ay nearest the town;
Because I was an earthly knight
They gie me that renown.",
      "'My right hand will be gloved, lady,
My left hand will be bare,
Cockt up shall my bonnet be,
And kaimed down shall my hair,
And thae's the takens I gie thee,
Nae doubt I will be there.",
      "'They'll turn me in your arms, lady,
Into an esk and adder;
But hold me fast, and fear me not,
I am your bairn's father.",
      "'They'll turn me to a bear sae grim,
And then a lion bold;
But hold me fast, and fear me not,
As ye shall love your child.",
      "'Again they'll turn me in your arms
To a red het gaud of airn;
But hold me fast, and fear me not,
I'll do to you nae harm.",
      "'And last they'll turn me in your arms
Into the burning gleed;
Then throw me into well water,
O throw me in wi speed.",
      "'And then I'll be your ain true-love,
I'll turn a naked knight;
Then cover me wi your green mantle,
And cover me out o sight.'",
      "Gloomy, gloomy was the night,
And eerie was the way,
As fair Jenny in her green mantle
To Miles Cross she did go.",
      "About the middle o the night
She heard the bridles ring;
This lady was as glad at that
As any earthly thing.",
      "First she let the black pass by,
And syne she let the brown;
But quickly she ran to the milk-white steed,
And pulled the rider down.",
      "Sae weel she minded what he did say,
And young Tam Lin did win;
Syne covered him wi her green mantle,
As blythe's a bird in spring.",
      "Out then spak the queen o fairies,
Out of a bush o broom:
'Them that has gotten young Tam Lin
Has gotten a stately groom.'",
      "Out then spak the queen o fairies,
And an angry woman was she:
'Shame betide her ill-far'd face,
And an ill death may she die,
For she's taen awa the bonniest knight
In a' my companie.",
      "'But had I kend, Tam Lin,' she says,
'What now this night I see,
I wad hae taen out thy twa grey een,
And put in twa een o tree.'",
    ],
  },

  "child96": {
    title: "The Gay Goshawk",
    childNumber: "Child 96",
    version: "Version E (Herd's Manuscripts, 1776)",
    stanzas: [
      "'O well's me o my gay goshawk,
That he can speak and flee;
He'll carry a letter to my love,
Bring back another to me.'",
      "'O how can I your true-love ken,
Or how can I her know?
When frae her mouth I never heard couth,
Nor wi my eyes her saw.'",
      "'O weel sall ye my true-love ken,
Sae sune as ye her see,
For of a' the flowers of fair England,
The fairest flower is she.'",
      "'The red that's on my true-love's cheik
Is like blood-drops on the snaw;
The white that is on her breast bare
Like the down o the white sea-maw.'",
      "'And even at my love's bouer-door
There grows a flowering birk,
And ye maun sit and sing thereon,
As she gangs to the kirk.'",
      "'And four-and-twenty fair ladyes
Will to the mass repair,
But weel may ye my ladye ken,
The fairest ladye there.'",
      "Lord William has written a love-letter,
Put it under his pinion gray,
And he is awa to southern land,
As fast as wings can gae.",
      "And even at that ladye's bour
There grew a flowering birk,
And he sat down and sang thereon,
As she gaed to the kirk.",
      "And first he sang a low, low note,
And syne he sang a clear,
And aye the overword of the sang
Was, Your love can no win here.",
      "'Feast on, feast on, my maidens a',
The wine flows you amang,
While I gang to my shot-window,
And hear yon bonny bird's sang.'",
      "'Sing on, sing on, my bonny bird,
The sang ye sung yestreen;
For weel I ken by your sweet singing
Ye are frae my true-love sen.'",
      "And weel he kent that ladye feir
Amang her maidens free,
For the flower that springs in May morning
Was not sae sweet as she.",
      "O first he sang a merry sang,
And syne he sang a grave,
And syne he pecked his feathers gray,
To her the letter gave.",
      "'Have there a letter from Lord William;
He says he's sent ye three;
He canna wait your love langer,
But for your sake he'll die.'",
      "'Gae bid him bake his bridal bread,
And brew his bridal ale,
And I sall meet him at Mary's kirk,
Lang, lang ere it be stale.'",
      "The lady's gane to her chamber,
And a mournfu' woman was she,
As gin she had ta'en a sudden brash,
And were about to die.",
      "'A boon, a boon, my father dear,
A boon I beg of thee!'
'Ask not that haughty Scottish lord,
For him you ne'er shall see.'",
      "Down she fell as dead that night,
Beside her mother's knee;
Then out it spake an auld witch-wife,
By the fireside sat she.",
      "'Drap the hot lead on her cheek,
And drap it on her chin,
And drap it on her rose-red lips,
And she will speak again.'",
      "They drapt the het lead on her cheek,
So did they on her chin;
They drapt it on her red-rose lips,
But they breathed none again.",
      "Her brothers went to a room,
To make to her a bier;
The boards of it were cedar wood,
And the plates of gold so clear.",
      "The first Scots kirk that they came to,
They gart the bells be rung;
The next Scots kirk that they came to,
They gart the mass be sung.",
      "But when they came to St Mary's kirk,
There stood spearmen all on raw,
And up and started Lord William,
The chieftain among them a'.",
      "'Set down, set down the bier,' he said,
'Let me look her upon;'
But as soon as Lord William touched her hand,
Her colour began to come.",
      "'Give me a shave of your white bread,
A bottle of your wine;
For I have fasted for your sake
Fully these lang days nine.'",
    ],
  },

  "child98": {
    title: "Brown Adam",
    childNumber: "Child 98",
    version: "Version A (Jamieson-Brown Manuscript, c.1783)",
    stanzas: [
      "It was late, late in the evening,
Late, late in the afternoon,
There came a knight to Brown Adam's house,
And he was clad all in brown.",
      "O wha woud wish the win to blaw,
Or the green leaves fa therewith?
Or wha wad wish a leeler love
Than Brown Adam the Smith?",
      "His hammer's o the beaten gold,
His study's o the steel,
His fingers white are my delight,
He blows his bellows well.",
      "But they ha banished him Brown Adam
Frae father and frae mither,
An they ha banished him Brown Adam
Frae sister and frae brither.",
      "And they ha banished Brown Adam
Frae the flower o a' his kin;
An he's biggit a bower in the good green wood
Between his lady and him.",
      "O it fell once upon a day
Brown Adam he thought lang,
An he woud to the green wood gang,
To hunt some venison.",
      "He's ta'en his bow his arm o'er,
His brand intill his han,
And he is to the good green wood,
As fast as he could gang.",
      "O he's shot up, an he's shot down,
The bird upon the thorn,
And sent it hame to his lady,
And he'd be hame the morn.",
      "Whan he came till his lady's bower-door
He stood a little foreby,
And there he heard a fu' fa'se knight
Tempting his gay lady.",
      "O he's ta'en out a gay gold ring,
Had cost him mony a pound:
'O grant me love for love, lady,
And this shall be your own.'",
      "'I loo Brown Adam well,' she says,
'I wot sae does he me;
An I woud na gi Brown Adam's love
For nae fa'se knight I see.'",
      "Out has he ta'en a purse of gold,
Was a' fu to the string:
'Grant me but love for love, lady,
An a' this sal be thine.'",
      "'I loo Brown Adam well,' she says,
'An I ken sae does he me;
An I woudna be your light leman
For mair nor ye coud gie.'",
      "Then out has he drawn his lang, lang brand,
And he's flashed it in her een:
'Now grant me love for love, lady,
Or thro you this sal gang!'",
      "'O,' sighing said that gay lady,
'Brown Adam tarries lang!'
Then up and starts him Brown Adam,
Says, I am here, my dear.",
      "He's ta'en the fa'se knight by the collar,
And thrown him to the ground;
'Now, villain, take the wages
That you so well have found.'",
    ],
  },

  "child99": {
    title: "Johnie Scot",
    childNumber: "Child 99",
    version: "Version A (Jamieson-Brown Manuscript, c.1800)",
    stanzas: [
      "Johnie Scot's a-hunting gane,
To England's woods sae wild;
The fairest flower of all England
To Johnie proved big with child.",
      "Word is to the kitchen gane,
And word is to the hall,
And word is to the king himself
Among his nobles all.",
      "O up then rose him Johnie Scot,
An hour before the day,
And he is on to Fair Ellen's bower,
To hear what she did say.",
      "'If she be wi child,' her father says,
'As I trow weel she be,
Before the morn at ten o'clock
High hanged thou shalt be.'",
      "He's ta'en her by the milk-white hand,
And set her on a steed;
'Come awa, come awa, my ain true love,
Now is the time of need.'",
      "When Johnie came before the king,
He glanced like the fire;
His hair was like the threads o' gold,
His eyes like crystal clear.",
      "'No wonder, no wonder,' the king he said,
'My daughter loved thee;
For wert thou a woman, as thou art a man,
My bedfellow thou shouldst be.'",
      "'There is an Italian in my court
Will fight your men by three;
Bring out your trooper, Johnie,' said the king,
'For fain I would him see.'",
      "They fought it once, they fought it twice,
They fought it o'er again,
Till drops of blood, like drops of rain,
Were running to the plain.",
      "Then Johnie drew his nut-brown brand,
And struck it o'er the plain:
'Are there any more of your English men
That want for to be slain?'",
      "'A clerk, a clerk,' the king then cried,
'To write her tocher free;'
'A priest, a priest,' then Johnie cried,
'To marry my love and me.'",
      "'I'll have none of your gold,' he said,
'As little of your gear;
But I will have my own true love,
For sure I've bought her dear.'",
    ],
  },

  "child100": {
    title: "Willie o Winsbury",
    childNumber: "Child 100",
    version: "Version A (Campbell Manuscripts, c.1783)",
    stanzas: [
      "The king he hath been a prisoner,
A prisoner lang in Spain,
And Willie o the Winsbury
Has lain lang wi his daughter at hame.",
      "'What aileth thee, my daughter Janet,
Ye look so pale and wan?
Have ye had any sore sickness,
Or have ye been lying wi a man?'",
      "'Cast ye off your berry-brown gown,
Stand straight upon the stone,
That I may ken ye by your shape,
Whether ye be a maiden or none.'",
      "She's cast off her berry-brown gown,
And stood straight upon the stone;
Her apron was short, and her haunches were round,
Her face it was pale and wan.",
      "'Is it to a man o might, Janet?
Or is it to a man of fame?
Or is it to any of the rank robbers
That's lately come out o Spain?'",
      "'It is not to a man of might,' she said,
'Nor is it to a man of fame;
But it is to William of Winsburry;
I could lye nae langer my lane.'",
      "The king's called on his merry men all,
By thirty and by three:
'Go fetch me William of Winsbury,
For hanged he shall be.'",
      "But when he came the king before,
He was clad o the red silk;
His hair was like the threads o gold,
His eyes were like the milk.",
      "'No wonder, no wonder,' the king he said,
'My daughter loved thee;
For wert thou a woman, as thou art a man,
My bedfellow thou shouldst be.'",
      "'O will you marry my daughter dear,
By the faith of thy right hand?
And thou shalt reign, when I am dead,
The king over my whole land.'",
      "'I will marry your daughter dear,
With my heart, yea and my hand;
But it never shall be that Lord Winsbury
Shall rule o'er fair Scotland.'",
      "'She shall have for her dower the bonny bowers
And the bonny halls of Spain;
And thou shalt reign, when I am dead,
The king and all his train.'",
      "He's mounted her on a milk-white steed,
Himself on a dapple-grey,
And made her a lady of as much land
She could ride in a whole summer day.",
    ],
  },

  "child103": {
    title: "Rose the Red and White Lily",
    childNumber: "Child 103",
    version: "Version A (Jamieson-Brown Manuscript, 1783)",
    stanzas: [
      "O Rose the Red and White Lily,
Their mother dear was dead,
And their father's married an ill woman
Wished them little good.",
      "Yet she had twa as full fair sons
As ever broke man's bread,
And the tane of them loved White Lily,
And the tither loved Rose the Red.",
      "O they have built a bigly bower,
And strawn it over wi sand,
And there was mair mirth in the ladies' bower
Than in all their father's land.",
      "But out is spake their step-mother,
Who stood a little foreby:
'I hope to live and play the prank
Shall gar your loud sang lie.'",
      "She's called upon her eldest son:
'Come here, my son, to me;
It fears me sair, my eldest son,
That ye maun sail the sea.'",
      "'If it fear you sair, my mither dear,
Your bidding I maun dee;
But never war to Rose the Red
Than ye ha been to me.'",
      "She's called upon her youngest son:
'Come here, my son, to me;
It fears me sair, my youngest son,
That ye maun sail the sea.'",
      "'If it fear you sair, my mither dear,
Your bidding I maun dee;
But be never war to White Lily
Than ye ha been to me.'",
      "When Rose the Red and White Lily
Saw their twa loves were gane,
Then stopped have they their loud, loud sang,
And ta'en up the still mourning.",
      "Then out it spake her White Lily:
'My sister, we'll be gane;
Why should we stay in Barnsdale
To waste our youth in pain?'",
      "Then cutted have they their green clothing
A little below their knee,
And sae have they their yellow hair
A little aboon their bree.",
      "There have they changed their ain twa names,
Sae far frae ony town;
And the tane of them hight Sweet Willy,
And the tither of them Roge the Roun.",
      "They have gone to the good green wood
As fast as gang could they,
And when they came to Brown Robin's bower
They chapped at the door that day.",
      "She hadna been in fair France
A twelvemonth and a day,
Till there she heard the morning drum
Beat out at break of day.",
      "Word is gone to Brown Robin's hall,
And to Brown Robin's bower,
That one of his merry young men
Had born a bonny young son.",
      "Word has gone to the king's court,
And to the king himself:
'Now, by my fay,' the king could say,
'The like was never heard tell!'",
    ],
  },

  "child106": {
    title: "The Famous Flower of Serving-Men",
    childNumber: "Child 106",
    version: "Version A (Traditional, c.1656)",
    stanzas: [
      "You beauteous ladies, great and small,
I write unto you, one and all,
Whereby that you may understand
What I have suffered in this land.",
      "I was by birth a lady fair,
My father's chief and only heir,
But when my good old father died,
Then I was made a young knight's bride.",
      "And then my love built me a bower
Bedeck'd with many a fragrant flower,
A braver bower you ne'er did see
Than my true-love did build for me.",
      "But there came thieves late in the night,
They robb'd my bower and slew my knight,
And after that my knight was slain
I could not live at home for pain.",
      "She dressed herself in man's array,
And to the king's court took her way;
She rode till she came to the palace gate,
One morning when it was late.",
      "Then she went to the king and said:
'A boon, a boon, my liege, I pray;
May I now serve you in your court
For I have neither home nor stay?'",
      "'What is your name, my pretty youth?
And where were you bred, in sooth?'
'My name is Sweet William,' she replied,
'And in the north country I did reside.'",
      "The king look'd on her as she spake,
And thought her face full fair to make;
'I'll take thee in my court,' said he,
'To be a page and wait on me.'",
      "But when the night was growing on
And the minstrels' music ceased to tone,
The king would go to his nightly rest,
And Sweet William lay down fully dressed.",
      "This lasted for a year and more,
Until a lord of high degree
Began to woo the pretty page
With gifts of money, land, and fee.",
      "The king at last began to wonder
Why Sweet William was so fair and tender;
One night in silence at the door
He heard such sighing as before.",
      "'Come tell to me your grief,' he said,
'Sweet William, wert thou ever maid?'
She fell down on her bended knee:
'O pardon me, my liege,' cried she.",
      "She told him all: her bower so fair,
Her father's lands and all her care,
How thieves came late and slew her knight
And drove her from her home in night.",
      "The king looked on her as she told,
And thought her face worth more than gold;
'Thou shalt be wed,' the king then said,
'To the best lord throughout my land.'",
    ],
  },

  "child112": {
    title: "The Baffled Knight",
    childNumber: "Child 112",
    version: "Version A (Pills to Purge Melancholy, 1707)",
    stanzas: [
      "As I went out one May morning,
To view the fields and meadows gay,
I met a maid came out of the wood,
And she had lost her way.",
      "'Where are you going, pretty fair maid?
And whither do you roam?'
'I've lost my way in the greenwood,
And cannot find my home.'",
      "'Come, take my horse,' the young man said,
'And ride him at your ease;
I'll guide you through the forest paths
Wherever you may please.'",
      "She thanked him with a curtsey low,
And mounted up the steed;
The young man followed by her side
And helped her at her need.",
      "'Come go with me,' the young man said,
'To yonder shady bower;
The day is hot, the sun is bright,
'Tis meet we rest an hour.'",
      "'Now God forbid,' the maid replied,
'That such a thing should be;
For I have pledged my faith,' she said,
'To one who waits for me.'",
      "He took her hand, he took her arm,
He led her through the mead;
She slipt away and ran before
And left him with the steed.",
      "He called to her, he cried to her,
But she would not come back;
She ran as swift as any deer
And kept the woodland track.",
      "'Alas, alas,' the young man cried,
'She's cozened me today;
A maid so fair and so discreet
Hath borne my horse away.'",
      "She rode till she came to her father's gate,
And knocked and called within;
'Here's a horse for you, dear father,
Won by wit and not by sin.'",
    ],
  },

  "child113": {
    title: "The Great Silkie of Sule Skerry",
    childNumber: "Child 113",
    version: "Version A (Duncan Collection, Orkney, 1852)",
    stanzas: [
      "An earthly nourris sits and sings,
And aye she sings, 'Ba, lily wean!
Little ken I my bairn's father,
Far less the land that he steps in.'",
      "Then ane arose at her bed-foot,
A grumbly guest I'm sure was he:
'Here am I, thy bairn's father,
Although that I be not comely.'",
      "'I am a man upon the land,
And I am a silkie in the sea;
And when I'm far and far frae land,
My dwelling is in Sule Skerry.'",
      "'It was not well,' quoth the maiden fair,
'It was not well, indeed,' quoth she,
'That the Great Silkie of Sule Skerry
Should have come and fathered a bairn to me.'",
      "Now he has ta'en a purse of gold,
And he has put it upon her knee,
Saying, 'Give to me my little young son,
And take thee up thy nurse's fee.'",
      "'And it shall come to pass on a summer's day,
When the sun shines hot on every stone,
That I will take my little young son,
And teach him for to swim the foam.'",
      "'And thou shalt marry a proud gunner,
And a proud gunner I'm sure he'll be,
And the very first shot that ever he shoots
He'll shoot both my young son and me.'",
    ],
  },

  "child114": {
    title: "Johnie Cock",
    childNumber: "Child 114",
    version: "Version F (Scott's Minstrelsy, 1802)",
    stanzas: [
      "Johnie rose up in a May morning,
Called for water to wash his hands,
And he has called for his good gray hounds,
That lay bound in iron bands.",
      "'Gar loose to me the good gray dogs,
That are bound wi iron bands;
For I am going to the good green wood
To ding the dun deer down.'",
      "When Johnie's mother got word of that,
Her hands for dule she wrang:
'O Johnie, for my benison,
To the green wood do not gang!'",
      "'Enough ye have of the good wheat bread,
And enough of the blood-red wine;
And therefore for no venison
I pray ye, stir from hame.'",
      "But Johnie's busked up his good bent bow,
His arrows, one by one,
And he has gone to Durrisdeer
To hunt the dun deer down.",
      "As he came down by Merriemass,
And in by the benty line,
There has he espied a deer lying
Beneath a bush of ling.",
      "Johnie he shot, and the dun deer leapt,
And he wounded her on the side;
But between the water and the brae
His hounds they laid her pride.",
      "They've eaten so meikle of the good venison,
And they've drunken so muckle of the blood,
That they've fallen into as sound a sleep
As if that they were dead.",
      "'It's down, and it's down, and it's down, down,
And it's down among the scrogs,
And there ye'll espy twa bonnie boys lie
Asleep among their dogs.'",
      "They wakened Johnie out of his sleep,
And he's drawn to him his coat:
'My fingers five, save me alive,
And a stout heart fail me not!'",
      "'Stand stout, stand stout, my noble dogs,
Stand stout, and do not flee;
Stand fast, stand fast, my good gray hounds,
And we will make them dee.'",
      "He has killed six of the proud foresters,
And wounded the seventh sair;
He laid his leg out o'er his steed,
Says, I will kill no more.",
      "'O wae betide thee, silly old man,
An ill death may thee dee!
Upon thy head be all this blood,
For mine, I ween, is free.'",
    ],
  },

  "child119": {
    title: "Robin Hood and the Monk",
    childNumber: "Child 119",
    version: "Version A (Cambridge MS, c.1450)",
    stanzas: [
      "In summer, when the shaws be sheen,
And leaves be large and long,
It is full merry in fair forest
To hear the fowls' song.",
      "To see the deer draw to the dale,
And leave the hills high,
And shadow them in the leaves green
Under the greenwood tree.",
      "It befell on Whitsuntide,
Early in a May morning,
The sun up fair did shine,
And the birds merry did sing.",
      "'This is a merry morning,' said Little John,
'By Him that died on tree;
A more merry man than I am one
Lives not in Christentee.'",
      "'Pluck up thy heart, my dear master,'
Little John can say,
'And think it is a full fair time
In a morning of May.'",
      "'One thing grieves me,' said Robin,
'And does my heart much woe;
That I may not on a solemn day
To mass nor matins go.'",
      "'It is a fortnight and more,' said he,
'Since I my Saviour see;
To day will I to Nottingham,'
Said Robin, 'with the might of mild Mary.'",
      "Then spake Much, the miller's son,
'Ever more well thee betide;
Take twelve of thy wight yeomen,
Well weaponed, by thy side.'",
      "John early in a May morning,
Looking his shoes upon,
He took him to Nottingham,
To matins all alone.",
      "And Robin is to Nottingham gone,
Himself mourning alone,
And Little John he is left behind,
To the yeomen every one.",
      "But when he came to Nottingham,
I tell you as I mean,
Robin Hood and a great monk
There together were seen.",
      "Of all the Mary's in merry England,
Right well loved Robin the shrine;
But the monk hath spied out Robin Hood,
And told the sheriff anon.",
    ],
  },

  "child155": {
    title: "Sir Hugh, or, The Jew's Daughter",
    childNumber: "Child 155",
    version: "Version B (Motherwell's Manuscript, 1825)",
    stanzas: [
      "Four and twenty bonny boys
Were playing at the ba,
And by it came him sweet Sir Hugh,
And he played o'er them a'.",
      "He kicked the ba with his right foot,
And catched it wi his knee,
And throuch-and-thro the Jew's window
He gard the bonny ba flee.",
      "He's doen him to the Jew's castell,
And walked it round about;
And there he saw the Jew's daughter,
At the window looking out.",
      "'Throw down the ba, ye Jew's daughter,
Throw down the ba to me!'
'Never a bit,' says the Jew's daughter,
'Till up to me come ye.'",
      "'How will I come up? How can I come up?
How can I come to thee?
For as ye did to my auld father,
The same ye'll do to me.'",
      "She's gane till her father's garden,
And pu'd an apple red and green;
'Twas a' to wile him sweet Sir Hugh,
And to entice him in.",
      "She's led him in through ae dark door,
And sae has she through nine;
She's laid him on a dressing-table,
And stickit him like a swine.",
      "She's ta'en him to her cellar dark,
At the hour o midnight keen;
She's stabbed him with a little penknife,
And put him in the well sae deep.",
      "'Will ye gang to the well-water,
Or to the well-spring?'
'For I am weary, weary o my mother,
And I winna walk but a wee.'",
      "The lead is wondrous heavy, mother,
The well is wondrous deep;
A keen penknife sticks in my heart,
A word I daurna speak.",
    ],
  },

  "child159": {
    title: "Durham Field",
    childNumber: "Child 159",
    version: "Version A (Percy Folio MS, c.1650)",
    stanzas: [
      "The sixth of August the muster was,
Early in a morning clear;
Our English archers their bows did bend,
And many a black blade did appear.",
      "The king of Scots in armour bright
Did march his men in ray;
Our English king kept him in sight,
Resolved to win the day.",
      "The Scots they stood like walls of stone,
As thick as they might be;
But our brave English archers all
Let fly right lustily.",
      "Lord Percy led the English vanguard,
A noble knight and keen;
The Scots were driven back apace
On every side between.",
      "There was many a man of England
That morning fell full low;
But there was many a man of Scotland
Was laid full cold also.",
      "But at the last, when all was done,
The English won the field;
And many a Scots lord on that day
Was forced with them to yield.",
    ],
  },

  "child161": {
    title: "The Battle of Otterburn",
    childNumber: "Child 161",
    version: "Version A/B/C composite (Cotton MS / Herd / Child)",
    stanzas: [
      "It fell about the Lammas tide,
When the muir-men win their hay,
The doughty Douglas bound him to ride
Into England, to drive a prey.",
      "He chose the Gordons and the Graemes,
With them the Lindsays light and gay;
But the Jardines wald not with him ride,
And they rue it to this day.",
      "And he has burned the dales of Tyne,
And part of Bambroughshire,
And three good towers on Reidswire fells,
He left them all on fire.",
      "And he marched up to Newcastle,
And rode it round about;
'O wha's the lord of this castle?
Or wha's the lady o't?'",
      "But up spake proud Lord Percy then,
And O but he spake hie!
'I am the lord of this castle,
My wife's the lady gay.'",
      "'If thou'rt the lord of this castle,
Sae weel it pleases me!
For, ere I cross the Border fells,
The tane of us shall die.'",
      "He took a long spear in his hand,
Shod with the metal free,
And for to meet the Douglas there
He rode right furiously.",
      "But O how pale his lady looked
Frae off the castle wa,
When down before the Scottish spear
She saw proud Percy fa!",
      "'Had we twa been upon the green,
And never an eye to see,
I wad hae had you, flesh and fell;
But your sword sall gae wi me.'",
      "'But gae ye up to Otterbourne,
And wait there dayis three;
And, if I come not ere three dayis end,
A fause knight ca' ye me.'",
      "The Douglas turned him round and said,
'What maun needs be maun be.
Gae back to Northumberland, and tell
Them what you've seen wi me.'",
      "They lighted high on Otterburn,
Upon the bent sae broun;
They lighted high on Otterburn,
And threw their pallions doun.",
      "And he that had a bonny boy,
Sent out his horse to grass;
And he that had not a bonny boy,
His ain servant he was.",
      "But up then spake a little page,
Before the peep of dawn:
'O waken ye, waken ye, my good lord,
For Percy's hard at hand.'",
      "'Ye lie, ye lie, ye liar loud!
Sae loud I hear ye lie!
For Percy had not men yestreen
To dight my men and me.'",
      "'But I have dreamed a dreary dream,
Beyond the Isle of Sky;
I saw a dead man win a fight,
And I think that man was I.'",
      "He belted on his guid braid sword,
And to the field he ran,
But he forgot the helmet good
That should have kept his brain.",
      "This deed was done at Otterburn,
About the breaking of the day;
Earl Douglas was buried at the bracken-bush,
And Percy led captive away.",
    ],
  },

  "child167": {
    title: "Sir Andrew Barton",
    childNumber: "Child 167",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "As it befell in midsummer-time,
When birds sing sweetly on every tree,
Our king commanded Lord Howard the Admiral
To go take Sir Andrew Barton on the sea.",
      "When Flora, with her fragrant flowers,
Bedecked the earth so trim and gay,
And Neptune, with his dainty showers,
Came to present the month of May.",
      "Our king he caused a royal fleet
To be rigged out with all good speed,
Of ships of war both great and small,
And brave Lord Howard was their head.",
      "Lord Howard then, of courage bold,
Went to the sea with pleasant cheer,
Not curbed with winter's piercing cold,
Though it was the stormy time of the year.",
      "With pikes, and guns, and bowmen bold,
This noble Howard is gone to the sea,
On the day before Midsummer's Eve,
And out at Thames mouth sailed they.",
      "They had not sailed days two or three
Before they met with a merchant's ship;
Then they hailed her, and asked her wither she came,
And whence she did her voyage keep.",
      "'We are merchants from the northeast come,
We came from Bordeaux upon the bay;
We have met with Sir Andrew Barton today,
Who robbed us of our goods and spoil.'",
      "'We durst not fight for loss of life,
Nor could we stand against his power;
His ship is armed so passing well,
That none can match him in an hour.'",
      "Then said Lord Howard, 'By God's grace,
I'll make him rue this deed today;
For I will never return to the king
Till I have brought Sir Andrew to bay.'",
      "The admiral brought his ship about,
And towards Sir Andrew did make way;
His ship was clad in iron plates,
To keep the cannon shot at bay.",
    ],
  },

  "child173": {
    title: "Mary Hamilton",
    childNumber: "Child 173",
    version: "Version A (Motherwell's Manuscript, c.1825)",
    stanzas: [
      "Last night Queen Mary had four Maries,
This night she'll have but three;
There was Mary Seaton and Mary Beaton,
And Mary Carmichael, and me.",
      "Last night I washed Queen Mary's feet,
And bore her to her bed;
This day she's given me my reward,
This gallows-tree to tread.",
      "O often have I dressed my queen,
And put gold in her hair;
The gallows-tree is my reward
For a' my service there.",
      "They've tied a handkerchief round my eyes,
That I might not see to dee;
And they've put a robe of white on me,
To hang on the gallows-tree.",
      "'O little did my mither think,
When first she cradled me,
That I should die sae far frae hame,
And hang on a gallows-tree.'",
      "'O happy, happy is the maid
That's born of beauty free;
It was my dimpled cheeks and eyes
That's been the deil o me.'",
      "'Cast off, cast off my gown of silk,
And let it fa below;
For my ain sake and fair Mary's sake,
Gae wrap it round thee so.'",
      "'O what care I for my gown of silk,
Or what care I for my fee?
What I do mourn and ay must mourn
Is the babe that's torn frae me.'",
      "'O tie a napkin round my face,
For that I dare not see,
To see myself hung in the sun,
For a' the world to see.'",
      "Yestreen the queen had four Maries,
The night she'll hae but three;
There was Mary Seaton and Mary Beaton,
And Mary Carmichael, and me.",
    ],
  },

  "child193": {
    title: "The Death of Parcy Reed",
    childNumber: "Child 193",
    version: "Version A (Scott's Minstrelsy, 1803)",
    stanzas: [
      "The Liddesdale Crosiers have ridden a race,
And they had far better stayed at hame,
For they have lost a gallant gay,
Young Whinton Crosier it was his name.",
      "For Parcy Reed has him ta'en,
And he's delivered him to the law;
But auld Crosier has made answer
That he'll gar the house of the Troughend fa.",
      "So as it happened on a day
That Parcy Reed is a-hunting gane,
And the three false Halls of Girsonsfield
They all along with him are gane.",
      "They hunted high, they hunted low,
They hunted up, they hunted down,
Until the day was past the prime,
And it grew late in the afternoon.",
      "They hunted high in Batinghope,
Till weariness on Parcy seized;
At the Batinghope he's fallen asleep,
Amid the heather green he's eased.",
      "'O some they stole his powder-horn,
And some put water in his lang gun:
O waken, waken, Parcy Reed!
For we do doubt thou sleeps too sound.'",
      "'O waken, O waken, Parcy Reed!
For we do doubt thou sleeps too long;
For yonder's the five Crosiers coming,
They're coming by the Hingin Stane.'",
      "'If they be five men, we are four,
If ye will all stand true to me;
Now every one of you may take one,
And two of them ye may leave to me.'",
      "'We will not stay, nor we dare not stay,
O Parcy Reed, to fight with thee;
For thou wilt find, O Parcy Reed,
That they will slay both us and thee.'",
      "Now foul fa' ye, ye traitors all,
That ever ye should in England won!
You have left me in a fair field standing
And in my hand an uncharged gun.",
      "'O fare thee well, my wedded wife!
O fare you well, my children five!
And fare thee well, my daughter Jane,
That I love best that's born alive!'",
    ],
  },

  "child200": {
    title: "The Gypsy Laddie",
    childNumber: "Child 200",
    version: "Version A / Version F composite",
    stanzas: [
      "The gypsies came to our good lord's gate,
And O but they sang bonnie!
They sang sae sweet and sae complete
That down came the fair lady.",
      "She came tripping down the stair,
And all her maids before her;
As soon as they saw her well-favoured face,
They cast their glamour o'er her.",
      "She gave to them the good wheat bread,
And they gave her the ginger;
But she gave them a far better thing,
The gold ring from her finger.",
      "Yestreen I lay in a well-made bed,
And my good lord beside me;
This night I'll lie in a tenant's barn,
Whatever shall betide me.",
      "'Come to your bed,' says Johny Faa,
'Oh come to your bed, my deary;
For I vow and I swear, by the hilt of my sword,
That your lord shall no more come near ye.'",
      "She's taken off her silk mantle,
And she's brought to her a plaidie,
For she would travel the world o'er
Along with the gypsy laddie.",
      "They wandered high, they wandered low,
They wandered late and early,
Until they came to that wan water,
And by this time she was weary.",
      "Now when our lord came home at even,
He speired for his fair lady;
The ane she cried, the tither replied,
She's awa' wi' the gypsy laddie.",
      "'Go saddle to me the black, black steed,
Go saddle and make him ready;
Before that I either eat or sleep,
I'll go seek my fair lady.'",
      "He rode east and he rode west,
He rode through field and fallow,
Until he came to the green green wood,
Where the gypsies camp did follow.",
      "'O come thee home, my own true love,
O come thee home, my deary!
For I'll pledge my honour and my word
That your lord shall aye be near thee.'",
    ],
  },

  "child204": {
    title: "Jamie Douglas",
    childNumber: "Child 204",
    version: "Version G / Version H composite",
    stanzas: [
      "O waly, waly up the bank!
And waly, waly down the brae!
And waly, waly by yon burn-side,
Where me and my love were wont to gae!",
      "I leant my back unto an aik,
I thought it was a trusty tree;
But first it bowed and syne it brak,
Sae my true-love did lichtly me.",
      "O waly, waly, but love be bonny
A little time while it is new!
But when 'tis auld it waxes cauld,
And fades awa' like morning dew.",
      "O wherefore should I busk my head?
Or wherefore should I kame my hair?
For my true-love has me forsook,
And says he'll never love me mair.",
      "Now Arthur's Seat shall be my bed,
The sheets shall ne'er be pressed by me;
Saint Anton's well shall be my drink,
Since my true-love has forsaken me.",
      "In the morning when I arose,
My bonnie palace for to see,
I came unto my lord's room-door,
But he would not speak one word to me.",
      "Martinmas wind, when wilt thou blaw
And shake the green leaves off the tree?
O gentle death, when wilt thou come?
For of my life I am weary.",
      "'Tis not the frost that freezes fell,
Nor blawing snaw's inclemency;
'Tis not sic cauld that makes me cry,
But my love's heart grown cauld to me.",
      "When we came in by Glasgow town,
We were a comely sight to see;
My love was clad in the black velvet,
And I mysel' in cramasie.",
      "But had I wist, before I kissed,
That love had been sae ill to win,
I'd locked my heart in a case of gowd
And pinned it wi' a siller pin.",
    ],
  },

  "child214": {
    title: "The Braes o Yarrow",
    childNumber: "Child 214",
    version: "Version F (Herd's Manuscripts, c.1776)",
    stanzas: [
      "Late in the evening, drinking the wine,
Or early in the morning,
They set a combat them between,
To fight it out in the dawning.",
      "'I dreamed a dreary dream last night,
God keep us all from sorrow!
I dreamed I pulled the heather green
Upon the braes of Yarrow.'",
      "'O gentle wind that bloweth south
From where my love repaireth,
Convey a kiss from his dear mouth
And tell me how he fareth!'",
      "She sought him east, she sought him west,
She sought him braid and narrow;
Syne in the cleaving of a craig,
She found him drowned in Yarrow.",
      "She took him up in her arms,
With bitter grief and sorrow,
And she carried him to yonder bank,
Upon the braes of Yarrow.",
      "'How can I live,' the lady cried,
'How can I live in sorrow!
For I have lost the bonniest lad
That e'er rode on the Yarrow.'",
      "Her hair it was three quarters long,
It hung down by her middle;
She tied it round his white white neck,
And carried him home frae Yarrow.",
    ],
  },

  "child243": {
    title: "The Daemon Lover",
    childNumber: "Child 243",
    version: "Version C (Motherwell's Manuscript, 1825)",
    stanzas: [
      "There came a ghost to Margret's door,
With many a grievous groan,
Crying, O Margaret, are you within,
Or are you gone from home?",
      "'I am your own true-love,' he said,
'The man you pledged to me;
But seven years have come and gone
Since last our lips did meet.'",
      "'I am married now,' said Margaret,
'I have a husband dear;
And two small babes sit by my knee,
They call me mother here.'",
      "'Then farewell, farewell, Margaret dear,
Farewell for evermore;
You were the first I pledged my troth,
The last I shall adore.'",
      "She's ta'en her babe upon her knee,
And kissed it tenderly;
'My little babe, be still and sleep,
For troubled now am I.'",
      "She laid the baby in its cradle,
And dressed herself with care;
She's gone with the spirit through the night
Beyond all earthly prayer.",
      "When they had sailed a league, a league,
A league but barely three,
She espied the tops of the mountains high
And she wept right bitterly.",
      "When they had sailed a league, a league,
A league but barely nine,
She heard a sound like rushing wind
And she saw a sunken shrine.",
      "'O what hills are yon, yon pleasant hills,
The sun shines sweetly on?'
'O yon are the hills of heaven,' he said,
'Where you will never won.'",
      "'O what a mountain dark and drear,
Where never sun shines bright?'
'O yon is the mountain of hell,' he cried,
'Where you and I this night shall bide.'",
      "He sank the ship in a surging sea,
To the bottom of the main;
And down with him went Margaret,
Never to rise again.",
      "O sleep ye, wake ye, my husband?
I wish ye wake in time!
I would not for ten thousand pounds
This night ye knew my mind.",
    ],
  },

  "child248": {
    title: "The Grey Cock",
    childNumber: "Child 248",
    version: "Version A (Buchan's Ballads, 1828)",
    stanzas: [
      "'Saw ye my father? or saw ye my mother?
Or saw ye my true-love John?'
'I saw not your father, I saw not your mother,
But I saw your true-love John.'",
      "'It's now ten at night, and the stars give no light,
And the bells they ring ding, dang;
He's met with some delay that caused him to stay,
But he will be here ere lang.'",
      "The surly auld carl did naething but snarl,
And Johnie made haste to come in;
He chapped at the door, and he tirled the pin,
And sae low he began to win.",
      "'O stay, my dear Johnie, O stay but a while,
For there is neither moon nor light;
But the cock will soon crow, and the day it will daw,
And ye can go home by light.'",
      "'O an the cock craw at the dawning of day,
O maiden, I must be away;
My white neck shall be like the bonny beaten gold,
And my wings like the silver grey.'",
      "Flee, flee up, my bonny grey cock,
And crow when it is day;
Your neck shall be like the bonny beaten gold,
And your wings of the silver grey.",
      "The cock crew east, the cock crew west,
The cock crew north and sooth;
She only heard the one short crow
Ere Johnie fled to the wood.",
    ],
  },

  "child250": {
    title: "Henry Martyn",
    childNumber: "Child 250",
    version: "Version A (Traditional, c.1800)",
    stanzas: [
      "In merry Scotland, in merry Scotland
There lived brothers three;
They all did cast lots which of them should go
A-robbing upon the salt sea.",
      "The lot it fell upon Henry Martyn,
The youngest of the three;
That he should go rob on the salt sea, salt sea,
To maintain his brothers and he.",
      "He had not been sailing but a short winter's night,
And part of a short winter's day,
When he espied a lofty ship,
Come sailing all along that way.",
      "'Hello, hello,' cried Henry Martyn,
'What makes you sail so nigh?'
'I'm a rich merchant ship bound for London town;
Will you please let me pass by?'",
      "'O no, O no,' cried Henry Martyn,
'That thing it cannot be;
Your ship and your cargo and your good merchantmen
This night shall come along with me.'",
      "With broadside and broadside and at it they went
For fully two hours or three;
Till Henry Martyn gave to her the death-shot,
And down to the bottom sank she.",
      "Bad news, bad news to old England came,
Bad news to fair London town:
There's been a rich vessel lost all on the sea,
And all of her merry men drowned.",
    ],
  },

  "child252": {
    title: "The Kitchie Boy",
    childNumber: "Child 252",
    version: "Version C (Buchan's Ballads of the North of Scotland, 1828)",
    stanzas: [
      "There lived a lady in the north,
O mickle birth and fame;
She's fallen in love with her kitchen-boy,
The greater was her shame.",
      "Her father called her to his bower:
'Daughter, what ails thee now?
You look so pale and wan today,
I fear you've made a vow.'",
      "She called him in one evening late,
And many words did say;
He kissed her lips and promised her
He'd sail no more away.",
      "He's ta'en her rings from off her hand,
Her garters from her knee,
And he has sailed away from her
Far out upon the sea.",
      "A lord came courting to her door
With jewels rich and gay;
'Now will you marry me,' he said,
'And name the wedding day?'",
      "'There is a man far over the sea
That I do love the best;
And until he comes home to me
I cannot be at rest.'",
      "But oh, the wind blew sore that night,
And the sea ran wondrous deep;
And at the hour of midnight keen
The gallant ship went reep.",
      "He came before her father's gate,
A sailor bold was he;
He showed the lady's rings he had
As tokens from the sea.",
      "She looked in his bonny face,
And through her tears did smile:
'Awa, awa, thou false, false love,
How could you me beguile?'",
      "The day it is gone, and the night's come on,
And the King's court it is begun;
All the ladies in the court are going to bed,
And it's time that I were gone.",
      "He's drawn the mask from off his face,
And smiled right courteously:
'A priest! a priest!' the old man cried,
'Come wed this maid and me.'",
    ],
  },

  "child255": {
    title: "Willie's Lyke-Wake",
    childNumber: "Child 255",
    version: "Version B (Herd's Manuscripts, c.1776)",
    stanzas: [
      "'O Willie my son, what makes thee sae sad?'
'I lie sairly sick for the love of a maid.'",
      "'O Willie my son, I'll learn thee a wile:
How this fair maid thou mayst beguile.'",
      "'Thou'lt gie the principal bellman a groat,
And bid him cry thy dead lyke-wake.'",
      "So he gae the principal bellman a groat,
He bade him cry his dead lyke-wake.",
      "The maiden she stood till she heard it all,
And down from her cheeks the tears did fall.",
      "She's gone to her bower as fast as she can:
'I'll go to yon lyke-wake but only one man.'",
      "As she walked in by her own bower stair,
She saw seven brothers standing there.",
      "As she walked in through ae dark door,
She saw the corpse laid on the floor.",
      "'O I'll kiss his cheek and I'll clap his hand,
And I'll have but one look ere I gang.'
She lifted up the green covering,
And kissed his lips and stroked his hair.",
      "About the dead hour of the night
She heard the bridles ring;
And Janet was as glad of that
As any earthly thing.",
      "She's kissed his cheek and she's clapped his hand,
And three times has she him kissed;
Then he looked up into her face,
With the blythe blink in his eyes.",
      "'O bonny maid, since we are met,
We'll never more be separate;
And I will wed thee now this night,
Ere ever thou canst think of flight.'",
    ],
  },

  "child265": {
    title: "The Knight's Ghost",
    childNumber: "Child 265",
    version: "Version A (Buchan's Ballads of the North of Scotland, 1828)",
    stanzas: [
      "She looked over her castle wall,
To see what she might see;
She spied her own dear lord
Come riding over the lee,
At the dead hour of the night.",
      "'How came you here, my own dear lord,
At this untimely hour?
For I have mourned for you seven years,
And you've been cold in earth so long.'",
      "'I am not come from any grave,
Nor yet from any sea;
But I am come from heaven above,
To take my leave of thee.'",
      "'O lay not my head on cold church floor,
Nor yet in churchyard ground;
But lay me in your own bower window,
Where music it does sound.'",
      "She called up her merry men all,
By one, by two, by three;
She bade them make a bier of birch,
To carry her love from the sea.",
      "They laid him in her bower window,
Where she was wont to be;
And there she wept and there she mourned
For her true love eternally.",
    ],
  },

  "child272": {
    title: "The Suffolk Miracle",
    childNumber: "Child 272",
    version: "Version A (Broadside, c.1700)",
    stanzas: [
      "A young man riding in the night,
His journey for to take,
He rode until the morning light,
For his true love's sake.",
      "There was a wealthy farmer's son
Who courted a farmer's daughter;
But her father he would not agree,
For he was of a lower order.",
      "He sent his daughter far away
To friends she had in London;
But for the love she bore this youth,
She wished she'd never gone there.",
      "When forty weeks were past and gone,
This maid began to wonder;
And thinking on her absent love
She sighed and mourned thereunder.",
      "One night when she sat all alone,
A knock came to her chamber;
'Come down, come down, my dear,' he said,
'Let nothing make you wander.'",
      "She dressed herself and came down stairs,
With many a silent gesture;
He placed her up behind himself
And rode on through the darkness.",
      "He neither sang, nor yet he spoke,
No word the live-long journey;
But when they came to her father's gate,
He bade her there be easy.",
      "A young man riding in the night,
His journey for to take,
He rode until the morning light,
For his true love's sake.",
    ],
  },

  "child281": {
    title: "The Keach i the Creel",
    childNumber: "Child 281",
    version: "Version A (Herd's Manuscripts, c.1776)",
    stanzas: [
      "A fair maid sat in her bower door,
Wringing her lily hands;
And by there came a sprightly youth,
Fast tripping o'er the strands.",
      "'Where gang ye, young John,' she said,
'Sae early in the day?
It gars me think, by your fast trip,
Ye're gaun some road astray.'",
      "'I gang to see a lovely maid,
As fair as fair can be;
And if ye will not hinder me,
I'll soon come back tae thee.'",
      "'Gin ye be for that lovely maid,
I'll point you out the way;
Ye'll find her in the garden green,
And there she'll bid you stay.'",
      "He's ta'en the creel upon his back,
And to the garden green;
The maiden met him at the gate
And bade him enter in.",
      "She's set him in a creel of straw
And drawn it up full high;
Her father heard a noise above
And came the stair to spy.",
      "But the night was dark, and the way was sair,
And the morn came up on them unaware;
He called out, 'What strange creature's there?'
But she had slipped inside with care.",
      "He's let the creel down to the ground
And laughed as he did fall;
And the maiden blushed with rosy cheek
Behind her bower wall.",
    ],
  },

  "child299": {
    title: "Trooper and Maid",
    childNumber: "Child 299",
    version: "Version A (Traditional)",
    stanzas: [
      "When the trumpet sounds to horse and away,
Early in the morning,
Leave thy bed and leave thy beau,
Early in the morning.",
      "The trooper laced his cloak so gay,
Early in the morning,
And kissed his maid ere riding away,
Early in the morning.",
      "'O soldier, soldier, will you marry me?
Early in the morning;
With your musket, fife, and drum?'
Early in the morning.",
      "'O no, sweet maid, I cannot marry thee,
Early in the morning;
For I have a wife in my own countree,
Early in the morning.'",
      "'O what will you give me for my maidenhead
Early in the morning?
That I gave to you in my bower-bed,
Early in the morning?'",
      "'I'll give you a ring and a silver pin,
Early in the morning,
And a fine new dress in the spring,
Early in the morning.'",
      "The trumpet sounded and away he rode,
Early in the morning,
And left the maid by the grassy road,
Early in the morning.",
    ],
  },

  "child305": {
    title: "The Broom of Cowdenknows",
    childNumber: "Child 305",
    version: "Version A (Traditional Scottish)",
    stanzas: [
      "There was a troop of merry gentlemen
Were riding tween twa knowes;
They swore they smelled a bonny lass,
As they came by the broom of Cowdenknows.
It's up then spake the foremost man,
Said, I see her standing there;
A bonny lass in a green mantle,
Combing down her yellow hair,
Early on a May morning.",
      "'O maid, O maid, come tell to me
What land you belong unto?'
'I'm a poor maid in good green wood,
And herding of the ewes, sir.'",
      "The knight's descended from his horse
And tied it to a tree;
He's ta'en the maiden by the hand
And sat down on the lea.",
      "'Now will you go with me,' he said,
'This merry month of May?
I'll wed you and I'll bed you,
And your fortune shall be gay.'",
      "'O no, kind sir, O no,' she said,
'I dare not venture so;
For my father and my mother dear
Would count me far too low.'",
      "'If I should bring my father's horse
And set you upon his back,
Would you go with me then?' he said,
'And never more come back?'",
      "She's ta'en his hand between her own
And sworn upon the lea;
Said, If you'll prove true to your word,
I'll prove as true to thee.",
    ],
  },

  "child47": {
    title: "Proud Lady Margaret",
    childNumber: "Child 47",
    version: "Version A / Version B composite",
    stanzas: [
      "'Twas on a night, an evening bright,
When the dew began to fall,
Lady Margaret was walking up and down,
Looking o'er her castle wall.",
      "She looked east and she looked west,
To see what she could spy,
When a gallant knight came in her sight,
And to the gate drew nigh.",
      "'You seem to be no gentleman,
You wear your boots so wide;
But you seem to be some cunning hunter,
You wear the horn so syde.'",
      "'I am no cunning hunter,' he said,
'Nor e'er intend to be;
But I am come to this castle
To seek the love of thee.
And if you do not grant me love,
This night for thee I'll die.'",
      "'If you should die for me, sir knight,
There's few for you will mean;
For many a better has died for me,
Whose graves are growing green.'",
      "'But ye maun read my riddle,' she said,
'And answer my questions three;
And but ye read them right,' she said,
'Gae stretch ye out and die.'",
      "'Now what is the flower, the ae first flower,
Springs either on moor or dale?
And what is the bird, the bonnie bonnie bird,
Sings on the evening gale?'",
      "'The primrose is the ae first flower
Springs either on moor or dale,
And the thristle-cock is the bonniest bird
Sings on the evening gale.'",
      "'O hey, how many small pennies
Make thrice three thousand pound?
Or hey, how many salt fishes
Swim the salt sea round?'",
      "'I think you maun be my match,' she said,
'My match and something mair;
You are the first e'er got the grant
Of love frae my father's heir.'",
      "'My father was lord of nine castles,
My mother lady of three;
My father was lord of nine castles,
And there's nane to heir but me.'",
      "'And round about a' thae castles
You may baith plow and saw,
And on the fifteenth day of May
The meadows they will maw.'",
      "'O hald your tongue, Lady Margaret,' he said,
'For loud I hear you lie;
Your father was lord of nine castles,
Your mother was lady of three.'",
      "'And round about a' thae castles
You may baith plow and saw,
But on the fifteenth day of May
The meadows will not maw.'",
      "'I am your brother Willie,' he said,
'I trow ye ken na me;
I came to humble your haughty heart,
Has gard sae many die.'",
      "'If ye be my brother Willie,' she said,
'As I trow weel ye be,
This night I'll neither eat nor drink,
But gae alang wi thee.'",
      "'O hold your tongue, Lady Margaret,' he said,
'Again I hear you lie;
For ye've unwashen hands and ye've unwashen feet,
To gae to clay wi me.'",
      "'For the wee worms are my bedfellows,
And cauld clay is my sheets,
And when the stormy winds do blow,
My body lies and sleeps.'",
      "There was a knight, in a summer's night,
Appeared in a lady's hall,
As she was walking up and down,
Looking o'er her castle wall.",
    ],
  },

  "child50": {
    title: "The Bonny Hind",
    childNumber: "Child 50",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "O May she comes, and May she goes,
Down by yon garden green,
And there she spied a gallant squire
As squire had ever been.",
      "And May she comes, and May she goes,
Down by yon hollin tree,
And there she spied a brisk young squire,
And a brisk young squire was he.",
      "'Give me your green manteel, fair maid,
Give me your maidenhead;
Gif ye winna gie me your green manteel,
Gi me your maidenhead.'",
      "He has taen her by the milk-white hand,
And softly laid her down,
And when he's lifted her up again
Given her a silver kaim.",
      "'Perhaps there may be bairns, kind sir,
Perhaps there may be nane;
But if you be a courtier,
You'll tell to me your name.'",
      "'I am nae courtier, fair maid,
But new come frae the sea;
I am nae courtier, fair maid,
But when I courteth thee.'",
      "'They call me Jack when I'm abroad,
Sometimes they call me John;
But when I'm in my father's bower
Jock Randal is my name.'",
      "'Ye lee, ye lee, ye bonny lad,
Sae loud as I hear ye lee!
For I'm Lord Randal's ae daughter,
He has nae mair nor me.'",
      "'Ye lee, ye lee, ye bonny may,
Sae loud as I hear ye lee!
For I'm Lord Randal's ae yae son,
Just now come o'er the sea.'",
      "She's putten her hand down by her spare,
And out she's taen a knife,
And she has put it in her heart's blood,
And ta'en away her life.",
      "And he's taen up his bonny sister,
With the big tear in his een,
And he has buried his bonny sister
Amang the hollins green.",
      "And syne he's hied him o'er the dale,
His father dear to see:
'Sing O and O for my bonny hind,
Beneath yon hollin tree!'",
      "'What needs you care for your bonny hyn?
For it you needna care;
There's aught score hyns in yonder park,
And five score hyns to spare.'",
      "'Four score of them are siller-shod,
Of thae ye may get three;
But O and O for my bonny hyn,
Beneath yon hollin tree!'",
      "'I care na for your hyns, my lord,
I care na for your fee;
But O and O for my bonny hyn,
Beneath the hollin tree!'",
      "'O were ye at your sister's bower,
Your sister fair to see,
Ye'll think na mair o your bonny hyn
Beneath the hollin tree.'",
    ],
  },

  "child58": {
    title: "Sir Patrick Spens",
    childNumber: "Child 58",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "The king sits in Dumferling town,
Drinking the blood-red wine:
'O where will I get a guid sailor,
To sail this ship of mine?'",
      "Up and spak an eldern knight,
Sat at the king's right knee:
'Sir Patrick Spens is the best sailor
That sails upon the sea.'",
      "The king has written a braid letter,
And signed it wi his hand,
And sent it to Sir Patrick Spens,
Was walking on the sand.",
      "The first line that Sir Patrick read,
A loud laugh laughed he;
The next line that Sir Patrick read,
The tear blinded his ee.",
      "'O wha is this has done this deed,
This ill deed done to me,
To send me out this time o the year,
To sail upon the sea!'",
      "'Make haste, make haste, my merry men all,
Our guid ship sails the morn:'
'O say na sae, my master dear,
For I fear a deadly storm.'",
      "'Late late yestreen I saw the new moon,
Wi the auld moon in her arm,
And I fear, I fear, my dear master,
That we will come to harm.'",
      "O our Scots nobles were right loath
To wet their cork-heeled shoes;
But long ere all the play was played,
Their hats they swam aboon.",
      "O long, long may their ladies sit,
Wi their fans into their hand,
Or e'er they see Sir Patrick Spens
Come sailing to the land.",
      "O long, long may the ladies stand,
Wi their gold combs in their hair,
Waiting for their ain dear lords,
For they'll see them na mair.",
      "Half o'er, half o'er to Aberdour,
It's fifty fathoms deep,
And there lies guid Sir Patrick Spens,
Wi the Scots lords at his feet.",
    ],
  },

  "child63": {
    title: "Child Waters",
    childNumber: "Child 63",
    version: "Version B (Jamieson-Brown Manuscript, c.1783)",
    stanzas: [
      "I warn ye all, ye gay ladies,
That wear scarlet and brown,
That ye dinna leave your father's house
To follow young men frae the town.",
      "O here am I, a lady gay,
That wears scarlet and brown,
Yet I will leave my father's house
And follow Lord John frae the town.",
      "Lord John stood in his stable-door,
Said he was bound to ride;
Burd Ellen stood in her bower-door,
Said she'd run by his side.",
      "'But ye maun rin through the wood, Ellen,
And I will ride my steed;
Ye maun rin through the water clear,
Though ye should never speed.'",
      "He rode, she ran, the livelong day,
Until they cam to Clyde;
She waded to the middle o the ford,
And he sat on the other side.",
      "O four and twenty ladies fair
Were playing at the ba',
And out then came Lord John's mother,
The flower amang them a'.",
      "'How cam ye by the bonny boy,
That rides by your side?'
'He is my brother William, mother,
Come riding frae the tide.'",
      "Lord John's mother in her bower
Was sitting all alone;
When in the silence of the night
She heard fair Ellen's moan.",
      "She went unto the horse's stall,
And there she found her son;
'Rise up, rise up now, Lord John,' she said,
'Your lady has born a son.'",
      "He's raised her frae the horse's stall,
And set her in a chair:
'Here is the best bed in my house,
For you and your young heir.'",
    ],
  },

  "child69": {
    title: "Clerk Saunders",
    childNumber: "Child 69",
    version: "Version B (Herd's Manuscripts, 1769)",
    stanzas: [
      "Clerk Saunders and a gay lady
Was walking in yonder green,
And heavy, heavy was the love
That fell this twa lovers between.",
      "'A bed, a bed,' Clerk Saunders said,
'A bed for you and me!'
'Fy na, fy na,' said the lady,
'Till anes we married be.'",
      "'For in it will come my seven brothers,
And a' their torches burning bright;
They'll say, We hae but ae sister,
And here her lying wi a knight.'",
      "'You'll take the sourocks on your lap,
The moon shines over the wall;
And I shall come to your bower-door,
And in softly I shall fa'.'",
      "And he has ta'en a lady's mantle,
And he has spread it on the floor;
And, softly stepping, Clerk Saunders
Has entered at the bower-door.",
      "And they baith lay in ae embrace,
And love passed high between;
But little thought Clerk Saunders then
That love was to be their bane.",
      "In and came her seven brothers,
With torches burning bright;
Says they, We hae but ae sister,
And here her lying wi a knight.",
      "Then ane of them has drawn his sword,
And another has drawn another;
And they've thrust them through Clerk Saunders' body,
The coldest blood ran over.",
      "Yestreen I made my bed full wide,
This night I'll make it narrow,
For all the livelong winter's night
I lie twined o' my marrow.",
      "O are ye sleeping, Margret? he said,
Or are ye waking presentlie?
Give me my faith and troth again,
I wot, true love, I gied to thee.",
      "'Your faith and troth ye sanna get,
And our true love sall never twin,
Until ye tell me what comes of women,
I wot, that die in strong travelling?'",
      "'Their beds are made in the heavens high,
Down at the foot of our good Lord's knee;
Weel set about wi' gillyflowers,
I wot, sweet company for to see.'",
      "'O cocks are crowing a merry midnight,
I wot the wild fowl boding day;
The psalms of heaven will be sung,
And I, ere now, will be missed away.'",
      "'Up, up, up, my seven brothers,
Up, up, up, and awa';
I wonder what hinders our good Lord's gate,
So late as ye come in the daw.'",
      "O it's they've taen up the clay-cold corpse,
And put it in the grave so deep;
And they've taen up the leal maiden,
And bade her mourn and weep.",
      "O she has made her brother's bed,
And she has made it braid and wide;
And she has dried her wet, wet eyes,
And she has laid her down to bide.",
      "They baith lay still, and slept sound,
Until the sun began to sheen;
She drew the curtains a wee bit,
And dull and drowsy was his een.",
      "This night, said she, the sleepiest man
That ever my twa eyes did see;
Ye've lain all night within my arms,
'Tis shame for you and me.",
      "She's rowd the claiths a to the foot,
And then she spied his deadly wounds:
'O wae be to my seven brothers,
A wat an ill death may they die!'",
    ],
  },

  "child70": {
    title: "Willie and Lady Maisry",
    childNumber: "Child 70",
    version: "Version A (Motherwell's Manuscript, 1826)",
    stanzas: [
      "Willie was a widow's son,
And he wore a milk-white weed,
And weel could Willie read and write,
Far better ride on steed.",
      "Lady Margerie was the first lady
That drank to him the wine,
And aye as the healths gade round and round,
'Laddy, your love is mine.'",
      "Lady Margerie was the first ladye
That drank to him the beer,
And aye as the healths gade round and round,
'Laddy, you're welcome here.'",
      "'You must come into my bower
When the evening bells do ring,
And you must come into my bower
When the evening mass doth sing.'",
      "He's taen four and twenty braid arrows,
And laced them in a whang,
And he's awa to Lady Margerie's bower,
As fast as he can gang.",
      "He set ae foot on the wall,
And the other on a stane,
And he's killed a' the king's life-guards,
And he's killed them every man.",
      "'Oh open, open, Lady Margerie,
Open and let me in;
The weet weets a' my yellow hair,
And the dew draps on my chin.'",
      "With her feet as white as sleet
She strode her bower within,
And with her fingers long and small
She's looten Sweet Willie in.",
      "'O Willie, Willie, I fear that thou
Has bred me dule and sorrow;
The deed that thou has done this night
Will kythe upon the morrow.'",
      "In then came her father dear,
And a broad sword by his side,
And he's given Willie, the widow's son,
A deep wound and a sair.",
      "'Lye yont, lye yont, Willie,' she says,
'Your sweat weets a' my side;
Lye yont, lie yont, Willie,' she says,
'For your sweat I downa bide.'",
      "She turned her back unto the wall,
Her face unto the room,
And there she saw her auld father,
Walking up and down.",
      "'Woe be to you, father,' she said,
'And an ill deed may you die!
For ye've killed Willie, the widow's son
And he would have married me.'",
      "She turned her back unto the room,
Her face unto the wall,
And with a deep and heavy sigh
Her heart it brak in twa.",
    ],
  },

  "child72": {
    title: "The Clerk's Twa Sons o Owsenford",
    childNumber: "Child 72",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "O I will sing to you a sang,
But oh my heart is sair!
The clerk's twa sons in Owsenford
Has to learn some unco lair.",
      "They hadna been in fair Parish
A twelvemonth and a day,
Till the clerk's twa sons o Owsenford
Wi the mayor's twa daughters lay.",
      "O words gaen to the mighty mayor,
As he sailed on the sea,
That the clerk's twa sons o Owsenford
Wi his twa daughters lay.",
      "'If they hae lain wi my twa daughters,
Meg and Marjorie,
The morn, or I taste meat or drink,
They shall be hangit hie.'",
      "O words gaen to the clerk himself,
As he sat drinking wine,
That his twa sons in fair Parish
Were bound in prison strong.",
      "Then up and spak the clerk's ladye,
And she spak powerfully:
'O tak with ye a purse of gold,
Or take with ye three,
And if ye canna get William,
Bring Andrew hame to me.'",
      "'O lie ye here for owsen, dear sons,
Or lie ye here for kye?
Or what is it that ye lie for,
Sae sair bound as ye lie?'",
      "'We lie not here for owsen, dear father,
Nor yet lie here for kye,
But it's for a little o dear-bought love
Sae sair bound as we lie.'",
      "O he's gane to the mighty mayor,
And he spoke powerfully:
'Will ye grant me my twa sons' lives,
Either for gold or fee?
Or will ye be sae gude a man
As grant them baith to me?'",
      "'I'll no grant ye your twa sons' lives,
Neither for gold or fee,
Nor will I be sae gude a man
As gie them back to thee;
Before the morn at twelve o'clock
Ye'll see them hangit hie.'",
      "Up and spak his twa daughters,
And they spak powerfully:
'Will ye grant us our twa loves' lives,
Either for gold or fee?
Or will ye be sae gude a man
As grant them baith to me?'",
      "'I'll no grant ye your twa loves' lives,
Neither for gold or fee,
Nor will I be sae gude a man
As grant their lives to thee;
Before the morn at twelve o'clock
Ye'll see them hangit hie.'",
      "O he's taen out these proper youths,
And hanged them on a tree,
And he's bidden the clerk of Owsenford
To tak them hame wi thee.",
      "The bonny clerks they died that morn,
Their loves died lang ere noon,
And the waefu' clerk o Owsenford
To his lady has gane hame.",
      "His lady sits on yon castle-wa,
Beholding dale and down,
And there she saw her ain gude lord
Come walkin to the town.",
      "'Ye're welcome, welcome, my ain gude lord,
Ye're welcome hame to me;
But where away are my twa sons?
Ye should hae brought them wi ye.'",
      "'It's I've putten them to a deeper lair,
And to a higher school;
Your ain twa sons'll no be here
Till the hallow days o Yule.'",
      "'O sorrow, sorrow come mak my bed,
And dool come lay me down!
For I'll neither eat nor drink,
Nor set a fit on ground.'",
    ],
  },

  "child73": {
    title: "Lord Thomas and Fair Annet",
    childNumber: "Child 73",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "Lord Thomas and Fair Annet
Sate a day on a hill;
Whan night was cum, and sun was sett,
They had not talkt their fill.",
      "Lord Thomas said a word in jest,
Fair Annet took it ill:
'A, I will nevir wed a wife
Against my ain friends will.'",
      "'Gif ye wull nevir wed a wife,
A wife wull neir wed yee:'
Sae he is hame to tell his mither,
And knelt upon his knee.",
      "'O rede, O rede, mither,' he says,
'A gude rede gie to mee:
O sall I tak the nut-browne bride,
And let fair Annet bee?'",
      "'The nut-browne bride haes gowd and gear,
Fair Annet she has gat nane;
And the little beauty fair Annet has,
O it wull soon be gane!'",
      "And he has till his brother gane:
'Now, brother, rede ye mee;
A' sall I marrie the nut-browne bride,
And let fair Annet bee?'",
      "'The nut-browne bride haes oxen, brother,
The nut-browne bride haes kye;
I wad hae ye marrie the nut-browne bride,
And cast fair Annet bye.'",
      "'Her oxen may dye i the house, billie,
And her kye into the byre;
And I sall hae nothing to my-sell
Bot a fat fadge by the fyre.'",
      "And he has till his sister gane:
'Now, sister, rede ye mee;
O sall I marrie the nut-browne bride,
And set fair Annet free?'",
      "'I'se rede ye tak fair Annet, Thomas,
And let the browne bride alane;
Lest ye sould sigh and say, Alace!
What is this we brought hame?'",
      "'No, I will tak my mither's counsel,
And marrie me out o hand;
And I will tak the nut-browne bride;
Fair Annet may leive the land.'",
      "Up then rose fair Annet's father
Twa hours or it wer day,
And he is gane into the bower,
Wherein fair Annet lay.",
      "'Rise up, rise up, fair Annet,' he says,
'Put on your silken sheene;
Let us gae to St Marie's kirk,
And see that rich weddeen.'",
      "'My maids, gae to my dressing-room,
And dress to me my hair;
Where-eir yee laid a plait before,
See yee lay ten times mair.'",
      "'My maids, gae to my dressing-room,
And dress to me my smock;
The one half is o the Holland fine,
The other o needle-work.'",
      "The horse fair Annet rade upon,
He amblit like the wind;
Wi siller he was shod before,
Wi burning gowd behind.",
      "Four and twenty siller bells
Wer a' tied till his mane,
And yae tift o the norland wind,
They tinkled ane by ane.",
      "Four and twenty gay gude knights
Rade by fair Annet's side,
And four and twenty fair ladies,
As gin she had bin a bride.",
      "And whan she cam to Marie's kirk,
She sat on Marie's stean:
The cleading that fair Annet had on
It skinkled in their een.",
      "And whan she cam into the kirk,
She shimmered like the sun;
The belt that was about her waist
Was a' wi pearles bedone.",
      "She sat her by the nut-browne bride,
And her een they wer sae clear,
Lord Thomas he clean forgat the bride,
Whan fair Annet drew near.",
      "He had a rose into his hand,
He gae it kisses three,
And reaching by the nut-browne bride,
Laid it on fair Annet's knee.",
      "Up than spak the nut-browne bride,
She spak wi meikle spite:
'And whair gat ye that rose-water,
That does mak yee sae white?'",
      "'O I did get the rose-water
Whair ye wull neir get nane,
For I did get that very rose-water
Into my mither's wame.'",
      "The bride she drew a long bodkin
Frae out her gay head-gear,
And strake fair Annet unto the heart,
That word spak nevir mair.",
      "Lord Thomas he saw fair Annet wex pale,
And marvelit what mote bee;
But whan he saw her dear heart's blood,
A wood-wroth wexed hee.",
      "He drew his dagger, that was sae sharp,
That was sae sharp and meet,
And drave it into the nut-browne bride,
That fell deid at his feet.",
      "'Now stay for me, dear Annet,' he sed,
'Now stay, my dear,' he cried;
Then strake the dagger until his heart,
And fell deid by her side.",
      "Lord Thomas was buried without kirk-wa,
Fair Annet within the quire,
And o the tane there grew a birk,
The other a bonny briere.",
      "And ay they grew, and ay they threw,
As they wad faine be near;
And by this ye may ken right weil
They were twa lovers dear.",
      "Sweet Willie and Fair Annie,
As they sat on yonder hill,
If they had sat from morn till evening,
They had not talked their fill.",
    ],
  },

  "child74": {
    title: "Fair Margaret and Sweet William",
    childNumber: "Child 74",
    version: "Version A (Broadside, c.1711)",
    stanzas: [
      "As it fell out on a long summer's day,
Two lovers they sat on a hill;
They sat together that long summer's day,
And could not talk their fill.",
      "'I see no harm by you, Margaret,
Nor you see none by me;
Before tomorrow eight a clock
A rich wedding shall you see.'",
      "Fair Margaret sat in her bower-window,
A-combing of her hair,
And there she spied Sweet William and his bride,
As they were riding near.",
      "Down she laid her ivory comb,
And up she bound her hair;
She went her way forth of her bower,
But never more did come there.",
      "When day was gone, and night was come,
And all men fast asleep,
Then came the spirit of Fair Margaret,
And stood at William's feet.",
      "'God give you joy, you two true lovers,
In bride-bed fast asleep;
Lo I am going to my green grass grave,
And am in my winding-sheet.'",
      "When day was come, and night was gone,
And all men waked from sleep,
Sweet William to his lady said,
'My dear, I have cause to weep.'",
      "'I dreamed a dream, my dear lady,
Such dreams are never good;
I dreamed my bower was full of red swine,
And my bride-bed full of blood.'",
      "'Such dreams, such dreams, my honoured lord,
They never do prove good,
To dream thy bower was full of swine,
And thy bride-bed full of blood.'",
      "He called up his merry men all,
By one, by two, and by three,
Saying, 'I'll away to Fair Margaret's bower,
By the leave of my lady.'",
      "And when he came to Fair Margaret's bower,
He knocked at the ring;
So ready was her seven brethren
To let Sweet William in.",
      "He turned up the covering-sheet:
'Pray let me see the dead;
Methinks she does look pale and wan,
She has lost her cherry red.'",
      "'I'll do more for thee, Margaret,
Than any of thy kin;
For I will kiss thy pale wan lips,
Tho a smile I cannot win.'",
      "With that bespeak her seven brethren,
Making most piteous moan:
'You may go kiss your jolly brown bride,
And let our sister alone.'",
      "'Deal on, deal on, my merry men all,
Deal on your cake and your wine;
For whatever is dealt at her funeral today
Shall be dealt tomorrow at mine.'",
      "Fair Margaret died on the over-night,
Sweet William died on the morrow;
Fair Margaret died for pure, pure love,
Sweet William died for sorrow.",
      "Margaret was buried in the lower chancel,
And William in the higher;
Out of her breast there sprang a rose,
And out of his a briar.",
      "They grew till they grew unto the church top,
And then they could grow no higher;
And there they tied in a true lover's knot,
Which made all the people admire.",
    ],
  },

  "child76": {
    title: "The Lass of Roch Royal",
    childNumber: "Child 76",
    version: "Version A / Version C / Version F composite",
    stanzas: [
      "Fair Isabell of Rochroyall,
She dreamed where she lay,
She dreamed a dream of her love Gregory,
A little before the day.",
      "O softly, softly rose she up,
And softly put she on,
And softly, softly she put on
The silks of crimson.",
      "'Saddle me the black,' she says,
'Saddle me the brown;
Saddle me the swiftest steed
That ever rode the town.'",
      "And she has ridden o'er muir and moss,
And she has ridden right slee,
Until she cam to a fair castle,
Stood on a tower sae hie.",
      "She knocked at the castle gate,
And loud and sair cried she:
'O open, open, Love Gregory,
And let your true love in!'",
      "But there stood by that castle-side
A nurse, a wicked woman,
And she has raised the gate so wide
And spoken to this woman.",
      "The night was dark, and the wind blew cold,
And her love was fast asleep,
And the bairn that was in her two arms
Full sore began to weep.",
      "'O waken, waken, Love Gregory,
Waken and let me in;
For the rain rains on my scarlet robe
And the dew is on my skin.'",
      "She knocked long at the castle gate,
And called full loud and sair;
But Love Gregory would not rise,
For all his lady's prayer.",
      "When the cock had crawn, and day did dawn,
And the sun began to peep,
Then it rose him Love Gregor,
And sorely did he weep.",
      "'O where is she, my dearest dear,
The lass of Roch Royal?
And where is all my heart's delight,
That I loved best of all?'",
      "'O cursed be ye, ye wicked nurse,
A hard heart had ye;
For she's gone from my castle gate,
And she's gone far from me.'",
    ],
  },

  "child77": {
    title: "Sweet William's Ghost",
    childNumber: "Child 77",
    version: "Version A (Ramsay's Tea-Table Miscellany, 1740)",
    stanzas: [
      "There came a ghost to Margret's door,
With many a grievous groan,
And ay he tirled at the pin,
But answer made she none.",
      "'Is that my father Philip,
Or is't my brother John?
Or is't my true-love, Willy,
From Scotland new come home?'",
      "'Tis not thy father Philip,
Nor yet thy brother John;
But 'tis thy true-love, Willy,
From Scotland new come home.",
      "'O sweet Margret, O dear Margret,
I pray thee speak to me;
Give me my faith and troth, Margret,
As I gave it to thee.'",
      "'Thy faith and troth thou's never get,
Nor yet will I thee lend,
Till that thou come within my bower,
And kiss my cheek and chin.'",
      "'If I shoud come within thy bower,
I am no earthly man;
And shoud I kiss thy rosy lips,
Thy days will not be lang.'",
      "'Is there any room at your head, Willy?
Or any room at your feet?
Or any room at your twa sides,
Where fain, fain I could sleep?'",
      "'There's no room at my head, Margret,
There's no room at my feet;
There's no room at my twa sides,
For fain, fain thou would sleep.'",
      "'O Margret, take the red, red gold,
That's written in my will,
And give it to my sister dear,
For I love her wondrous well.'",
      "'O cocks are crowing at merry midnight,
And the wild fowls herald the day;
Give me my faith and troth again,
And let me fare me on my way.'",
      "'Thy faith and troth thou's never get,
Nor yet will I thee lend,
Till thou take me to the kirk, Willy,
And wed me wi a ring.'",
      "'My banes are buried in yon kirk-yard,
It's far ayont the sea;
And it is my spirit, Margret,
That's speaking unto thee.'",
    ],
  },

  "child78": {
    title: "The Unquiet Grave",
    childNumber: "Child 78",
    version: "Version A (Lilly MS, c.1650)",
    stanzas: [
      "'The wind doth blow today, my love,
And a few small drops of rain;
I never had but one true-love,
In cold grave she was lain.",
      "'I'll do as much for my true-love
As any young man may;
I'll sit and mourn all at her grave
For a twelvemonth and a day.'",
      "The twelvemonth and a day being up,
The dead began to speak:
'Who sits weeping on my grave,
And will not let me sleep?'",
      "'Tis I, my love, sits on your grave,
And will not let you sleep;
For I crave one kiss of your clay-cold lips,
And that is all I seek.'",
      "'You crave one kiss of my clay-cold lips,
But my breath smells earthy strong;
If you have one kiss of my clay-cold lips,
Your time will not be long.'",
      "'Tis down in yonder garden green,
Love, where we used to walk,
The finest flower that e'er was seen
Is withered to a stalk.",
      "'The stalk is withered dry, my love,
So will our hearts decay;
So make yourself content, my love,
Till God calls you away.'",
    ],
  },

  "child80": {
    title: "Old Robin of Portingale",
    childNumber: "Child 80",
    version: "Version A (Percy Folio MS, c.1650)",
    stanzas: [
      "God let never so old a man
Marry so young a wife
As did Old Robin of Portingale;
He may rue all the days of his life.",
      "For the mayor's daughter of Lin,
God wot,
He chose her to his wife,
And thought to have lived in quietness
With her all the days of his life.",
      "They had not in their wed-bed laid,
Scarcely were both asleep,
But up she rose, and forth she goes
To Sir Gyles, and fast can weep.",
      "'Sleep you, wake you, fair Sir Gyles?
Or be not you within?'
'But I am waking, sweet,' he said,
'Lady, what is your will?'",
      "'I have bethought me of a wile,
How my wed lord we shall spill;
Four and twenty of my next cousins
Will help to bring him down.'",
      "With that was heard his little foot-page,
As he was watering his master's steed;
So softly he heard their words,
And told his lord with speed.",
      "'And thou be sick, my own wed lord,
So sore it grieves me;
But my five maidens and myself
Will watch thy bed for thee.'",
      "'And at the waking of your first sleep,
We will a hot drink make;
And at the waking of your next sleep,
Your sorrows we will slake.'",
      "He put a silk coat on his back,
And mail of many a fold;
And he put a steel cap on his head,
Was gilt with good red gold.",
      "He laid a bright brown sword by his side,
And another at his feet;
And twenty good knights he placed at hand,
To watch him in his sleep.",
      "And there he lay full still and close,
And watched in his array;
And by there came the false steward
With torch and lantern gay.",
      "He looked east, he looked west,
To see if all was clear;
Then softly stepped to the chamber door,
And thought no man was there.",
      "He stepped in at the chamber door,
And to the bed did go;
Old Robin started from his sleep,
And struck a deadly blow.",
      "Then up spoke the lady fair,
From bed where she did lie:
'O spare me now, my own wed lord,
For Robin, spare not thee!'",
      "Old Robin with his bright brown sword
Sir Gyles his head has won;
And scarce of all those twenty-four
Did Robin leave a one.",
      "He called up his little foot-page,
Before the peep of day:
'For this good deed that thou hast done
My heir thou shalt be aye.'",
      "Says, 'Ride now, my little foot-page,
And ride thou well with speed,
And when thou com'st to fair London
Tell them Old Robin's deed.'",
      "He has ta'en the lady by the hand,
He has led her through the hall;
'Come, we'll go see what's to be done
This morning after all.'",
      "Old Robin took her by the hand,
And said with mournful tone:
'For this thy deed, my own wed-wife,
Thou shalt make bitter moan.'",
      "He called up his merry men all,
By one, by two, by three;
'Now I must needs to merry London,
God be with you all,' said he.",
      "He cut the paps from off her breast,
Green wounds full wide and sore;
'Now I am off to good Jerusalem,
For to pray forevermore.'",
      "He took his horse and rode away,
By the lee light of the moon;
And there he knelt at the Holy Grave,
And he prayed till he was done.",
      "And about the middle time of the night
Came twenty-four good knights in;
Sir Gyles he was the foremost man,
So well he knew that gin.",
      "Old Robin with his bright brown sword
He smote them one by one;
And ere the dawning of the day
He left not one alive thereon.",
    ],
  },

  "child81": {
    title: "Little Musgrave and Lady Barnard",
    childNumber: "Child 81",
    version: "Version A (Wit Restor'd, 1658)",
    stanzas: [
      "As it fell one holy-day,
As many be in the year,
When young men and maids together did go
Their matins and mass to hear.",
      "Little Musgrave came to the church door,
The priest was at private mass;
But he had more mind of the fair women
Then he had of our lady's grace.",
      "The one of them was clad in green,
Another was clad in pall;
And then came in my lord Barnard's wife,
The fairest amongst them all.",
      "She cast an eye on Little Musgrave,
As bright as the summer sun;
And then bethought this Little Musgrave,
This lady's heart have I won.",
      "Quoth she, 'I have loved thee, Little Musgrave,
Full long and many a day;'
'So have I loved you, fair lady,
Yet never word durst I say.'",
      "'I have a bower at Bucklesfordbury,
Full daintily it is dight;
If thou wilt wend thither, thou Little Musgrave,
Thou's lig in mine arms all night.'",
      "Quoth he, 'I thank thee, fair lady,
This kindness thou showest to me;
But whether it be to my weal or woe,
This night I will lig with thee.'",
      "With that he heard, a little tiny page,
By this lady's coach as he ran:
'Although I am my lady's foot-page,
Yet I am Lord Barnard's man.'",
      "'My lord Barnard shall know of this,
Whether I sink or swim;'
And ever where the bridges were broke
He laid him down to swim.",
      "'Asleep or wake, thou Lord Barnard,
As thou art a man of life,
For Little Musgrave is at Bucklesfordbury,
Abed with thy own wedded wife.'",
      "'If this be true, thou little tiny page,
This thing thou tellest to me,
Then all the land in Bucklesfordbury
I freely will give to thee.'",
      "'But if it be a lie, thou little tiny page,
This thing thou tellest to me,
On the highest tree in Bucklesfordbury
Then hanged shalt thou be.'",
      "He called up his merry men all:
'Come saddle me my steed;
This night must I to Bucklesfordbury,
For I never had greater need.'",
      "When supper was over, and mass was sung,
And every man bound for bed,
Little Musgrave and that lady
In one chamber were laid.",
      "'Methinks I hear the thresel-cock,
Methinks I hear the jay;
Methinks I hear my lord Barnard,
And I would I were away.'",
      "'Lie still, lie still, thou Little Musgrave,
And huggle me from the cold;
'Tis nothing but a shepherd's boy,
A driving his sheep to the fold.'",
      "'Is not thy hawk upon a perch?
Thy steed eats oats and hay;
And thou a fair lady in thine arms,
And wouldst thou be away?'",
      "With that my lord Barnard came to the door,
And lit a stone upon;
He plucked out three silver keys,
And he opened the doors each one.",
      "He lifted up the coverlet,
He lifted up the sheet:
'How now, how now, thou Little Musgrave,
Dost thou find my lady sweet?'",
      "'I find her sweet,' quoth Little Musgrave,
'The more 'tis to my pain;
I would gladly give three hundred pounds
That I were on yonder plain.'",
      "'Arise, arise, thou Little Musgrave,
And put thy clothing on;
It shall ne'er be said in my country
I have killed a naked man.'",
      "'I have two swords in one scabbard,
Full dear they cost my purse;
And thou shalt have the best of them,
And I will have the worse.'",
      "The first stroke that Little Musgrave struck,
He hurt Lord Barnard sore;
The next stroke that Lord Barnard struck,
Little Musgrave ne'er struck more.",
      "With that bespake this fair lady,
In bed whereas she lay:
'Although thou'rt dead, thou Little Musgrave,
Yet I for thee will pray.'",
      "'I wish thee well,' then Barnard cried,
'And well in yonder town,
And well for all the lords and ladies
That on thee look and frown.'",
      "Lord Barnard he hewed off her head
And set it on a spear;
'The fairest lady in all the land
Has paid for sin right dear.'",
    ],
  },

  "child82": {
    title: "The Bonny Birdy",
    childNumber: "Child 82",
    version: "Version A (Herd's Manuscripts, 1769)",
    stanzas: [
      "There was a knight, in a summer's night,
Was riding o'er the lee,
And there he saw a bonny birdy,
Was singing upon a tree.",
      "'Make haste, make haste, ye gentle knight,
What keeps you here so late?
If ye knew what was doing at home,
I fear you'd look right blate.'",
      "'O what needs I toil day and night,
My fair body to kill,
When I have knights at my command,
And ladies at my will?'",
      "'Ye lie, ye lie, ye gentle knight,
So loud I hear you lie;
Your lady has a knight in her arms two
That she loves far better nor thee.'",
      "'Ye lie, ye lie, ye bonny birdy,
How you lie upon my sweet!
I will take out my bonny bow,
And in truth I will you sheet.'",
      "'But before ye have your bow well bent,
And all your arrows yare,
I will flee to another tree,
Where I can better fare.'",
      "'O where were you gotten, and where were you hatched?
O bonny birdy, tell me.'
'O I was hatched in good green wood,
In a holly tree;
A gentleman my nest did harry,
And gave me to his lady.'",
      "'With good white bread and farrow-cow milk
He bade her feed me oft,
And gave her a little summer wand
To ding me seldom and soft.'",
      "'With good white bread and farrow-cow milk
I wot she fed me nought,
But with a little summer wand
She dinged me sore and oft;
If she had done as ye her bade,
I would not tell how she has wrought.'",
      "The knight he rode, and the birdy flew,
The livelong summer's night,
Till he came to his lady's bower-door,
Then even down he did light.",
      "The birdy sat on the top of a tree,
And I wot it sang full dight:
'What ails you now, ye false lady,
Ye look so pale tonight?'",
      "'I have been sore sick,' the lady said,
'And near unto my end;'
'Nay, you have been in another man's arms,
Ye need not now pretend.'",
    ],
  },

  "child83": {
    title: "Child Maurice",
    childNumber: "Child 83",
    version: "Version D (Scots composite, c.1755)",
    stanzas: [
      "Child Maurice hunted the Silver Wood,
He hunted it round about;
And nobody that he found therein,
Nor none there was without.",
      "He took his silver comb in hand,
To comb his yellow locks;
'Come hither, thou little foot-page,
That runnest lowly by my knee.'",
      "'For thou shalt go to John Steward's wife,
And pray her speak with me;
And as it falls, as many times
As knots be knit on a kell.'",
      "'And here I send her a mantle of green,
As green as any grass,
And bid her come to the Silver Wood,
To hunt with Child Maurice.'",
      "'And here I send her a ring of gold,
A ring of precious stone;
And bid her come to the Silver Wood,
Let for no kind of man.'",
      "One while the little boy he walked,
Another while he ran,
Until he came to John Steward's hall,
I wis he never blan.",
      "'I am come from Child Maurice,
A message unto thee;
And Child Maurice, he greets you well,
And ever so well from me.'",
      "'And here he sends you a mantle of green,
As green as any grass,
And he bids you come to the Silver Wood,
To hunt with Child Maurice.'",
      "'Now peace, now peace, thou little foot-page,
For Christ's sake, I pray thee;
For if my lord hear one of these words,
Thou must be hanged high.'",
      "John Steward stood under the castle wall,
And he wrote the words every one;
And he called up his horse-keeper:
'Make ready thou my steed.'",
      "And he cast a leash upon his back,
And he rode to the Silver Wood;
And there he found him Child Maurice,
Sitting upon a block.",
      "With a silver comb in his hand,
Combing his yellow locks:
'How now, how now, Child Maurice?
Alack, how may this be?'",
      "'For thou hast sent her love-tokens,
More now than two or three;
Thou hast sent her a mantle of green,
As green as any grass.'",
      "'I do not know your lady,' he said,
'If that I do her see;'
'O how could I know thy lady dear,
Amongst so many free?'",
      "'She's not the wife of John Steward,
For I have known her long;
She is mine own dear mother,
Whom I have loved so strong.'",
      "Then John Steward took his sword in hand,
And smote off Maurice's head;
And he carried it on the sword's point
To show his lady the deed.",
      "'Now here is the head of Child Maurice,
I pray how like ye this?'
She turned away her face and wept:
'Alas, and woe is me!'",
      "'It is not the head of Child Maurice,
The head of my own dear son;
For his eyes were as bright as the morning star,
And the hair that round it shone.'",
      "'I got him in my father's house,
With much sin and shame;
I brought him up in the good green wood,
Under a different name.'",
      "'O were it not for Child Maurice' sake,
For him whom I loved best,
I'd thrust this sword through my own heart,
And lay me down to rest.'",
      "John Steward pulled out his sword in grief,
And pierced it through his side:
'Now may the Lord have mercy on my soul,
For this is sin and pride.'",
      "Then up and spake her eldest son,
Stood by his mother's knee:
'If I be living, John Steward's wife,
I'll be revenged on thee.'",
      "The lady wept, the lady mourned,
For her son slain at morn;
The one was killed in the morning air,
His mother died at eve,
And ere the morning bells were rung,
The threesome were all gone.",
    ],
  },

  "child84": {
    title: "Bonny Barbara Allan",
    childNumber: "Child 84",
    version: "Version A (Ramsay's Tea-Table Miscellany, 1740)",
    stanzas: [
      "It was in and about the Martinmas time,
When the green leaves were a-falling,
That Sir John Graeme, in the West Country,
Fell in love with Barbara Allan.",
      "He sent his men down through the town,
To the place where she was dwelling;
'O haste and come to my master dear,
Gin ye be Barbara Allan.'",
      "O hooly, hooly rose she up,
To the place where he was lying,
And when she drew the curtain by:
'Young man, I think you're dying.'",
      "'O it's I'm sick, and very very sick,
And tis all for Barbara Allan;'
'O the better for me ye's never be,
Though your heart's blood were a-spilling.'",
      "'O dinna ye mind, young man,' said she,
'When ye was in the tavern a-drinking,
That ye made the healths go round and round,
And slighted Barbara Allan?'",
      "He turned his face unto the wall,
And death was with him dealing;
'Adieu, adieu, my dear friends all,
And be kind to Barbara Allan.'",
      "And slowly, slowly raised she up,
And slowly, slowly left him;
And sighing said she could not stay,
Since death of life had reft him.",
      "She had not gone a mile but two,
When she heard the dead-bell ringing;
And every jow that the dead-bell gave
It cried, 'Woe to Barbara Allan!'",
      "'O mother, mother, make my bed,
O make it soft and narrow;
Since my love died for me today,
I'll die for him tomorrow.'",
      "All in the merry month of May,
When green leaves they were springing,
This young man on his death-bed lay,
For the love of Barbara Allan.",
      "It fell about the Lammas time,
When the woods grow green and yellow,
There was a young man fell in love,
But he could not get his fellow.",
    ],
  },

  "child85": {
    title: "Lady Alice",
    childNumber: "Child 85",
    version: "Version A (Percy's Reliques, 1765)",
    stanzas: [
      "Lady Alice was sitting in her bower-window,
Mending her midnight coif,
And there she saw as fine a corpse
As ever she saw in her life.",
      "'What bear ye, what bear ye, ye six men tall?
What bear ye on your shoulders?'
'We bear the corpse of Giles Collins,
Who was once a true lover of yours.'",
      "'O lay him down gently, ye six men tall,
All on the grass so green,
And tomorrow, when the sun goes down,
Lady Alice a corpse shall be seen.'",
      "And she, herself, did dig his grave
With her own lily-white hand;
And she herself did bury him
In the holy churchyard land.",
      "Lady Alice was buried in the east,
Giles Collins was buried in the west;
There grew a lily from Giles Collins
That touched Lady Alice's breast.",
      "There grew a briar from Lady Alice
That twined about the yew;
And every time they touched each other
They clung so fast and true.",
      "There blew a cold north-easterly wind
And cut this briar in twain;
Which never was seen to grow again,
And it never will again.",
    ],
  },

  "child86": {
    title: "Young Benjie",
    childNumber: "Child 86",
    version: "Version A (Herd's Manuscripts, c.1783)",
    stanzas: [
      "Of all the maids of fair Scotland
The fairest was Marjorie,
And young Benjie was her own true-love,
And a dear true-love was he.",
      "And wow, but they were lovers dear,
And loved full constantly;
But ay the more, when they fell out,
The sorier was their plea.",
      "And they have quarrelled on a day,
Till Marjorie's heart grew wae,
And she said she'd choose another love,
And let Young Benjie go.",
      "And he was stout, and proud-hearted,
And thought it bitterly,
And he's gone by the wan moonlight
To meet his Marjorie.",
      "'O open, open, my true love,
O open and let me in!'
'I dare not open, Young Benjie,
My three brothers are within.'",
      "'Ye lied, ye lied, ye bonny bird,
So loud I hear ye lie;
As I came by the Lowden banks,
They bade good even to me.'",
      "'But fare ye well, my own false love,
That I have loved so lang;
It sets ye choose another love,
And let Young Benjie gang.'",
      "Then Marjorie turned her round about,
The tear blinding her ee:
'I dare not, dare not let thee in,
But I'll come down to thee.'",
      "Then soft, soft went she down the stair,
And low, low down the gait;
She put her hand upon the pin,
But dared not open it straight.",
      "Young Benjie he stood at the door,
The moon shone wondrous clear;
He seized her by the waist so slim,
And threw her in the linn so dear.",
      "The stream was strong, the maid was stout,
And loath, loath to be drowned;
But ere she won the Lowden banks
Her fair colour was gone.",
      "Then up bespake her eldest brother:
'O see ye not what I see?'
And out then spake her second brother:
'It's our sister Marjorie!'",
      "Out then spake her eldest brother:
'O how shall we her ken?'
And out then spake her youngest brother:
'There's a honey-mark on her chin.'",
      "Then they have ta'en up the comely corpse,
And laid it on the ground;
'O who has killed our own sister,
And how can he be found?'",
      "'The night it is her low lykewake,
The morn her burial day,
And we maun watch at mirk midnight,
And hear what she will say.'",
      "With doors ajar, and candle-light,
And torches burning clear,
The laid-out corpse, till still midnight,
They waked, but nothing hear.",
      "About the middle of the night
The cocks began to crow,
And at the dead hour of the night
The corpse began to thraw.",
      "'O who has done the wrong, sister,
Or dared the deadly sin?
Who was so stout, and feared no doubt,
As throw ye o'er the linn?'",
      "'Young Benjie was the first man
I laid my love upon;
He was so stout, and feared no doubt,
And threw me o'er the linn.'",
      "'Shall we Young Benjie head, brothers,
Or shall we Benjie hang?
Or shall we pike out his two gray eyes,
And punish him ere he gang?'",
      "'Ye mauna Benjie head, brothers,
Ye mauna Benjie hang,
But ye maun pike out his two gray eyes,
And punish him ere he gang.'",
      "'Tie a green cravat round his neck,
And lead him out and in,
And the best servant about your house
To wait Young Benjie on.'",
    ],
  },

  "child90": {
    title: "Jellon Grame",
    childNumber: "Child 90",
    version: "Version A (Herd's Manuscripts, c.1783)",
    stanzas: [
      "O Jellon Grame sat in Silver Wood,
He whistled and he sang,
And he has called his little foot-page,
His errand for to gang.",
      "'Win up, my bonny boy,' he says,
'As quick as ever you may;
For ye maun gang for Lillie Flower,
Before the break of day.'",
      "The boy has buckled his belt about,
And through the green-wood ran,
And he came to the lady's bower-door
Before the day did dawn.",
      "'O sleep ye, or wake ye, Lillie Flower?
The red runs in the rain;
I sleep not oft, I wake right oft;
Whas that that kens my name?'",
      "'Ye are bidden come to Silver Wood,
But I fear you'll never win hame;
Ye are bidden come to Silver Wood,
And speak wi Jellon Grame.'",
      "'O I will gang to Silver Wood,
Though I should never win hame;
For the thing I most desire on earth
Is to speak wi Jellon Grame.'",
      "She had not ridden a mile, a mile,
A mile but barely three,
Ere she came to a new-made grave,
Beneath a green oak tree.",
      "O then up started Jellon Grame,
Out of a bush hard by:
'Light down, light down now, Lillie Flower,
For it's here that ye maun lie.'",
      "She lighted off her milk-white steed,
And knelt upon her knee:
'O mercy, mercy, Jellon Grame!
For I'm not prepared to die.'",
      "'Your bairn, that stirs between my sides,
Maun shortly see the light;
But to see it weltering in my blood
Would be a piteous sight.'",
      "'O should I spare your life,' he says,
'Until that bairn be born,
I ken full well your stern father
Would hang me on the morn.'",
      "'My father you need never dread;
I'll keep my bairn in the good green wood,
Or with it I'll beg my bread.'",
      "He took no pity on that lady,
Though she for life did pray;
But pierced her through the fair body,
As at his feet she lay.",
      "He felt no pity for that lady,
Though she was lying dead;
But he felt some for the bonny boy
Lay weltering in her blood.",
      "Up has he ta'en that bonny boy,
Given him to nurses nine;
Three to wake, and three to sleep,
And three to go between.",
      "And he's brought up that bonny boy,
Called him his sister's son;
He thought no man would ever find out
The deed that he had done.",
      "But it so fell out upon a time,
As a-hunting they did go,
That they rested them in Silver Wood,
Upon a summer day.",
      "Then out it spake that bonny boy,
While the tear stood in his eye:
'O tell me this now, Jellon Grame,
And I pray you do not lie.'",
      "'The reason that my mother dear
Does never take me home;
To keep me still in banishment
Is both a sin and shame.'",
      "'You wonder that your mother dear
Does never send for thee;
Lo, there's the place I slew thy mother,
Beneath that green oak tree.'",
      "With that the boy has bent his bow,
It was both stout and long,
And through and through him Jellon Grame
He's sent an arrow strong.",
      "'Lie you there now, Jellon Grame,
My malison go with thee;
The place my mother lies buried in
Is far too good for thee.'",
    ],
  },

  "child79": {
    title: "The Wife of Usher's Well",
    childNumber: "Child 79",
    version: "Version A (Child's English and Scottish Popular Ballads)",
    stanzas: [
      "It fell about the Martinmas,
When nights are lang and mirk,
The carlin wife's three sons came home,
And their hats were of the birch.",
      "It neither grew in syke nor ditch,
Nor yet in ony sheugh;
But at the gates o Paradise
That birk grew fair eneugh.",
      "'Blow up the fire, my maidens!
Bring water from the well!
For a' my house shall feast this night,
Since my three sons are well.'",
      "The hallow day of Yule are come,
The nights are long and dark,
And in it came her own three sons,
And their hats were of birch bark.",
      "And it grew not in the syke or ditch,
Nor in any haugh or fen;
But at the very gates of Paradise
That birch tree flourished then.",
      "'Blow up the fire now, maidens mine,
Bring water from the well;
For a' my house shall feast this night,
Since my three sons are hale and well.'",
      "And she has made to them a bed,
She's made it large and wide;
And she's ta'en her mantle her about,
Sat down at the bedside.",
      "The young cock crew in the merry morning,
And the wild fowl chirped for day;
The elder to the younger did say,
'Dear brother, we must away.'",
      "Up then crew the red, red cock,
And up and crew the gray;
The eldest to the youngest said,
'Tis time we were away.",
      "The cock he hadna crawed but once,
And clapped his wings at a',
When the youngest to the eldest said,
'Brother, we must awa.",
      "'The cock doth craw, the day doth daw,
The channerin worm doth chide;
Gin we be mist out o our place,
A sair pain we maun bide.",
      "'Fare ye weel, my mother dear!
Fareweel to barn and byre!
And fare ye weel, the bonny lass
That kindles my mother's fire!'",
    ],
  },

  "child101": {
    title: "Willie o Couglas Dale",
    childNumber: "Child 101",
    version: "Versions B and C (Kinloch Manuscripts)",
    stanzas: [
      "O Willy was as brave a lord
As ever sailed the sea,
And he has gone to the English court,
To serve for meat and fee.",
      "He had not been at the king's court
A twelvemonth and a day,
Till he longed for a sight o the king's daughter,
But one he could never see.",
      "O it fell once upon a day
To the green wood she has gone,
An Willy he has followed her,
With the clear light o the moon.",
      "He looted him low, by her did go,
Wi his hat intill his hand:
'O what's your will wi me, Sir Knight?
I pray keep your hat on.'",
      "'O I am not a knight, Madam,
Nor never thinks to be;
For I am Willy o Douglassdale,
An I serve for meat and fee.'",
      "'O I'll gang to my bower,' she says,
'An sigh baith even an morn
That ever I saw your face, Willy,
Or that ever ye was born.'",
      "But the cocks they crew, and the horns blew,
And the lions took the hill,
And Willie he gaed hame again,
To his hard task and till;
And likewise did Dame Oliphant,
To her book and her seam.",
      "Sweet Sir William of Douglas Dale,
A knight's ae son was he;
He dreamed of dear Dame Oliphant,
Lang ere he did her see.",
      "The cocks do craw, and the day does daw,
And the wild fowl bodes on hill;
The lassie she followed her Sweet William,
And let the tears down fall.",
    ],
  },

  "child108": {
    title: "Christopher White",
    childNumber: "Child 108",
    version: "Version A (Percy Folio Manuscript)",
    stanzas: [
      "As I walked forth one morning,
By one place that pleased me,
Wherein I heard a wandering wight,
Says, Christopher White is good company.",
      "I drew me nearer, and very near,
Till I was as near as near could be;
Loth I was her counsel to discern,
Because I wanted company.",
      "'Say on, say on, thou well fair maid,
Why makest thou moan so heavily?'
'All is for one wandering wight,
Is banished forth of his own country.'",
      "She loved him, and he loved her,
And they parted with grief and pain;
Silver and gold makes her heart to turn,
And makes her leave good company.",
    ],
  },

  "child118": {
    title: "Robin Hood and Guy of Gisborne",
    childNumber: "Child 118",
    version: "Version A (Percy Folio Manuscript)",
    stanzas: [
      "When shaws been sheen, and shreds full fair,
And leaves both large and long,
It is merry, walking in the fair forest,
To hear the small birds' song.",
      "'Good morrow, good fellow,' quoth Sir Guy;
'Good morrow, good fellow,' quoth he;
'Methinks by this bow thou bearest in thy hand,
A good archer thou seemst to be.'",
      "'I am wilful of my way,' quoth Sir Guy,
'And of my morning tide:'
'I'll lead thee through the wood,' quoth Robin,
'Good fellow, I'll be thy guide.'",
      "To see how these yeomen together fought
Two hours of a summer's day;
Yet neither Robin Hood nor Sir Guy
The other forced to fly away.",
      "Robin was reckless on a root,
And stumbled at that tide;
And Guy was quick and nimble withal,
And hit him o'er the left side.",
      "'Ah, dear Lady!' said Robin Hood,
'Thou art both mother and may!
I think it was never man's destiny
To die before his day.'",
    ],
  },

  "child124": {
    title: "The Jolly Pinder of Wakefield",
    childNumber: "Child 124",
    version: "Version A (Roxburghe Ballads)",
    stanzas: [
      "In Wakefield there lives a jolly pinder,
In Wakefield, all on a green.",
      "'There is neither knight nor squire,' said the pinder,
'Nor baron that is so bold,
Dare take a trespass to the town of Wakefield,
But his pledge goes to the pinfold.'",
      "All this beheld three witty young men,
'Twas Robin Hood, Scarlet, and John;
With that they spied the jolly pinder,
As he sat under a thorn.",
      "'Now turn again, turn again,' said the pinder,
'For a wrong way have you gone;
For you have forsaken the king his highway,
And made a path over the corn.'",
      "He leaned his back fast unto a thorn,
And his foot unto a stone,
And there he fought all a summer's day,
A summer's day so long.",
      "'Hold thy hand, hold thy hand,' said Robin Hood,
'And my merry men every one;
For this is one of the best pinders
That ever I tried with sword.'",
    ],
  },

  "child138": {
    title: "Robin Hood and Allen a Dale",
    childNumber: "Child 138",
    version: "Version A (Broadside, c.1685)",
    stanzas: [
      "Come listen to me, you gallants so free,
All you that love mirth for to hear,
And I will you tell of a bold outlaw,
That lived in Nottinghamshire.",
      "As Robin Hood in the forest stood,
All under the green-wood tree,
There was he ware of a brave young man,
As fine as fine might be.",
      "The youngster was clothed in scarlet red,
In scarlet fine and gay,
And he did frisk it over the plain,
And chanted a roundelay.",
      "As Robin Hood next morning stood,
Amongst the leaves so gay,
There did he espy the same young man
Come drooping along the way.",
      "The scarlet he wore the day before,
It was clean cast away;
And every step he fetched a sigh,
Alack and a well a day!",
    ],
  },

  "child157": {
    title: "Gude Wallace",
    childNumber: "Child 157",
    version: "Traditional Scottish (Kinloch MSS)",
    stanzas: [
      "Wallace bold, upon a night,
Came riding over a linn;
And he is to his lover's bower,
And tirled at the pin.",
      "'O sleep ye, or wake ye, lady?' he cried;
'Ye'll rise and let me in.'",
      "She dressed him in her own clothing,
And from her house he came;
Which made the Englishmen admire
To see such a stalwart dame!",
      "Full five-and-twenty men he slew,
Five hanged upon a grain;
On the morn he sat, wi his merry-men a',
In Lochmaben town at dine.",
    ],
  },

  "child249": {
    title: "Auld Matrons",
    childNumber: "Child 249",
    version: "Version A (Buchan's Ballads of the North of Scotland)",
    stanzas: [
      "My love she is a gentlewoman,
Has her living by the seam;
I know not how she is provided
This night for me and my foot-groom.",
      "He is gone to Annie's bower-door,
And gently tirled at the pin:
'Ye sleep, ye wake, my love Annie,
Ye'll rise and let your true-love in.'",
      "'My love Annie, my dear Annie,
I would be at your desire;
But woe betide the auld Matrons,
As she sits by the kitchen fire!'",
      "'Keep up your heart, Willie,' she said,
'Keep up your heart, dinna fear;
It's seven years, and some good more,
Since her foot did file the floor.'",
      "Willie slept but Annie waked
Till she heard their bridles ring;
Then tapped on her love's shoulder,
And said, 'Ye've slept too lang.'",
    ],
  },

  "child251": {
    title: "Lang Johnny More",
    childNumber: "Child 251",
    version: "Version A (Buchan's Ballads of the North of Scotland)",
    stanzas: [
      "There lives a man in Rynie's land,
And another in Auchindore,
But the bravest lad among them all
Was Lang Johnny More.",
      "Benachie lies very low,
The tap o Noth lies high;
For all the distance that's between,
He heard auld Johnny cry.",
      "These men they ran over hills and dales,
And over mountains high,
Till they came on to London town,
At the dawn o' the third day.",
      "And when they came to London town
The yetts were locked with bands,
And who were there but a trumpeter,
With trumpet in his hands?",
      "'There's nothing the matter,' the keeper said,
'There's nothing the matter to thee,
But a weighty Scot to strain the rope,
And the morn he must die.'",
    ],
  },

  "child253": {
    title: "Thomas o Yonderdale",
    childNumber: "Child 253",
    version: "Version A (Buchan's Ballads of the North of Scotland)",
    stanzas: [
      "Lady Maisry lives within a bower,
She never wore but what she would;
Her gowns were of the silks so fine,
Her coats stood up with bolts of gold.",
      "Many a knight there courted her,
And gentlemen of high degree,
But it was Thomas o Yonderdale
That gained the love of this lady.",
      "Now he has hunted her till her bower,
Both late at night and the midday,
But when he stole her virgin rose
No more this maid he would come nigh.",
      "One night as he lay on his bed,
In a dreary dream dreamed he
That Maisry stood by his bedside,
Upbraiding him for his inconstancy.",
      "He's called upon his little boy,
Says, 'Bring me candle, that I see;
And you must go this night, my boy,
With a letter to a gay lady.'",
    ],
  },

  "child261": {
    title: "Lady Isabel",
    childNumber: "Child 261",
    version: "Version A (Buchan's Ballads of the North of Scotland)",
    stanzas: [
      "'Twas early on a May morning
Lady Isabel combed her hair;
But little knew she, ere the morn,
She would never comb it more.",
      "'Twas early on a May morning
Lady Isabel rang the keys;
But little knew she, ere the morn,
A fey woman she was.",
      "'O will I leave the lands, mother?
Or shall I sail the sea?
Or shall I drink this woeful drink
That is prepared for me?'",
      "'Your bed is made in a better place
Than ever hers will be,
And ere you're cold into the room
You will be there with me.'",
    ],
  },

  "child270": {
    title: "The Earl of Mar's Daughter",
    childNumber: "Child 270",
    version: "Version A (Buchan's Ballads of the North of Scotland)",
    stanzas: [
      "It was in a pleasant time,
Upon a summer's day,
The noble Earl of Mar's daughter
Went forth to sport and play.",
      "As thus she did amuse herself,
Below a green oak tree,
There she saw a sprightly dove
Set on a tower so high.",
      "When day was gone, and night was come,
About the evening tide,
This lady spied a sprightly youth
Stand straight up by her side.",
      "'I am a dove the live-long day,
A sprightly youth at night;
This is to make me appear more fair
In any maiden's sight.'",
      "Then he has stayed in bower with her
For six long years and one,
Till six young sons to him she bore,
And the seventh she's brought home.",
    ],
  },

  "child275": {
    title: "Get Up and Bar the Door",
    childNumber: "Child 275",
    version: "Version A (Herd's Ancient and Modern Scottish Songs, 1776)",
    stanzas: [
      "It fell about the Martinmas time,
And a gay time it was then,
When our goodwife got puddings to make,
And she's boiled them in the pan.",
      "The wind so cold blew south and north,
And blew into the floor;
Quoth our goodman to our goodwife,
'Go out and bar the door.'",
      "They made a pact between them two,
They made it firm and sure,
That the first word whoever should speak
Should rise and bar the door.",
      "Then by there came two gentlemen,
At twelve o clock at night,
And they could neither see house nor hall,
Nor coal nor candle-light.",
      "And first they ate the white puddings,
And then they ate the black;
Though much thought the goodwife to herself,
Yet never a word she spoke.",
    ],
  },

  "child289": {
    title: "The Mermaid",
    childNumber: "Child 289",
    version: "Version A (Broadside, c.1690)",
    stanzas: [
      "As we lay musing in our beds,
So well and so warm at ease,
I thought upon those lodging-beds
Poor seamen have at seas.",
      "Last Easter day, in the morning fair,
We was not far from land,
Where we spied a mermaid on the rock,
With comb and glass in hand.",
      "The first came up the mate of our ship,
With lead and line in hand,
To sound and see how deep we was
From any rock or sand.",
      "Our gallant ship is gone to wreck,
Which was so lately trimmed;
The raging seas have sprung a leak,
And the salt water does run in.",
      "'Last night, when the moon shined bright,
My mother had sons five,
But now she may look in the salt seas
And find but one alive.'",
    ],
  },

  "child304": {
    title: "Young Ronald",
    childNumber: "Child 304",
    version: "Version A (Buchan's Ballads of the North of Scotland)",
    stanzas: [
      "Young Ronald rose up in the morning,
And called for water to wash his hands,
And he has called for his good gray horse
To ride to the far-off lands.",
      "When cocks did craw, and day did daw,
And mint in meadows sprang,
Young Ronald and his little wee boy
The way they rode along.",
      "So they rode on, and further on,
To yonder pleasant green,
And there they saw that lady fair,
In her garden alone.",
      "'King Honour is my father's name,
The morn to war must fare,
And that's to fight a proud giant,
That's wrought him much care.'",
    ],
  },

  "sharp19": {
    title: "Blow Away the Morning Dew",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "There was a farmer's son, kept sheep all on the hill,
And he walked out one May morning to see what he could kill.",
      "He looked high, he looked low, he cast an under look;
And there he saw a fair pretty maid beside the wat'ry brook.
And sing blow away the morning dew,
The dew, and the dew,
Blow away the morning dew,
How sweet the winds do blow.",
      "Cast over me my mantle fair, and pin it o'er my gown;
And if you will, take hold my hand, and I will be your own.",
      "If you come down to my father's house, which is walled all around,
You shall have a kiss from me and twenty thousand pound.",
      "He mounted on a milk-white steed and she upon another;
And then they rode along the lane like sister and like brother.",
      "As they were riding on alone, they saw some pooks of hay.
O is not this a very pretty place for girls and boys to play?",
      "But when they came to her father's gate, so nimble she popped in:
And said, there is a fool without, and here's a maid within.",
    ],
  },

  "sharp62": {
    title: "The Lark in the Morn",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "As I was a-walking one morning in the spring,
I heard a pretty damsel most sweetly to sing;
And as she was singing these words she did say,
There's no life like a ploughboy's all in the month of May.",
      "The lark in the morning she rises from her nest,
She mounts into the air with the dew round her breast;
And at night she will return to her own nest again.",
      "And when the pretty ploughboy his day's work is done,
He trips down to the meadows where the grass is all cut down;
And there with his sweetheart he'll dance and he'll sing,
And at night he will return with his lass home again.",
    ],
  },

  "sharp48": {
    title: "Searching for Lambs",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "As I went out one May morning,
One May morning betime,
I met a maid, from home had strayed
Just as the sun did shine.",
      "What makes you rise so soon, my dear,
Your journey to pursue?
Your pretty little feet they tread so sweet,
Strike off the morning dew.",
      "I'm going to feed my father's flock,
His young and tender lambs,
That over hills and over dales
Lie waiting for their dams.",
      "O stay, O stay, you handsome maid,
And rest a moment here,
For there is none but you alone
That I do love so dear.",
      "How gloriously the sun doth shine,
How pleasant is the air!
I'd rather rest on my true love's breast
Than any other where.",
      "For I am thine and thou art mine;
No man shall uncomfort thee;
We'll join our hands in wedded bands
And married we will be.",
    ],
  },

  "sharp51": {
    title: "The Sweet Primeroses",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "As I walked out one midsummer's morning
For to view the fields and to take the air,
Down by the banks of the sweet primeroses,
There I beheld a most lovely fair.",
      "I stepped up to her and thus I did say:
Why wait you here, my fair one, alone?
She said, stand off, you are deceitful,
You are deceitful and a false young man.",
      "It is you that's caused my poor heart to wander,
To give me comfort it lies all in vain;
I'll go down to some lonesome valley,
Where no man on earth shall me ever find.",
      "Where the pretty little small birds do change their voices,
And every moment blows a blust'rous wind;
There's many a dark and a cloudy morning
Turns out to be a bright and sunshiny day.",
    ],
  },

  "sharp33": {
    title: "The Seeds of Love",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "I sowed the seeds of love,
And I sowed them in the spring;
I gathered them up in the morning so soon,
While the small birds so sweetly sing.",
      "My garden was planted well
With flowers everywhere;
But I had not the liberty to choose for myself
Of the flowers that I love so dear.",
      "The gardener was standing by,
And I asked him to choose for me;
He chose for me the violet, the lily and the pink,
But those I refused all three.",
      "The violet I did not like
Because it bloomed so soon;
The lily and the pink I really overthink;
So I vowed that I'd stay till June.",
      "In June there is a red rose-bud,
And that's the flower for me;
I oftentimes have plucked that red rose-bud
Till I gained the willow tree.",
      "The willow tree will twist,
And the willow tree will twine;
I oftentimes have wished I was in that young man's arms
That once had the heart of mine.",
    ],
  },

  "sharp35": {
    title: "The Cuckoo",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "The cuckoo is a pretty bird, she singeth as she flies,
She bringeth us good tidings, she telleth us no lies;
She sucketh white flowers to make her voice clear,
And the more she cries 'cuckoo,' the summer draweth near.",
      "The cuckoo is a giddy bird, no other is as she,
She flits across the meadow and sings from every tree;
A nest she never buildeth, a vagrant doth she roam,
Her music is but sorrow: I nowhere have a home.",
      "O meeting is a pleasure and parting is a grief,
And an inconstant lover is worse than a thief;
A thief can but rob you of all that you have,
But an inconstant lover will bring you to the grave.",
    ],
  },

  "sharp25": {
    title: "The Trees They Do Grow High",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "The trees they do grow high and the leaves they do grow green,
And many a cold and wintry night my love and I have seen;
Of a cold winter's night, my love, you and I alone have been,
Whilst my bonny boy is young, but he's growing.",
      "O father, dearest father, you've done to me great wrong,
You've married me to a boy when you know he is too young;
O daughter, dearest daughter, if you wait a little while,
A lady you shall be while he's growing.",
      "We'll send him off to college for a year or two,
And then perhaps in time, my love, he will do for you;
I'll buy him white ribbons to tie around his waist,
To let the ladies know that he's married.",
      "And so early in the morning, at the dawning of the day,
They went out into the hayfield to have some sport and play;
And what they did there, she never would declare,
But she never more complained of his growing.",
      "At the age of sixteen years he was a married man,
At the age of seventeen the father of a son;
At the age of eighteen, o'er his grave the grass grew green,
Cruel death put an end to his growing.",
      "I'll make my love a shroud of the linen so fine,
And whilst I am a-weaving it the tears they do run down;
For once I had a true love, but now he lies low,
And I'll nurse his bonny babe while he's growing.",
    ],
  },

  "sharp40": {
    title: "Green Bushes",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "As I was walking one morning in May,
To hear the birds whistle and the nightingales sing,
I saw a young damsel, so sweetly sang she,
Down by the green bushes he thinks to meet me.",
      "I'll buy you fine beavers and a fine silken gown,
I'll buy you fine petticoats flounced to the ground;
If you will prove loyal and constant to me,
And forsake your own true love, I'll be married to thee.",
      "I want none of your beavers nor fine silken hose,
For I never was so poor as to marry for clothes;
But if you will prove loyal and constant to me,
I'll forsake my own true love and get married to thee.",
      "Come let us be going, kind sir, if you please,
Come let us be going from under these trees;
For yonder he's coming, my true love I see,
Down by the green bushes where he thinks to meet me.",
      "Oh when he came there and found she was gone,
He looked very foolish and cried quite forlorn;
She's gone with another and forsaken me,
So adieu to green bushes for ever, said he.",
    ],
  },

  "sharp44": {
    title: "Dabbling in the Dew",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "Oh, where are you going to, my pretty little dear,
With your red rosy cheeks and your coal black hair?
I'm going a-milking, kind sir, she answered me,
And it's dabbling in the dew makes the milkmaids fair.",
      "Oh, may I go with you, my pretty little dear,
With your red rosy cheeks and your coal black hair?
Oh, you may go with me, kind sir, she answered me,
And it's dabbling in the dew makes the milkmaids fair.",
      "If I should chance to kiss you, my pretty little dear,
With your red rosy cheeks and your coal black hair?
The wind may take it off again, kind sir, she answered me,
And it's dabbling in the dew makes the milkmaids fair.",
      "Oh say, will you marry me, my pretty little dear,
With your red rosy cheeks and your coal black hair?
Oh yes, if you please, kind sir, she answered me,
And it's dabbling in the dew makes the milkmaids fair.",
      "Oh, will you be constant, my pretty little dear,
With your red rosy cheeks and your coal black hair?
Oh, that I cannot promise you, kind sir, she answered me,
And it's dabbling in the dew makes the milkmaids fair.",
      "Then I won't marry you, my pretty little dear,
With your red rosy cheeks and your coal black hair.
Oh, nobody asked you, kind sir, she answered me,
And it's dabbling in the dew makes the milkmaids fair.",
    ],
  },

  "sharp61": {
    title: "I'm Seventeen Come Sunday",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "As I walked out on a May morning,
On a May morning so early,
I overtook a pretty fair maid
Just as the day was a-dawning.",
      "Her shoes were bright, her stockings white,
And her buckles shone like silver;
She had a dark and rolling eye,
And her hair hung down her shoulder.",
      "Where are you going, my pretty fair maid?
Where are you going, my honey?
She answered me right cheerfully,
I've an errand for my mummy.",
      "How old are you, my pretty fair maid?
How old are you, my honey?
She answered me right cheerfully,
I'm seventeen come Sunday.",
      "Will you take a man, my pretty fair maid?
Will you take a man, my honey?
She answered me right cheerfully,
I dare not for my mummy.",
      "But if you come to my mummy's house,
When the moon shines bright and clearly,
I will come down and let you in,
And my mummy shall not hear me.",
    ],
  },

  "sharp30": {
    title: "Farewell Nancy",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "Fare you well, my dearest Nancy,
For now I must leave you,
All across the salt seas
I am bound for to go;
Don't let my long absence
Trouble and grieve you,
For I shall return in the spring,
As you know.",
      "Like a pretty little sea-boy
I'll dress and go with you,
In the midst of all danger
Your help I will remain;
In the cold stormy weather,
When the winds are a-blowing,
My love, I'll be ready
To wait on you then.",
      "Your pretty little hands they can't handle our tackle,
And your delicate feet to our topmast can't go;
And the cold stormy weather, love, you can't well endure,
I would have you ashore when the stormy winds blow.",
      "So fare you well, my dearest Nancy,
Since now I must leave you,
All across the salt seas
I am bound for to go;
But wherever I wander
I'll be loyal and constant,
For I shall return in the spring,
As you know.",
    ],
  },

  "sharp23": {
    title: "The Low Low Lands of Holland",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "The very day I married,
That night I lay on my bed;
A press-gang came to my bed-side,
These words to me they said:
Arise, arise, arise young man,
And come along with me,
To the low, low lands of Holland
To face your enemy.",
      "Though money had been as plentiful
As leaves upon the tree,
Yet before I'd time to turn myself
My love was stol'n from me.",
      "I'll build my love a gallant ship,
A ship of noted fame,
With four and twenty mariners
To box her on the main;
They'll rant and roar in sparkling glee
Wheresomever they do go,
To the low, low lands of Holland,
To face the daring foe.",
      "There's not a swathe goes round my waist,
Nor a comb goes in my hair,
Neither firelight nor candlelight
Can ease my heart's despair;
And never will I married be
Until the day I die,
Since the low, low lands of Holland
Have parted my love and me.",
      "Says the mother to the daughter:
What makes you to lament?
O there are lords and dukes and squires
Can ease your heart's content.
But never will I married be
Until the day I die,
Since the low, low lands of Holland
Have parted my love and me.",
    ],
  },

  "sharp84": {
    title: "John Barleycorn",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "There were three men come out of the west
Their fortunes for to try,
And these three men made a solemn vow,
John Barleycorn should die.
They ploughed, they sowed, they harrowed him in,
Throwed clods on his head.
And these three men made a solemn vow,
John Barleycorn was dead.",
      "Then they let him lie for a very long time
Till the rain from heaven did fall,
Then little Sir John sprung up his head
And soon amazed them all.",
      "They let him stand till midsummer day
Till he looked both pale and wan.
And little Sir John he growed a long beard
And so become a man.",
      "They hired men with the scythes so sharp
To cut him off at the knee.
They rolled him and tied him by the waist,
And served him most barbarously.
They hired men with the sharp pitchforks
Who pricked him to the heart.
And the loader he served him worse than that
For he bound him to the cart.",
      "They wheeled him round and round the field
Till they came unto a barn
And there they made a solemn vow
Of poor John Barleycorn.
They hired men with the crab-tree sticks
To cut him skin from bone,
And the miller, he served him worse than that
For he ground him between two stones.",
      "Here's little Sir John in a nut-brown bowl
And brandy in a glass
And little Sir John in the nut-brown bowl
Proved the stronger man at last.
And the huntsman, he can't hunt the fox
Nor so loudly to blow his horn,
And the tinker, he can't mend kettles nor pots
Without a little of Barleycorn.",
    ],
  },

  "sharp92": {
    title: "Wassail Song",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "A-wassail, a-wassail throughout all this town,
Our cup it is white and our ale it is brown.
Our wassail is made of the good ale and true,
Some nutmeg and ginger, the best we could brew.",
      "Our wassail is made of an elderberry bough,
And so my good neighbours, we'll drink unto thou,
Besides all on earth, you have apples in store,
Pray let us come in for it's cold by the door.",
      "We hope that your apple trees prosper and bear
So that we may have cider when we call next year,
And where you have one barrel I hope you'll have ten
So that we can have cider when we call again.",
      "There's a master and a mistress sitting down by the fire,
While we poor wassailers do wait in the mire,
So you, pretty maid, with your silver-headed pin,
Please open the door and let us come in.",
      "We know by the moon that we are not too soon,
And we know by the sky that we are not too high.
We know by the stars that we are not too far,
And we know by the ground that we are within sound.",
      "Here's we jolly wassail boys growing weary and cold,
Drop a bit of silver into our old bowl,
And if we're alive for another new year,
Perhaps we may call and see who does live here.",
    ],
  },

  "sharp93": {
    title: "It's a Rosebud in June",
    version: "Cecil Sharp, One Hundred English Folksongs (1916)",
    stanzas: [
      "It's a rosebud in June, and violets in full bloom,
And the small birds singing love songs on each spray.",
      "When we have a-sheared all our jolly, jolly sheep,
What joy can be greater than to talk of their increase?",
      "With the lily-white pail filled full of brown ale,
Our table, our table is all on the green grass.",
    ],
  },

  "campbellsharp47": {
    title: "Awake! Awake!",
    version: "Olive Dame Campbell and Cecil J. Sharp, English Folk Songs from the Southern Appalachians (G.P. Putnam's Sons, 1917)",
    stanzas: [
      "Awake! Awake! You drowsy sleeper,
Awake! Awake! For it's almost day,
Why do you lie there in your slumber,
When your true-love is going away?",
      "\"Oh, who is this beneath my window,
That speaks my name so speedily?\"
\"It is your own and dear true lover,
Who wants to speak a word with you.\"",
      "\"Hush, oh hush! you'll wake my father,
Who lies on yonder bed so near;
All in his hand he holds a weapon,
To kill the one that I love dear.\"",
      "\"I won't go off and court another;
What I say, I mean no harm;
I mean to wean you from your mother,
And rest you in your true lover's arm.\"",
    ],
  },

  "campbellsharp65": {
    title: "Come All You Fair and Tender Ladies",
    version: "Olive Dame Campbell and Cecil J. Sharp, English Folk Songs from the Southern Appalachians (G.P. Putnam's Sons, 1917)",
    stanzas: [
      "Come all you fair and tender ladies,
Take warning how you court young men.
They're like a bright star on a summer's morning,
First they appear and then they're gone.",
      "They'll tell to you some loving story,
Declare to you their love is true.
Straightway they'll go and court another,
And that is the love they have for you.",
      "I wish I'd known before I courted
That love had been so hard to win;
I'd have locked my heart in a box of golden
And fastened it up with a silver pin.",
      "I wish I was a little sparrow,
That I had wings and I could fly;
I'd fly away to my false true lover
And when he'd speak I would deny.",
      "But I am not a little sparrow,
I have no wings, neither can I fly;
I'll sit down here and weep in sorrow,
And pass my troubles by and by.",
    ],
  },

  "campbellsharp72": {
    title: "Early, Early in the Spring",
    version: "Olive Dame Campbell and Cecil J. Sharp, English Folk Songs from the Southern Appalachians (G.P. Putnam's Sons, 1917)",
    stanzas: [
      "It was early, early all in a spring,
I went on board for to serve the king,
I left my dearest dearie behind,
That often told me her heart was mine.",
      "When I was sailing on the salt sea,
Still looking for an opportunity,
I sent letters for my dear,
But one answer from her I could never hear.",
      "I went down into her father's hall,
On my true love loudly I did call;
Her father answered, made this reply:
\"Your true love, young man, I must deny.\"",
      "\"Come tell me quickly what do you mean?\"
\"She has got married to a rich man for life;
I'd have you to go and choose some other wife.\"",
      "Now my curse on gold and on silver too,
And to all false lovers that won't prove true;
To all false lovers that would vows make
And marry others for riches' sake.",
      "Since all bad fortune has on me frowned,
I will sail the seas to the day I die
And topple those waves that roll mountains high.",
    ],
  },

  "campbellsharp76": {
    title: "Pretty Saro",
    version: "Olive Dame Campbell and Cecil J. Sharp, English Folk Songs from the Southern Appalachians (G.P. Putnam's Sons, 1917)",
    stanzas: [
      "Down in some lone valley in a lonesome place,
Where the wild birds do whistle and their notes do increase,
Farewell, Pretty Saro, I bid you adieu;
And I'll dream of Pretty Saro wherever I go.",
      "My love she won't have me, so I understand;
She wants a freeholder who owns house and land.
I cannot maintain her with silver and gold,
Nor buy all the fine things that a big house can hold.",
      "If I were a merchant and could write a fine hand,
I would write my love a letter that she'd understand;
I'd write it by the river where the waters o'erflow,
And I'll dream of Pretty Saro wherever I go.",
      "Well, if I were a turtle dove, had wings and could fly,
I would fly to my love's lodging and there I'd draw nigh.
And in her lily white arms all night I would lay
And watch those little winders till the dawning of day.",
    ],
  },
};

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
    spring: { bg: "#f0ebe0", ink: "#2c2416", accent: "#577144", mist: "#d4e8c2" },
    summer: { bg: "#fdf3d0", ink: "#2c2416", accent: "#9b6322", mist: "#fae89a" },
    autumn: { bg: "#f5e6cc", ink: "#2c2416", accent: "#a84e1b", mist: "#e8c998" },
    winter: { bg: "#eaf0f5", ink: "#1a2530", accent: "#447190", mist: "#c8dde8" },
  },
  afternoon: {
    spring: { bg: "#e8f0dc", ink: "#1e2d14", accent: "#4d7631", mist: "#c5dba8" },
    summer: { bg: "#fef0b0", ink: "#2a2010", accent: "#926417", mist: "#fad870" },
    autumn: { bg: "#f0dcc0", ink: "#2a1e10", accent: "#a04a18", mist: "#ddb880" },
    winter: { bg: "#dde8f0", ink: "#182230", accent: "#3a6888", mist: "#b0cede" },
  },
  evening: {
    spring: { bg: "#2a3520", ink: "#e8f0d8", accent: "#90c060", mist: "#405030" },
    summer: { bg: "#302818", ink: "#f8e8c0", accent: "#e0a040", mist: "#504028" },
    autumn: { bg: "#2e2010", ink: "#f0d8b0", accent: "#d56d25", mist: "#503020" },
    winter: { bg: "#181e28", ink: "#c8d8e8", accent: "#6090b8", mist: "#283040" },
  },
  night: {
    spring: { bg: "#121c10", ink: "#d0e8c0", accent: "#70a850", mist: "#1e2e18" },
    summer: { bg: "#181408", ink: "#f0e0a0", accent: "#c89030", mist: "#282010" },
    autumn: { bg: "#140e08", ink: "#e8c890", accent: "#b76727", mist: "#221408" },
    winter: { bg: "#080c14", ink: "#b0c8e0", accent: "#4d7dad", mist: "#101828" },
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

// Decorative glyphs per time of day — plain Unicode, not emoji
// The variation selector \uFE0E forces text rendering (no emoji colour)
const TIME_GLYPHS = {
  morning: "☀\uFE0E",
  afternoon: "◑\uFE0E",
  evening: "☽\uFE0E",
  night: "✦\uFE0E",
};

// ============================================================
//  LYRICS SCREEN COMPONENT
// ============================================================
function LyricsScreen({ entry, stanzaIndex, onClose }) {
  const highlightRef = React.useRef(null);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, []);

  return (
    <div className="lyrics-overlay">
      <button className="lyrics-close" onClick={onClose}>X</button>
      <div className="lyrics-title-block">
        <div className="lyrics-title">{entry.title}</div>
        <div className="lyrics-meta">{entry.childNumber} · {entry.version}</div>
      </div>
      <div className="lyrics-rule">
        <div className="rule-line" />
        <div className="rule-diamond" />
        <div className="rule-line" />
      </div>
      <div className="lyrics-body">
        {entry.stanzas.map((stanza, i) => {
          const isHighlight = i === stanzaIndex;
          return (
            <p
              key={i}
              ref={isHighlight ? highlightRef : null}
              className={isHighlight ? "lyrics-stanza lyrics-stanza--highlight" : "lyrics-stanza"}
            >
              {stanza.split("\n").map((line, j) => (
                <span key={j}>{line}{j < stanza.split("\n").length - 1 && <br />}</span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
//  MAIN COMPONENT
// ============================================================
export default function FolkClock() {
  const [now, setNow] = useState(new Date());
  const [quote, setQuote] = useState(null);
  const [lastQuote, setLastQuote] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const [devTime, setDevTime] = useState(getTimeOfDay(new Date().getHours()));
  const [devSeason, setDevSeason] = useState(getSeason(new Date().getMonth()));
  const [devSearch, setDevSearch] = useState("");
  const [pinnedQuote, setPinnedQuote] = useState(null);

  // Ensure viewport-fit=cover so iOS respects safe-area-inset env() vars
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && !meta.content.includes("viewport-fit")) {
      meta.content += ", viewport-fit=cover";
    }
  }, []);

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
        setShowLyrics(false);
        setPinnedQuote(null);
        setDevSearch("");
      }
    },
    [pool]
  );

  // Initial pick
  useEffect(() => {
    refresh(null);
  }, []);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const next = new Date(now);
    const mins = next.getMinutes();
    const minsUntilNext = 15 - (mins % 15);
    next.setMinutes(next.getMinutes() + minsUntilNext, 0, 0);
    const ms = next - now;
    const t = setTimeout(() => {
      setNow(new Date());
      refresh(null);
    }, ms);
    return () => clearTimeout(t);
  }, [now]);

  // Re-pick when time slot changes
  useEffect(() => {
    if (quote) refresh(null);
  }, [timeOfDay, season]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowInfo(false);
        setShowLyrics(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!quote) return null;

  const displayQuote = pinnedQuote || quote;

  const devSearchResults = DEV_MODE && devSearch.trim().length >= 2
    ? QUOTES.filter((q) =>
        q.source.toLowerCase().includes(devSearch.toLowerCase()) ||
        q.text.toLowerCase().includes(devSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Lato:ital,wght@0,400;0,700;1,400&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      height: 100%;
      /* Extend background into safe-area gutters on iOS */
      background: ${theme.bg};
    }

    body {
      background: ${theme.bg};
      transition: background 1.2s ease;
    }

    .folk-root {
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      /* Respect iOS safe-area insets in landscape */
      padding: 1.75rem max(1.5rem, env(safe-area-inset-right)) 1.75rem max(1.5rem, env(safe-area-inset-left));
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
      max-width: 720px;
      margin: 0 auto;
      overflow-y: auto;
      padding: 0.25rem 0;
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
      font-size: clamp(1.15rem, 4.5vw, 1.9rem);
      line-height: 1.85;
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

    /* Attribution as link */
    .attribution-link {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 1.125rem;
      letter-spacing: 0.08em;
      color: ${theme.ink};
      opacity: 0.6;
      font-style: normal;
      text-decoration: underline;
      text-decoration-color: ${theme.accent};
      text-underline-offset: 3px;
      transition: opacity 0.2s;
    }
    .attribution-link:hover { opacity: 1; }

    /* Lyrics overlay — fades in */
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .lyrics-overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg};
      z-index: 10;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.2s ease;
      overflow: hidden;
    }


    .lyrics-close {
      position: fixed;
      top: 1.75rem;
      right: 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-family: 'IM Fell English SC', serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: ${theme.ink};
      opacity: 0.5;
      padding: 0.25rem 0.5rem;
      transition: opacity 0.2s;
      text-transform: uppercase;
      z-index: 20;
    }
    .lyrics-close:hover { opacity: 1; }

    .lyrics-rule {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      opacity: 0.3;
      flex-shrink: 0;
      padding: 0.6rem clamp(1.5rem, 8vw, 90px) 0 clamp(1.5rem, 8vw, 90px);
    }

    .lyrics-title-block {
      flex-shrink: 0;
      padding: 1.75rem clamp(1.5rem, 8vw, 90px) 0 clamp(1.5rem, 8vw, 90px);
    }

    .lyrics-title {
      font-family: 'IM Fell English', serif;
      font-size: clamp(1.3rem, 5vw, 1.9rem);
      letter-spacing: 0.02em;
      color: ${theme.ink};
      margin-bottom: 0.2rem;
    }

    .lyrics-meta {
      font-family: 'Lato', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.02em;
      opacity: 0.55;
      margin-top: 0.15rem;
    }

    .lyrics-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem clamp(1.5rem, 8vw, 90px) 2rem clamp(1.5rem, 8vw, 90px);
      -webkit-overflow-scrolling: touch;
    }

    .lyrics-stanza {
      font-size: clamp(0.9rem, 3vw, 1.05rem);
      line-height: 1.9;
      margin-bottom: 2.8rem;
      color: ${theme.ink};
      opacity: 0.45;
      transition: opacity 0.3s;
      font-family: 'Lato', sans-serif;
      font-weight: 400;
    }

    .lyrics-stanza--highlight {
      opacity: 1;
      font-weight: 700;
    }
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
      font-family: 'Lato', sans-serif;
    }
    .info-body p + p { margin-top: 1.5rem; }
    .info-body ul {
      padding-left: 1.2rem;
      margin: 0.5rem 0 1.5rem;
    }
    .info-body li { margin-bottom: 0.75rem; }

    .overlay-body .lyrics-rule {
      padding-left: 0;
      padding-right: 0;
      margin-bottom: 0.75rem;
    }

    /* Info overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: ${theme.bg};
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease;
      overflow: hidden;
    }

    .overlay-body {
      overflow-y: auto;
      padding: 1.75rem clamp(1.5rem, 8vw, 90px) 2rem clamp(1.5rem, 8vw, 90px);
      max-width: 720px;
      width: 100%;
      -webkit-overflow-scrolling: touch;
    }

    .info-title {
      font-family: 'IM Fell English', serif;
      font-size: clamp(1.3rem, 5vw, 1.9rem);
      letter-spacing: 0.02em;
      color: ${theme.ink};
      margin-bottom: 0.75rem;
    }

    /* Dev panel */
    .dev-bar {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 20;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: ${theme.bg};
      border: 1px solid ${theme.accent};
      padding: 0.5rem 0.75rem;
      opacity: 0.85;
      min-width: 280px;
    }
    .dev-bar:hover { opacity: 1; }

    .dev-bar-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .dev-search-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      border-top: 1px solid ${theme.accent}44;
      padding-top: 0.35rem;
    }

    .dev-bar label {
      font-family: 'IM Fell English SC', serif;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: ${theme.ink};
      opacity: 0.6;
      text-transform: uppercase;
      flex-shrink: 0;
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

    .dev-search-input {
      background: none;
      border: none;
      border-bottom: 1px solid ${theme.accent}66;
      font-family: 'IM Fell English', serif;
      font-size: 0.7rem;
      color: ${theme.ink};
      padding: 0.1rem 0.2rem;
      flex: 1;
      outline: none;
      min-width: 0;
    }
    .dev-search-input::placeholder { opacity: 0.35; }

    .dev-pin-clear {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.65rem;
      color: ${theme.accent};
      opacity: 0.7;
      padding: 0;
      flex-shrink: 0;
    }
    .dev-pin-clear:hover { opacity: 1; }

    .dev-results {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      border-top: 1px solid ${theme.accent}44;
      padding-top: 0.35rem;
      max-height: 220px;
      overflow-y: auto;
    }

    .dev-result-item {
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      padding: 0.25rem 0.3rem;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      border-radius: 2px;
      transition: background 0.15s;
    }
    .dev-result-item:hover { background: ${theme.accent}22; }

    .dev-result-source {
      font-family: 'IM Fell English SC', serif;
      font-size: 0.63rem;
      letter-spacing: 0.06em;
      color: ${theme.accent};
    }

    .dev-result-preview {
      font-family: 'IM Fell English', serif;
      font-size: 0.67rem;
      color: ${theme.ink};
      opacity: 0.6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
              {displayQuote.text.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < displayQuote.text.split("\n").length - 1 && <br />}
                </span>
              ))}
            </blockquote>
            <p className="attribution">
              {displayQuote.lyricsKey && LYRICS[displayQuote.lyricsKey]
                ? <button className="attribution-link" onClick={() => setShowLyrics(true)}>— {displayQuote.source}</button>
                : <>— {displayQuote.source}</>
              }
            </p>
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
          <div className="overlay">
            <button className="lyrics-close" onClick={() => setShowInfo(false)}>X</button>
            <div className="overlay-body">
              <div className="info-title">About This Collection</div>
              <div className="lyrics-rule">
                <div className="rule-line" />
                <div className="rule-diamond" />
                <div className="rule-line" />
              </div>
              <div className="info-body">
                <p>These verses are drawn from several collections:</p>
                <ul>
                  <li>
                    <strong>The Child Ballads</strong>—305 traditional English and Scottish folk songs
                    collected by Francis James Child between 1882 and 1898. They are among the oldest
                    surviving songs in the English language.
                  </li>
                  <li>
                    <strong>One Hundred English Folksongs</strong>—100 traditional English folk songs
                    collected by Cecil Sharp from roughly 1903–1913 and published in 1916. Sharp gathered
                    them from singers across rural England in the early twentieth century, at a time when
                    many of these songs were on the verge of being forgotten.
                  </li>
                </ul>
                <p>
                  Each verse is chosen to match the time of day and season where you are.
                  The words have been lightly modernised where needed.
                </p>
                <p>
                  The verses are beautiful enough on their own, but they are meant to be sung.
                  Find recordings, listen to them, learn them, and sing them!
                </p>
                <p>
                  A new verse appears every 15 minutes, or press "Another" whenever you like.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lyrics overlay */}
        {showLyrics && displayQuote.lyricsKey && LYRICS[displayQuote.lyricsKey] && (
          <LyricsScreen
            entry={LYRICS[displayQuote.lyricsKey]}
            stanzaIndex={displayQuote.stanzaIndex}
            onClose={() => setShowLyrics(false)}
          />
        )}
        {DEV_MODE && (
          <div className="dev-bar">
            <div className="dev-bar-row">
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
            <div className="dev-search-row">
              <label>Find</label>
              <input
                className="dev-search-input"
                type="text"
                value={devSearch}
                onChange={(e) => { setDevSearch(e.target.value); setPinnedQuote(null); setShowLyrics(false); }}
                placeholder="source or text…"
                spellCheck={false}
              />
              {pinnedQuote && (
                <button className="dev-pin-clear" onClick={() => { setPinnedQuote(null); setDevSearch(""); setShowLyrics(false); }}>✕</button>
              )}
            </div>
            {devSearchResults.length > 0 && (
              <div className="dev-results">
                {devSearchResults.map((q, i) => (
                  <button
                    key={i}
                    className="dev-result-item"
                    onClick={() => {
                      setPinnedQuote(q);
                      setFadeKey((k) => k + 1);
                      setShowLyrics(false);
                      setDevSearch(q.source);
                    }}
                  >
                    <span className="dev-result-source">{q.source}</span>
                    <span className="dev-result-preview">{q.text.split("\n")[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
