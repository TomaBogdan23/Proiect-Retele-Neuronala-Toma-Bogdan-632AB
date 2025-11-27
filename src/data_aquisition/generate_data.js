const fs = require('fs');
const path = require('path');


const OUTPUT_DIR = path.join(__dirname, 'data', 'raw');


const formatDate = (date) => {
   
    return date.toISOString().split('.')[0];
};


const randomDouble = (min, max) => {
    return Math.random() * (max - min) + min;
};


const main = () => {
    
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`✔ Director creat: ${OUTPUT_DIR}`);
    }

    console.log("--- Începere Generare Date Flotă (JavaScript) ---");

    generateVibrationData();
    generateBrakeData();
    generateFluidData();

    console.log("--- Generare Completă! Verifică folderul 'data/raw' ---");
};


const generateVibrationData = () => {
    const filePath = path.join(OUTPUT_DIR, 'vib_data.csv');
    let content = "id,timestamp,vib_x_fft,vib_y_fft,vib_z_fft,freq_bin,label\n";

    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 4); 

    for (let i = 1; i <= 30; i++) {
        const isFaulty = i > 20; 
        const label = isFaulty ? "faulty_bearing" : "normal";

        let vibX, vibY, vibZ;

        if (isFaulty) {
            vibX = randomDouble(40.0, 80.0); 
            vibY = randomDouble(10.0, 20.0);
            vibZ = randomDouble(5.0, 10.0);
        } else {
            vibX = randomDouble(5.0, 15.0);  
            vibY = randomDouble(5.0, 13.0);
            vibZ = randomDouble(2.0, 6.0);
        }

        const freqBin = ((i % 4) + 1) * 50; 

        
        content += `${i},${formatDate(currentTime)},${vibX.toFixed(2)},${vibY.toFixed(2)},${vibZ.toFixed(2)},${freqBin},${label}\n`;

        
        currentTime.setSeconds(currentTime.getSeconds() + 1);
    }

    fs.writeFileSync(filePath, content);
    console.log(`✔ Generat: ${filePath}`);
};


const generateBrakeData = () => {
    const filePath = path.join(OUTPUT_DIR, 'brake_data.csv');
    let content = "id,timestamp,brake_temp,brake_pressure,brake_wear\n";

    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - 2);
    
    let currentWear = 12.50;

    for (let i = 1; i <= 30; i++) {
        
        let pressure = 0.0;
        if (Math.random() > 0.6) {
            pressure = randomDouble(50.0, 120.0);
        }

       
        let temp = 25.0 + (pressure * 1.8) + randomDouble(0, 10.0);

        
        if (pressure > 0) {
            currentWear += randomDouble(0.01, 0.03);
        }

        // Simulare valoare lipsă la indexul 10
        let tempStr = temp.toFixed(1);
        if (i === 10) {
            tempStr = ""; 
        }

        content += `${i},${formatDate(currentTime)},${tempStr},${pressure.toFixed(1)},${currentWear.toFixed(2)}\n`;

        // Incrementăm timpul cu 5 secunde
        currentTime.setSeconds(currentTime.getSeconds() + 5);
    }

    fs.writeFileSync(filePath, content);
    console.log(`✔ Generat: ${filePath}`);
};

// --- 3. Generare Date Fluide (Serii de timp) ---
const generateFluidData = () => {
    const filePath = path.join(OUTPUT_DIR, 'fluid_data.csv');
    let content = "id,timestamp,oil_level,coolant_level,brake_fluid\n";

    let currentTime = new Date();
    currentTime.setDate(currentTime.getDate() - 15); // Începe acum 15 zile

    let oil = 99.5;
    let coolant = 98.0;
    let brakeFluid = 99.9;

    for (let i = 1; i <= 15; i++) {
        // Ulei și frână scad încet (normal)
        oil -= randomDouble(0.05, 0.1);
        brakeFluid -= randomDouble(0.01, 0.03);

        // Lichidul de răcire are o problemă (scurgere) după ziua 7
        if (i > 7) {
            coolant -= randomDouble(3.0, 5.0); // Scădere masivă
        } else {
            coolant -= 0.05; // Scădere normală
        }

        // Limite minime
        if (oil < 0) oil = 0;
        if (coolant < 0) coolant = 0;

        content += `${i},${formatDate(currentTime)},${oil.toFixed(1)},${coolant.toFixed(1)},${brakeFluid.toFixed(1)}\n`;

        // Incrementăm timpul cu 1 zi
        currentTime.setDate(currentTime.getDate() + 1);
    }

    fs.writeFileSync(filePath, content);
    console.log(`✔ Generat: ${filePath}`);
};

// Pornire script
main();