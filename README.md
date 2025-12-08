### CLOCK WEATHER CARD

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

---
---

### ENERGY CARD

**Purpose**

A glassmorphic energy summary card showing:

- Electricity and Gas daily spend (from Bright / Hildebrand Glow integration).
- A horizontal-pill layout with animated pulses (blue for electricity, orange for gas).
- A smooth 24-hour mini-graph of cost trends (using `mini-graph-card`).
- Beautiful gradient background, rounded edges, and subtle drop-shadows.

---

**Required custom cards / plugins**

Install via HACS:

- `custom:stack-in-card`
- `custom:button-card`
- `custom:mini-graph-card`
- `card-mod`

---

**Required entities**

Electricity + gas cost sensors:
- `sensor.electricity` — *Displays the current electricity cost*  
- `sensor.gas` — *Displays the current gas cost*  
- `sensor.electricity_cost_today` — *Used for the 24h electricity graph*  
- `sensor.gas_cost_today` — *Used for the 24h gas graph*

> These typically come from the **Bright / Hildebrand Glow DCC** integration.

---

**Visual behaviour**

- The two pill-style header buttons show:
  - ⚡ Electricity price with blue theme
  - 🔥 Gas price with orange theme
- The bottom section displays a **mini-graph-card** line chart only when cost sensors are not `unknown`.
- Includes delayed animation for the graph path (smooth, glowing line).

---

**How to adapt for your setup**

- Replace the following entities with yours if named differently:
  - `sensor.electricity`
  - `sensor.gas`
  - `sensor.electricity_cost_today`
  - `sensor.gas_cost_today`
- Change colors by adjusting:
  - `#47C1E8` for electricity  
  - `#ffaa00` for gas
- You can remove the pulse animations if not needed by deleting the `@keyframes` blocks.
- Background gradient can be customised in:
  ```yaml
  background: linear-gradient(135deg, rgba(151, 87, 167, 0.25), rgba(75, 124, 132, 0.25));
