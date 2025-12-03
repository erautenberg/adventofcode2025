const DAY3 = 3;
parseData(DAY3, (input) => {
  const timeStringDay3 = `Day ${DAY3}, Total Execution Time`;
  console.time(timeStringDay3);

  const timeStringData1 = `Day ${DAY3}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const banks = formatBatteries(input);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY3}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getTotalHighestJoltage(banks, 2);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY3}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getTotalHighestJoltage(banks, 12);
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

const getTotalHighestJoltage = (banks, n = 2) => {
  return banks.reduce(
    (acc, curr) => (acc += getHighestNDigitJoltage(curr, n)),
    0
  );
};

// Part 2 updates the logic to make this work for all battery counts
// const getHighestJoltage = (bank) => {
//   let a, b, currJoltage;
//   let highestJoltage = 0;
//   const maxJoltage = 99;

//   for (let i = 0; i < bank.length - 1; i++) {
//     for (let j = i + 1; j < bank.length; j++) {
//       a = bank[i];
//       b = bank[j];
//       currJoltage = parseInt([a, b].join(''));
//       if (currJoltage > highestJoltage) highestJoltage = currJoltage;
//       if (highestJoltage === maxJoltage) return maxJoltage;
//     }
//   }

//   return highestJoltage;
// };

const getHighestNDigitJoltage = (bank, n = 12) => {
  let batteries = [];
  for (let i = 0; i < bank.length; i++) {
    // if a better battery is found in the bank,
    // remove the last battery in the new list and add the current one
    // (while there are batteries saved in the new array
    // and the joltage of the last saved battery is less than the current battery in the bank
    // and we have enough batteries left in the bank to fill out the new list with n batteries)
    while (
      batteries.length > 0 &&
      batteries.at(-1) < bank[i] &&
      batteries.length + (bank.length - i) > n
    ) {
      batteries.pop();
    }
    batteries.push(bank[i]);

    // remove extra batteries if exceeded the total to be turned on
    while (batteries.length > n) {
      batteries.pop();
    }
  }
  return parseInt(batteries.join(''));
};
