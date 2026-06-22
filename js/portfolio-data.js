/* ===========================================================
   EDITKARO.IN — PORTFOLIO DATA
   Placeholder client work. No real client footage was supplied
   with the project brief, so every entry below is a stand-in:
   a placeholder thumbnail (Lorem Picsum), a fictional client
   name, and a one-line description.

   TO GO LIVE: replace `thumb` with a real exported frame/poster
   image from the actual edit, and add a `videoUrl` field (a
   hosted MP4, or a YouTube/Vimeo embed URL) — then update
   js/main.js openModal() to render a <video> or <iframe>
   instead of the placeholder note.
   =========================================================== */

const PORTFOLIO_CATEGORIES = [
  { id: 'short-form',     label: 'Short Form' },
  { id: 'long-form',      label: 'Long Form' },
  { id: 'gaming',         label: 'Gaming Videos' },
  { id: 'football',       label: 'Football Edits' },
  { id: 'ecommerce',      label: 'eCommerce Ads' },
  { id: 'documentary',    label: 'Documentary Style' },
  { id: 'color-grading',  label: 'Color Grading' },
  { id: 'anime',          label: 'Anime Videos' },
  { id: 'ads',            label: 'Ads' },
];

const PORTFOLIO_ITEMS = [
  // Short Form
  { id:'sf1', category:'short-form', title:'7-Second Hook Reel', client:'Kettle & Co.', duration:'0:24', seed:'sf1', blurb:'A whiplash-paced Reel built around a single visual hook, recut for IG and Shorts.' },
  { id:'sf2', category:'short-form', title:'Behind The Counter', client:'ChaiTime Co.', duration:'0:31', seed:'sf2', blurb:'Day-in-the-life micro-vlog edited for vertical sound-off viewing.' },
  { id:'sf3', category:'short-form', title:'3 Tips In 15 Seconds', client:'NimbusWear', duration:'0:15', seed:'sf3', blurb:'Text-on-screen tip format with snap-cut pacing for maximum completion rate.' },

  // Long Form
  { id:'lf1', category:'long-form', title:'Studio Tour: Full Walkthrough', client:'Foxglove Films', duration:'14:02', seed:'lf1', blurb:'A long-form YouTube edit with chapter markers, lower-thirds, and a paced narrative arc.' },
  { id:'lf2', category:'long-form', title:'The Sourcing Trip', client:'PureLeaf Organics', duration:'9:48', seed:'lf2', blurb:'Travel-documentary-style brand story cut for retention across a 10-minute runtime.' },
  { id:'lf3', category:'long-form', title:'Founder Q&A, Unedited No More', client:'TrueNorth Outdoors', duration:'21:15', seed:'lf3', blurb:'A raw two-hour interview cut down to its sharpest 21 minutes.' },

  // Gaming
  { id:'gm1', category:'gaming', title:'Clutch Round Montage', client:'RallyPoint Esports', duration:'1:48', seed:'gm1', blurb:'Frame-accurate kill-cam sync with beat-matched sound design.' },
  { id:'gm2', category:'gaming', title:'Patch Notes, Explained', client:'ArcadeNight', duration:'4:20', seed:'gm2', blurb:'Motion-graphics-heavy explainer edit for a weekly patch breakdown series.' },
  { id:'gm3', category:'gaming', title:'48-Hour Stream Recap', client:'BlazeReel Gaming', duration:'3:02', seed:'gm3', blurb:'Highlight reel pulled from two days of stream VOD, recut for a Sunday upload.' },

  // Football
  { id:'fb1', category:'football', title:'Matchday Recap', client:'Northside FC', duration:'2:10', seed:'fb1', blurb:'Goal-by-goal recap edit with broadcast-style graphics package.' },
  { id:'fb2', category:'football', title:'Transfer Window Hype Cut', client:'SwiftKick United', duration:'0:42', seed:'fb2', blurb:'Announcement teaser built to drop the moment the deal was confirmed.' },
  { id:'fb3', category:'football', title:'Tunnel To Final Whistle', client:'GoalLine Daily', duration:'5:55', seed:'fb3', blurb:'Access-all-areas matchday story, synced to crowd audio throughout.' },

  // eCommerce
  { id:'ec1', category:'ecommerce', title:'Unboxing-Style Product Ad', client:'BrightCart', duration:'0:28', seed:'ec1', blurb:'Conversion-focused product cut with on-screen price and CTA overlay.' },
  { id:'ec2', category:'ecommerce', title:'Seasonal Sale Countdown', client:'CartGlow eCommerce', duration:'0:20', seed:'ec2', blurb:'Urgency-driven ad variant A/B tested across three hook openings.' },
  { id:'ec3', category:'ecommerce', title:'Customer Review Compilation', client:'QuickServe Foods', duration:'0:55', seed:'ec3', blurb:'UGC stitched into a single trust-building product story.' },

  // Documentary Style
  { id:'doc1', category:'documentary', title:'The Maker\'s Hands', client:'Saffron & Slate', duration:'8:12', seed:'doc1', blurb:'Slow, observational brand film shot and cut to let the craft speak.' },
  { id:'doc2', category:'documentary', title:'Twelve Years In', client:'RiverBend Docs', duration:'11:40', seed:'doc2', blurb:'Founder-story documentary edit, structured around three turning points.' },
  { id:'doc3', category:'documentary', title:'Where The Harvest Goes', client:'HarvestTable', duration:'6:36', seed:'doc3', blurb:'Field-to-table mini-doc with a restrained, natural-sound-led edit.' },

  // Color Grading
  { id:'cg1', category:'color-grading', title:'Teal & Amber Pass', client:'ColorBloom Studio', duration:'2:05', seed:'cg1', blurb:'Full grading pass on a music-driven brand reel — exposure, skin tones, and a custom LUT build.' },
  { id:'cg2', category:'color-grading', title:'Flat-Log To Filmic', client:'GoldenHour Grading', duration:'3:40', seed:'cg2', blurb:'Log footage graded to a warm filmic look with matched day-for-night shots.' },
  { id:'cg3', category:'color-grading', title:'Consistent Look Across 40 Clips', client:'FrameForge', duration:'5:00', seed:'cg3', blurb:'Batch-graded multi-camera shoot for a single, consistent on-screen look.' },

  // Anime
  { id:'an1', category:'anime', title:'Opening-Style AMV Cut', client:'ShogunVerse', duration:'1:32', seed:'an1', blurb:'Beat-synced AMV edit referencing classic anime OP pacing and typography.' },
  { id:'an2', category:'anime', title:'Fan Edit: Arc Recap', client:'MidnightArc', duration:'4:48', seed:'an2', blurb:'Story-recap fan edit with subtitle styling and motion-typography callouts.' },
  { id:'an3', category:'anime', title:'Character Tribute Reel', client:'AfterDark Anime', duration:'2:20', seed:'an3', blurb:'Slow-motion tribute cut layered with custom motion graphics overlays.' },

  // Ads
  { id:'ad1', category:'ads', title:'15-Second Paid Social Ad', client:'TapToWin', duration:'0:15', seed:'ad1', blurb:'Platform-native paid ad, three hook variants delivered for testing.' },
  { id:'ad2', category:'ads', title:'Performance Creative Refresh', client:'PrimeServe Ads', duration:'0:30', seed:'ad2', blurb:'Refresh of a fatigued ad creative with a new opening hook and CTA card.' },
  { id:'ad3', category:'ads', title:'Brand Awareness Bumper', client:'VelvetCut Ads', duration:'0:06', seed:'ad3', blurb:'A six-second unskippable bumper built around a single brand beat.' },
];

function thumbUrl(seed, w, h){
  return `https://picsum.photos/seed/editkaro-${seed}/${w}/${h}`;
}
