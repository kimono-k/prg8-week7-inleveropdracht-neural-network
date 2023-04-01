import { createChart, updateChart } from "./scatterplot.js";

// Neural Network: Can find complex patterns in data and works with regression
// Regression: When the neural network gives back a numeric value
let nn;

// Getting DOM elements
const predictButton = document.getElementById("btn");
const inputField = document.getElementById("field");
const resultDiv = document.getElementById("result");

// Hide the elements on the first boot
// inputField.style.display = "none";
// predictButton.style.display = "none";

/**
 * Fires the prediction and shows it in the viewport
 */
predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let inputFieldValue = document.getElementById("field").value;
  makePrediction(+inputFieldValue);
});

/**
 * Preparing the data
 */
function loadData() {
  Papa.parse("./data/mobilephone.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => createNeuralNetwork(results.data),
  });
}

/**
 * Creating a Neural Network
 */
function createNeuralNetwork(data) {
  // Shuffle: Prevents that the Neural Network learns the exact order of CSV data
  data.sort(() => Math.random() - 0.5);

  // Slice data into test and training data
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  let testData = data.slice(Math.floor(data.length * 0.8) + 1);
  console.table(testData);

  const options = {
    task: "regression",
    debug: true,
  };

  // Create Neural Network
  nn = ml5.neuralNetwork(options);

  // Adding data to the Neural Network
  for (let mobilePhone of trainData) {
    let inputs = {
      weight: mobilePhone.weight,
      resoloution: mobilePhone.resoloution,
      ppi: mobilePhone.ppi,
      cores: mobilePhone.cores,
    };

    nn.addData(inputs, { price: mobilePhone.price });
  }

  // Normalize: Prevents that some columns have higher precedence than others
  nn.normalizeData();

  //Pass data to next function
  checkData(trainData, testData);
}

/**
 * Checks if loading of CSV file was succesful
 */
function checkData(trainData, testData) {
  console.table(testData);

  /**
   * Scatterplot = A type of mathematical diagram using Cartesian coordinates
   * to display values for typically two variables for a set of data
   * The scatterplot only consists of x and y, it's not like Neural Network
   */

  // Prepare the data for the scatterplot
  const chartdata = trainData.map((mobilePhone) => ({
    x: mobilePhone.price,
    y: mobilePhone.weight,
  }));

  // Create a scatterplot
  createChart(chartdata, "Weight", "Price");

  // Pass data to next function
  startTraining(trainData, testData);
}

/**
 * Trains the neural network
 * epochs: A value that should be as close as possible to value 0
 */
function startTraining(trainData, testData) {
  nn.train({ epochs: 20 }, () => finishedTraining(trainData, testData));
}

async function finishedTraining(trainData = false, testData) {
  // Empty array to push all the data in later on
  let predictions = [];
  // For loop for every possible price in CSV
  for (let pr = 1200; pr < 4000; pr += 100) {
    const testPhone = {
      weight: testData[0].weight,
      resoloution: testData[0].resoloution,
      ppi: testData[0].ppi,
      cores: testData[0].cores,
    };
    const pred = await nn.predict(testPhone);
    predictions.push({ x: pr, y: pred[0].price });
  }

  // Adds the neural network data to the chart
  updateChart("Predictions", predictions);
  console.log("Finished training!");

  // Show the DOM elements after loading the scatterplot and neural network
  inputField.style.display = "inline";
  predictButton.style.display = "inline";
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(value) {
  const results = await nn.predict({ price: testData[0] });
  resultDiv.innerText = `Geschat verbruik: ${results[0].price}`;
}

loadData();
