# 🌡️ HEATESCAPE
### **Urban Heat Island Monitor & Cooling Strategy Optimizer — Multi-City India**

HEATESCAPE is a state-of-the-art predictive data platform and interactive dashboard designed to monitor, analyze, and mitigate the **Urban Heat Island (UHI)** effect across six major Indian metropolitan areas: **Delhi NCR, Mumbai, Hyderabad, Kolkata, Patna, and Ranchi**.

By combining satellite-derived climate metrics (LST, NDVI, NDBI, Albedo) with local meteorological datasets, HEATESCAPE provides urban planners, researchers, and citizens with actionable insights. The platform leverages machine learning models (Multiple Linear Regression & Random Forest) to identify local heat drivers and simulate the cooling impact (in °C) of various material-based interventions (e.g., cool roofs, reflective pavements, urban tree canopies).

---

## 🚀 Key Features

* **Multi-City Geospatial Dashboard:** Seamlessly toggle between six major Indian cities with a global overview map pinpointing coordinates and city-wide climate risks.
* **Interactive Heat Maps:** Fully-realized interactive Leaflet maps mapping neighborhood-level surface temperatures, priority scores, and socio-economic vulnerabilities.
* **Predictive ML Simulator:** Live-simulate thermal reduction drops (°C) at the neighborhood level using trained regression coefficients for different cooling materials.
* **AI Chat Assistant:** Conversational agent powered by the Google Gemini Developer API providing hyper-localized recommendations on climate resilience and cooling strategies.
* **Cooling Materials Catalog:** Comprehensive comparative directory detailing albedo ratings, surface temperature reductions, unit costs, and durability estimates.
* **Feature Importance Analytics:** Interactive charts showcasing ML coefficient distributions, regression model fits ($R^2$), and methodology breakdowns.

---

## 🏗️ Project Architecture & Structure

HEATESCAPE is architected into three main modules:
1. **`data-pipeline`**: Ingests raw CSV datasets, augments meteorological indices, trains scikit-learn regression models, simulates cooling interventions, and exports optimized JSON assets.
2. **`backend`**: A FastAPI application that serves precompiled static datasets as high-performance JSON payloads.
3. **`frontend`**: A React single-page application built on Vite featuring dark glassmorphic styling, smooth micro-animations, and dynamic visual widgets.

### **Directory Layout**

```text
HEATESCAPE/
├── data-pipeline/               # Ingestion, ML modelling, and asset exporter
│   ├── raw_zones_*.csv          # Geospatial & socio-environmental metrics per city
│   ├── augment_csvs.py          # Script to compute meteorological columns
│   ├── build_dataset.py         # ML training (Linear/RF) & JSON dataset builder
│   ├── gee_export_script.py     # Google Earth Engine script template for Landsat 8/9 LST
│   └── materials.csv            # Catalog of cooling interventions & parameters
│
├── backend/                     # High-performance FastAPI server
│   ├── data/                    # Precompiled static JSON database
│   │   ├── cities.json          # Coordinates & overview indexes
│   │   ├── materials.json       # Cooling materials properties
│   │   ├── zones_*.json         # Neighborhood properties & priority scores
│   │   ├── cooling_*.json       # Temperature reduction simulations per zone
│   │   └── model_meta_*.json    # ML model coefficients, errors, & training stats
│   ├── .env                     # Server configuration (Gemini API keys)
│   ├── main.py                  # API routes & server launch configuration
│   └── requirements.txt         # Python dependencies
│
└── frontend/                    # Single-page dashboard client (React + Vite)
    ├── public/                  # Assets, icons, and leaflet markers
    ├── src/
    │   ├── api/                 # API connection configurations
    │   │   └── client.js        # Axios instance configured for backend requests
    │   ├── components/          # Reusable UI dashboard elements
    │   │   ├── ChatWidget.jsx   # Gemini-powered interactive chat panel
    │   │   ├── CoolingChart.jsx # Recharts simulated temperature reduction chart
    │   │   ├── HeatMap.jsx      # Leaflet geospatial visualization component
    │   │   ├── InsightsPanel.jsx# ML-generated priority heat-driver insights
    │   │   ├── MaterialsTable.jsx # Interactive cooling materials library grid
    │   │   └── PriorityTable.jsx# Neighborhood risk ranking grid
    │   ├── context/             # Global states (selected city and selected zone)
    │   ├── pages/               # Top-level view layouts
    │   │   ├── IndiaMap.jsx     # National overview map for city selection
    │   │   ├── Overview.jsx     # Main KPI summary and recommendation layout
    │   │   ├── HeatMaps.jsx     # Full-screen geospatial explorer
    │   │   ├── Materials.jsx    # Intervention library browser
    │   │   └── Analysis.jsx     # Regression coefficients & simulator graphs
    │   ├── App.jsx              # Routing config, layout frame, and embers animation
    │   ├── index.css            # Custom CSS system (dark glassmorphism, responsive grid)
    │   └── main.jsx             # Client entrypoint
    ├── package.json             # Node package manifest
    └── vite.config.js           # Vite bundler configurations
```

---

## ⚡ Setup & Local Installation

