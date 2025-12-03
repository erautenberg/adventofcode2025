const DAY3 = 3;
parseData(DAY3, (input) => {
  const timeStringDay3 = `Day ${DAY3}, Total Execution Time`;
  console.time(timeStringDay3);

  const timeStringData1 = `Day ${DAY3}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const banks = formatBatteries(input);
  console.log(banks);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY3}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getTotalHighestJoltage(banks);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY3}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay3);
  showAnswers(DAY3, part1, part2);
});

const formatBatteries = (input) => {
  return input.reduce((acc, curr) => {
    acc.push(curr.split('').map((n) => parseInt(n)));
    return acc;
  }, []);
};

const getHighestJoltage = (bank) => {
  let a, b, currJoltage;
  let highestJoltage = 0;
  const maxJoltage = 99;

  for (let i = 0; i < bank.length - 1; i++) {
    for (let j = i + 1; j < bank.length; j++) {
      a = bank[i];
      b = bank[j];
      currJoltage = parseInt([a, b].join(''));
      if (currJoltage > highestJoltage) highestJoltage = currJoltage;
      if (highestJoltage === maxJoltage) return maxJoltage;
    }
  }

  return highestJoltage;
};

const getTotalHighestJoltage = (banks) => {
  return banks.reduce((acc, curr) => (acc += getHighestJoltage(curr)), 0);
};
