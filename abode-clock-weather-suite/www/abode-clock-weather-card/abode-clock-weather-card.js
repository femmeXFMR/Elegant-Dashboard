import { LitElement, html, css, svg } from "lit";

const DEFAULTS = {
  source: {
    weather: {
      entity: null,
      cache_entity: "sensor.abode_weather_cache",
    },
  },
  clock: true,
  condition: true,
  sun_arc: true,
  forecast_bar: true,
  hourly_chart: true,
  doorbell_when_active: false,
  greeting: {
    enabled: false,
    mode: "helpers",
    template: "{salutation}, {user} {emoji}",
    helpers: {
      salutation_entity: "sensor.ui_salutation",
      user_entity: "sensor.ui_logged_in_user",
    },
    emoji_set: "morning",
  },
  icon_base_path: "/local/weather-icons/",
};

function getEntityState(hass, entityId) {
  return hass?.states?.[entityId];
}

function getSalutationFromHelper(hass, entityId) {
  const state = getEntityState(hass, entityId);
  return state?.state || "";
}

function getUserFromHelper(hass, entityId) {
  const state = getEntityState(hass, entityId);
  return state?.state || hass?.user?.name || hass?.user?.display_name || "friend";
}

function getTimeBasedEmoji(emojiSet, hour) {
  const sets = {
    morning: { morning: "🌅", afternoon: "☀️", evening: "🌆", night: "🌙" },
    afternoon: { morning: "🌄", afternoon: "🌞", evening: "🌇", night: "🌃" },
    evening: { morning: "🌅", afternoon: "☀️", evening: "🌆", night: "🌙" },
    night: { morning: "🌅", afternoon: "☀️", evening: "🌆", night: "🌙" },
  };
  const set = sets[emojiSet] || sets.morning;
  if (hour < 6 || hour >= 22) return set.night;
  if (hour < 12) return set.morning;
  if (hour < 18) return set.afternoon;
  return set.evening;
}

function formatGreeting(cfg, hass) {
  if (!cfg.greeting?.enabled) return "";
  
  const now = new Date();
  const hour = now.getHours();
  const emoji = getTimeBasedEmoji(cfg.greeting.emoji_set || "morning", hour);
  
  if (cfg.greeting.mode === "helpers") {
    const salutation = getSalutationFromHelper(hass, cfg.greeting.helpers?.salutation_entity);
    const user = getUserFromHelper(hass, cfg.greeting.helpers?.user_entity);
    const template = cfg.greeting.template || "{salutation}, {user} {emoji}";
    return template
      .replace("{salutation}", salutation)
      .replace("{user}", user)
      .replace("{emoji}", emoji);
  }
  
  return cfg.greeting.template || "";
}

export class AbodeClockWeatherCard extends LitElement {
  static properties = { hass: {}, config: {} };

  static styles = css`
    .wrap {
      padding: 16px;
      border-radius: 18px;
      backdrop-filter: blur(10px);
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .row {
      display: flex;
      gap: 12px;
      align-items: baseline;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .clock {
      font-size: 34px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .date {
      opacity: 0.8;
      font-size: 14px;
    }
    .condition {
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid rgba(127, 127, 127, 0.25);
      font-size: 12px;
      opacity: 0.95;
    }
    .sun-arc-container {
      margin: 12px 0;
      height: 130px;
      position: relative;
    }
    .forecast-bar {
      display: flex;
      gap: 8px;
      margin: 12px 0;
      overflow-x: auto;
      padding: 8px 0;
    }
    .forecast-hour {
      min-width: 60px;
      text-align: center;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid rgba(127, 127, 127, 0.18);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .forecast-hour-time {
      font-size: 11px;
      opacity: 0.8;
    }
    .forecast-hour-temp {
      font-size: 14px;
      font-weight: 600;
    }
    .forecast-hour-precip {
      font-size: 10px;
      opacity: 0.7;
    }
    .hourly-chart {
      margin: 12px 0;
      height: 60px;
    }
    .hourly-chart svg {
      width: 100%;
      height: 100%;
    }
  `;

  setConfig(config) {
    this.config = { ...DEFAULTS, ...config };
    if (!this.config.source?.weather?.entity) {
      throw new Error("source.weather.entity is required");
    }
  }

  render() {
    const cfg = this.config;
    const hass = this.hass;

    const weatherEntity = cfg.source.weather.entity;
    const cacheEntity = cfg.source.weather.cache_entity;

    const weather = getEntityState(hass, weatherEntity);
    const cache = getEntityState(hass, cacheEntity);
    const sun = getEntityState(hass, "sun.sun");

    const now = new Date();
    const timeStr = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(now);
    const dateStr = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(now);

    const temp = weather?.attributes?.temperature;
    const unit = weather?.attributes?.temperature_unit || "°";
    const condition = weather?.state;

    const hourly = cache?.attributes?.hourly || [];
    const daily = cache?.attributes?.daily || [];

    const greeting = formatGreeting(cfg, hass);

    return html`
      <ha-card>
        <div class="wrap">
          ${greeting ? html`<div class="title">${greeting}</div>` : ""}
          
          <div class="row">
            ${cfg.clock ? html`<div class="clock">${timeStr}</div>` : ""}
            ${cfg.clock ? html`<div class="date">${dateStr}</div>` : ""}
            ${cfg.condition && temp != null
              ? html`<div class="condition">${Math.round(temp)}${unit} · ${condition}</div>`
              : ""}
          </div>

          ${cfg.sun_arc ? this._renderSunArc(sun, now) : ""}
          ${cfg.forecast_bar ? this._renderForecastBar(hourly, unit) : ""}
          ${cfg.hourly_chart ? this._renderHourlyChart(hourly) : ""}
        </div>
      </ha-card>
    `;
  }