### Prerequisites
Make sure you have the following installed on your machine:
- **Python 3.9+** (For backend and data pipeline)
- **Node.js 18+** & **npm** (For the frontend dashboard)
- **Git**

---

### 1. Backend Server Setup

Navigate into the `backend` directory, create a virtual environment, install requirements, and configure your credentials:

```bash
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a file named `.env` in the `backend` directory:

```env
# backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
```
> ⚠️ **Note:** A valid `GEMINI_API_KEY` is required for the conversational AI Chat Widget to generate localized cooling intervention recommendations. You can obtain one for free at the [Google AI Studio](https://aistudio.google.com/).

#### Run the Server
Launch the FastAPI development server with Uvicorn:

```bash
uvicorn main:app --reload --port 8000
```
- The backend will run at `http://localhost:8000`
- Interactive API documentation will be available at `http://localhost:8000/docs`

---

### 2. Frontend Dashboard Setup

Navigate to the `frontend` directory, install dependencies, and run the Vite bundler:

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```
- The application will run at `http://localhost:5173`
- The client is pre-configured to look for the backend at `http://localhost:8000`. You can configure a custom location by creating a `frontend/.env` file and defining `VITE_API_URL=your_api_url`.

---

### 3. Data Pipeline & Regeneration (Optional)

You only need to run this step if you have modified the source CSV datasets (e.g. `data-pipeline/raw_zones_delhi.csv`) or the attributes in `data-pipeline/materials.csv`.

```bash
# Navigate to data-pipeline
cd ../data-pipeline

# Install pandas and scikit-learn in your Python environment
pip install pandas scikit-learn

# Run CSV metrics augmentation
python augment_csvs.py

# Run the ML models and compile data outputs into the backend
python build_dataset.py
```
This updates all the JSON files inside `backend/data/` dynamically.

---

## 📊 Backend API Endpoints

All endpoints are `GET` requests and serve static, high-performance precompiled JSON payloads:

| Endpoint | Description |
| :--- | :--- |
| `/` | Server info, active configuration, and endpoints list. |
| `/api/cities` | Summary statistics of all 6 Indian cities (used for the global map pins). |
| `/api/cities/{city_id}/zones` | All neighborhood zones for a city, pre-sorted by Priority Score. |
| `/api/cities/{city_id}/zones/{zone_id}` | Detailed properties, indicators, and ML-generated driver text for a zone. |
| `/api/cities/{city_id}/zones/{zone_id}/cooling` | Simulated cooling effects (in °C) for each material applied in that zone. |
| `/api/cities/{city_id}/model-meta` | ML model indicators: coefficients, R² scores, and training metadata. |
| `/api/materials` | Complete catalog of available cooling materials with characteristics. |

*Supported `city_id` keys:* `delhi-ncr`, `mumbai`, `hyderabad`, `kolkata`, `patna`, `ranchi`.

---

## 🔬 Scientific Methodology & ML Simulation

### **1. Priority Score Calculation**
To guide planning, neighborhoods are ranked using a multi-factor **Priority Score** (0-100), calculated as:

$$\text{Priority Score} = (\text{LST} \times 0.4) + (\text{NDBI} \times 0.2) + (1.0 - \text{NDVI}) \times 20 + (\text{Vulnerability Index} \times 0.2)$$

Where:
* **LST (Land Surface Temperature):** Satellite thermal index.
* **NDVI (Normalized Difference Vegetation Index):** Canopy density factor.
* **NDBI (Normalized Difference Built-up Index):** Urban build-up density.
* **Vulnerability Index:** Socio-economic vulnerability (income, density, access to cooling).

### **2. Thermal Regression Modeling**
We model UHI intensity ($T_{\text{zone}}$) as a function of environmental drivers:

$$T_{\text{zone}} = \beta_0 + \beta_1(\text{NDBI}) + \beta_2(\text{NDVI}) + \beta_3(\text{Albedo}) + \beta_4(\text{Vulnerability}) + \epsilon$$

### **3. Intervention Simulation**
When a material (e.g. Albedo change $\Delta \alpha$) is applied, the temperature reduction ($\Delta T$) is simulated using the trained coefficients:

$$\Delta T = \beta_3 \times \Delta \alpha \times \text{Factor}_{\text{efficiency}}$$

This model runs offline within the Python scikit-learn pipeline, outputting precalculated scenarios mapped straight into your interactive dashboard.

---

## 🎨 Technology Stack

* **Core Frameworks**: React 18, Vite, FastAPI (Python)
* **Geospatial Engine**: Leaflet, React-Leaflet
* **Data Visualization**: Recharts, React-CountUp
* **Machine Learning**: Scikit-Learn (`LinearRegression`, `RandomForestRegressor`), Pandas
* **AI Chat Integrations**: Google Gemini Developer API (`google-genai` SDK)
* **Styling**: Modern, responsive CSS featuring custom dark glassmorphism, glowing accents, and smooth Framer Motion micro-animations.

---

## 🛡️ License & Attributions
- Built for educational, climate mitigation planning, and research purposes.
- Satellite derived values (LST/NDVI) are parsed from USGS Landsat datasets using Google Earth Engine scripts.
