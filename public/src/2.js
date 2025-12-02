const DAY2 = 2;
parseData(DAY2, (input) => {
  const timeStringDay2 = `Day ${DAY2}, Total Execution Time`;
  console.time(timeStringDay2);

  const timeStringData1 = `Day ${DAY2}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const ranges = formatRanges(input);
  console.log(ranges);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY2}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getInvalidIdTotal(ranges);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY2}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay2);
  showAnswers(DAY2, part1, part2);
});

const formatRanges = (input) => {
  return input[0].split(',').reduce((acc, curr) => {
    const [, start, end] = curr.match(/(\d+)-(\d+)/);
    acc.push([parseInt(start), parseInt(end)]);
    return acc;
  }, []);
};

const getInvalidIdTotal = (ranges) => {
  return getInvalidIds(ranges).reduce((acc, curr) => (acc += curr), 0);
};

const getDigitCount = (number) => {
  return Math.abs(number).toString().length;
};

const getIncrement = (num) => {
  const str = num.toString();
  const len = str.length;
  // length / 2 of the number minus 1 equals number of 0s between the two 1's
  return parseInt('1' + '0'.repeat(len / 2 - 1) + '1');
};

const checkValidity = (num) => {
  const str = num.toString();
  const len = str.length;
  return str.slice(0, len / 2) !== str.slice(len / 2);
};

const getNextEvenDigitNumber = (num) => {
  let curr = num;
  let len = getDigitCount(curr);

  // if odd number of digits, jump to next power of 10
  if (len % 2 !== 0) curr = parseInt('1' + '0'.repeat(len));

  const increment = getIncrement(curr);
  // find the lowest multiple of the increment within range
  curr = Math.ceil(curr / increment) * increment;
  len = getDigitCount(curr);

  return { curr, increment, len };
};

const getInvalidIds = (ranges) => {
  let invalid = [];
  ranges.forEach(([start, end]) => {
    let { curr, increment, len } = getNextEvenDigitNumber(start);

    while (curr <= end) {
      if (!checkValidity(curr)) {
        invalid.push(curr);
      }

      // if the increment increases the current number to have more digits,
      // recalculate the starting number to ensure we did not skip any potentiall invalid IDs
      // if the digit length is the same, just keep incrementing, no need to do the extra calculations again
      let newCurr = curr + increment;
      let newLen = getDigitCount(newCurr);
      if (newLen === len) {
        curr = newCurr;
      } else {
        ({ curr, increment, len } = getNextEvenDigitNumber(newCurr));
      }
    }
  });
  return invalid;
};
