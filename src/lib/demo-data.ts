import type { FarmingPlan, Project } from "@/types/app.types";

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
  steps: [
    {
      id: "step-1",
      title: "Mark the first growing zone",
      timing: "Day 1",
      description:
        "Start with a small section that you can water and observe daily. Keep walking paths clear.",
      status: "done",
    },
    {
      id: "step-2",
      title: "Prepare soil with compost",
      timing: "Days 2-4",
      description:
        "Loosen the top soil and mix compost evenly. Remove stones, weeds, and compacted clumps.",
      status: "doing",
    },
    {
      id: "step-3",
      title: "Plant leafy greens first",
      timing: "Week 1",
      description:
        "Use simple rows with enough spacing to weed and water comfortably.",
      status: "todo",
    },
    {
      id: "step-4",
      title: "Check leaves and soil moisture",
      timing: "Weekly",
      description:
        "Look for yellowing, holes, pests, and dry soil. Ask the assistant if symptoms appear.",
      status: "todo",
    },
  ],
};
