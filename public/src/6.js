const DAY6 = 6;
parseData(DAY6, (input) => {
  const timeStringDay6 = `Day ${DAY6}, Total Execution Time`;
  console.time(timeStringDay6);

  const timeStringData1 = `Day ${DAY6}, Data Setup Execution Time`;
  console.time(timeStringData1);
  const mathProblems = formatMathProblems(input);
  console.log(mathProblems);
  console.timeEnd(timeStringData1);

  const timeString1 = `Day ${DAY6}, Part 1 Execution Time`;
  console.time(timeString1);
  const part1 = getTotal(mathProblems);
  console.timeEnd(timeString1);

  const timeString2 = `Day ${DAY6}, Part 2 Execution Time`;
  console.time(timeString2);
  const part2 = '';
  console.timeEnd(timeString2);

  console.timeEnd(timeStringDay6);
  showAnswers(DAY6, part1, part2);
});

const formatMathProblems = (input) => {
  // return input.reduce((acc, curr) => {
  //   acc.push(
  //     curr
  //       .split(' ')
  //       .filter((n) => n)
  //       .map((n) => parseInt(n) || n)
  //   );
  //   return acc;
  // }, []);

  return input.reduce((acc, curr) => {
    curr
      .split(' ')
      .filter((n) => n)
      .forEach((n, r) => {
        if (!acc[r]) acc.push([]);
        acc[r].push(parseInt(n) || n);
      });
    return acc;
  }, []);
};

const solveProblem = (problem) => {
  const operator = problem.at(-1);
  const start = operator === '*' ? 1 : 0;
  return problem.reduce((acc, curr, index) => {
    if (index < problem.length - 1) acc = executeMath(operator, acc, curr);
    return acc;
  }, start);
};

const executeMath = (operator, a, b) => {
  let c = a;
  switch (operator) {
    case '+':
      c = a + b;
      break;
    case '*':
      c = a * b;
      break;
  }
  return c;
};

const getTotal = (problems) => {
  return problems.reduce((acc, curr) => (acc += solveProblem(curr)), 0);
};
