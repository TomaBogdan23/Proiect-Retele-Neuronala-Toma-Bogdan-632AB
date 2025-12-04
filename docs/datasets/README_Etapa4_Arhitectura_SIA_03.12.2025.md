# 📘 README – Etapa 4: Arhitectura Completă a Aplicației SIA bazată pe Rețele Neuronale

**Disciplina:** Rețele Neuronale  
**Instituție:** POLITEHNICA București – FIIR  
**Student:** Toma Bogdan Marian - 632AB
**Link Repository GitHub**
**Data:** 4.12.2025
---

## Scopul Etapei 4

Am livrat un **SCHELET COMPLET și FUNCȚIONAL** al sistemului **SIA-HDS** (Sistem Inteligent de Diagnoză Holistică) denumit de mine Sistem Integrat de Diagnoză și Prognoză a Stării de Sănătate a Vehiculului intr-o flota auto.
Întreaga aplicație este dezvoltată în ecosistemul **JavaScript (Node.js)** pentru o integrare nativă între backend și modulele de Inteligență Artificială (TensorFlow.js). De asemenea am folosit **JavaScript (Node.js)** pentru a genera setul de date folosit la rularea sistemului.

### IMPORTANT - Ce înseamnă "schelet funcțional":

 **CE TREBUIE SĂ FUNCȚIONEZE:**
- Toate modulele pornesc fără erori
- Pipeline-ul complet rulează end-to-end (de la date → până la output UI)
- Modelul RN este definit și compilat (arhitectura există)
- Web Service/UI primește input și returnează output

 **CE NU E NECESAR ÎN ETAPA 4:**
- Model RN antrenat cu performanță bună
- Hiperparametri optimizați
- Acuratețe mare pe test set
- Web Service/UI cu funcționalități avansate


##  Livrabile Obligatorii

### 1. Tabelul Nevoie Reală → Soluție SIA → Modul Software (max ½ pagină)

| **Nevoie reală concretă** | **Cum o rezolvă SIA-ul vostru** | **Modul software responsabil** |
|---------------------------|--------------------------------|--------------------------------|
| **Mentenanță predictivă Motor & Cutie:** Detectarea uzurii lagărelor înainte de blocare | Analiză spectrală (FFT) a vibrațiilor cu CNN 1D → detecție anomalii > 90% | **Modul 1 (Simulare LabVIEW)** + **Modul 2 (Node.js - TFJS CNN)** |
| **Siguranță Sistem Frânare:** Estimarea distanței rămase până la schimbul plăcuțelor | Predicție RUL (km rămași) bazată pe istoricul de senzori folosind LSTM | **Modul 2 (Node.js - TFJS LSTM)** + **Modul 3 (API Express)** |
| **Management Fluide:** Detectarea scurgerilor de ulei/lichid răcire | Analiză serii de timp pentru detecția scăderilor anormale de nivel | **Modul 2 (Node.js - TFJS LSTM)** |
| **Optimizare Logistică:** Centralizarea deciziilor de service | Agregarea a 4 diagnoze într-un singură recomandare JSON unificată | **Modul 3 (Controller Logic - JS)** |



### 2. Contribuția Voastră Originală la Setul de Date – MINIM 40% din Totalul Observațiilor Finale

**Total observații finale:** 10,000 (estimat)
**Observații originale:** 10,000 (100%)

**Tipul contribuției:**
[X] Date generate prin simulare algoritmică (JavaScript/Node.js)
[ ] Date achiziționate cu senzori proprii
[ ] Etichetare/adnotare manuală

**Descriere detaliată:**
Am ales generarea datelor folosind **scripturi personalizate în JavaScript (Node.js)** pentru a menține o stivă tehnologică unitară și pentru a avea un control matematic precis asupra generării seturilor de date.
1.  **Vibrații (Motor/Cutie):** Am implementat funcții matematice în JS care simulează semnale de accelerometre triaxiale prin compunerea de unde sinusoidale (frecvențe fundamentale și armonici) peste care am adăugat zgomot aleator (white noise) generat algoritmic, emulând astfel uzura mecanică.
2.  **Senzori Analogici (Frâne/Fluide):** Am creat algoritmi care generează serii de timp ce reflectă degradarea progresivă (uzura plăcuțelor) sau scăderea nivelului de fluide, corelate direct cu un contor de kilometraj virtual incrementat în cadrul buclei de generare.

**Locația codului de generare:** `src/data_acquisition/generators/`
**Locația datelor generate:** `data/generated/`


---

### 3. Diagrama State Machine a Întregului Sistem (OBLIGATORIE)

**Locație fișier:** `docs/state_machine.png`

### Justificarea State Machine-ului ales:

Am implementat o arhitectură asincronă bazată pe evenimente, specifică Node.js, modelată ca un pipeline de procesare secvențială:

