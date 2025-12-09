const DAY9 = 9;
parseData(DAY9, (input) => {
  const timeStringDay9 = `Day ${DAY9}, Total Execution Time`;
  console.time(timeStringDay9);

  const timeStringData1 = `Day ${DAY9}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const tiles = formatTiles(input);
  const rectangles = getAllRectangles(tiles);
  const areas = getAllAreas(rectangles);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY9}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getHighestArea(areas);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY9}, Part 2 Execution Time`;
  console.time(timeString2);
  const polygon = getTileOrder(tiles);
  const part2 = getHighestValidRectangleArea(areas, polygon);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay9);
  showAnswers(DAY9, part1, part2);
});

const formatTiles = (input) => {
  return input.reduce((acc, curr) => {
    acc.push(curr.split(',').map((n) => parseInt(n)));
    return acc;
  }, []);
};

const getAllRectangles = (tiles) => {
  let rectangles = [];
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      rectangles.push([tiles[i], tiles[j]]);
    }
  }
  return rectangles;
};

const getAllAreas = (rectangles) => {
  return rectangles.reduce((acc, curr) => {
    const a = getArea(curr);
    acc.has(a) ? acc.get(a).push(curr) : acc.set(a, [curr]);
    return acc;
  }, new Map());
};

const getArea = ([[x1, y1], [x2, y2]]) => {
  return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
};

const getHighestArea = (areas) => {
  const sortedAreas = Array.from(areas.keys()).sort((a, b) => b - a);
  return sortedAreas[0];
};

const isInLine = ([x1, y1], [x2, y2]) => {
  return (x1 === x2 && y1 !== y2) || (y1 === y2 && x1 !== x2);
};

const getTopLeft = (tiles) => {
  return tiles.reduce((acc, curr) => {
    // if the y is smaller or the the y is the same but the x is smaller, new minimum point found
    if (curr[1] < acc[1] || (curr[1] === acc[1] && curr[0] < acc[0]))
      acc = curr;
    return acc;
  }, tiles[0]);
};

const getSetKey = (tile) => {
  return `${tile[0]},${tile[1]}`;
};

const getDirection = ([ax, ay], [bx, by]) => {
  return [ax - bx, ay - by];
};

// negative cross product is a right turn (clockwise)
// positive cross product is a left turn (counterclockwise)
const getCrossProduct = ([ax, ay], [bx, by]) => {
  return ax * by - ay * bx;
};

const getNextTile = (orderedTiles, candidates, currTile) => {
  if (candidates.length === 1) return candidates[0];

  const prevTile = orderedTiles.at(-2) || currTile;
  const currDir = getDirection(currTile, prevTile);

  return candidates.reduce((bestCandidate, currCandidate) => {
    if (!bestCandidate) return currCandidate;

    const currCandidateDir = getDirection(currCandidate, currTile);
    const bestCandidateDir = getDirection(bestCandidate, currTile);
    const crossCurr = getCrossProduct(currDir, currCandidateDir);
    const crossBest = getCrossProduct(currDir, bestCandidateDir);

    if (crossCurr < crossBest) return currCandidate;
    return bestCandidate;
  }, null);
};

const getTileOrder = (tiles) => {
  const start = getTopLeft(tiles);
  const orderedTiles = [start];
  const visited = new Set([getSetKey(start)]);
  let curr = start;

  while (orderedTiles.length < tiles.length) {
    const candidates = tiles.filter(
      // if we haven't used the tile already and it is in line with the current
      (tile) => !visited.has(getSetKey(tile)) && isInLine(curr, tile)
    );
    if (!candidates.length) break;

    const next = getNextTile(orderedTiles, candidates, curr);
    orderedTiles.push(next);
    visited.add(getSetKey(next));
    curr = next;
  }

  return orderedTiles;
};

const isPointOnEdge = ([px, py], [xi, yi], [xj, yj]) => {
  const vertical =
    xi === xj && px === xi && Math.min(yi, yj) <= py && py <= Math.max(yi, yj);
  if (vertical) return true;

  const horizontal =
    yi === yj && py === yi && Math.min(xi, xj) <= px && px <= Math.max(xi, xj);
  if (horizontal) return true;

  return false;
};

// Ray Casting Algorithm for rectilinear polygons
// https://stackoverflow.com/questions/36735542/point-inside-a-polygon-javascript
// https://www.youtube.com/watch?v=01E0RGb2Wzo
const isPointInsidePolygon = (polygon, [px, py]) => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (isPointOnEdge([px, py], [xi, yi], [xj, yj])) return true;

    // Standard ray casting
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

const isRectangleInsidePolygon = (polygon, [x1, y1], [x2, y2]) => {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  const corners = [
    [minX, minY], // top left
    [maxX, minY], // top right
    [maxX, maxY], // lower right
    [minX, maxY] // lower left
  ];

  // potential short-circuit by checking corners before checking all points
  for (const c of corners) {
    if (!isPointInsidePolygon(polygon, c)) return false;
  }
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (!isPointInsidePolygon(polygon, [x, y])) return false;
    }
  }

  return true;
};

// const getAllValidRectangles = (rectangles, polygon) => {
//   return rectangles.filter(([a, b]) => isRectangleInsidePolygon(polygon, a, b));
// };

const getHighestValidRectangleArea = (areas, polygon) => {
  const sortedAreas = Array.from(areas.keys()).sort((a, b) => b - a);

  for (let i = 0; i < sortedAreas.length; i++) {
    const a = sortedAreas[i];
    const rectangles = areas.get(a);
    const foundValid = rectangles.some((rect) =>
      isRectangleInsidePolygon(polygon, ...rect)
    );
    if (foundValid) return a;
  }

  return false;
};
