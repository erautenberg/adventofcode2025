const DAY1 = 1;
parseData(DAY1, (input) => {
  const timeStringDay1 = `Day ${DAY1}, Total Execution Time`;
  console.time(timeStringDay1);

  const timeStringData1 = `Day ${DAY1}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const formatedInput = sortLists(formatLists(input));
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY1}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = '';
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY1}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay1);
  showAnswers(DAY1, part1, part2);
});
