const listFileName = "./src/abagames_games_2021.csv";
const outputDirectory = "./";
const description = `## I have created 111 one-button games in 2021

You can play all games in your browser (PC or mobile). Clink on the images below to play.

All games are created with [crisp-game-lib](https://github.com/abagames/crisp-game-lib).
`;

/**
 * @type {{
 * title: string, imageUrl: string, linkUrl: string,
 * linkType: string, platformName: string,
 * rt: number, fav: number, total: number, type: string
 * }[]}
 */
let gameList;

loadList();
saveReadMe();

function loadList() {
  const fs = require("fs");
  const listCsv = fs.readFileSync(listFileName, "utf8");
  const list = listCsv.split("\r\n");
  list.shift();
  list.pop();
  gameList = list.map((l) => {
    const items = l.split(",");
    return {
      title: items[0],
      imageUrl: items[1],
      linkUrl: items[2],
      linkType: items[3],
      platformName: items[4],
      rt: Number.parseFloat(items[5]),
      fav: Number.parseFloat(items[6]),
      total: Number.parseFloat(items[7]),
      type: items[8],
    };
  });
}

function saveReadMe() {
  const fs = require("fs");
  const fileName = `${outputDirectory}README.md`;
  const pageMarkDown = getMarkDown();
  fs.writeFileSync(fileName, pageMarkDown);
}

function getMarkDown() {
  return `${description}
${getImages(sortGameList(filterGameList("One-button")))}`;
}

function filterGameList(type) {
  return gameList.filter((g) => g.type === type);
}

function sortGameList(list) {
  return stableSort(list, (a, b) => b.total - a.total);
}

function getImages(list) {
  return list
    .map((g, i) => {
      return `${getImg(g.title, g.imageUrl, g.linkUrl)}${
        i % 4 === 3 ? "\n\n" : ""
      }`;
    })
    .join("");
}

function getImg(title, imageUrl, linkUrl) {
  return `<a href="${linkUrl}"><img src="${imageUrl}" alt="${title}" width="25%" loading="lazy"></a>`;
}

function stableSort(values, compareFunc) {
  if (compareFunc == null) {
    compareFunc = (a, b) => a - b;
  }
  const indexedValues = values.map((v, i) => [v, i]);
  indexedValues.sort((a, b) => {
    const cmp = compareFunc(a[0], b[0]);
    return cmp !== 0 ? cmp : a[1] - b[1];
  });
  return indexedValues.map((v) => v[0]);
}
