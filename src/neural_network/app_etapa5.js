/**
 * SIA-HDS: Etapa 5 - Antrenare Rețea Neuronală (Implementare Nativă JS)
 * Student: Toma Bogdan Marian
 * Grupa: 632AB
 * * Acest script implementează o rețea neuronală de tip Perceptron "from scratch"
 * pentru a satisface cerințele academice fără a necesita librării externe (TensorFlow).
 */

const fs = require('fs');
const path = require('path');

// --- CONFIGURARE ---
const CONFIG = {
    trainSplit: 0.8,      // 80% Antrenare, 20% Testare
    epochs: 50,           // Număr de iterații prin setul de date
    learningRate: 0.01,   // Rata de învățare
    files: {
        vib: path.join(__dirname, 'data', 'vib_data.csv'),
        brake: path.join(__dirname, 'data', 'brake_data.csv'),
        fluid: path.join(__dirname, 'data', 'fluid_data.csv'),
        reportTxt: path.join(__dirname, 'raport_performanta.txt'),
        reportCsv: path.join(__dirname, 'raport_final.csv'),
        modelJson: path.join(__dirname, 'model_salvat.json')
    }
};

// --- 1. CLASA REȚEA NEURONALĂ (PERCEPTRON) ---
class SimpleNeuralNetwork {
    constructor(inputNodes) {
        this.weights = new Array(inputNodes).fill(0).map(() => Math.random() - 0.5);
        this.bias = Math.random() - 0.5;
    }

    // Funcția de activare (Sigmoid) - transformă outputul în probabilitate (0-1)
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Derivata Sigmoid (pentru backpropagation)
    sigmoidDerivative(x) {
        return x * (1 - x);
    }

    // Feedforward (Predicție)
    predict(inputs) {
        let sum = this.bias;
        for (let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i];
        }
        return this.sigmoid(sum);
    }

    // Antrenare (Gradient Descent)
    train(trainingData) {
        console.log(`\n--- START ANTRENARE (${CONFIG.epochs} Epoci) ---`);
        
        for (let epoch = 1; epoch <= CONFIG.epochs; epoch++) {
            let totalError = 0;

            trainingData.forEach(data => {
                // 1. Predicție
                const output = this.predict(data.features);
                
                // 2. Calcul Eroare
                const error = data.label - output;
                totalError += Math.abs(error);

                // 3. Ajustare Ponderi (Backpropagation simplificat)
                const adjustment = error * this.sigmoidDerivative(output) * CONFIG.learningRate;
                
                for (let i = 0; i < this.weights.length; i++) {
                    this.weights[i] += adjustment * data.features[i];
                }
                this.bias += adjustment;
            });

            // Afișăm progresul la fiecare 10 epoci
            if (epoch % 10 === 0 || epoch === 1) {
                console.log(`Epoca ${epoch}/${CONFIG.epochs} | Eroare Totală: ${totalError.toFixed(4)}`);
            }
        }
        console.log("--- ANTRENARE COMPLETĂ ---\n");
    }
}

// --- 2. UTILITARE CITIRE DATE ---
function readCSV(filePath) {
    try {
        const rawData = fs.readFileSync(filePath, 'utf8');
        const lines = rawData.split(/\r?\n/).filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                let entry = {};
                headers.forEach((h, idx) => entry[h] = values[idx].trim());
                data.push(entry);
            }
        }
        return data;
    } catch (e) {
        console.error(`Eroare citire ${filePath}:`, e.message);
        return [];
    }
}

// Procesare specifică pentru Vibrații (Inputs: FFT X, Y, Z -> Output: 0 sau 1)
function prepareVibData(rawData) {
    return rawData.map(row => ({
        // Normalizăm valorile (împărțim la 100 pentru a fi între 0 și 1)
        features: [
            parseFloat(row.vib_x_fft) / 100,
            parseFloat(row.vib_y_fft) / 100,
            parseFloat(row.vib_z_fft) / 100
        ],
        // Label: 'normal' = 0, 'faulty_bearing' = 1
        label: row.label && row.label.includes('faulty') ? 1 : 0,
        original: row
    }));
}

// --- 3. FUNCȚII EVALUARE (Matrice de Confuzie) ---
function evaluateModel(network, testData) {
    let tp = 0, tn = 0, fp = 0, fn = 0;

    testData.forEach(item => {
        const predictedProb = network.predict(item.features);
        const predictedLabel = predictedProb > 0.5 ? 1 : 0; // Prag de decizie 0.5
        const actualLabel = item.label;

        if (predictedLabel === 1 && actualLabel === 1) tp++;
        if (predictedLabel === 0 && actualLabel === 0) tn++;
        if (predictedLabel === 1 && actualLabel === 0) fp++;
        if (predictedLabel === 0 && actualLabel === 1) fn++;
    });

    const accuracy = (tp + tn) / testData.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = 2 * (precision * recall) / (precision + recall) || 0;

    return { tp, tn, fp, fn, accuracy, precision, recall, f1 };
}

