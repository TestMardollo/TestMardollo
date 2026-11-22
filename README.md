# Test Mardollo — Web App Cronometro Apnea (Vasca 25m)

[![Licenza: GNU AGPLv3](https://img.shields.io/badge/Licenza-GNU%20AGPLv3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html)
[![PWA Offline](https://img.shields.io/badge/PWA-100%25%20Offline-0284c7.svg)](https://testmardollo.github.io/TestMardollo/)
[![Privacy](https://img.shields.io/badge/Privacy-Zero--Backend%20%7C%20GDPR--free-16a34a.svg)](#privacy-by-design-100-locale)

Progressive Web App (PWA) leggera, gratuita e **100% locale** per l'esecuzione a bordo vasca del **Test Mardollo** in piscina da **25 metri**, con calcolo immediato delle soglie fisiologiche di allenamento, generazione del report in PDF ed esportazione dati per allenatori in formato ZIP/CSV.

👉 **Apri l'applicazione:** [https://testmardollo.github.io/TestMardollo/](https://testmardollo.github.io/TestMardollo/)

---

> ⚠️ **AVVERTENZA DI SICUREZZA IN ACQUA**  
> Il Test Mardollo deve essere eseguito **esclusivamente in piscina sorvegliata** e sotto la diretta assistenza di un istruttore o assistente qualificato nella sicurezza in apnea. Non praticare mai apnea da soli. L'applicazione è fornita "così com'è" (*AS IS*) come mero strumento cronometrico e di calcolo.

---

## Installazione su Smartphone e Uso Offline

L'app funziona interamente offline dopo la prima apertura (comprese la generazione del PDF da condividere e l'esportazione del file ZIP/CSV).

* **Android (Chrome):** Apri [l'URL dell'app](https://testmardollo.github.io/TestMardollo/), tocca il menu `⋮` in alto a destra e seleziona **Installa app** (o **Aggiungi a schermata Home**).
* **iOS (Safari):** Apri [l'URL dell'app](https://testmardollo.github.io/TestMardollo/), tocca l'icona **Condividi** e seleziona **Aggiungi alla schermata Home**.

*(Aprire l'app almeno una volta con connessione attiva prima di recarsi a bordo vasca per consentire al Service Worker di salvare in cache i file statici e le librerie di esportazione.)*

---

## Protocollo e Funzionalità

Il Test Mardollo consiste in **6 minuti continui** in vasca da **25m**, alternando una vasca in apnea dinamica (vasche dispari, schermata **Blu**) e una vasca di recupero attivo a dorso (vasche pari, schermata **Verde**). In caso di vasca da 50m è possibile valutare di fare metà vasca in apnea e l'altra metà in recupero attivo.
Per rendere confrontabili i dati durante la stagione è importante che il test venga effettuato sempre nelle medesime condizioni. Si suggerisce quindi di effettuare il test con pinne e maschera, senza muta e/o pesi che potrebbero variare in base allo stato di allenamento dell'atleta.

L'interfaccia è divisa in **3 schermate sequenziali**:

1. **Pre-Test (Impostazione Rapida):** Parametro vasca fisso a 25m e campi facoltativi per identificativo atleta, profilo antropometrico (età, sesso, altezza, peso) e livello.
2. **Cronometro (6:00):**
   * Pulsante gigante a tutto schermo (~80% del display) progettato per l'uso con mani bagnate senza guardare il telefono.
   * Timer ad alta precisione (`performance.now()`), blocco spegnimento schermo, segnale acustico e vibrazione allo scadere dei 6:00.
   * Tasto secondario **Annulla ultimo tocco** protetto da **doppio tocco**.
   * Inserimento rapido (slider o pulsanti) dei **metri residui (0–24m)** percorsi nell'ultima vasca incompleta allo scadere del tempo.
3. **Post-Test & Esportazione:**
   * Riepilogo immediato, grafico a barre affiancate Blu/Verde e tabella soglie calcolate.
   * Selettori rapidi facoltativi per riscaldamento, posizione braccia, attrezzatura (pinne, muta, cintura, collare), sensazioni fisiche su scala `0–3` e note libere.
   * **Condividi Report PDF** (Web Share API nativa o download diretto, nome file `TestMardollo - AAAAMMGG - Nome Atleta.pdf`).
   * **Esporta Dati Allenatore (ZIP/CSV)** per il monitoraggio stagionale.
   * **Nuovo Test / Pulisci Dati** per azzerare completamente la memoria RAM al termine del test.

---

## Calcolo delle Soglie Fisiologiche

A partire dalle sole **vasche da 25m completate interamente in apnea** (escludendo l'eventuale frazione residua finale):

* **Con 3 o più vasche in apnea:** media aritmetica dei tempi scartando il tempo più veloce (`min`) e quello più lento (`max`), moltiplicata per 2 per ottenere **A2 su 50m**.
* **Con meno di 3 vasche in apnea:** media aritmetica semplice dei tempi completati, moltiplicata per 2.

| Zona | Descrizione Fisiologica | Formula di Calcolo |
| :--- | :--- | :--- |
| **A2** | Capacità Aerobica | Base 50m • `75m = A2(50m) + A2(50m)/2` • `100m = A2(50m) × 2` • `125m = A2(50m)×2 + A2(50m)/2` |
| **B1** | Soglia Anaerobica | `B1 = A2 − (A2 × 0,10)` |
| **B2** | VO2 Max | `B2 = B1 − (B1 × 0,10)` |
| **C1** | Tolleranza al Lattato | `C1 = B2 − (B2 × 0,05)` |

Nel Report PDF i tempi sono mostrati in formato leggibile `ss.cc`; nei file CSV sono esportati in secondi decimali con virgola (es. `42,50`) per elaborazioni dirette in fogli di calcolo.

---

## Esportazione Dati per Allenatori (ZIP / Doppio CSV)

Il pacchetto `TestMardollo_AAAAMMGG_Atleta.zip` contiene due file CSV codificati in **UTF-8 con BOM** (separatore di colonna `;`, decimale `,`, date ISO `AAAA-MM-GG`), pronti per l'apertura diretta in Microsoft Excel e Google Sheets e relazionati tramite chiave univoca `TEST_ID`:

* **`mardollo_summary.csv`** (1 riga per test): riepilogo completo di profilo, attrezzatura, distanze, medie, soglie su base 50m e sensazioni fisiche per il registro stagionale.
* **`mardollo_vasche.csv`** (1 riga per vasca): dettaglio parziale di ogni frazione (`APNEA`, `RECUPERO`, `RESIDUO`) con distanza, tempo e velocità in `m/s` per analizzare la curva di decadimento tramite Tabelle Pivot.

---

## Privacy by Design (100% Locale)

* **Zero-Backend:** nessun dato anagrafico, biometrico o prestazionale viene trasmesso a server esterni, database o fogli online.
* **Memoria Volatile:** l'app elabora tutto nella RAM temporanea del browser senza usare `localStorage` o cookie di tracciamento, tutelando la riservatezza anche su dispositivi condivisi a bordo vasca.
* **Controllo Totale:** i file PDF e ZIP vengono generati direttamente sul dispositivo dell'utente, che sceglie liberamente se e con chi condividerli.

---

## Struttura Tecnica del Repository

Progetto statico in puro **HTML5 / CSS3 / JavaScript Vanilla** ospitato su GitHub Pages:

* `index.html` — Applicazione completa (UI, cronometro, calcolo soglie, grafico Canvas, generatore PDF con `jsPDF` ed export ZIP con `JSZip`).
* `manifest.json` — Configurazione PWA per l'installazione sulla schermata Home.
* `sw.js` — Service Worker per la cache offline dei soli file statici e delle librerie JS.
* `icon.svg` — Icona vettoriale dell'applicazione.

---

## Licenza

Distribuito sotto licenza **GNU Affero General Public License v3.0 (GNU AGPLv3)**. Consulta il file [LICENSE](./LICENSE) per i dettagli completi.
