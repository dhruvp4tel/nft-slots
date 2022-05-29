const winRateChartCtx = getCanvasCtx('winRateChart');
let winrateLineChart = new Chart(winRateChartCtx);


const rarityChartCtx = getCanvasCtx('rarityDistributionChart');
let rarityDistributionChart = new Chart(rarityChartCtx);


const totalGames = document.getElementById('totalIterationInput');
const gamesPerIteration = document.getElementById('gamesPerIterationInput');

const slotMachine = (reels = 3) => {

  const elementGroups = {
    common: [1, 50],
    uncommon: [51, 85],
    rare: [86, 110],
    legendary: [111, 118]
  }


  const slotItems = new Array(reels).fill(0).map(a => getRandomNumber(1, 118));

  const result = slotItems.reduce((p, current, index, arr) => {
    if (isNumberInRange(current, elementGroups.common)) {
      arr[index] = { type: 'common', element: current, key: 1 }
    }
    else if (isNumberInRange(current, elementGroups.uncommon)) {
      arr[index] = { type: 'uncommon', element: current, key: 2 }
    }
    else if (isNumberInRange(current, elementGroups.rare)) {
      arr[index] = { type: 'rare', element: current, key: 3 }
    }

    else if (isNumberInRange(current, elementGroups.legendary)) {
      arr[index] = { type: 'legendary', element: current, key: 4 }
    }

    return arr;

  }, new Array(reels))



  const threeWin = result[0].key == result[1].key && result[1].key == result[2].key;


  if (threeWin) {
    return { win: true, result };
  }

  return { win: false, result };
}



const gameLoop = (totalGames = 1) => {
  let wins = 0;
  let games = totalGames;

  let hashmap = {
    'common,common,common': {count: 0, average:0, label:"Commons"},
    'legendary,legendary,legendary':  {count: 0, average:0, label:"Legendaries"},
    'rare,rare,rare':  {count: 0, average:0, label:"Rares"},
    'uncommon,uncommon,uncommon':  {count: 0, average:0, label:"Uncommons"},
  };

  for (let i = 0; i < games; i++) {
    const a = slotMachine();
    if (a.win) {
      const str = a.result.map(a => a.type).join(",").toString();
      hashmap[str].count ++;
      hashmap[str].average = (hashmap[str].count / games) * 100;
      wins++;
    }
  }


  return { winrate: ((wins / games) * 100).toPrecision(2), wins: hashmap }
}

const collectStats = (totalIterations = 50, gamesPerIteration = 50) => {

  console.log(totalIterations, gamesPerIteration)

  const games = new Array(totalIterations).fill(0).map(a => gameLoop(gamesPerIteration));

  console.log(games);

  const data = {
    labels: games.map((g, i) => `Game ${i + 1}`),
    datasets:[{
      label:'Win Rate (%) ',
      data: games.map(game => game.winrate),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
  winrateLineChart.destroy();
  winrateLineChart = new Chart(winRateChartCtx, {type: 'line', data});

  // rarity distribution chart


  const rarityData = {
    labels: games.map((g, i) => `Game ${i + 1}`),
    datasets:[{
      label:'Common (%) ',
      data: games.map(g => g.wins["common,common,common"].average),
      fill: false,
      borderColor: '#FF9B71',
      tension: 0.1
    },{
      label:'Uncommon (%) ',
      data: games.map(g => g.wins["uncommon,uncommon,uncommon"].average),
      fill: false,
      borderColor: '#82C09A',
      tension: 0.1
    },{
      label:'Rare (%) ',
      data: games.map(g => g.wins["rare,rare,rare"].average),
      fill: false,
      borderColor: '#2D3047',
      tension: 0.1
    },{
      label:'Legendary (%) ',
      data: games.map(g => g.wins["legendary,legendary,legendary"].average),
      fill: false,
      borderColor: '#DB2B39',
      tension: 0.1
    }]
  }

  rarityDistributionChart.destroy();
  rarityDistributionChart = new Chart(rarityChartCtx, {type: 'line', data: rarityData});

}


const handlePlayBtn = () => {
  // console.log(totalGames.value, gamesPerIteration.value)
  collectStats(parseInt(totalGames.value), parseInt(gamesPerIteration.value))
 
}