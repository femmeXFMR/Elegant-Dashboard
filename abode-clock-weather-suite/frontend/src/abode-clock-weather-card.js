import { LitElement, html, css } from "lit";

const DEFAULTS = {
  title_mode: "greeting", // greeting | none | static
  title: "",
  greeting_template: "",
  weather_entity: null,
  cache_sensor: "sensor.abode_weather_cache",
  show_hourly: true,
  show_daily: true,
  show_precip: true,
  show_wind: false,
  show_humidity: false,
  max_hourly: 8,
  max_daily: 5,
};

function getUserName(hass) {
  return hass?.user?.name || hass?.user?.display_name || hass?.user?.username || "friend";
}

function getSalutation(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatTime(d) {
  try { return new Intl.DateTimeFormat(undefined, { hour: "numeric" }).format(d); }
  catch { return d.toLocaleTimeString(); }
}

export class AbodeClockWeatherCard extends LitElement {
  static properties = { hass: {}, config: {} };

  static styles = css`
    .wrap { padding: 16px; border-radius: 18px; backdrop-filter: blur(10px); }
    .title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
    .row { display: flex; gap: 12px; align-items: baseline; flex-wrap: wrap; }
    .clock { font-size: 34px; font-weight: 700; letter-spacing: -0.02em; }
    .date { opacity: 0.8; }
    .pill { padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(127,127,127,0.25); font-size: 12px; opacity: 0.95; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 8px; margin-top: 12px; }
    .cell { padding: 10px; border-radius: 14px; border: 1px solid rgba(127,127,127,0.18); }
    .cell .k { font-size: 12px; opacity: 0.8; }
    .cell .v { font-size: 18px; font-weight: 650; margin-top: 4px; }
    .forecast { margin-top: 12px; display: grid; gap: 8px; }
    .frow { display: flex; justify-content: space-between; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(127,127,127,0.18); }
    .muted { opacity: 0.75; font-size: 12px; }
  `;

  setConfig(config) {
    this.config = { ...DEFAULTS, ...config };
    if (!this.config.weather_entity) throw new Error("weather_entity is required");
  }

  _title() {
    const { title_mode, title, greeting_template } = this.config;
    if (title_mode === "none") return "";
    if (title_mode === "static") return title || "";
    if (greeting_template) return greeting_template;
    return `${getSalutation()} ${getUserName(this.hass)}`;
  }

  render() {
    const cfg = this.config;
    const hass = this.hass;

    const weather = hass.states?.[cfg.weather_entity];
    const cache = hass.states?.[cfg.cache_sensor];

    const now = new Date();
    const timeStr = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(now);
    const dateStr = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(now);

    const temp = weather?.attributes?.temperature;
    const unit = weather?.attributes?.temperature_unit || "°";
    const condition = weather?.state;

    const hourly = cache?.attributes?.hourly || [];
    const daily = cache?.attributes?.daily || [];

    return html`
      <ha-card>
        <div class="wrap">
          ${this._title() ? html`<div class="title">${this._title()}</div>` : html``}
          <div class="row">
            <div class="clock">${timeStr}</div>
            <div class="date">${dateStr}</div>
            ${temp != null ? html`<div class="pill">${Math.round(temp)}${unit} · ${condition}</div>` : html`<div class="pill">No weather data</div>`}
          </div>

          <div class="grid">
            ${cfg.show_precip ? html`
              <div class="cell"><div class="k">Precip</div><div class="v">${this._bestPrecip(hourly, daily)}</div></div>
            ` : ""}
            ${cfg.show_wind ? html`
              <div class="cell"><div class="k">Wind</div><div class="v">${this._bestWind(weather)}</div></div>
            ` : ""}
            ${cfg.show_humidity ? html`
              <div class="cell"><div class="k">Humidity</div><div class="v">${this._bestHumidity(weather)}</div></div>
            ` : ""}
          </div>

          ${cfg.show_hourly ? html`
            <div class="forecast">
              <div class="muted">Next hours</div>
              ${hourly.slice(0, cfg.max_hourly).map((f) => this._renderHourly(f))}
            </div>
          ` : ""}

          ${cfg.show_daily ? html`
            <div class="forecast">
              <div class="muted">Next days</div>
              ${daily.slice(0, cfg.max_daily).map((f) => this._renderDaily(f))}
            </div>
          ` : ""}
        </div>
      </ha-card>
    `;
  }

  _bestPrecip(hourly, daily) {
    const h0 = hourly?.[0];
    const p = h0?.precipitation_probability ?? h0?.precipitation_probability_percentage;
    if (p != null) return `${Math.round(p)}%`;
    const d0 = daily?.[0];
    const dp = d0?.precipitation_probability;
    if (dp != null) return `${Math.round(dp)}%`;
    return "—";
  }
  _bestWind(weather) {
    const sp = weather?.attributes?.wind_speed;
    const u = weather?.attributes?.wind_speed_unit || "";
    if (sp == null) return "—";
    return `${Math.round(sp)} ${u}`.trim();
  }
  _bestHumidity(weather) {
    const h = weather?.attributes?.humidity;
    if (h == null) return "—";
    return `${Math.round(h)}%`;
  }
  _renderHourly(f) {
    const dt = f?.datetime ? new Date(f.datetime) : null;
    const when = dt ? formatTime(dt) : "—";
    const t = f?.temperature ?? f?.native_temperature;
    const p = f?.precipitation_probability;
    return html`<div class="frow"><div>${when}</div><div class="muted">${t != null ? Math.round(t) + "°" : "—"}${p != null ? " · " + Math.round(p) + "%" : ""}</div></div>`;
  }
  _renderDaily(f) {
    const dt = f?.datetime ? new Date(f.datetime) : null;
    const when = dt ? new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(dt) : "—";
    const hi = f?.temperature ?? f?.native_temperature;
    const lo = f?.templow ?? f?.native_templow;
    return html`<div class="frow"><div>${when}</div><div class="muted">${hi != null ? Math.round(hi) + "°" : "—"}${lo != null ? " / " + Math.round(lo) + "°" : ""}</div></div>`;
  }

  static getStubConfig() {
    return { type: "custom:abode-clock-weather-card", weather_entity: "weather.home" };
  }
}

customElements.define("abode-clock-weather-card", AbodeClockWeatherCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "abode-clock-weather-card",
  name: "Abode Clock Weather Card",
  description: "Clock + simplified weather, backed by a forecast cache sensor.",
});
