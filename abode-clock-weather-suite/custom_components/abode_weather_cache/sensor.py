from __future__ import annotations

from datetime import timedelta
import logging

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    CONF_WEATHER_ENTITY,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL_MIN,
    CACHE_SENSOR_UNIQUE_ID,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    weather_entity = entry.data[CONF_WEATHER_ENTITY]
    scan_min = entry.data.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL_MIN)
    
    coordinator = AbodeWeatherCacheCoordinator(hass, weather_entity, scan_min)
    await coordinator.async_config_entry_first_refresh()
    
    async_add_entities([AbodeForecastCacheSensor(coordinator, weather_entity)])


class AbodeWeatherCacheCoordinator(DataUpdateCoordinator):
    """Coordinator for fetching weather forecasts."""

    def __init__(self, hass: HomeAssistant, weather_entity: str, scan_min: int) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=scan_min),
        )
        self._weather_entity = weather_entity
        self._hourly = None
        self._daily = None

    async def _async_update_data(self):
        """Fetch forecast data from weather.get_forecasts service."""
        try:
            hourly_resp = await self.hass.services.async_call(
                "weather",
                "get_forecasts",
                {"type": "hourly", "entity_id": self._weather_entity},
                blocking=True,
                return_response=True,
            )
            daily_resp = await self.hass.services.async_call(
                "weather",
                "get_forecasts",
                {"type": "daily", "entity_id": self._weather_entity},
                blocking=True,
                return_response=True,
            )
        except Exception as err:
            raise UpdateFailed(f"Forecast refresh failed for {self._weather_entity}: {err}") from err

        def _extract(resp):
            if not isinstance(resp, dict):
                return []
            # typical: { "<entity_id>": { "forecast": [...] } }
            if self._weather_entity in resp and isinstance(resp[self._weather_entity], dict):
                forecast = resp[self._weather_entity].get("forecast")
                return forecast if isinstance(forecast, list) else []
            # fallback: scan values
            for v in resp.values():
                if isinstance(v, dict) and "forecast" in v:
                    forecast = v.get("forecast")
                    return forecast if isinstance(forecast, list) else []
            return []

        self._hourly = _extract(hourly_resp) or []
        self._daily = _extract(daily_resp) or []
        
        return {
            "hourly": self._hourly,
            "daily": self._daily,
            "last_update": self.hass.helpers.now().isoformat(),
        }


class AbodeForecastCacheSensor(SensorEntity):
    _attr_name = "Abode Weather Cache"
    _attr_icon = "mdi:weather-partly-cloudy"
    _attr_should_poll = False
    _attr_unique_id = CACHE_SENSOR_UNIQUE_ID

    def __init__(self, coordinator: AbodeWeatherCacheCoordinator, weather_entity: str) -> None:
        self.coordinator = coordinator
        self._weather_entity = weather_entity

    @property
    def native_value(self):
        """Return the last update timestamp."""
        if self.coordinator.data:
            return self.coordinator.data.get("last_update", "unknown")
        return "unknown"

    @property
    def extra_state_attributes(self):
        """Return forecast data as attributes."""
        if self.coordinator.data:
            return {
                "provider_entity": self._weather_entity,
                "hourly": self.coordinator.data.get("hourly", []),
                "daily": self.coordinator.data.get("daily", []),
            }
        return {
            "provider_entity": self._weather_entity,
            "hourly": [],
            "daily": [],
        }

    @property
    def available(self):
        """Return if entity is available."""
        return self.coordinator.last_update_success

    async def async_added_to_hass(self) -> None:
        """When entity is added to hass."""
        await super().async_added_to_hass()
        self.async_on_remove(
            self.coordinator.async_add_listener(self.async_write_ha_state)
        )

    async def async_update(self) -> None:
        """Update the entity."""
        await self.coordinator.async_request_refresh()