// --- 4. MAIN FLOW ---
async function main() {
    console.log("=== SIA-HDS: ETAPA 5 - ANTRENARE & EVALUARE ===\n");

    // A. Încărcare Date
    const vibRaw = readCSV(CONFIG.files.vib);
    const brakeRaw = readCSV(CONFIG.files.brake);
    const fluidRaw = readCSV(CONFIG.files.fluid);

    if (vibRaw.length === 0) { console.error("Nu s-au găsit date!"); return; }

    // B. Pregătire Date pentru RN (Vibrații)
    const dataset = prepareVibData(vibRaw);
    
    // Split Train/Test (Manual, fără librării)
    const splitIndex = Math.floor(dataset.length * CONFIG.trainSplit);
    const trainData = dataset.slice(0, splitIndex);
    const testData = dataset.slice(splitIndex);

    console.log(`Dataset Total: ${dataset.length}`);
    console.log(`> Set Antrenare: ${trainData.length}`);
    console.log(`> Set Testare:   ${testData.length}`);

    // C. Inițializare și Antrenare Rețea
    // Avem 3 input-uri (Vib X, Y, Z)
    const neuralNet = new SimpleNeuralNetwork(3);
    neuralNet.train(trainData);

    // D. Evaluare Model
    console.log("Evaluare performanță pe setul de testare...");
    const metrics = evaluateModel(neuralNet, testData);

    // E. Generare Raport Performanță (txt)
    const reportContent = `
=== RAPORT PERFORMANȚĂ REȚEA NEURONALĂ (SIA-HDS) ===
Data: ${new Date().toLocaleString()}
Arhitectură: Perceptron (Single Layer)
Input Nodes: 3 (Vib_X, Vib_Y, Vib_Z)
Output: Clasificare Binară (0=Normal, 1=Defect)

REZULTATE METRICE:
------------------
Acuratețe Globală: ${(metrics.accuracy * 100).toFixed(2)}%
Precizie:          ${(metrics.precision * 100).toFixed(2)}%
Recall (Sensibilitate): ${(metrics.recall * 100).toFixed(2)}%
F1 Score:          ${metrics.f1.toFixed(4)}

MATRICE DE CONFUZIE:
------------------
                 | Prez. Normal | Prez. Defect
Real Normal      |     ${metrics.tn} (TN)     |     ${metrics.fp} (FP)
Real Defect      |     ${metrics.fn} (FN)     |     ${metrics.tp} (TP)
------------------
Concluzie: Modelul ${metrics.accuracy > 0.8 ? "este pregătit" : "necesită re-antrenare"} pentru producție.
`;

    fs.writeFileSync(CONFIG.files.reportTxt, reportContent);
    console.log(`✅ Raportul de performanță a fost salvat în: ${CONFIG.files.reportTxt}`);

    // F. Salvare Model (JSON)
    const modelState = {
        weights: neuralNet.weights,
        bias: neuralNet.bias,
        architecture: "SimplePerceptron_JS"
    };
    fs.writeFileSync(CONFIG.files.modelJson, JSON.stringify(modelState, null, 2));
    console.log(`✅ Modelul antrenat a fost salvat în: ${CONFIG.files.modelJson}`);


    // G. Rulare Inferență Finală (Simulare Flux Complet pentru Raport CSV)
    // Folosim modelul antrenat pentru a evalua starea curentă a vehiculului
    console.log("\nGenerare Raport Final CSV (Inferență)...");
    
    // Luăm ultima citire din fiecare senzor
    const lastVib = dataset[dataset.length - 1];
    const lastBrake = brakeRaw[brakeRaw.length - 1];
    const lastFluid = fluidRaw[fluidRaw.length - 1];

    // Predicție Motor cu Rețeaua Antrenată
    const engineScore = neuralNet.predict(lastVib.features);
    const engineStatus = engineScore > 0.5 ? "DEFECT_PROBABIL" : "OPTIM";

    // Logică simplă pentru restul (Reguli)
    const brakeRul = (parseFloat(lastBrake.brake_wear) - 2.0) * 2000;
    const fluidStatus = parseFloat(lastFluid.oil_level) < 20 ? "CRITIC" : "OK";

    const csvHeader = "ID,Timestamp,Status_Motor_RN,Scor_Incredere_RN,Status_Frane,RUL_Km,Status_Fluide\n";
    const csvRow = `B-101-CUR,${new Date().toISOString()},${engineStatus},${engineScore.toFixed(4)},${brakeRul > 5000 ? "OK" : "SCHIMBA"},${brakeRul.toFixed(0)},${fluidStatus}\n`;

    fs.writeFileSync(CONFIG.files.reportCsv, csvHeader + csvRow);
    console.log(`✅ Raportul final CSV a fost generat: ${CONFIG.files.reportCsv}`);
}

main();