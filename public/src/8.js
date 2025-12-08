const DAY8 = 8;
parseData(DAY8, (input) => {
  const timeStringDay8 = `Day ${DAY8}, Total Execution Time`;
  console.time(timeStringDay8);

  const timeStringData1 = `Day ${DAY8}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const junctionBoxes = formatBoxes(input);
  console.log(junctionBoxes);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY8}, Part 1 Execution Time`;
  console.time(timeString1);
  const distances = getAllDistances(junctionBoxes);
  const { circuits } = getCircuits(junctionBoxes, distances, 1000);
  const part1 = multiplyCircuits(circuits);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY8}, Part 2 Execution Time`;
  console.time(timeString2);
  const { lastConnection } = getCircuits(junctionBoxes, distances);
  const part2 = multiplyLastConnection(junctionBoxes, lastConnection);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay8);
  showAnswers(DAY8, part1, part2);
});

const formatBoxes = (input) => {
  return input.reduce((acc, curr) => {
    acc.push(curr.split(',').map((n) => parseInt(n)));
    return acc;
  }, []);
};

const getEuclideanDistance = ([x1, y1, z1], [x2, y2, z2]) => {
  const squareDist = (a, b) => (a - b) ** 2;

  return Math.sqrt(
    squareDist(x1, x2) + squareDist(y1, y2) + squareDist(z1, z2)
  );
};

const getAllDistances = (junctionBoxes) => {
  const distanceMap = new Map();
  for (let i = 0; i < junctionBoxes.length - 1; i++) {
    for (let j = i + 1; j < junctionBoxes.length; j++) {
      distanceMap.set(
        getEuclideanDistance(junctionBoxes[i], junctionBoxes[j]),
        [i, j]
      );
    }
  }

  return distanceMap;
};

const getCircuits = (junctionBoxes, distanceMap, maxConnections = 0) => {
  let sortedDistances = [...distanceMap.keys()].sort((a, b) => a - b);
  if (maxConnections) {
    sortedDistances = sortedDistances.slice(0, maxConnections);
  }

  let circuits = [];
  let lastConnection = [];
  for (let i = 0; i < sortedDistances.length; i++) {
    const curr = sortedDistances[i];
    const [a, b] = distanceMap.get(curr);

    if (!circuits.length) {
      circuits.push(new Set([a, b]));
    } else {
      const circuitWithA = circuits.findIndex((c) => c.has(a));
      const circuitWithB = circuits.findIndex((c) => c.has(b));

      if (circuitWithA === -1 && circuitWithB === -1) {
        // neither is in an existing circuit
        circuits.push(new Set([a, b]));
      } else if (circuitWithA !== -1 && circuitWithB === -1) {
        // only a is currently in a circuit, b is not
        circuits[circuitWithA].add(b);
      } else if (circuitWithB !== -1 && circuitWithA === -1) {
        // only b is currently in a circuit, a is not
        circuits[circuitWithB].add(a);
      } else if (circuitWithA !== circuitWithB) {
        // need to combine circuits because a is in one and b is in another
        circuits[circuitWithA] = new Set([
          ...circuits[circuitWithA],
          ...circuits[circuitWithB],
        ]);
        circuits.splice(circuitWithB, 1);
      }
    }

    if (circuits[0] && circuits[0].size === junctionBoxes.length) {
      lastConnection = [a, b];
      break;
    }
  }

  return { circuits, lastConnection };
};

const multiplyCircuits = (circuits) => {
  const largestCircuits = circuits
    .map((c) => c.size)
    .sort((a, b) => b - a)
    .slice(0, 3);

  return largestCircuits.reduce((acc, curr) => (acc *= curr), 1);
};

const multiplyLastConnection = (junctionBoxes, [a, b]) => {
  return junctionBoxes[a][0] * junctionBoxes[b][0];
};