  _renderSunArc(sun, now) {
    if (!sun) return html``;

    const nextRising = sun.attributes?.next_rising;
    const nextSetting = sun.attributes?.next_setting;
    const isNight = sun.state === "below_horizon";

    if (!nextRising || !nextSetting) return html``;

    const sunriseTime = new Date(nextRising);
    const sunsetTime = new Date(nextSetting);
    const nowTime = now;

    const toMinutes = (date) => date.getHours() * 60 + date.getMinutes();
    const sunriseMin = toMinutes(sunriseTime);
    const sunsetMin = toMinutes(sunsetTime);
    const nowMin = toMinutes(nowTime);

    let sunPct = 0;
    if (nowMin >= sunriseMin && nowMin <= sunsetMin) {
      sunPct = (nowMin - sunriseMin) / (sunsetMin - sunriseMin);
    } else if (nowMin < sunriseMin) {
      sunPct = 0;
    } else {
      sunPct = 1;
    }

    const r = 90;
    const cx = 120;
    const cy = 110;
    const sunAngle = sunPct * Math.PI;
    const sunX = cx + r * Math.cos(sunAngle - Math.PI);
    const sunY = cy - r * Math.sin(sunAngle);

    const sr = sunriseTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const ss = sunsetTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return html`
      <div class="sun-arc-container">
        <svg width="240" height="130" viewBox="0 0 240 130" style="display: block;">
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(130, 177, 255, 0.35)" />
              <stop offset="100%" stop-color="rgba(30, 58, 138, 0.2)" />
            </linearGradient>
            <linearGradient id="nightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="rgba(44, 62, 80, 0.4)" />
              <stop offset="100%" stop-color="rgba(20, 30, 48, 0.2)" />
            </linearGradient>
            <filter id="glassBlur">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <linearGradient id="lightArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ffee99" stop-opacity="1" />
              <stop offset="100%" stop-color="#ffee99" stop-opacity="0" />
            </linearGradient>
            <filter id="arcGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M30 110 A90 90 0 0 1 210 110"
            fill="${isNight ? "url(#nightGradient)" : "url(#skyGradient)"}"
            filter="url(#glassBlur)"
            stroke="none"
          />
          <path
            d="M30 110 A90 90 0 0 1 210 110"
            stroke="url(#lightArc)"
            stroke-width="3.5"
            fill="none"
            filter="url(#arcGlow)"
          />

          ${!isNight
            ? svg`<circle cx="${sunX}" cy="${sunY}" r="10" fill="#FFD93B" filter="url(#glow)">
                <animate
                  attributeName="cy"
                  values="${sunY + 4};${sunY - 4};${sunY + 4}"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              <text x="120" y="20" font-size="16" fill="white" text-anchor="middle">Sunrise</text>
              <text x="120" y="35" font-size="14" fill="white" text-anchor="middle">${sr}</text>
              <text x="30" y="132" font-size="16" fill="white" text-anchor="start">Sunrise</text>
              <text x="30" y="146" font-size="14" fill="white" text-anchor="start">${sr}</text>
              <text x="210" y="132" font-size="16" fill="white" text-anchor="end">Sunset</text>
              <text x="210" y="146" font-size="14" fill="white" text-anchor="end">${ss}</text>`
            : svg`<text x="120" y="65" font-size="16" fill="white" text-anchor="middle">Night</text>`}
        </svg>
      </div>
    `;
  }

  _renderForecastBar(hourly, unit) {
    const next5 = hourly.slice(0, 5);
    if (next5.length === 0) return html``;

    return html`
      <div class="forecast-bar">
        ${next5.map((f) => {
          const dt = f?.datetime ? new Date(f.datetime) : null;
          const time = dt
            ? new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "2-digit",
              }).format(dt)
            : "—";
          const temp = f?.temperature ?? f?.native_temperature;
          const precip = f?.precipitation_probability ?? f?.precipitation_probability_percentage;

          return html`
            <div class="forecast-hour">
              <div class="forecast-hour-time">${time}</div>
              <div class="forecast-hour-temp">
                ${temp != null ? `${Math.round(temp)}${unit}` : "—"}
              </div>
              ${precip != null
                ? html`<div class="forecast-hour-precip">${Math.round(precip)}%</div>`
                : ""}
            </div>
          `;
        })}
      </div>
    `;
  }

  _renderHourlyChart(hourly) {
    const next12 = hourly.slice(0, 12);
    if (next12.length === 0) return html``;

    const temps = next12
      .map((f) => f?.temperature ?? f?.native_temperature)
      .filter((t) => t != null);

    if (temps.length === 0) return html``;

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1;

    const width = 400;
    const height = 60;
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = temps.map((temp, i) => {
      const x = padding + (i / (temps.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((temp - minTemp) / range) * chartHeight;
      return [x, y];
    });

    const linePath = points
      .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
      .join(" ");

    const areaPath = `M ${points[0][0]},${height} ${linePath} L ${points[points.length - 1][0]},${height} Z`;

    return html`
      <div class="hourly-chart">
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="tempLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffc658" />
              <stop offset="100%" stop-color="#ff7300" />
            </linearGradient>
            <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff8c00" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#ff8c00" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d="${areaPath}" fill="url(#tempArea)" />
          <path d="${linePath}" fill="none" stroke="url(#tempLine)" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </div>
    `;
  }

  static getStubConfig() {
    return {
      type: "custom:abode-clock-weather-card",
      source: {
        weather: {
          entity: "weather.home",
          cache_entity: "sensor.abode_weather_cache",
        },
      },
    };
  }
}

customElements.define("abode-clock-weather-card", AbodeClockWeatherCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "abode-clock-weather-card",
  name: "Abode Clock Weather Card",
  description: "Clock + simplified weather, backed by a forecast cache sensor.",
});
