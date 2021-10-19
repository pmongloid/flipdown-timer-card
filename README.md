# Flipdown Timer Card

Card for timer entities in the Lovelace user interface of Home Assistant
![Default](card.png)

## Features

- Set timer duration on the card
- Display timer
- Flip together if you have multiple cards

## Installation

- Install using HACS and add this card.
- Or Download the 'flipdown-timer-card.js' from the latest release.

## Configuration

| Name       | Type    | Requirement  | Description                                              | Default |
| ---------- | ------- | ------------ | -------------------------------------------------------- | ------- |
| type       | string  | **Required** | `custom:flipdown-timer-card`                             |         |
| entity     | string  | **Required** | Timer entity                                             |         |
| duration   | string  | **Optional** | Timer duration indicated when idle. Should be 'hh:mm:ss' |         |
| theme      | string  | **Optional** | Colorscheme : hass, dark, light                          | `hass`  |
| show_title | boolean | **Optional** | Show card title                                          | `false` |
| show_hours | boolean | **Optional** | Show hour rotors                                         | `false` |
| styles     | object  | **Optional** | Card style                                               |         |

Home Assistant timer updates default duration whenever timer starts. if duration is set on this card, it will override default timer duration when idle.

## Styles Object

| Object | key      | Description                           | Default |
| ------ | -------- | ------------------------------------- | ------- |
| rotor  | width    | single rotor width                    | 50px    |
|        | height   | single rotor height                   | 80px    |
| button | width    | button width                          | 50px    |
|        | location | button location - right, bottom, hide | right   |

## Example

```yaml
- type: custom:flipdown-timer-card
  entity: timer.timer
  show_hour: false #optional
  show_title: false #optional
  theme: dark #optional
  duration: '00:00:00' #optional
  styles: #optional
    rotor:
      width: 60px
      height: 80px
    button:
      width: 60px
      location: bottom
```

## Notes

- Timing error(<1s) may occur due to flipping effect.

## Credits

- This card is based on the work of [@PButcher/flipdown](https://github.com/PButcher/flipdown)
- and [@iantrich](https://github.com/iantrich)'s boilerplate card
