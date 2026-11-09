import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { networkAPI } from "../services/apiService";
import "./NetworkVisualization.css";

const NetworkVisualization = () => {
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const svgRef = React.useRef();

  useEffect(() => {
    fetchNetwork();
  }, []);

  useEffect(() => {
    if (network && svgRef.current) {
      renderNetwork();
    }
  }, [network]);

  const fetchNetwork = async () => {
    try {
      const response = await networkAPI.getNetwork();
      setNetwork(response.data.data);
    } catch (error) {
      console.error("Error fetching network:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderNetwork = () => {
    if (!network || !svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const simulation = d3
      .forceSimulation(network.nodes)
      .force(
        "link",
        d3
          .forceLink(network.edges)
          .id((d) => d.id || d)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Draw links
    const links = svg
      .selectAll("line")
      .data(network.edges)
      .enter()
      .append("line")
      .attr("stroke", "rgba(0, 212, 255, 0.3)")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Draw nodes
    const nodes = svg
      .selectAll("circle")
      .data(network.nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("fill", "url(#gradient)")
      .attr("stroke", "#00d4ff")
      .attr("stroke-width", 2)
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      );

    // Add labels
    const labels = svg
      .selectAll("text")
      .data(network.nodes)
      .enter()
      .append("text")
      .text((d) => d.id?.slice(-4) || "")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#e0e0e0")
      .attr("font-size", "12px")
      .attr("pointer-events", "none");

    // Add arrow marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 29)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", "#00d4ff");

    // Add gradient
    svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "gradient")
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#00d4ff");

    simulation.on("tick", () => {
      links
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <div className="network-visualization">
      <div className="network-header">
        <h2>🕸️ Transaction Network Graph</h2>
        <button onClick={fetchNetwork} className="primary">
          Refresh Network
        </button>
      </div>

      {loading ? (
        <div className="network-loading">Loading network...</div>
      ) : network ? (
        <>
          <svg
            ref={svgRef}
            className="network-svg"
            style={{ width: "100%", height: "500px" }}
          ></svg>
          <div className="network-stats">
            <div className="stat">
              <span className="stat-label">Accounts:</span>
              <span className="stat-value">{network.nodes?.length || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Transactions:</span>
              <span className="stat-value">{network.edges?.length || 0}</span>
            </div>
            {network.clusters && (
              <div className="stat">
                <span className="stat-label">Clusters:</span>
                <span className="stat-value">{network.clusters.length}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="network-error">Error loading network</div>
      )}
    </div>
  );
};

export default NetworkVisualization;
