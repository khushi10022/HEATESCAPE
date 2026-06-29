"""
HEATESCAPE — Google Earth Engine Data Export
==============================================
Run this in the Google Earth Engine Code Editor (https://code.earthengine.google.com)
or via the Python API in Google Colab (free, no local setup needed).

This script exports zone-level Land Surface Temperature (LST), NDVI, and
NDBI for Delhi NCR from Landsat 8/9, which you then process with
build_dataset.py to replace the placeholder data with real satellite values.

SETUP (one-time, ~10 minutes):
  1. Go to https://code.earthengine.google.com
  2. Sign in with any Google account, accept the free Earth Engine terms
  3. Paste this script (convert to JS syntax — see notes below) OR
     run the Python version in Google Colab with:
       !pip install earthengine-api geemap
       import ee; ee.Authenticate(); ee.Initialize()

WHAT THIS PRODUCES:
  A CSV with one row per zone (use your own zone boundaries as a GeoJSON,
  or draw them in the GEE code editor) containing: zone_id, lst_celsius,
  ndvi, ndbi computed as the mean value within each zone polygon.

NOTE: The GEE Code Editor uses JavaScript. Below is the Python version
(for Colab/Python API). A JS translation note is included at the bottom
for direct use in the Code Editor, since that's the faster path for a
one-off export with no local Python setup.
"""

import ee

# ee.Authenticate()  # uncomment on first run in Colab
# ee.Initialize()

# 1. Define area of interest — Delhi NCR bounding box
delhi_ncr = ee.Geometry.Rectangle([76.85, 28.35, 77.55, 28.90])

# 2. Load a recent, low-cloud Landsat 9 Collection 2 Level 2 image
#    (use a summer month for peak UHI signal — April-June for Delhi)
landsat = (
    ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
    .filterBounds(delhi_ncr)
    .filterDate("2025-04-01", "2025-06-30")
    .filter(ee.Filter.lt("CLOUD_COVER", 15))
    .sort("CLOUD_COVER")
)

image = landsat.first()

# 3. Compute Land Surface Temperature from thermal band (ST_B10)
#    Landsat Collection 2 ST_B10 is already scaled; convert Kelvin -> Celsius
lst = image.select("ST_B10").multiply(0.00341802).add(149.0).subtract(273.15).rename("LST_C")

# 4. Compute NDVI from Surface Reflectance bands (SR_B5=NIR, SR_B4=Red)
sr = image.select(["SR_B5", "SR_B4", "SR_B3", "SR_B6"]).multiply(0.0000275).add(-0.2)
ndvi = sr.normalizedDifference(["SR_B5", "SR_B4"]).rename("NDVI")

# 5. Compute NDBI (Normalized Difference Built-up Index): (SWIR - NIR)/(SWIR + NIR)
ndbi = sr.normalizedDifference(["SR_B6", "SR_B5"]).rename("NDBI")

combined = lst.addBands(ndvi).addBands(ndbi)

# 6. Load your zone boundaries — replace this with your own GeoJSON of
#    Delhi NCR neighborhood polygons (e.g., exported from QGIS or drawn
#    in the GEE code editor's geometry tool)
zones_fc = ee.FeatureCollection("YOUR_ZONES_ASSET_OR_GEOJSON_HERE")

# 7. Reduce: mean value of each band within each zone polygon
zone_stats = combined.reduceRegions(
    collection=zones_fc,
    reducer=ee.Reducer.mean(),
    scale=30,
)

# 8. Export to Google Drive as CSV
task = ee.batch.Export.table.toDrive(
    collection=zone_stats,
    description="heatescape_delhi_zones",
    fileFormat="CSV",
    selectors=["zone_id", "zone_name", "LST_C", "NDVI", "NDBI"],
)
task.start()

print("Export started. Check Google Drive in a few minutes for heatescape_delhi_zones.csv")

# ---------------------------------------------------------------------------
# JAVASCRIPT VERSION FOR THE GEE CODE EDITOR (paste this instead if you
# don't want to set up Python/Colab — this is the faster path):
#
# var delhiNCR = ee.Geometry.Rectangle([76.85, 28.35, 77.55, 28.90]);
# var landsat = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
#   .filterBounds(delhiNCR)
#   .filterDate('2025-04-01', '2025-06-30')
#   .filter(ee.Filter.lt('CLOUD_COVER', 15))
#   .sort('CLOUD_COVER');
# var image = landsat.first();
# var lst = image.select('ST_B10').multiply(0.00341802).add(149.0).subtract(273.15).rename('LST_C');
# var sr = image.select(['SR_B5','SR_B4','SR_B3','SR_B6']).multiply(0.0000275).add(-0.2);
# var ndvi = sr.normalizedDifference(['SR_B5','SR_B4']).rename('NDVI');
# var ndbi = sr.normalizedDifference(['SR_B6','SR_B5']).rename('NDBI');
# var combined = lst.addBands(ndvi).addBands(ndbi);
# // Draw zone polygons using the geometry tools in the editor, or import a GeoJSON asset
# var zonesFc = ee.FeatureCollection('your_uploaded_asset');
# var zoneStats = combined.reduceRegions({collection: zonesFc, reducer: ee.Reducer.mean(), scale: 30});
# Export.table.toDrive({collection: zoneStats, description: 'heatescape_delhi_zones', fileFormat: 'CSV'});
# ---------------------------------------------------------------------------
