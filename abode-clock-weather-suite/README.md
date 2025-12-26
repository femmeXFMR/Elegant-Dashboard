# Abode Dashboard Cards

> **Inspired by the beautiful [Abode Dashboard](https://github.com/malakajayawardene/Abode-Dashboard) design by Malaka Jayawardene**

This repository provides **easily installable, production-ready** Home Assistant custom cards and integrations based on the stunning Abode Dashboard design. While the original repository serves as an excellent blueprint and concept library, these cards are designed to work out-of-the-box without manual YAML configuration, custom helpers, or complex setup requirements.

## 🎨 About the Original Design

The original [Abode Dashboard](https://github.com/malakajayawardene/Abode-Dashboard) is a beautifully crafted Home Assistant dashboard featuring:

- Glassmorphic design with smooth animations
- Advanced card constructions and styling techniques
- Dynamic weather displays with animated icons
- Room summary cards with presence, climate, and automation controls
- Media center, surveillance, and housekeeper controls
- And much more!

**We love this design** and wanted to make it accessible to everyone by creating installable plugins that work without the manual configuration caveats mentioned in the original repository.

## 📦 Available Cards

### Clock + Weather Card

A beautiful clock and weather display card with:
- **Custom Integration**: `abode_weather_cache` - Robust forecast caching using Home Assistant's `weather.get_forecasts` service
- **Custom Card**: `abode-clock-weather-card` - Displays time, date, weather conditions, sun arc, forecast bar, and hourly temperature chart
- **Pirate Weather Compatible**: Works reliably with providers that may not expose hourly forecasts in entity attributes
- **No Manual YAML Required**: Everything configured through the UI

[📖 Full Documentation →](docs/clock-weather-card.md)

### More Cards Coming Soon

- Energy Card
- Media Centre Card
- Rooms Card
- Location & Security Card
- Surveillance Card
- Housekeepers Card
- Quickfire Card

## 🚀 Quick Start

### Installation via HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to **Integrations**
3. Click the three dots menu (⋮) → **Custom repositories**
4. Add repository:
   - **Repository**: `https://github.com/YOURUSERNAME/Elegant-Dashboard` (update with your repo URL)
   - **Category**: Integration
5. Click **Install**
6. Restart Home Assistant

### Manual Installation

1. Clone or download this repository
2. Copy the `custom_components/` folder contents to your Home Assistant `config/custom_components/` directory
3. Copy the `www/` folder contents to your Home Assistant `config/www/` directory
4. Restart Home Assistant

## 📚 Documentation

Each card has its own detailed documentation:

- [Clock + Weather Card](docs/clock-weather-card.md) - Complete setup and configuration guide

## 🎯 Key Differences from Original

| Original (Blueprint) | This Repository (Installable) |
|---------------------|------------------------------|
| Manual YAML configuration required | UI-based configuration |
| Custom helpers and sensors needed | Built-in integrations handle setup |
| Template sensors required | Automatic forecast caching |
| Entity-specific implementations | Generic, works with any entities |
| Copy-paste and adapt | Install and configure via UI |

## 🤝 Contributing

We welcome contributions! If you'd like to help convert more cards from the original design into installable plugins, please:

1. Fork this repository
2. Create a new branch for your card
3. Follow the existing structure and patterns
4. Submit a pull request

## 📄 License

This project is licensed under the same terms as the original Abode Dashboard. See LICENSE file for details.

## 🙏 Credits

- **Original Design**: [Malaka Jayawardene](https://github.com/malakajayawardene) - Creator of the beautiful Abode Dashboard
- **Original Repository**: [Abode-Dashboard](https://github.com/malakajayawardene/Abode-Dashboard)

## ⚠️ Important Note

This repository is **not** affiliated with or endorsed by the original Abode Dashboard author. We are simply fans of the design who wanted to make it more accessible to the Home Assistant community.

---

**Made with ❤️ for the Home Assistant community**
