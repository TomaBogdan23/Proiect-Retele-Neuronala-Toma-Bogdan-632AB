# 📘 README – Etapa 5: Configurarea și Antrenarea Modelului RN

**Disciplina:** Rețele Neuronale  
**Instituție:** POLITEHNICA București – FIIR  
**Student:** Toma Bogdan Marian
**Link Repository GitHub:** https://github.com/TomaBogdan23/Proiect-Retele-Neuronala-Toma-Bogdan-632AB/tree/main
**Data predării:** 11.12.2025

---

1. Obiectivul Etapei 5
În această etapă, am realizat implementarea propriu-zisă, antrenarea și validarea modelului de Inteligență Artificială responsabil cu detectarea defecțiunilor la motor (Rulmenți).

Notă Tehnică Importantă: Pentru a demonstra înțelegerea profundă a algoritmilor de învățare, am ales să NU folosesc librării "black-box" (precum TensorFlow sau PyTorch) pentru această etapă. Am implementat de la zero (from scratch) în JavaScript nativ o rețea neuronală de tip Perceptron, incluzând funcția de activare Sigmoid și algoritmul de Backpropagation (Gradient Descent).



2. Descrierea Setului de Date & Pre-procesare
Datele utilizate provin din fișierul vib_data.csv generat în etapele anterioare.
Sursa datelor: Simulare algoritmică a vibrațiilor (Accelerometru triaxial).
Volum date: ~100+ înregistrări (extensibil).
Split Date:
     80% Antrenare: Utilizate pentru ajustarea ponderilor ($W$).
     20% Testare: Utilizate exclusiv pentru validarea finală (calculul acurateței).

Procesarea Datelor (Feature Engineering):
Codul citește datele brute și aplică următoarele transformări înainte de a intra în rețea:
Input (Features): vib_x_fft, vib_y_fft, vib_z_fft.
Normalizare: Valorile FFT (0-100) sunt împărțite la 100 pentru a aduce input-urile în intervalul [0, 1], necesar pentru convergența optimă a funcției Sigmoid.
Etichetare (Labeling):
     Dacă label conține "faulty" $\rightarrow$ Output 1 (Defect).
     Dacă label este "normal" $\rightarrow$ Output 0 (Normal).



3. Arhitectura Rețelei Neuronale
Am implementat o arhitectură Single-Layer Perceptron (Rețea cu un singur strat), suficientă pentru clasificarea liniară a datelor de vibrații.

Noduri de Intrare: 3 (corespunzătoare axelor X, Y, Z).

Noduri de Ieșire: 1 (Probabilitatea de defecțiune).

Ponderi (Weights): Inițializate aleatoriu (Math.random() - 0.5).

Bias: 1 neuron de bias antrenabil.

Funcția de Activare: Sigmoid

$$f(x) = \frac{1}{1 + e^{-x}}$$  - Aceasta transformă suma ponderată într-o probabilitate între 0 și 1.



4. Algoritmul de AntrenareProcesul de antrenare este implementat manual în clasa SimpleNeuralNetwork din fișierul app_etapa5.js:
Feedforward: Se calculează suma ponderată a intrărilor + bias, apoi se trece prin Sigmoid.
Calcul Eroare: $Eroare = (Tinta - Output)$.
Backpropagation (Ajustarea Ponderilor):Folosind metoda Gradient Descent, ponderile sunt actualizate la fiecare pas: $$W_{nou} = W_{vechi} + (Eroare \cdot DerivataSigmoid(Output) \cdot LearningRate)$$

Hiperparametri utilizați:
Epoci: 50 (Iterații complete prin setul de date).
Learning Rate (Rata de învățare): 0.01.


5. Evaluarea PerformanțeiDupă antrenare, modelul este testat pe setul de date nevăzut (20%). Metricele sunt calculate automat și salvate în raport_performanta.txt.
Metrice Implementate:
  Matricea de Confuzie: Numărul de TP (True Positives), TN, FP, FN.
  Acuratețe (Accuracy): $(TP + TN) / Total$.
  Precizie (Precision): Cât de multe defecte detectate sunt reale.
  Recall (Sensibilitate): Cât de multe defecte reale a reușit să găsească.
  
Exemplu de Rezultate (Generate de app_etapa5.js):Acuratețe Globală: > 90%Eroarea la finalul antrenamentului: Tinde spre 0.



6. Livrabile Generate de CodRularea scriptului generează automat următoarele fișiere cerute în proiect:

raport_performanta.txt: Conține detaliile tehnice ale antrenării, matricea de confuzie și scorurile F1.
model_salvat.json: Conține Ponderile ($W$) și Bias-ul învățate de rețea. Acest fișier permite salvarea "inteligenței" rețelei pentru a fi folosită ulterior fără re-antrenare.
raport_final.csv: Un fișier CSV gata de vizualizare în Excel, care conține decizia finală a SIA (Status Motor, Estimare Frâne, Recomandare Service).



7. Instrucțiuni de Rulare
Sistemul este construit să ruleze nativ, fără instalări complexe.

Cerințe: Node.js instalat.

Locație fișiere: Asigurați-vă că fișierele CSV (vib_data.csv, etc.) sunt în folderul data/.

Comandă: Deschideți terminalul în folderul proiectului și rulați:

Bash

node app_etapa5.js




