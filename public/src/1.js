const DAY1 = 1;
parseData(DAY1, (input) => {
  const timeStringDay1 = `Day ${DAY1}, Total Execution Time`;
  console.time(timeStringDay1);

  const timeStringData1 = `Day ${DAY1}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const startingPos = 50;
  const formattedRotations = formatRotations(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY1}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getZeroCount(formattedRotations, startingPos);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY1}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getAllZeroCount(formattedRotations, startingPos);
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay1);
  showAnswers(DAY1, part1, part2);
});

const formatRotations = (input) => {
  return input.reduce((acc, curr) => {
    const [, dir, dist] = curr.match(/(\D)(\d+)/);
    acc.push(parseInt(dist) * (dir === 'L' ? -1 : 1));
    return acc;
  }, []);
};

const getZeroCount = (rotations, startingPos) => {
  const total = 100;
  const max = 99;
  const min = 0;
  let zeros = 0;

  rotations.reduce((acc, curr) => {
    let dial = acc + (curr % total);
    if (dial < min) {
      dial = dial + total;
    } else if (dial > max) {
      dial = dial - total;
    }
    if (dial === 0) zeros++;
    return dial;
  }, startingPos);

  return zeros;
};

const getAllZeroCount = (rotations, startingPos) => {
  const total = 100;
  const max = 99;
  const min = 0;
  let zeros = 0;

  rotations.reduce((acc, curr) => {
    zeros += Math.floor(Math.abs(curr) / total);
    let dial = acc + (curr % total);
    if (dial !== acc) {
      if (dial < min) {
        dial = dial + total;
        // only count passing zero, not starting on it
        if (acc !== min) zeros++;
      } else if (dial > max) {
        dial = dial - total;
        zeros++;
      } else if (dial === min) {
        zeros++;
      }
    }
    return dial;
  }, startingPos);

  return zeros;
};
