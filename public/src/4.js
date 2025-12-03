const DAY4 = 4;
parseData(DAY4, (input) => {
  const timeStringDay4 = `Day ${DAY4}, Total Execution Time`;
  console.time(timeStringDay4);

  const timeStringData1 = `Day ${DAY4}, Data Setup Execution Time`;
  console.time(timeStringData1);
  // setup code here
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY4}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = '';
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY4}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay4);
  showAnswers(DAY4, part1, part2);
});