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
  paths = findPaths(devices, ['you'], 'out');
  const part1 = paths.length;
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY11}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
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

const findPaths = (devices, path = ['you'], end = 'out') => {
  const currDevice = path.at(-1);
  const outputs = devices[currDevice];

  if (outputs) {
    if (outputs.includes(end)) return [[...path, end]];

    return outputs.reduce((acc, curr) => {
      const paths = findPaths(devices, [...path, curr], end);
      return paths ? [...acc, ...paths] : acc;
    }, []);
  }

  return [];
};
