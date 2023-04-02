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

/** Create a Neural Network for usage */
const options = {
  task: "regression",
  debug: true,
};

function loadData() {
  nn = ml5.neuralNetwork(options);

  /**
   * Loads in the model
   */
  const modelInfo = {
    model: "./model/model.json",
    metadata: "./model/model_meta.json",
    weights: "./model/model.weights.bin",
  };

  nn.load(modelInfo, () => console.log("Model loaded!"));

  // Show elements after loading
  predictButton.style.display = "inline-block";
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
