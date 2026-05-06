const express = require("express");
const cors = require("cors");
const data = require("../data/data.json");

const app = express();
app.use(cors());

function getMetrics() {

  // Lead Time
  const leadTime =
    data.prs.reduce((sum, pr) => {
      const diff = (new Date(pr.merged) - new Date(pr.created)) / (1000 * 60 * 60 * 24);
      return sum + diff;
    }, 0) / data.prs.length;

  // Cycle Time
  const cycleTime =
    data.tasks.reduce((sum, task) => {
      const diff = (new Date(task.end) - new Date(task.start)) / (1000 * 60 * 60 * 24);
      return sum + diff;
    }, 0) / data.tasks.length;

  // Bug Rate
  const bugs = data.tasks.filter(t => t.type === "bug").length;
  const bugRate = bugs / data.tasks.length;

  // Deployment Frequency
  const deployFreq = data.deployments.length;

  // PR Throughput
  const prThroughput = data.prs.length;

  // Insights + Actions
  let insights = [];
  let actions = [];

  if (leadTime > 3) {
    insights.push("Delivery is slow (high lead time).");
    actions.push("Reduce PR size and speed up code reviews.");
  }

  if (cycleTime > 4) {
    insights.push("Tasks are taking too long to complete.");
    actions.push("Break tasks into smaller parts.");
  }

  if (bugRate > 0.3) {
    insights.push("Too many bugs are being introduced.");
    actions.push("Improve testing before deployment.");
  }

  if (deployFreq < 2) {
    insights.push("Deployment frequency is low.");
    actions.push("Automate CI/CD to deploy faster.");
  }

  if (prThroughput < 2) {
    insights.push("Low PR throughput indicates slow delivery.");
    actions.push("Increase PR frequency and reduce task size.");
  }

  if (insights.length === 0) {
    insights.push("Performance looks good.");
    actions.push("Maintain current workflow.");
  }

  // Dynamic Story
  let story = "Based on your metrics, ";

  if (bugRate > 0.3) story += "quality issues are high. ";
  if (cycleTime > 4) story += "tasks are slow. ";
  if (leadTime > 3) story += "delivery is delayed. ";
  if (deployFreq < 2) story += "deployment frequency is low. ";

  story += "Focus on improving testing and reducing delays.";

  return {
    leadTime: Number(leadTime.toFixed(2)),
    cycleTime: Number(cycleTime.toFixed(2)),
    bugRate: Number(bugRate.toFixed(2)),
    deployFreq,
    prThroughput,
    insights,
    actions,
    story
  };
}

// API
app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

// run server
app.listen(5000, () => console.log("Server running on port 5000"));