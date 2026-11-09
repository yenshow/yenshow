/** Shared SVG layout constants for interactive module diagrams. */

export const DIAGRAM_LANE_X = Object.freeze([28, 260, 492, 724]);
export const DIAGRAM_NODE_W = 200;
export const DIAGRAM_NODE_H = 104;

export const diagramNodePosition = (node) => ({
	x: DIAGRAM_LANE_X[node.lane] ?? DIAGRAM_LANE_X[0],
	y: node.y
});
