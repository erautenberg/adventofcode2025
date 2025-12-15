const DAY11 = 11;
parseData(DAY11, (input) => {
  const timeStringDay11 = `Day ${DAY11}, Total Execution Time`;
  console.time(timeStringDay11);

  const timeStringData1 = `Day ${DAY11}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const devices = formatDevices(input);
  console.log(devices);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY11}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getPathCount(devices, 'you', 'out');
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY11}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getPathCount(devices, 'svr', 'out', ['dac', 'fft']);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay11);
  showAnswers(DAY11, part1, part2);
});

const formatDevices = (input) => {
  return input.reduce((acc, curr) => {
    const [device, ...outputs] = curr.split(' ');
    acc[device.replace(':', '')] = outputs;
    return acc;
  }, {});
};

const getPathCount = (
  devices,
  start,
  end,
  mustInclude = [],
  visited = new Set([start]),
  pathCache = new Map()
) => {
  const remainingStops = mustInclude
    .filter((stop) => !visited.has(stop))
    .sort()
    .join(',');
  const cacheKey = `${start}:${remainingStops}`;

  if (pathCache.has(cacheKey)) return pathCache.get(cacheKey);

  const outputs = devices[start];

  if (!outputs) {
    pathCache.set(cacheKey, 0);
    return 0;
  }

  if (outputs.includes(end)) {
    const allVisited = mustInclude.every((stop) => visited.has(stop));
    const result = allVisited ? 1 : 0;
    pathCache.set(cacheKey, result);
    return result;
  }

  let totalPaths = 0;
  for (const output of outputs) {
    if (visited.has(output)) continue;

    const uniqueVisited = new Set(visited);
    uniqueVisited.add(output);

    totalPaths += getPathCount(
      devices,
      output,
      end,
      mustInclude,
      uniqueVisited,
      pathCache
    );
  }

  pathCache.set(cacheKey, totalPaths);
  return totalPaths;
};
