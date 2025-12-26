# Installation Guide - Clock + Weather Card

## ⚠️ IMPORTANT: Two-Step Installation Required

This card requires **TWO separate steps**:
1. Install the **integration** (for forecast caching)
2. Add the **card resource** (so the card appears in the picker)

**The card will NOT show up until BOTH steps are complete!**

---

## Step 1: Install Integration via HACS

1. Open Home Assistant
2. Go to **HACS** (in the sidebar)
3. Click **Integrations** (top menu)
4. Click the three dots menu (⋮) in the top right
5. Select **Custom repositories**
6. Click **Add** and enter:
   - **Repository**: `https://github.com/femmeXFMR/Elegant-Dashboard`
   - **Category**: **Integration**
7. Click **Add**
8. Search for **Abode Clock Weather Suite** or **Abode Weather Cache**
9. Click **Install**
10. **Restart Home Assistant**

## Step 2: Configure the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration** (bottom right)
3. Search for **Abode Weather Cache**
4. Select your weather entity (e.g., `weather.pirateweather`)
5. Set update interval (default: 5 minutes)
6. Click **Submit**

This creates `sensor.abode_weather_cache` with hourly and daily forecast attributes.

## Step 3: Add the Card Resource (REQUIRED!)

**This step is critical - the card won't appear without it!**

1. Go to **Settings** → **Dashboards** → **Resources**
2. Click **Add Resource** (bottom right)
3. Configure:
   - **URL**: `/hacsfiles/elegant-dashboard/abode-clock-weather-card/abode-clock-weather-card.js`
   - **Resource Type**: **JavaScript Module**
4. Click **Create**
5. **Refresh your browser** (Ctrl+F5 or Cmd+Shift+R)

**If the path doesn't work, check what HACS created:**
- Look in your `config/www/` folder
- Find the folder HACS created (might be `elegant-dashboard` or `Elegant-Dashboard`)
- Use that folder name in the path

## Step 4: Add the Card to Your Dashboard

### Via UI Editor

1. Edit your dashboard
2. Click **Add Card**
3. **Search for "Abode Clock Weather Card"** - it should now appear!
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

### Card doesn't show up in picker

1. **Did you add the resource?** (Step 3 above) - This is REQUIRED!
2. **Did you refresh your browser?** - Hard refresh (Ctrl+F5)
3. **Check browser console** (F12 → Console) for errors
4. **Verify the resource path:**
   - Go to Settings → Dashboards → Resources
   - Check if the resource is listed and shows "Loaded"
   - If it shows an error, the path might be wrong

### Resource path doesn't work

HACS might create the folder with a different name. To find it:

1. SSH into your Home Assistant (or use File Editor addon)
2. Navigate to `config/www/`
3. Look for a folder created by HACS (might be `elegant-dashboard`, `Elegant-Dashboard`, or similar)
4. Update the resource URL to match: `/hacsfiles/<actual-folder-name>/abode-clock-weather-card/abode-clock-weather-card.js`

### Integration installed but no sensor

1. Check that you configured the integration (Step 2)
2. Go to Settings → Devices & Services
3. Look for "Abode Weather Cache" - is it listed?
4. If not, add it via "Add Integration"
5. Check Home Assistant logs for errors

### Forecasts not showing

1. Verify `sensor.abode_weather_cache` exists
2. Check its attributes - do you see `hourly` and `daily`?
3. Check Home Assistant logs: Settings → System → Logs
4. Verify your weather entity is working

## Quick Checklist

- [ ] Integration installed via HACS
- [ ] Home Assistant restarted
- [ ] Integration configured (sensor created)
- [ ] Card resource added in Resources
- [ ] Browser refreshed
- [ ] Card appears in card picker

## Still Having Issues?

1. Check the browser console (F12) for JavaScript errors
2. Verify the card file exists at the resource path
3. Make sure you're using the correct resource type (JavaScript Module)
4. Try clearing browser cache

---

**Remember: The card resource MUST be added manually - HACS doesn't do this automatically for integrations!**
