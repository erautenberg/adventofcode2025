const DAY5 = 5;
parseData(DAY5, (input) => {
  const timeStringDay5 = `Day ${DAY5}, Total Execution Time`;
  console.time(timeStringDay5);

  const timeStringData1 = `Day ${DAY5}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const database = formatIngredientsDatabase(input);
  console.log(database);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY5}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = countFresh(database);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY5}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay5);
  showAnswers(DAY5, part1, part2);
});

const formatIngredientsDatabase = (input) => {
  let fresh = true;
  const database = input.reduce(
    (acc, curr) => {
      if (curr === '') {
        fresh = false;
      } else {
        if (fresh) {
          acc.fresh.push(curr.split('-').map((n) => parseInt(n)));
        } else {
          acc.available.push(parseInt(curr));
        }
      }
      return acc;
    },
    { fresh: [], available: [] }
  );

  database.fresh = condenseRanges(database.fresh);

  return database;
};

const condenseRanges = (ranges) => {
  const sorted = ranges.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const condensed = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const last = condensed[condensed.length - 1];

    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      condensed.push(curr);
    }
  }
  return condensed;
};

const checkIfInRange = (ranges, ingredient) => {
  let fresh = false;
  for (let i = 0; i < ranges.length; i++) {
    let [s, e] = ranges[i];
    if (ingredient >= s && ingredient <= e) {
      fresh = true;
      break;
    }
  }
  return fresh;
};

const countFresh = ({ fresh, available }) => {
  return available.reduce((acc, curr) => {
    if (checkIfInRange(fresh, curr)) {
      acc++;
    }
    return acc;
  }, 0);
};
