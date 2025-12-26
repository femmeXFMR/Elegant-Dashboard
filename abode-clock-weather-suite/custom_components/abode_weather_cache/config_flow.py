from __future__ import annotations

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.helpers import selector

from .const import DOMAIN, CONF_WEATHER_ENTITY, CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL_MIN


class AbodeWeatherCacheConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if user_input is not None:
            return self.async_create_entry(title="Abode Weather Cache", data=user_input)

        schema = vol.Schema(
            {
                vol.Required(CONF_WEATHER_ENTITY): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="weather")
                ),
                vol.Optional(CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL_MIN): vol.All(
                    vol.Coerce(int), vol.Range(min=1, max=180)
                ),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema)
