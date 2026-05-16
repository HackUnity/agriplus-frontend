import type { FarmingPlan, PlanPhase, Project } from "@/types/app.types";

export const demoProjects: Project[] = [
  {
    id: "demo-project",
    name: "Beginner Vegetable Garden",
    location: "Kurunegala, Sri Lanka",
    goal: "Grow food for home and learn basics",
    area: "0.25 acres",
    status: "ready",
    nextAction: "Review this week's soil preparation steps",
    updatedAt: "Today",
  },
  {
    id: "market-greens",
    name: "Market Greens Trial",
    location: "Kandy, Sri Lanka",
    goal: "Small income from fast-growing leafy crops",
    area: "600 sq ft",
    status: "onboarding",
    nextAction: "Finish land and water details",
    updatedAt: "Yesterday",
  },
  {
    id: "home-herbs-2025",
    name: "Home Herb Patch 2025",
    location: "Gampaha, Sri Lanka",
    goal: "Year-round kitchen herbs for family use",
    area: "120 sq ft",
    status: "completed",
    nextAction: "Review harvest notes and plan next season",
    updatedAt: "2 weeks ago",
  },
  {
    id: "rainfed-beans",
    name: "Rainfed Bean Plot",
    location: "Anuradhapura, Sri Lanka",
    goal: "Dry-zone legume trial with minimal irrigation",
    area: "0.1 acres",
    status: "completed",
    nextAction: "Archive season summary and rotate crop zone",
    updatedAt: "Last month",
  },
];

