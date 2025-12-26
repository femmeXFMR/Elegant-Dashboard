# Installation Guide

## Step 1: Push to GitHub

First, create a GitHub repository and push this code:

```bash
# If you haven't created the repo on GitHub yet, do that first
# Then add the remote:
git remote add origin https://github.com/YOURUSERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Install via HACS

1. Open Home Assistant
2. Go to **HACS** (in the sidebar)
3. Click **Integrations** (top menu)
4. Click the three dots menu (⋮) in the top right
5. Select **Custom repositories**
6. Click **Add** and enter:
   - **Repository**: `https://github.com/YOURUSERNAME/YOUR-REPO-NAME`
   - **Category**: **Integration**
7. Click **Add**
8. Search for **Abode Clock Weather Suite** or **Abode Weather Cache**
9. Click **Install**
10. **Restart Home Assistant**

## Step 3: Configure the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration** (bottom right)
3. Search for **Abode Weather Cache**
4. Select your weather entity (e.g., `weather.pirateweather`)
5. Set update interval (default: 5 minutes)
6. Click **Submit**

This creates `sensor.abode_weather_cache` with hourly and daily forecast attributes.

## Step 4: Add the Card Resource

1. Go to **Settings** → **Dashboards** → **Resources**
2. Click **Add Resource** (bottom right)
3. Configure:
   - **URL**: `/hacsfiles/elegant-dashboard/abode-clock-weather-card/abode-clock-weather-card.js`
   - **Resource Type**: **JavaScript Module**
4. Click **Create**

## Step 5: Add the Card to Your Dashboard

### Via UI Editor

1. Edit your dashboard
2. Click **Add Card**
3. Search for **Abode Clock Weather Card**
4. Configure:
   - **Weather Entity**: Select your weather entity
   - **Cache Entity**: `sensor.abode_weather_cache` (default)
   - Toggle features on/off as desired
5. Click **Save**

### Via YAML

```yaml
type: custom:abode-clock-weather-card
source:
  weather:
    entity: weather.pirateweather
    cache_entity: sensor.abode_weather_cache
clock: true
condition: true
sun_arc: true
forecast_bar: true
hourly_chart: true
```

## Troubleshooting

### Integration not showing in HACS

- Make sure you added it as an **Integration** (not Frontend)
- Check that `hacs.json` is in the root of the repository
- Verify the repository is public (or you have HACS configured for private repos)

### Card resource not loading

- Verify the resource URL is correct
- Check browser console for errors (F12 → Console)
- Ensure the card file exists at the path

### Forecasts not showing

- Check that `sensor.abode_weather_cache` exists
- Verify it has `hourly` and `daily` attributes
- Check Home Assistant logs: **Settings** → **System** → **Logs**

### Sun arc not showing

- Ensure `sun.sun` entity exists (usually automatic)
- Check that it has `next_rising` and `next_setting` attributes

## Next Steps

See the [full documentation](docs/clock-weather-card.md) for advanced configuration options, greeting setup, and more examples.

