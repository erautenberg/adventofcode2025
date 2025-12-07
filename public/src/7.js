const DAY7 = 7;
parseData(DAY7, (input) => {
  const timeStringDay7 = `Day ${DAY7}, Total Execution Time`;
  console.time(timeStringDay7);

  const timeStringData1 = `Day ${DAY7}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const { manifold, start } = formatManifold(input);
  console.log(manifold, start);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY7}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = countSplits(manifold, start);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY7}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay7);
  showAnswers(DAY7, part1, part2);
});

const formatManifold = (input) => {
  return input.reduce(
    (acc, curr, index) => {
      const foundStart = curr.indexOf('S');
      if (foundStart !== -1) {
        acc.start = [index, foundStart];
      }
      acc.manifold.push(curr.split(''));
      return acc;
    },
    { manifold: [], start: [] }
  );
};

const getSplits = (manifold, [r, c], splits, visited) => {
  while (r < manifold.length && manifold[r][c] !== '^') r++;

  if (!manifold[r] || !manifold[r][c]) return splits;

  const splitPos = `${r},${c}`;
  if (visited.has(splitPos)) return splits;

  visited.add(splitPos);
  splits.add(splitPos);

  manifold[r][c - 1] && getSplits(manifold, [r, c - 1], splits, visited);
  manifold[r][c + 1] && getSplits(manifold, [r, c + 1], splits, visited);

  return splits;
};

const countSplits = (manifold, start) => {
  return getSplits(manifold, start, new Set(), new Set()).size;
};