export const demoPlanPhases: PlanPhase[] = [
  {
    name: "Phase 1: Pre-Cultivation",
    substages: [
      {
        step_number: 1,
        title: "Conduct Home Soil pH and Drainage Test",
        description:
          "Purchase a basic soil pH test kit (garden store, ~$8-10) or use the vinegar-and-baking-soda home method. Mix a handful of soil with water into a paste, dip a strip, and record the pH. Also dig a 30 cm deep hole, fill it with water, and time how long it takes to drain completely. Sandy soil should drain in under 1 hour. Record results for later amendment planning.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 2,
        title: "Mark Out 1,000 sqft Garden Plot",
        description:
          "Using string, stakes, and a tape measure, mark a 10m × 10m square (or 9m × 11m to fit the area) on the chosen flat or gently sloped spot closest to the water source. Ensure the long sides run perpendicular to the slope direction to reduce runoff across the plot. Drive corner stakes firmly into the ground and tie string at 30 cm height.",
        estimated_days: 1,
        requires_physical_action_image: true,
        image_prompt_context:
          "Aerial top-down view of a 10m by 10m square garden plot marked with white string and wooden stakes on slightly sloped ground.",
      },
      {
        step_number: 3,
        title: "Clear Surface Vegetation and Rocks",
        description:
          "Hand-pull all grass, weeds, and surface vegetation within the staked plot. Use a digging hoe or large flat blade to skim off the top 5 cm of sod. Remove rocks and root clumps. This step prevents competition with the new crops and reduces pest habitat. Work in 1m-wide strips, clearing the entire plot area within 2 hours across 2 sessions.",
        estimated_days: 2,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 4,
        title: "Dig and Break Up Subsoil in Beds",
        description:
          "With a spade or broadfork, turn the soil to a depth of 30 cm. Sandy soil compacts less than clay but benefits from breaking up any hardpan below 20 cm. Mix the top 20 cm thoroughly as you dig. Avoid walking on the bed areas once dug — stay on pathways. Create 4 rows (80 cm wide, 10-15 cm tall raised beds) running lengthwise across the plot, with 50 cm pathways between them.",
        estimated_days: 7,
        requires_physical_action_image: true,
        image_prompt_context:
          "Side cross-section diagram of a raised bed garden row, 80 cm wide and 15 cm tall, built on sandy soil.",
      },
      {
        step_number: 5,
        title: "Apply Organic Amendments for Sandy Soil Moisture Retention",
        description:
          "Spread a 5 cm layer of mature compost or well-rotted manure over each raised bed row. Additionally apply coconut coir or peat moss (one 2kg bale is sufficient for 10 sqm) at 2-3 cm depth on the bed surface. Sandy soil loses water rapidly — compost and coir dramatically increase the water-holding capacity of sandy beds. Work amendments into the top 15 cm of soil using a rake.",
        estimated_days: 3,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 6,
        title: "Set Up Basic Drip Irrigation from Tap or Well",
        description:
          "Connect a 19mm main feeder hose from the tap/well to the plot edge. Install a simple timer valve (battery-operated, ~$12 at hardware store) set to water early morning (before 8 AM). Run 13mm drip tape along each of the 4 raised beds. Poke holes at 20 cm intervals. Test the system: run for 15 minutes and check that each bed has even moisture.",
        estimated_days: 2,
        requires_physical_action_image: true,
        image_prompt_context:
          "Garden layout showing a 10m by 10m plot with 4 raised beds running horizontally connected to a drip irrigation system.",
      },
      {
        step_number: 7,
        title: "Install Low-Cost Border and Erosion Control",
        description:
          "Place flat stones, bricks, or thick wooden boards along the outer edges of the plot boundary to define the garden edge and slow surface runoff. On the downhill side of the plot, dig a shallow 20 cm wide, 10 cm deep drainage channel and pile the soil inward toward the beds. Place a length of old wooden beam or heavy branch along this channel as a simple diversion berm.",
        estimated_days: 2,
        requires_physical_action_image: true,
        image_prompt_context:
          "Side elevation view of a sloped garden plot showing the downhill edge with a shallow V-shaped drainage channel running along the outer boundary.",
      },
    ],
  },
  {
    name: "Phase 2: Sowing & Germination",
    substages: [
      {
        step_number: 1,
        title: "Select and Acquire Corn and Carrot Seed Varieties",
        description:
          "Purchase short-season, compact varieties suitable for a small plot: corn — 'Golden Bantam', 'Early Sunglow', or 'Painted Mountain' (60-75 days to harvest, ~1.5m tall, suitable for 1,000 sqft); carrot — 'Scarlet Nantes', 'Little Finger', or 'Danvers 126' (65-75 days, tolerant of sandy soil). Buy from a local nursery or agricultural co-op. Store seeds in a cool, dry place until sowing day.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 2,
        title: "Pre-Soak Corn Seeds Before Planting",
        description:
          "The evening before sowing, place corn seeds in a shallow dish of lukewarm water. Do not fully submerge — add just enough water to half-cover the seeds. Leave for 8-12 hours at room temperature. This softens the hard seed coat and accelerates germination by 2-3 days. Drain and plant immediately the next morning. Do not soak carrot seeds — they are too small and become difficult to handle.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 3,
        title: "Sow Corn in Block Configuration Along Outer Beds",
        description:
          "Sow pre-soaked corn seeds in beds 1 and 4 (the outermost raised beds) to act as a wind-pollination screen for the plot and a visual border. Create a shallow trench 2.5 cm deep with a finger or stick. Place 1 seed every 25 cm within the row. Corn must be planted in a block of at least 4 rows for successful pollination — in the 1,000 sqft plot, 4 rows of 20 corn plants each (80 plants total) is ideal.",
        estimated_days: 2,
        requires_physical_action_image: true,
        image_prompt_context:
          "Close-up overhead view of a 4-row corn block planting pattern with seeds at 25 cm spacing.",
      },
      {
        step_number: 4,
        title: "Sow Carrot Seeds in Middle Beds in Narrow Bands",
        description:
          "In beds 2 and 3, sow carrot seeds in two 15 cm wide bands running the length of each bed. Scatter seeds thinly (roughly 1 seed per 2 cm) in the band, then rake the surface very lightly to barely cover them (carrot seeds need light to germinate — no more than 3mm of soil). Tamp the soil surface gently with a board or your hand to ensure good seed-to-soil contact.",
        estimated_days: 2,
        requires_physical_action_image: true,
        image_prompt_context:
          "Close-up view of two parallel raised beds showing carrot seed sowing in 15 cm wide bands.",
      },
      {
        step_number: 5,
        title: "Apply Mulch to Beds and Set Up Shade Cloth for Early Germination",
        description:
          "Apply a 5 cm layer of straw mulch (or dried grass clippings, free from seeds) over both carrot bands immediately after sowing. Leave a 5 cm gap around corn seed positions. Mulch reduces moisture loss from the sandy soil surface by up to 70%, critical for carrot germination and sandy soil water retention.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 6,
        title: "Install Simple Monitoring Markers and Daily Check Routine",
        description:
          "Place small labeled markers at 5 randomly chosen corn seed positions to track emergence. Place one marker at each end of the carrot bands. Establish a 15-minute daily morning check: (1) visually inspect soil moisture under the mulch at the carrot bands, (2) check for surface crusting and break it gently with a fork if present, (3) verify the drip timer has run and the soil surface is moist.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
    ],
  },
  {
    name: "Phase 3: Active Growth & Field Management",
    substages: [
      {
        step_number: 1,
        title: "Monitor Germination and Fill Gaps in Both Crops",
        description:
          "Check seed markers every 2 days. Corn seedlings should emerge within 5-10 days after the pre-soak. If any 30 cm section of a corn row has no seedling, re-sow immediately with a pre-soaked seed. Carrot germination is highly uneven in sandy soil — do not be alarmed. Thin the band only once seedlings are 5 cm tall. Use scissors to snip off the weakest seedlings at soil level rather than pulling, to avoid disturbing neighboring roots.",
        estimated_days: 14,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 2,
        title: "Establish Consistent Irrigation Schedule for Sandy Soil",
        description:
          "With sandy soil draining rapidly, switch the drip timer to water for 20 minutes every 48 hours during cool weeks and every 24 hours during heat waves (temperatures above 28°C). Sandy soil irrigation rule: water more frequently, not more volume. Check soil moisture by feel — insert a finger 5 cm deep between plants. If it feels dry at 3 cm, trigger an extra manual watering cycle.",
        estimated_days: 30,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 3,
        title: "Conduct First Organic Fertilizer Application at 21 Days",
        description:
          "At 3 weeks after sowing, apply a side-dressing of balanced organic fertilizer to both crops. For carrots: apply 2 tablespoons per square meter of bone meal (phosphorus for root development). For corn: apply 2 tablespoons per square meter of blood meal or well-rotted chicken manure (nitrogen for rapid stalk growth) in a band 10 cm from the corn stalks, then water in immediately.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 4,
        title: "Begin Thinning and Weeding Program — 4 Weekly Sessions",
        description:
          "Each week, dedicate one 30-minute session to maintenance across the entire plot: (1) Thin carrot seedlings to 5 cm apart using scissors, cutting at soil level; (2) Hand-weed all 4 beds and pathways, removing weeds before they set seed; (3) Inspect the border drainage channel and clear any debris washed in from the slope.",
        estimated_days: 7,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 5,
        title: "Earth Up Corn Stalks at 30 Days",
        description:
          "When corn stalks are 30 cm tall, use a hoe to pull 5 cm of loose sandy soil from the pathways up against each corn stalk base. This process (called hilling up) provides structural support, covers shallow brace roots emerging from the lower stalk, and increases the corn plant's wind stability. Takes approximately 20 minutes for 80 corn plants.",
        estimated_days: 1,
        requires_physical_action_image: true,
        image_prompt_context:
          "Side view of a 30 cm tall corn plant showing hilling-up technique with soil mounded around the stalk base.",
      },
      {
        step_number: 6,
        title: "Apply Second Fertilizer Application and Foliar Spray",
        description:
          "At 45 days after sowing, apply a second nitrogen side-dressing to corn using blood meal or compost tea. Simultaneously apply a diluted liquid seaweed extract foliar spray to both corn and carrots (2 tablespoons per litre of water, sprayed on leaf undersides in early morning) to supply micronutrients — particularly potassium and boron which are often deficient in sandy soils.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 7,
        title: "Monitor for Pests and Act Immediately if Found",
        description:
          "At the 1,000 sqft scale, pest monitoring takes only 10 minutes per week. Check weekly: (1) Corn — look for bore holes or frass near corn stalk nodes; (2) Carrots — look for carrot rust fly (orange tunnels on root surface). If detected, cover carrot bands with fine floating row cover immediately; (3) General — look for aphids on the undersides of corn silk.",
        estimated_days: 7,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 8,
        title: "Final Pre-Harvest Inspection and Assessment",
        description:
          "At day 60 for corn and day 65 for carrots, conduct a pre-harvest assessment. Check: (1) Corn ears — silk should be brown and dry, ears should feel firm when squeezed from the outside; (2) Carrots — gently brush aside soil at one band end to expose the root shoulder — if visible and 2cm+ diameter, they are close to harvest. Stop irrigation to carrots 5 days before harvest to improve sweetness and storage quality.",
        estimated_days: 5,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
    ],
  },
  {
    name: "Phase 4: Harvesting & Post-Harvest Operations",
    substages: [
      {
        step_number: 1,
        title: "Harvest Carrots in Bands, Root-by-Root",
        description:
          "Harvest carrots once they have reached minimum 2cm shoulder diameter (typically 65-80 days from sowing). Loosen the soil along the carrot band with a garden fork pushed 15 cm deep, then gently pull each carrot by the foliage top. Sort carrots into three categories: (1) Large, straight carrots for immediate kitchen use; (2) Smaller or oddly shaped carrots for cooking or juicing; (3) Any damaged carrots for compost.",
        estimated_days: 3,
        requires_physical_action_image: true,
        image_prompt_context:
          "Overhead view of a person kneeling beside a raised carrot bed harvesting, pulling bright orange carrots from loose sandy soil.",
      },
      {
        step_number: 2,
        title: "Harvest Corn at Peak Freshness — Milky Stage",
        description:
          "Harvest corn ears at the milky stage, typically 20-25 days after silking (or day 70-85 from sowing). Indicators: (1) Silks are completely brown and dry; (2) Husk feels tight and firm; (3) Press a thumbnail into a kernel — white milky liquid should exude. Pull each ear downward with a twisting motion. Harvest in the early morning for maximum sugar content. Process within 2 hours of harvest.",
        estimated_days: 2,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 3,
        title: "Clean, Cure, and Store Fresh Produce",
        description:
          "For carrots: remove foliage by twisting off the top 3 cm (do not cut the root top — this causes rot). Brush off loose soil but do not wash until use. Store in layers separated by slightly damp sand or newspaper in a covered box. For corn: shuck ears immediately, remove silks, and either (a) cook and eat fresh within 2 days, (b) blanch in boiling water for 4 minutes and freeze, or (c) dehydrate corn kernels in a low-oven for long-term storage.",
        estimated_days: 2,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 4,
        title: "Clean Tools and Plot Infrastructure",
        description:
          "After harvest, remove all stakes, string, and any remaining plant material from the plot. Wash all tools (trowel, fork, scissors, hoe) with water, dry immediately with a cloth, and apply a light coating of vegetable oil to metal surfaces to prevent rust. Store tools hanging or in a dry box. Flush the drip irrigation lines with clean water and disconnect the timer.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 5,
        title: "Plant Cover Crop on Beds for Off-Season Soil Protection",
        description:
          "Immediately after the main harvest, seed the 4 raised beds with a quick-growing cover crop: sow crimson clover or annual rye grass (both available from co-ops, ~$5/packet). These establish in 3-4 weeks, hold the sandy soil in place during the off-season, fix nitrogen back into the beds, and suppress weed growth. If the next season is 8+ weeks away, the cover crop can be turned into the soil as green manure.",
        estimated_days: 1,
        requires_physical_action_image: true,
        image_prompt_context:
          "Four raised beds on a sloped plot, each densely planted with cover crops — crimson clover and annual rye grass.",
      },
      {
        step_number: 6,
        title: "Record Season Data for Next Year Planning",
        description:
          "Spend 30 minutes writing a simple season record: (1) sowing dates and germination rate for each crop; (2) fertilizer application dates and types; (3) weather observations — number of heat wave days and dry spells; (4) which carrot variety performed best in the sandy soil; (5) problems encountered (pests, irrigation issues, erosion); (6) yield estimate — kg of carrots and number of corn ears harvested.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
      {
        step_number: 7,
        title: "Plan Next Season Crop Rotation",
        description:
          "Based on the season record, plan a 3-bed rotation for the next planting: do NOT plant corn in the same beds consecutively (pest and disease carryover). Recommended next-season arrangement: Bed 1 (corn this season) — rotate to carrots next season; Bed 2 (carrots this season) — rotate to corn or a legume crop (beans); Bed 3 (carrots this season) — rotate to beans or greens; Bed 4 (corn this season) — rotate to carrots.",
        estimated_days: 1,
        requires_physical_action_image: false,
        image_prompt_context: null,
      },
    ],
  },
];

export const demoPlan: FarmingPlan = {
  id: "plan-demo",
  projectId: "demo-project",
  suitabilityScore: 82,
  summary:
    "Your land is suitable for a beginner vegetable plan focused on leafy greens, okra, and beans. The main success factors are steady watering, soil preparation, and starting with a small growing area.",
  assumptions: [
    "Water is available at least three times per week.",
    "The soil drains within a few hours after heavy rain.",
    "You can spend 4 to 6 hours per week on the project.",
  ],
  recommendations: [
    {
      crop: "Leafy greens",
      fit: "Fast harvest, forgiving for beginners, and useful for learning watering routines.",
      difficulty: "Easy",
      waterNeeds: "Medium",
      timeline: "25 to 35 days",
    },
    {
      crop: "Okra",
      fit: "Handles warm weather well and gives repeated harvests once established.",
      difficulty: "Easy",
      waterNeeds: "Medium",
      timeline: "45 to 60 days",
    },
    {
      crop: "Beans",
      fit: "Improves soil nitrogen and helps beginners learn trellis or row support.",
      difficulty: "Moderate",
      waterNeeds: "Medium",
      timeline: "50 to 65 days",
    },
  ],
  risks: [
    "Inconsistent watering may reduce germination.",
    "Poor drainage can damage roots after heavy rain.",
    "Starting too large may make weekly maintenance difficult.",
  ],
  phases: demoPlanPhases,
  goals: [
    {
      id: "goal-1",
      title: "Mark the first growing zone",
      timing: "Day 1",
      description:
        "Start with a small section that you can water and observe daily. Keep walking paths clear.",
      status: "done",
      subtasks: [
        { id: "goal-1-a", title: "Measure plot boundaries", status: "done" },
        { id: "goal-1-b", title: "Clear weeds from the zone", status: "done" },
        { id: "goal-1-c", title: "Mark walking paths", status: "done" },
      ],
    },
    {
      id: "goal-2",
      title: "Prepare soil with compost",
      timing: "Days 2-4",
      description:
        "Loosen the top soil and mix compost evenly. Remove stones, weeds, and compacted clumps.",
      status: "doing",
      subtasks: [
        { id: "goal-2-a", title: "Loosen top 6 inches of soil", status: "done" },
        { id: "goal-2-b", title: "Mix compost evenly", status: "doing" },
        { id: "goal-2-c", title: "Remove stones and compacted clumps", status: "todo" },
      ],
    },
    {
      id: "goal-3",
      title: "Plant leafy greens first",
      timing: "Week 1",
      description:
        "Use simple rows with enough spacing to weed and water comfortably.",
      status: "todo",
      subtasks: [
        { id: "goal-3-a", title: "Soak seeds if needed", status: "todo" },
        { id: "goal-3-b", title: "Mark simple rows with spacing", status: "todo" },
        { id: "goal-3-c", title: "Plant and water gently", status: "todo" },
      ],
    },
    {
      id: "goal-4",
      title: "Check leaves and soil moisture",
      timing: "Weekly",
      description:
        "Look for yellowing, holes, pests, and dry soil. Ask the assistant if symptoms appear.",
      status: "todo",
      subtasks: [
        { id: "goal-4-a", title: "Morning soil moisture check", status: "todo" },
        { id: "goal-4-b", title: "Inspect leaves for pests or yellowing", status: "todo" },
        { id: "goal-4-c", title: "Log issues for the assistant", status: "todo" },
      ],
    },
  ],
};
