const DAY9 = 9;
parseData(DAY9, (input) => {
  const timeStringDay9 = `Day ${DAY9}, Total Execution Time`;
  console.time(timeStringDay9);

  const timeStringData1 = `Day ${DAY9}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const tiles = formatTiles(input);
  console.log(tiles);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY9}, Part 1 Execution Time`;
  console.time(timeString1);
  const rectangles = getAllRectangles(tiles);
  const areas = getAllAreas(rectangles);
  console.log(areas);
  const part1 = getHighestArea(areas);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY9}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
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

const getArea = ([[ax, ay], [bx, by]]) => {
  return (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1);
};

const getHighestArea = (areas) => {
  const sortedAreas = Array.from(areas.keys()).sort((a, b) => b - a);
  return sortedAreas[0];
};
