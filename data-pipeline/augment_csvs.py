import pandas as pd
import os

CSV_FILES = {
    "delhi-ncr": {"file": "raw_zones_delhi.csv", "base_temp": 42.0, "base_rh": 22.0, "base_wind": 3.5},
    "mumbai": {"file": "raw_zones_mumbai.csv", "base_temp": 33.5, "base_rh": 78.0, "base_wind": 4.5},
    "hyderabad": {"file": "raw_zones_hyderabad.csv", "base_temp": 38.5, "base_rh": 32.0, "base_wind": 3.0},
    "patna": {"file": "raw_zones_patna.csv", "base_temp": 39.5, "base_rh": 48.0, "base_wind": 2.2},
    "ranchi": {"file": "raw_zones_ranchi.csv", "base_temp": 34.5, "base_rh": 42.0, "base_wind": 3.2},
    "kolkata": {"file": "raw_zones_kolkata.csv", "base_temp": 35.0, "base_rh": 72.0, "base_wind": 3.8},
}

def augment_csv(city_id, config):
    filename = config["file"]
    if not os.path.exists(filename):
        print(f"File {filename} not found, skipping...")
        return
        
    df = pd.read_csv(filename)
    
    # Calculate physics-informed values:
    # 1. Air temperature is influenced by LST but modulated by green cover (NDVI)
    # 2. Relative humidity decreases with high surface temperature, increases with vegetation (evapotranspiration)
    # 3. Wind speed is reduced by urban morphology (NDBI proxy for building density)
    
    air_temps = []
    humidities = []
    winds = []
    
    lst_min = df["lst_celsius"].min()
    lst_max = df["lst_celsius"].max()
    
    for idx, row in df.iterrows():
        # Temperature mapping: base temperature + delta based on LST, cooled by NDVI
        # Higher LST raises air temp, higher NDVI lowers air temp
        lst_factor = (row["lst_celsius"] - lst_min) / (lst_max - lst_min) if lst_max != lst_min else 0.5
        temp = config["base_temp"] + (lst_factor * 4.0) - (row["ndvi"] * 3.5)
        
        # Relative humidity mapping: base RH + NDVI increase - LST increase
        rh = config["base_rh"] + (row["ndvi"] * 20.0) - (lst_factor * 12.0)
        rh = max(min(rh, 95.0), 10.0) # bound between 10% and 95%
        
        # Wind speed: base wind speed reduced by high building density (NDBI)
        wind = config["base_wind"] * (1.2 - 0.7 * max(row["ndbi"], 0.0))
        wind = max(min(wind, 10.0), 0.5) # bound between 0.5 and 10.0 m/s
        
        air_temps.append(round(temp, 1))
        humidities.append(round(rh, 1))
        winds.append(round(wind, 1))
        
    df["air_temp_celsius"] = air_temps
    df["relative_humidity"] = humidities
    df["wind_speed_mps"] = winds
    
    df.to_csv(filename, index=False)
    print(f"Successfully augmented {filename} with air_temp_celsius, relative_humidity, and wind_speed_mps.")

def main():
    print("Augmenting raw zone CSV files with meteorological variables...")
    for city_id, config in CSV_FILES.items():
        augment_csv(city_id, config)
    print("Done!")

if __name__ == "__main__":
    main()
