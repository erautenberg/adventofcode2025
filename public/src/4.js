const DAY4 = 4;
parseData(DAY4, (input) => {
  const timeStringDay4 = `Day ${DAY4}, Total Execution Time`;
  console.time(timeStringDay4);

  const timeStringData1 = `Day ${DAY4}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const rolls = formatRolls(input);
  console.log(rolls);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY4}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = countAccessible(rolls);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY4}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay4);
  showAnswers(DAY4, part1, part2);
});

const formatRolls = (input) => {
  return input.reduce((acc, curr) => {
    acc.push(curr.split(''));
    return acc;
  }, []);
};

const ROLL_CHAR = '@';

const checkIfAccessible = (rolls, row = 0, col = 0, max = 4) => {
  let count = 0;
  if (rolls[row - 1]) {
    if (rolls[row - 1][col - 1] === ROLL_CHAR) count++; // upper left
    if (rolls[row - 1][col] === ROLL_CHAR) count++; // directly above
    if (rolls[row - 1][col + 1] === ROLL_CHAR) count++; // upper right
  }
  if (rolls[row]) {
    if (rolls[row][col - 1] === ROLL_CHAR) count++; // directly left
    if (rolls[row][col + 1] === ROLL_CHAR) count++; // directly right
  }
  if (rolls[row + 1]) {
    if (rolls[row + 1][col - 1] === ROLL_CHAR) count++; // lower left
    if (rolls[row + 1][col] === ROLL_CHAR) count++; // directly below
    if (rolls[row + 1][col + 1] === ROLL_CHAR) count++; // lower right
  }
  return count < max;
};

const countAccessible = (rolls) => {
  return rolls.reduce((acc, curr, row) => {
    curr.forEach((char, col) => {
      if (char === ROLL_CHAR && checkIfAccessible(rolls, row, col)) acc++;
    });
    return acc;
  }, 0);
};
