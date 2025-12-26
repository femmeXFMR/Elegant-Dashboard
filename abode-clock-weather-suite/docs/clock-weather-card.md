# Clock + Weather Card

A beautiful clock and weather display card with robust forecast caching, inspired by the Abode Dashboard design.

## Features

- **Custom Integration**: `abode_weather_cache` - Caches weather forecasts using Home Assistant's `weather.get_forecasts` service
- **Custom Card**: `abode-clock-weather-card` - Displays time, date, weather conditions, sun arc, forecast bar, and hourly temperature chart
- **Pirate Weather Compatible**: Works reliably with Pirate Weather and other providers that may not expose hourly forecasts in entity attributes
- **No Manual YAML Required**: Everything is configured through the UI

## Installation

### Step 1: Add the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration**
3. Search for **Abode Weather Cache**
4. Select your weather entity (e.g., `weather.pirateweather`)
5. Set the update interval (default: 5 minutes)
6. Click **Submit**

This creates a sensor entity: `sensor.abode_weather_cache` with attributes:
- `hourly`: List of hourly forecast objects
- `daily`: List of daily forecast objects
- `provider_entity`: The weather entity being cached

### Step 2: Add the Lovelace Card Resource

1. Go to **Settings** → **Dashboards** → **Resources**
2. Click **Add Resource** (bottom right)
3. Configure:
   - **URL**: 
     - If using HACS: `/hacsfiles/abode-clock-weather-suite/abode-clock-weather-card/abode-clock-weather-card.js`
     - If manual install: `/local/abode-clock-weather-card/abode-clock-weather-card.js`
   - **Resource Type**: JavaScript Module
4. Click **Create**

### Step 3: Add the Card to Your Dashboard

#### Via UI Editor

1. Edit your dashboard
2. Click **Add Card**
3. Search for **Abode Clock Weather Card**
4. Configure the card (see Configuration below)

#### Via YAML

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
greeting:
  enabled: true
  mode: helpers
  template: "{salutation}, {user} {emoji}"
  helpers:
    salutation_entity: sensor.ui_salutation
    user_entity: sensor.ui_logged_in_user
  emoji_set: morning
```

## Configuration

### Card Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `source.weather.entity` | string | **Required** | Weather entity for current conditions (e.g., `weather.pirateweather`) |
| `source.weather.cache_entity` | string | `sensor.abode_weather_cache` | Cache sensor entity from the integration |
| `clock` | boolean | `true` | Show clock and date |
| `condition` | boolean | `true` | Show temperature and condition |
| `sun_arc` | boolean | `true` | Show sun arc with sunrise/sunset times |
| `forecast_bar` | boolean | `true` | Show next 5 hours forecast bar |
| `hourly_chart` | boolean | `true` | Show hourly temperature sparkline chart |
| `doorbell_when_active` | boolean | `false` | Reserved for future use |
| `greeting.enabled` | boolean | `false` | Enable greeting display |
| `greeting.mode` | string | `helpers` | Greeting mode: `helpers` or `static` |
| `greeting.template` | string | `"{salutation}, {user} {emoji}"` | Template string with placeholders |
| `greeting.helpers.salutation_entity` | string | `sensor.ui_salutation` | Entity for salutation text |
| `greeting.helpers.user_entity` | string | `sensor.ui_logged_in_user` | Entity for user name |
| `greeting.emoji_set` | string | `morning` | Emoji set: `morning`, `afternoon`, `evening`, `night` |
| `icon_base_path` | string | `/local/weather-icons/` | Base path for weather icons (optional) |

### Greeting Configuration

The greeting system supports helper entities for dynamic content:

**Template Placeholders:**
- `{salutation}` - Replaced with value from `greeting.helpers.salutation_entity`
- `{user}` - Replaced with value from `greeting.helpers.user_entity` (falls back to HA user name)
- `{emoji}` - Time-based emoji based on current hour and `emoji_set`

**Example Helper Setup:**

If you have helper sensors:
- `sensor.ui_salutation` with state "Good morning"
- `sensor.ui_logged_in_user` with state "John"

The template `"{salutation}, {user} {emoji}"` will render as: "Good morning, John 🌅"

## Example Configurations

### Minimal Configuration

```yaml
type: custom:abode-clock-weather-card
source:
  weather:
    entity: weather.pirateweather
```

### Full Configuration

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
doorbell_when_active: false
greeting:
  enabled: true
  mode: helpers
  template: "{salutation}, {user} {emoji}"
  helpers:
    salutation_entity: sensor.ui_salutation
    user_entity: sensor.ui_logged_in_user
  emoji_set: morning
icon_base_path: /local/weather-icons/
```

### Clock Only

```yaml
type: custom:abode-clock-weather-card
source:
  weather:
    entity: weather.pirateweather
clock: true
condition: false
sun_arc: false
forecast_bar: false
hourly_chart: false
```

### Weather Only (No Clock)

```yaml
type: custom:abode-clock-weather-card
source:
  weather:
    entity: weather.pirateweather
clock: false
condition: true
sun_arc: true
forecast_bar: true
hourly_chart: true
```

## Integration Configuration

The integration can be configured via the UI:

1. Go to **Settings** → **Devices & Services**
2. Find **Abode Weather Cache**
3. Click **Configure**
4. Options:
   - **Weather Entity**: Select your weather entity
   - **Update Interval**: Minutes between forecast updates (1-180, default: 5)

## How It Works

### Forecast Caching

The integration uses Home Assistant's `weather.get_forecasts` service to fetch forecasts. This is more reliable than reading from `weather_entity.attributes.forecast` because:

1. Some providers (like Pirate Weather) don't always populate `attributes.forecast`
2. The service call explicitly requests hourly and daily forecasts
3. The service response is cached in the sensor attributes for the card to read

### Update Mechanism

- Uses `DataUpdateCoordinator` for efficient updates
- Updates at the configured interval (default: 5 minutes)
- Handles errors gracefully
- Falls back to empty arrays if forecasts are unavailable

### Card Features

- **Clock**: Displays current time and date
- **Condition**: Shows temperature and weather condition
- **Sun Arc**: Visual arc showing sun position with sunrise/sunset times (uses `sun.sun` entity)
- **Forecast Bar**: Next 5 hours with temperature and precipitation probability
- **Hourly Chart**: Sparkline chart of next 12 hours temperature

## Troubleshooting

### Card shows "No weather data"

- Verify the `source.weather.entity` is correct
- Check that the weather entity is available in Home Assistant
- Ensure the weather integration is working

### Forecasts not showing

- Verify the integration is installed and configured
- Check that `sensor.abode_weather_cache` exists
- Verify the cache entity has `hourly` and `daily` attributes
- Check Home Assistant logs for errors

### Sun arc not showing

- Ensure `sun.sun` entity exists (usually created automatically)
- Check that the sun entity has `next_rising` and `next_setting` attributes

### Greeting not working

- Verify helper entities exist (e.g., `sensor.ui_salutation`, `sensor.ui_logged_in_user`)
- Check that `greeting.enabled` is `true`
- Ensure template placeholders match: `{salutation}`, `{user}`, `{emoji}`

## Weather Icons

Weather icons are included in `www/weather-icons/` and served at `/local/weather-icons/`. The card supports an optional `icon_base_path` configuration, but icons are not required for the card to function.

Icons are organized in:
- `/local/weather-icons/fill/` - Filled style icons
- `/local/weather-icons/line/` - Line style icons

