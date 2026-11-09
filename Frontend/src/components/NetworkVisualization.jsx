import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchNetworkData } from "../services/apiService";
import "./NetworkVisualization.css";

const NetworkVisualization = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const linkSelRef = useRef(null);
  const nodeSelRef = useRef(null);
  const labelSelRef = useRef(null);
  const zoomRef = useRef(null);

  const [linkDistance, setLinkDistance] = useState(120);
  const [chargeStrength, setChargeStrength] = useState(-300);
  const [showLabels, setShowLabels] = useState(true);
  const [search, setSearch] = useState("");
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch network data on mount
  useEffect(() => {
    const loadNetworkData = async () => {
      setLoading(true);
      const data = await fetchNetworkData();
      setNetworkData(data);
      setLoading(false);
    };
    loadNetworkData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !networkData || loading)
      return;

    const data = JSON.parse(JSON.stringify(networkData.graph));

    const width = containerRef.current.clientWidth || 800;
    const height = 500;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add a group for zooming
    const g = svg.append("g").attr("class", "graph-root");

    // Tooltip
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "nv-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("visibility", "hidden")
      .style("background", "white")
      .style("padding", "6px 10px")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("font-size", "12px");

    // Links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.max(1, Math.log(d.value || 1000) / 2));

    // Nodes
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", (d) => d.size || (d.type === "bank" ? 20 : 12))
      .attr("fill", (d) => (d.type === "bank" ? "#1f77b4" : "#ff7f0e"))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    // Labels
    const labels = g
      .append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#111")
      .attr("font-size", "11px")
      .style("pointer-events", "none")
      .text((d) => d.id)
      .style("opacity", showLabels ? 1 : 0);

    // Save selections
    linkSelRef.current = link;
    nodeSelRef.current = node;
    labelSelRef.current = labels;

    // Simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2));

    simulationRef.current = simulation;

    // Node interactions
    node
      .on("mouseover", (_event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d.label || d.id}</strong><div>Type: ${d.type}</div>`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", event.layerY + 10 + "px")
          .style("left", event.layerX + 10 + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"))
      .on("click", (_event, d) => {
        d.fx = d.fx == null ? d.x : null;
        d.fy = d.fy == null ? d.y : null;
        simulation.alpha(0.7).restart();
      });

    // Drag behavior
    function drag(sim) {
      function started(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function ended(event, _d) {
        if (!event.active) sim.alphaTarget(0);
      }
      return d3
        .drag()
        .on("start", started)
        .on("drag", dragged)
        .on("end", ended);
    }

    node.call(drag(simulation));

    // Zoom
    const zoom = d3
      .zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    zoomRef.current = zoom;

    svg.call(zoom);

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      labels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    // Cleanup on unmount
    return () => {
      simulation.stop();
      d3.select(containerRef.current).selectAll(".nv-tooltip").remove();
    };
  }, [networkData, loading]);

  // Update forces when controls change
  useEffect(() => {
    const sim = simulationRef.current;
    if (!sim) return;
    const linkForce = sim.force("link");
    if (linkForce) linkForce.distance(linkDistance);
    const charge = sim.force("charge");
    if (charge) charge.strength(chargeStrength);
    sim.alpha(0.7).restart();

    if (labelSelRef.current) {
      labelSelRef.current.style("opacity", showLabels ? 1 : 0);
    }
  }, [linkDistance, chargeStrength, showLabels]);

  // Search highlighting
  useEffect(() => {
    if (!nodeSelRef.current) return;
    const q = search.trim().toLowerCase();
    nodeSelRef.current.attr("stroke-width", (d) =>
      d.id.toLowerCase().includes(q) && q ? 3 : 1.5
    );
    nodeSelRef.current.attr("stroke", (d) =>
      d.id.toLowerCase().includes(q) && q ? "#ffd700" : "#fff"
    );
  }, [search]);

  if (loading) {
    return (
      <div className="network-visualization">
        <h2>Network Visualization</h2>
        <p>Loading network data...</p>
      </div>
    );
  }

  return (
    <div className="network-visualization" ref={containerRef}>
      <h2>Network Visualization</h2>

      <div className="nv-controls">
        <label>
          Link distance:{" "}
          <input
            type="range"
            min="20"
            max="300"
            value={linkDistance}
            onChange={(e) => setLinkDistance(+e.target.value)}
          />{" "}
          {linkDistance}
        </label>
        <label>
          Charge:{" "}
          <input
            type="range"
            min="-1000"
            max="-10"
            value={chargeStrength}
            onChange={(e) => setChargeStrength(+e.target.value)}
          />{" "}
          {chargeStrength}
        </label>
        <label>
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />{" "}
          Show labels
        </label>
        <label className="search-group">
          <span className="sr-only">Search</span>
          <input
            type="search"
            aria-label="Search accounts or nodes"
            placeholder="Search accounts or nodes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </label>
        <button
          onClick={() => {
            // reset zoom
            const svg = d3.select(svgRef.current);
            svg
              .transition()
              .duration(400)
              .call(zoomRef.current.transform, d3.zoomIdentity);
          }}
        >
          Reset view
        </button>
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color account"></div>
          <span>Account</span>
        </div>
        <div className="legend-item">
          <div className="legend-color bank"></div>
          <span>Bank</span>
        </div>
      </div>

      <svg ref={svgRef}></svg>
    </div>
  );
};

export default NetworkVisualization;
