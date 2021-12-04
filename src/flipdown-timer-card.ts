/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  TemplateResult,
  PropertyValues,
  CSSResultGroup,
  unsafeCSS,
} from 'lit';
import { customElement, property, state } from "lit/decorators";
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  LovelaceCardEditor,
  getLovelace
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types

import './editor';

import type { FlipdownTimerCardConfig } from './types';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import { FlipDown } from './flipdown.js'
import { styles } from './styles';

/* eslint no-console: 0 */
console.info(
  `%c  FLIPDOWN-TIMER-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'flipdown-timer-card',
  name: 'Flipdown Timer Card',
  description: 'A template custom card for you to create something awesome',
});

export function durationToSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

let fdComponent: any = [];

function startInterval(): void {
  fdComponent = fdComponent.filter(a => a.offsetParent != null);
  fdComponent.forEach(element => {
    element.fd._startInterval();
  });
}

@customElement('flipdown-timer-card')
export class FlipdownTimer extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('flipdown-timer-card-editor');
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit-element.polymer-project.org/guide/properties
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) private fd: FlipDown = null;
  @state() private config!: FlipdownTimerCardConfig;

  // https://lit-element.polymer-project.org/guide/properties#accessors-custom
  public setConfig(config: FlipdownTimerCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config || !config.entity) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      ...config,
    };

    let localizeBtn = ["start", "stop", "cancel", "resume", "reset"]
    let localizeHeader = ["Hours", "Minutes", "Seconds"]

    if (config.hasOwnProperty("localize")) {
      if (config.localize.button) {
        const BtnText = config.localize.button.replace(/\s/g, '').split(",");
        if (BtnText.length === 5) {
          localizeBtn = BtnText;
        }
      }
      if (config.localize.header) {
        const BtnText = config.localize.header.replace(/\s/g, '').split(",");
        if (BtnText.length === 3) {
          localizeHeader = BtnText;
        }
      }
    }
    localizeHeader.unshift("Days");

    this.config.localizeBtn = localizeBtn;
    this.config.localizeHeader = localizeHeader;

    if (!this.config.styles) {
      this.config.styles = {
        rotor: false,
        button: false,
      }
    }
  }

  // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if(this.fd) this.fd.stop();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this.config && this.config.entity) {
      const stateObj = this.hass?.states[this.config!.entity];
      if (stateObj) {
        this._start();
      }
    }
  }

  protected _start(): boolean {
    const state = this.hass.states[this.config.entity!];
    const fddiv = this.shadowRoot?.getElementById('flipdown');

    if (!fddiv) return false;
    if (fddiv && !this.fd) this._init();
    this.fd.state = state.state;

    //["start", "stop", "cancel", "resume", "reset"]
    if (state.state === 'active') {
      this.fd.button1.textContent = this.config.localizeBtn[1];
      this.fd.button2.textContent = this.config.localizeBtn[2];
      let timeRemaining = durationToSeconds(state.attributes.remaining);
      const madeActive = new Date(state.last_changed).getTime();
      timeRemaining = Math.max(timeRemaining + madeActive / 1000, 0);
      this.fd._updator(timeRemaining);
      this.fd.start();
      fdComponent.push(this);
      startInterval();
    } else if (state.state === 'idle') {
      this.fd.stop();
      this.fd.button1.textContent =  this.config.localizeBtn[0];
      this.fd.button2.textContent =  this.config.localizeBtn[4];
      this._reset();
    } else if (state.state === 'paused') {
      this.fd.stop();
      this.fd.button1.textContent =  this.config.localizeBtn[3];
      this.fd.button2.textContent =  this.config.localizeBtn[2];
      const timeRemaining = durationToSeconds(state.attributes.remaining);
      this.fd.rt = timeRemaining;
      this.fd._tick(true);
    }
    return true;
  }

  protected _clear(): void {
    this.fd = null;
  }

  protected _reset(): void {
    const state = this.hass.states[this.config.entity!];
    const duration = durationToSeconds(this.config.duration? this.config.duration:state.attributes.duration);
    this.fd.rt = duration;
    this.fd._tick(true);
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("hass")) {
      const stateObj = this.hass!.states[this.config.entity!];
      const oldHass = changedProps.get("hass") as this["hass"];
      const oldStateObj = oldHass
        ? oldHass.states[this.config.entity!]
        : undefined;

      if (oldStateObj !== stateObj) {
        this._start();
      } else if (!stateObj) {
        this._clear();
      }
    }
  }

  // https://lit-element.polymer-project.org/guide/templates
  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning(localize('common.show_warning'));
    }

    if (this.config.show_error) {
      return this._showError(localize('common.show_error'));
    }

    return html`
      <ha-card>
        <div class="card-content">
          ${this.config.show_title ?
      html`<hui-generic-entity-row .hass=${this.hass} .config=${this.config}></hui-generic-entity-row>`:
      html``}
          <div class="flipdown_shell" style="
            --rotor-width:  ${(this.config.styles.rotor && this.config.styles.rotor.width) || '50px'};
            --rotor-height: ${(this.config.styles.rotor && this.config.styles.rotor.height) || '80px'};
            --rotor-space:  ${(this.config.styles.rotor && this.config.styles.rotor.space) || '20px'};
            ${(this.config.styles.button && this.config.styles.button.width) && '--button-width: ' + this.config.styles.button.width }
          ">
            <div id="flipdown" class="flipdown"></div>
          </div>
        </div>
      </ha-card>
    `;
  }
  protected _init(): void {
    const fddiv = this.shadowRoot?.getElementById('flipdown');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const timeRemaining = new Date().getTime() / 1000;
    const state = this.hass.states[this.config.entity!].state;

    // eslint-disable-next-line @typescript-eslint/camelcase
    if (!this.fd) {
      this.fd = new FlipDown(timeRemaining, fddiv, {
        show_header: this.config.show_header,
        show_hour: this.config.show_hour,
        bt_location: this.config.styles.button && this.config.styles.button.hasOwnProperty("location") ? this.config.styles.button.location : 'right',
        theme: this.config.theme,
        headings: this.config.localizeHeader,
      })._init(state);
    }


    if (this.config.entity) {
      fddiv?.querySelectorAll('.rotor-trans-top').forEach((item, i) => {
        item.addEventListener('click', () => {
          this._handleRotorClick(item, i, true);
        })
      });
      fddiv?.querySelectorAll('.rotor-trans-bottom').forEach((item, i) => {
        item.addEventListener('click', () => {
          this._handleRotorClick(item, i, false);
        })
      });
      this.fd.button1.addEventListener('click', () => this._handleBtnClick(1));
      this.fd.button2.addEventListener('click', () => this._handleBtnClick(2));
    }
  }

  protected firstUpdated(): null | void {
    this._init();
  }

  private _handleRotorClick(item: any, param: number, inc: boolean): boolean {
    const state = this.hass.states[this.config.entity!].state;
    if (state !== 'idle') return false;
    const max = [5, 9, 5, 9, 5, 9];

    const rotorTarget = item.offsetParent;

    if (inc) {
      const currentValue = Number(rotorTarget.querySelector('.rotor-leaf-rear').textContent);
      const nextValue = (currentValue < max[param]) ? currentValue + 1 : 0;
      rotorTarget.querySelector('.rotor-leaf-front').classList.add('front-bottom');
      rotorTarget.querySelector('.rotor-leaf-rear').classList.add('rear-bottom');
      rotorTarget.querySelector('.rotor-leaf-rear').textContent = nextValue;
      rotorTarget.querySelector('.rotor-bottom').textContent = nextValue;
      rotorTarget.querySelector('.rotor-leaf').classList.add('flippedfr')

      setTimeout(() => {
        rotorTarget.querySelector('.rotor-leaf-front').textContent = nextValue;
        rotorTarget.querySelector('.rotor-top').textContent = nextValue;
        rotorTarget.querySelector('.rotor-leaf').classList.remove('flippedfr');
        rotorTarget.querySelector('.rotor-leaf-front').classList.remove('front-bottom');
        rotorTarget.querySelector('.rotor-leaf-rear').classList.remove('rear-bottom');
      }, 200);
    } else {
      const currentValue = Number(rotorTarget.querySelector('.rotor-leaf-rear').textContent);
      const nextValue = (currentValue > 0) ? currentValue - 1 : max[param];
      rotorTarget.querySelector('.rotor-leaf-rear').textContent = nextValue;
      rotorTarget.querySelector('.rotor-top').textContent = nextValue;
      rotorTarget.querySelector('.rotor-leaf').classList.add('flippedf')

      setTimeout(() => {
        rotorTarget.querySelector('.rotor-leaf-front').textContent = nextValue;
        rotorTarget.querySelector('.rotor-bottom').textContent = nextValue;
        rotorTarget.querySelector('.rotor-leaf').classList.remove('flippedf')
      }, 200);
    }
    return true;
  }

  private _handleBtnClick(param: number): void {
    const state = this.hass.states[this.config.entity!].state;
    switch (param) {
      case 1:
        let duration = this._getRotorTime();
        if (state === 'idle' && duration != '00:00:00') {
          if (this.config.show_hour == 'auto') {
            duration = duration.substr(3, 5) + ":00";
          }
          this.hass.callService('timer', 'start', {
            entity_id: this.config.entity,
            duration: duration
          })
        } else if (state === 'active') {
          this.hass.callService('timer', 'pause', {
            entity_id: this.config.entity,
          })
        } else if (state === 'paused') {
          this.hass.callService('timer', 'start', {
            entity_id: this.config.entity,
          })
        }
        break;
      case 2:
        if (state === 'idle') { // reset
          this._reset();
        } else {
          this.hass.callService('timer', 'cancel', {
            entity_id: this.config.entity,
          })
        }
    }
  }

  private _getRotorTime(): string {
    let durationNew = "";
    this.fd.rotorTop.forEach((el, i) => {
      durationNew += el.textContent;
      if (i == 1 || i == 3) durationNew += ":";
    });
    return durationNew;
  }

  private _showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }

  // https://lit-element.polymer-project.org/guide/styles
  static get styles(): CSSResultGroup {
    return unsafeCSS(styles);
  }
}
