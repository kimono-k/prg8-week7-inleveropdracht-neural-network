# PRG8 - Week 7 - Inleveropdracht

- Kies een CSV file uit de data map [geschikt voor regression]
  - mobilephones.csv
- Train het neural network met meerdere kolommen
  - Mobile Phone PRICE bepalen aan de hand van de SPECS en RESOLUTION van een telefoon.
  - PRICE AND SPECS ONLY FOR SCATTERPLOT
- Bepaal hoeveel epochs en welke kolommen je nodig hebt
  - epochs zo dicht mogelijk op 0 instellen
- Sla het model op

- Laad je model in een nieuwe HTML pagina, waarin je via een UI een voorspelling kan doen
- Plaats je shit online, en vul feedbackfruits in.

# CSV data

- mobilephones.csv

# Data voorbereiden

gelukt---

# Trainen met meerdere kolommen

- meerdere kolommen:
- price, specs, and resolution

function checkData(data){
// data voorbereiden
data.sort(() => (Math.random() - 0.5))
let trainData = data.slice(0, Math.floor(data.length _ 0.8))
let testData = data.slice(Math.floor(data.length _ 0.8) + 1)

    // neural network aanmaken
    nn = ml5.neuralNetwork({ task: 'regression', debug: true })

    // data toevoegen aan neural network
    for(let car of trainData){
        nn.addData({ horsepower: car.horsepower, weight: car.weight, cylinders:car.cylinders }, { mpg: car.mpg })
    }

}

# Voorspelling doen met de testdata

Om te kijken of het trainen goed is gegaan doe je een voorspelling met testdata. Let op dat je hierbij !!dezelfde kolommen gebruikt als bij het trainen!!.

async function makePrediction() {
const testCar = { horsepower: testData[0].horsepower, weight: testData[0].weight, cylinders:testData[0].cylinders }
const pred = await nn.predict(testCar)
console.log(pred[0].mpg)
}

Je kan voorspellingen van je testdata aan je scatterplot toevoegen door een x en y as te kiezen, bijvoorbeeld x = horsepower en y = mpg.
