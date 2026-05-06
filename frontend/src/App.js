import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/metrics")
      .then(res => setData(res.data));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Developer Productivity Dashboard</h1>

      <div style={{ border: "1px solid gray", padding: "15px", margin: "10px" }}>
        <h2>📊 Metrics</h2>
        <p>Lead Time: {data.leadTime} days</p>
        <p>Cycle Time: {data.cycleTime} days</p>
        <p>Bug Rate: {data.bugRate}</p>
        <p>Deployment Frequency: {data.deployFreq}</p>
        <p>PR Throughput: {data.prThroughput}</p>
      </div>

      <div style={{ border: "1px solid blue", padding: "15px", margin: "10px" }}>
        <h2>🧠 Insights (What is happening)</h2>
        {data.insights && data.insights.map((i, index) => (
          <p key={index}>• {i}</p>
        ))}
      </div>

      <div style={{ border: "1px solid green", padding: "15px", margin: "10px" }}>
        <h2>🚀 Recommended Actions (What to do)</h2>
        {data.actions && data.actions.map((a, index) => (
          <p key={index}>• {a}</p>
        ))}
      </div>

      <div style={{ border: "1px solid orange", padding: "15px", margin: "10px" }}>
        <h2>📖 Story</h2>
        <p>{data.story}</p>
      </div>
    </div>
  );
}

export default App;