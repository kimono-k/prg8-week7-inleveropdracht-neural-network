import { createChart, updateChart } from "./scatterplot.js";

// Neural Network: Can find complex patterns in data and works with regression
// Regression: When the neural network gives back a numeric value
let nn;

// Getting DOM elements
const weightInputField = document.getElementById("weight-input-field");
const resoloutionInputField = document.getElementById(
  "resoloution-input-field"
);
const ppiInputField = document.getElementById("ppi-input-field");
const coresInputField = document.getElementById("cores-input-field");
const predictButton = document.getElementById("prediction-btn");
const saveButton = document.getElementById("save-btn");
const resultDiv = document.getElementById("result");

// Hide the elements on the first boot
predictButton.style.display = "none";
saveButton.style.display = "none";

/**
 * Fires the prediction and shows it in the viewport
 */
predictButton.addEventListener("click", (e) => {
  e.preventDefault();
  let weightInputFieldValue =
    document.getElementById("weight-input-field").value;
  let resoloutionInputFieldValue = document.getElementById(
    "resoloution-input-field"
  ).value;
  let ppiInputFieldValue = document.getElementById("ppi-input-field").value;
  let coresInputFieldValue = document.getElementById("cores-input-field").value;
  makePrediction(
    +weightInputFieldValue,
    +resoloutionInputFieldValue,
    +ppiInputFieldValue,
    +coresInputFieldValue
  );
});

/**
 * Save the trained model
 */
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  nn.save();
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
  weightInputField.style.display = "inline";
  resoloutionInputField.style.display = "inline";
  ppiInputField.style.display = "inline";
  coresInputField.style.display = "inline";
  predictButton.style.display = "inline";
  saveButton.style.display = "inline";
}

/**
 * Creates a prediction of the price of a phone based on its specs
 */
async function makePrediction(weight, resoloution, ppi, cores) {
  if (weight && resoloution && ppi && cores) {
    const results = await nn.predict(
      {
        weight: weight,
        resoloution: resoloution,
        ppi: ppi,
        cores: cores,
      },
      () => console.log("Prediction successful!")
    );
    const priceTwoDecimals = results[0].price.toFixed(2);
    resultDiv.innerText = `De prijs van de telefoon is €${priceTwoDecimals}`;
  } else {
    resultDiv.innerText = `Please fill in all the fields, numbskull!`;
  }
}

loadData();
