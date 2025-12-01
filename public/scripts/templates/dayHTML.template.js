module.exports = (num) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Emily's Advent of Code 2025 Solutions</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <header>
    <h1>Day ${num}</h1>
  </header>

  <h2><a href="https://adventofcode.com/2025/day/${num}">Prompt</a></h2>

  <h2>Part 1</h2>
  <p></p>
  <p class="answer" id="answer1"></p>

  <h2>Part 2</h2>
  <p></p>
  <p class="answer" id="answer2"></p>

  <footer><ul id="nav"></ul></footer>

  <script type="text/javascript" src="../index.js" ></script>
  <script type="text/javascript" src="../src/${num}.js" ></script>

</body>
</html>`;
};
