const DAY2 = 2;
parseData(DAY2, (input) => {
  const timeStringDay2 = `Day ${DAY2}, Total Execution Time`;
  console.time(timeStringDay2);

  const timeStringData1 = `Day ${DAY2}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const { ranges, maxDigits } = formatRanges(input);
  console.log(ranges);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY2}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getInvalidIdTotal(getInvalidIds(ranges));
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY2}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = getInvalidIdTotal(getInvalidRepeatIds(ranges));
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay2);
  showAnswers(DAY2, part1, part2);
});

const formatRanges = (input) => {
  let maxDigits = 0;
  return input[0].split(',').reduce(
    (acc, curr) => {
      const [, start, end] = curr.match(/(\d+)-(\d+)/);
      if (end.length > maxDigits) maxDigits = end.length;
      acc.ranges.push([parseInt(start), parseInt(end)]);
      return acc;
    },
    { ranges: [], maxDigits }
  );
};

const getInvalidIdTotal = (invalidNums) => {
  return invalidNums.reduce((acc, curr) => (acc += curr), 0);
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

const checkValidity = (num, repeat = 2) => {
  const str = num.toString();
  const len = str.length;

  let chunks = [];
  let chunkLen = len / repeat;
  for (let i = 0; i < len; i += chunkLen) {
    chunks.push(str.slice(i, i + chunkLen));
  }
  return !chunks.every((c) => c === chunks[0]);
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

const DIVISORS = {};

// generate list of divisors in total digit count
const getDivisors = (digitCount) => {
  if (DIVISORS[digitCount]) {
    return DIVISORS[digitCount];
  }

  const divisors = [];
  for (let i = 1; i < digitCount; i++) {
    if (digitCount % i === 0) {
      divisors.push(i);
    }
  }
  DIVISORS[digitCount] = divisors;
  return divisors;
};

const getInvalidRepeatIds = (ranges) => {
  const results = new Set();

  ranges.forEach(([start, end]) => {
    const startLen = getDigitCount(start);
    const endLen = getDigitCount(end);

    // for each possible digit count in range
    for (let currLen = startLen; currLen <= endLen; currLen++) {
      const divisors = getDivisors(currLen);

      // for each divisor (pattern length)
      for (const patternLength of divisors) {
        const repetitions = currLen / patternLength;

        // generate the range of possible patterns
        // i.e., if 2 digits, minimum is 10, maximum is 99 (10-99)
        const minPattern = Math.pow(10, patternLength - 1);
        const maxPattern = Math.pow(10, patternLength) - 1;

        for (let pattern = minPattern; pattern <= maxPattern; pattern++) {
          const num = parseInt(pattern.toString().repeat(repetitions));
          if (num >= start && num <= end) results.add(num);
          if (num > end) break;
        }
      }
    }
  });

  return Array.from(results).sort((a, b) => a - b);
};

// 132132132/1001001
// 123123123123123/1001001001001 -- repeats 5 times, therefore 5 1s (13 digit factor)
// 123451234512345/10000100001 -- repeats 3 times, therefore 3 1s (11 digit factor)

// 95 - 115 --> 99, 111
// 998-1012 --> 999 and 1010
// if its only 3 digits, the only invalid numbers are the single repeats (111, 222, ..., 999)
// odd prime numbers can only have the single repeats (111, 222, 55555, 77777) vs
// non-prime odd numbers like 9 can have other repeating patters (123123123)
