# Elegant Dashboard Cards

> **Converting beautiful dashboard blueprints into installable Home Assistant plugins**

This repository takes the stunning [Abode Dashboard](https://github.com/djmalaka/Abode-Dashboard) design concepts by Malaka Jayawardene and converts them into **production-ready, easily installable** Home Assistant custom integrations and Lovelace cards that work out-of-the-box.

## 🎯 What We're Doing Here

The original Abode Dashboard is a **concept library** - beautiful blueprints that require manual YAML configuration, custom helpers, and entity-specific setup. While it's an incredible source of inspiration, it's not designed to work out-of-the-box.

**We're changing that.**

We're systematically converting each card from the original design into:
- ✅ **HACS-installable** custom integrations
- ✅ **UI-configurable** custom Lovelace cards  
- ✅ **Zero manual YAML** required
- ✅ **Works with any entities** - no hardcoded dependencies
- ✅ **Complete documentation** and installation guides

## 📁 Repository Structure

```
Elegant-Dashboard/
├── SRC/                          # Original blueprint cards (reference only)
│   ├── 1 - Clock Weather Card
│   ├── 2 - Energy Card
│   ├── 3 - Media Centre Card
│   └── ...
├── abode-clock-weather-suite/    # First converted card (installable!)
│   ├── custom_components/         # Weather cache integration
│   ├── www/                       # Card JavaScript files
│   └── docs/                      # Documentation
├── custom_components/             # Root-level integrations (HACS)
├── www/                           # Root-level card files (HACS)
└── ...
```

## 🚀 Available Cards

### ✅ Clock + Weather Card

**Status:** Complete and installable via HACS

A beautiful clock and weather display with:
- Custom integration for robust forecast caching (works with Pirate Weather!)
- Sun arc visualization
- Forecast bar and hourly temperature charts
- Fully configurable via UI

[📖 Installation Guide →](abode-clock-weather-suite/INSTALL.md) | [📚 Full Documentation →](abode-clock-weather-suite/docs/clock-weather-card.md)

### 🔄 Coming Soon

We're working on converting more cards from the original design:

- **Energy Card** - Electricity and gas cost tracking
- **Media Centre Card** - Alexa/Echo media controls
- **Rooms Card** - Room summary with presence, climate, lights
- **Location & Security Card** - Person tracking and alarm controls
- **Surveillance Card** - Camera grid with live streaming
- **Housekeepers Card** - Robot vacuum and mower controls
- **Quickfire Card** - Quick access to lights, heat, blinds, automations

## 🎨 About the Original Design

The [Abode Dashboard](https://github.com/djmalaka/Abode-Dashboard) by Malaka Jayawardene features:

- Stunning glassmorphic design
- Smooth animations and transitions
- Advanced card constructions
- Beautiful weather displays with animated icons
- Comprehensive room and automation controls

**We love this design** and want to make it accessible to everyone without the manual configuration requirements.

## 🚀 Quick Start

### Install via HACS

1. Open **HACS** → **Integrations**
2. Click **⋮** → **Custom repositories**
3. Add: `https://github.com/femmeXFMR/Elegant-Dashboard`
4. Category: **Integration**
5. Install **Abode Clock Weather Suite**
6. Restart Home Assistant

See the [Clock + Weather Card installation guide](abode-clock-weather-suite/INSTALL.md) for complete setup instructions.

## 🎯 Key Differences

| Original (Blueprint) | This Repository (Installable) |
|---------------------|------------------------------|
| Manual YAML configuration | UI-based configuration |
| Custom helpers required | Built-in integrations |
| Template sensors needed | Automatic data handling |
| Entity-specific | Works with any entities |
| Copy-paste and adapt | Install and configure |

## 📚 Documentation

Each converted card has its own documentation:

- [Clock + Weather Card](abode-clock-weather-suite/docs/clock-weather-card.md) - Complete setup guide

## 🤝 Contributing

Want to help convert more cards? We welcome contributions!

1. Pick a card from `SRC/` that hasn't been converted yet
2. Create a new folder following the `abode-clock-weather-suite/` structure
3. Build the integration and card
4. Submit a pull request

## 📄 License

This project maintains the same license as the original Abode Dashboard. See [LICENSE](SRC/LICENSE) for details.

## 🙏 Credits & Attribution

- **Original Design**: [Malaka Jayawardene](https://github.com/djmalaka) - Creator of the beautiful Abode Dashboard
- **Original Repository**: [Abode-Dashboard](https://github.com/djmalaka/Abode-Dashboard)

The original repository serves as our blueprint and inspiration. All design concepts, styling techniques, and UI patterns are credited to the original author.

## ⚠️ Important Note

This repository is **not** affiliated with or endorsed by the original Abode Dashboard author. We are fans of the design who wanted to make these beautiful cards accessible to the entire Home Assistant community through installable plugins.

---

**Made with ❤️ for the Home Assistant community**

*Converting blueprints into plugins, one card at a time.*

