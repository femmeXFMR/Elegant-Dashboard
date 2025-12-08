### home_header_welcome_weather.yaml

**Purpose**

Glassmorphic header block for the Home dashboard that:

- Hides the HA top bar when kiosk mode is enabled (via a `kiosk-mode="on"` attribute on the view).
- Shows a live front door camera when the doorbell view is active.
- Otherwise shows:
  - A “Welcome Abode” title.
  - A large animated weather + time header (condition, temperature, current time, date).
  - A dynamic sun arc / lunar phase visual using `sun.sun` and `sensor.moon_phase`.
  - A compact 5-day forecast bar card with min/max temps, precipitation probability, and animated SVG icons.
  - A 12-hour temperature line chart with glowing gradient and animated path.

---

**Required custom cards / plugins**

Install via HACS (or equivalent):

- `custom:mod-card` (and `card-mod` for styling)
- `custom:layout-card`
- `custom:button-card`
- `custom:stack-in-card`

---

**Required entities**

- Doorbell toggle and camera  
  - `input_boolean.doorbell_camera_active` – turns the doorbell live view on/off.  
  - `camera.front_door_bell_live_view` – your front doorbell / camera entity.

- Time + sun + moon  
  - `sensor.time` – standard HA time sensor (Time & Date integration).  
  - `sun.sun` – core Sun integration.  
  - `sensor.moon_phase` – moon phase sensor (e.g. Moon integration).

- Weather  
  - `weather.forecast_abode` – main weather entity used for current condition + temperature.  
  - `sensor.tomorrow_raw_hourly` – raw hourly forecast sensor from Tomorrow.io (must expose
    `attributes.timelines.hourly` with `time` and `values.temperature`, `values.weatherCode`,
    `values.precipitationProbability`).

---

**Required assets**

Animated SVG weather icons in `/config/www` (exposed as `/local/...`):

- Line icons for the big header:
  - `/local/weather-icons/weather-icons-master/design/line/animation-ready/<icon>.svg`
- Fill icons for the 5-day forecast:
  - `/local/weather-icons/weather-icons-master/design/fill/animation-ready/<icon>.svg`

You can use any icon set as long as you update the paths in the JavaScript blocks.

---

**Kiosk mode behaviour**

The top-level `mod-card` includes CSS:

- Hides `app-header` and `app-toolbar` when the active `hui-view` has `kiosk-mode="on"`.

To use this:

- Either add `kiosk-mode="on"` to your view via a custom theme or custom panel, or  
- Remove that CSS block if you don’t need kiosk mode.

---

**How to adapt for your setup**

- Replace the following entities with your own:
  - `input_boolean.doorbell_camera_active` → your boolean controlling when to show the doorbell.
  - `camera.front_door_bell_live_view` → your door camera entity.
  - `weather.forecast_abode` → your main weather entity.
  - `sensor.tomorrow_raw_hourly` → your hourly forecast sensor (structure must match Tomorrow.io style).
  - `sensor.moon_phase` → your moon phase sensor (or adjust the code to remove lunar phase if not used).
- Ensure `sensor.time` and `sun.sun` are available (core integrations).
- Update icon file paths if your `/local` weather icons live in a different folder or if you use another icon pack.
- If you don’t want the header text “Welcome Abode 🙏”, change the markdown card content to whatever title you prefer.
- If you’re not using kiosk mode, you can safely remove the `/* Hide top bar when kiosk-mode is ON */` CSS section from the `style` block at the top.

---

**Notes**

- The 5-day forecast bars compute per-day min/max temperature and precipitation probability by aggregating the raw hourly timeline (no template sensors needed).
- The rain bar uses a glassmorphic gradient with a small 💧 icon and percentage label, and animates in a short time after page load.
- The 12-hour chart is an inline SVG rendered inside a `custom:button-card` using the first 12 entries of `sensor.tomorrow_raw_hourly.attributes.timelines.hourly`.