**Stările principale sunt:**
1.  **DATA_INGESTION (Server Idle):** API-ul Express.js așteaptă primirea datelor CSV simulate de la generator.
2.  **PREPROCESSING (JS Worker):** Odată primite, datele sunt citite cu `csv-parser`. Pentru vibrații, se aplică FFT (biblioteca `fft-js`) pentru a trece din domeniul timp în frecvență direct în Node.js.
3.  **MODEL_LOADING:** Sistemul verifică asincron dacă modelele salvate în `models/` sunt încărcate în memorie.
4.  **INFERENCE_BATCH:** Se execută predicția paralelă:
    * `model_motor.predict(tensor_vib)` (CNN)
    * `model_cutie.predict(tensor_vib)` (CNN)
    * `model_frana.predict(tensor_senzori)` (LSTM)
    * `model_fluide.predict(tensor_senzori)` (LSTM)
5.  **AGGREGATION & RESPONSE:** Rezultatele sunt combinate într-un obiect JSON final trimis clientului.

---

### 4. Scheletul Complet al celor 3 Module Cerute la Curs (slide 7)

Aplicația este 100% JavaScript.

| **Modul** | **Tehnologie Aleasă** | **Stadiu la Predare** |
|-----------|-----------------------|-----------------------|
| **1. Data Logging / Acquisition** | **Node.js Scripts** | **Funcțional.** Scriptul `generate_data.js` creează fișierele CSV (`vib_data.csv`, etc.) matematic corecte pentru antrenare. |
| **2. Neural Network Module** | **TensorFlow.js (Node)** | **Funcțional.** Fișierul `src/neural_network/build_models.js` definește arhitectura (Layere Conv1D, LSTM, Dense) și compilează modelele. Acestea sunt salvate în format `file://./models/`. |
| **3. Web Service / API** | **Express.js** | **Funcțional.** Serverul `server.js` expune endpoint-ul `POST /diagnose`. Primește date, apelează modelele și returnează diagnoza. |

#### Instrucțiuni de rulare (Node.js):

1.  **Prerechizite:** Asigurați-vă că aveți Node.js instalat.
2.  **Instalare dependențe:**
    ```bash
    npm install express @tensorflow/tfjs-node csv-parser fft-js
    ```
3.  **Pasul 1: Generare Date:**
    ```bash
    node src/data_acquisition/generators/generate_data.js
    # Generează fișierele CSV în data/generated/
    ```
4.  **Pasul 2: Construire Modele (Schelet):**
    ```bash
    node src/neural_network/build_models.js
    # Salvează structura modelelor în folderul models/
    ```
5.  **Pasul 3: Pornire Server:**
    ```bash
    node src/app/server.js
    # Serverul pornește pe portul 3000
    ```

---

## Structura Repository-ului

proiect-rn-toma-bogdan/
│
├── 📂 data/                          # STOCARE DATE
│   └── 📂 generated/                 # (OUTPUT Modul 1) Date simulate algoritmic
│       ├── 📄 vib_motor_sim.csv      # 10k samples: Vibrații motor (Normal/Defect)
│       ├── 📄 vib_cutie_sim.csv      # 10k samples: Vibrații transmisie
│       └── 📄 senzori_frana_sim.csv  # 10k samples: Serii de timp senzori
│
├── 📂 src/                           # COD SURSĂ (Node.js)
│   │
│   ├── 📂 data_acquisition/          # ➤ MODUL 1: Generator Date
│   │   └── 📂 generators/
│   │       └── 📜 generate_data.js   # Script matematic de simulare (fără LabVIEW)
│   │
│   ├── 📂 neural_network/            # ➤ MODUL 2: Inteligență Artificială
│   │   ├── 📜 build_models.js        # Definește și compilează CNN + LSTM (TFJS)
│   │   └── 📜 train_stub.js          # Scheletul procesului de antrenare
│   │
│   └── 📂 app/                       # ➤ MODUL 3: Aplicație & API
│       ├── 📜 server.js              # Server Express.js (Endpoint /diagnose)
│       └── 📜 logic.js               # "Brain": Agregă rezultatele celor 4 modele
│
├── 📂 docs/                          # DOCUMENTAȚIE
│   ├── 🖼️ state_machine.png          # Diagrama fluxului de stări (Obligatorie)
│   └── 📂 screenshots/
│       └── 🖼️ api_test.png           # Screenshot dovadă răspuns JSON
│
├── 📂 models/                        # (OUTPUT Modul 2) Modele TFJS salvate
│   ├── 📄 model.json                 # Arhitectura rețelei
│   └── 📄 weights.bin                # Ponderile (binare)
│
├── 📜 package.json                   # Dependențe (express, tensorflow, csv-parser)
├── 📝 README.md                      # Documentația generală a proiectului
└── 📝 README_Etapa4_Arhitectura_SIA.md  # Documentația specifică Etapei 4


**Diferențe față de Etapa 3:**
- Adăugat `data/generated/` pentru contribuția dvs originală
- Adăugat `src/data_acquisition/` 
- Adăugat `src/app/` 
- Adăugat `models/` pentru model neantrenat
- Adăugat `docs/state_machine.png` - OBLIGATORIU





