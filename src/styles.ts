import { css } from '@lit/reactive-element';

export const styles = css`
  /* THEMES */
  /********** Theme: hass **********/
  /* Font styles */
  .flipdown.flipdown__theme-hass {
    font-family: sans-serif;
    font-weight: bold;
  }
  /* Rotor group headings */
  .flipdown.flipdown__theme-hass .rotor-group-heading:before {
    color: var(--primary-color);
  }
  /* Delimeters */
  /* Rotor tops */
  .flipdown.flipdown__theme-hass .rotor,
  .flipdown.flipdown__theme-hass .rotor-top,
  .flipdown.flipdown__theme-hass .rotor-leaf-front {
    color: var(--text-primary-color);
    background-color: var(--primary-color);
  }
  /* Rotor bottoms */
  .flipdown.flipdown__theme-hass .rotor-bottom,
  .flipdown.flipdown__theme-hass .rotor-leaf-rear {
    color: var(--text-primary-color);
    background-color: var(--primary-color);
  }
  /* Hinge */
  .flipdown.flipdown__theme-hass .rotor:after {
    border-top: solid 1px var(--dark-primary-color);
  }
  .flipdown.flipdown__theme-hass .delimeter span {
    background-color: var(--primary-color);
  }
  .flipdown.flipdown__theme-hass .btn-top,
  .flipdown.flipdown__theme-hass .btn-bottom {
    background-color: var(--dark-primary-color);
    color: var(--text-primary-color);
  }
  /********** Theme: dark **********/
  /* Font styles */
  .flipdown.flipdown__theme-dark {
    font-family: sans-serif;
    font-weight: bold;
  }
  /* Rotor group headings */
  .flipdown.flipdown__theme-dark .rotor-group-heading:before {
    color: #000000;
  }
  /* Delimeters */
  /* Rotor tops */
  .flipdown.flipdown__theme-dark .rotor,
  .flipdown.flipdown__theme-dark .rotor-top,
  .flipdown.flipdown__theme-dark .rotor-leaf-front {
    color: #ffffff;
    background-color: #151515;
  }
  /* Rotor bottoms */
  .flipdown.flipdown__theme-dark .rotor-bottom,
  .flipdown.flipdown__theme-dark .rotor-leaf-rear {
    color: #efefef;
    background-color: #202020;
  }
  /* Hinge */
  .flipdown.flipdown__theme-dark .rotor:after {
    border-top: solid 1px #151515;
  }
  .flipdown.flipdown__theme-dark .delimeter span {
    background-color: #151515;
  }
  .flipdown.flipdown__theme-dark .btn-top,
  .flipdown.flipdown__theme-dark .btn-bottom {
    background-color: #202020;
    color: #ffffff;
  }
  /********** Theme: light **********/
  /* Font styles */
  .flipdown.flipdown__theme-light {
    font-family: sans-serif;
    font-weight: bold;
  }
  /* Rotor group headings */
  .flipdown.flipdown__theme-light .rotor-group-heading:before {
    color: #eeeeee;
  }
  /* Delimeters */
  .flipdown.flipdown__theme-light .rotor-group:nth-child(n + 1):nth-child(-n + 2):before,
  .flipdown.flipdown__theme-light .rotor-group:nth-child(n + 1):nth-child(-n + 2):after {
    background-color: #dddddd;
  }
  /* Rotor tops */
  .flipdown.flipdown__theme-light .rotor,
  .flipdown.flipdown__theme-light .rotor-top,
  .flipdown.flipdown__theme-light .rotor-leaf-front {
    color: #222222;
    background-color: #dddddd;
  }
  /* Rotor bottoms */
  .flipdown.flipdown__theme-light .rotor-bottom,
  .flipdown.flipdown__theme-light .rotor-leaf-rear {
    color: #333333;
    background-color: #eeeeee;
  }
  /* Hinge */
  .flipdown.flipdown__theme-light .rotor:after {
    border-top: solid 1px #222222;
  }
  .flipdown.flipdown__theme-light .delimeter span {
    background-color: #eeeeee;
  }
  .flipdown.flipdown__theme-light .btn-top,
  .flipdown.flipdown__theme-light .btn-bottom {
    background-color: #dddddd;
    color: #222222;
  }
  /* END OF THEMES */
  .flipdown_shell {
    width: 100%;
    text-align: center;
    align-content: center;
    display: block;
  }

  .flipdown {
    overflow: visible;
    display: inline-block;
  }

  .flipdown .rotor-group {
    position: relative;
    display: inline-block;
  }

  .flipdown .delimeter {
    width: var(--rotor-space, 20px);
    height: var(--rotor-height, 80px);
    position: relative;
    float: left;
  }

  .flipdown .delimeter.blink {
    animation: blinker 1s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .flipdown .rotor-group-heading {
    width: calc(var(--rotor-width, 50px) * 2 + 5px);
    height: 30px;
  }

  .flipdown .rotor-group-heading:before {
    display: block;
    line-height: 30px;
    text-align: center;
  }

  .flipdown .hide {
    display: none;
  }

  .flipdown .no-height {
    height: 0px;
  }

  .flipdown .rotor-group .rotor-group-heading:before {
    content: attr(data-before);
  }
  .flipdown .rotor-group.autohour .rotor-group-heading:before {
    content: attr(data-after);
  }

  .flipdown .rotor:after {
    content: '';
    z-index: 2;
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: var(--rotor-width, 50px);
    height: calc(var(--rotor-height, 80px) / 2);
    border-radius: 0px 0px 4px 4px;
  }

  .flipdown .delimeter span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 5px);
  }
  .flipdown .delimeter-span-top {
    top: calc(var(--rotor-height, 80px) / 2 - 20px);
  }
  .flipdown .delimeter-span-bottom {
    bottom: calc(var(--rotor-height, 80px) / 2 - 20px);
  }

  .flipdown .rotor {
    position: relative;
    float: left;
    width: var(--rotor-width, 50px);
    height: var(--rotor-height, 80px);
    margin: 0px 5px 0px 0px;
    border-radius: 4px;
    font-size: var(--rotor-fontsize);
    text-align: center;
    perspective: 200px;
  }

  .flipdown #d0 {
    margin: 0;
  }

  .flipdown .button-group {
    position: relative;
  }

  .flipdown .button-group.button-right {
    float: right;
    padding-left: var(--rotor-space, 20px);
  }

  .flipdown .button-group.button-right .button-group-heading {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  .flipdown .button-group.button-right .btn {
    position: relative;
    float: left;
    width: var(--button-width, 50px);
    height: var(--rotor-height, 80px);
    margin: 0px 0px 0px 0px;
    border-radius: 4px;
    text-align: center;
  }

  .flipdown .button-group.button-right .btn-top,
  .flipdown .button-group.button-right .btn-bottom {
    overflow: hidden;
    position: absolute;
    left: 0px;
    width: var(--button-width, 50px);
    margin: 0px;
    height: calc(var(--rotor-height, 80px) / 2 - 2px);
    padding: 0px;
    border-radius: 4px;
    border: 0px;
    font-family: sans-serif;
    font-size: var(--button-fontsize);
  }

  .flipdown .button-group.button-right .btn-bottom {
    bottom: 0;
  }

  .flipdown .button-group.button-bottom {
    position: relative;
    margin-top: 5px;
  }

  .flipdown .button-group.button-bottom .button-group-heading {
    display: none;
  }

  .flipdown .button-group.button-bottom .btn-top,
  .flipdown .button-group.button-bottom .btn-bottom {
    overflow: hidden;
    width: var(--button-width, calc(var(--rotor-width, 50px) * 2 + 5px));
    margin: 0px;
    height: var(--button-height, 20px);
    padding: 0px;
    border-radius: 4px;
    border: 0px;
    font-family: sans-serif;
    font-size: var(--button-fontsize);
  }
  .flipdown .button-group.button-bottom .btn-bottom {
    margin-left: var(--rotor-space, 20px);
  }

  .flipdown .rotor:last-child {
    margin-right: 0;
  }

  .flipdown .rotor-top,
  .flipdown .rotor-bottom {
    overflow: hidden;
    position: absolute;
    width: var(--rotor-width, 50px);
    height: calc(var(--rotor-height, 80px) / 2);
  }


  .flipdown .rotor-trans-top,
  .flipdown .rotor-trans-bottom {
    position: absolute;
    width: var(--rotor-width, 50px);
    height: calc(var(--rotor-height, 80px) / 2);
    z-index: 1000;
  }

  .flipdown .rotor-trans-bottom {
    bottom: 0px;
  }

  .flipdown .rotor-leaf {
    z-index: 1;
    position: absolute;
    width: var(--rotor-width, 50px);
    height: var(--rotor-height, 80px);
    transform-style: preserve-3d;
    transition: transform 0s;
  }

  .flipdown .rotor-leaf.flipped {
    transform: rotateX(-180deg);
    transition: all 0.5s ease-in-out;
  }

  .flipdown .rotor-leaf.flippedf {
    transform: rotateX(-180deg);
    transition: all 0.2s ease-in-out;
  }

  .flipdown .rotor-leaf.flippedr {
    transform: rotateX(180deg);
    transition: all 0.5s ease-in-out;
  }

  .flipdown .rotor-leaf.flippedfr {
    transform: rotateX(180deg);
    transition: all 0.2s ease-in-out;
  }

  .flipdown .rotor-leaf-front,
  .flipdown .rotor-leaf-rear {
    overflow: hidden;
    position: absolute;
    width: var(--rotor-width, 50px);
    height: calc(var(--rotor-height, 80px) / 2);
    margin: 0;
    transform: rotateX(0deg);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .flipdown .rotor-leaf-front {
    line-height: var(--rotor-height, 80px);
    border-radius: 4px;
  }

  .flipdown .rotor-leaf-rear {
    line-height: 0px;
    border-radius: 4px;
    transform: rotateX(-180deg);
  }

  .flipdown .front-bottom {
    bottom: 0px;
    line-height: 0px;
  }

  .flipdown .rear-bottom {
    bottom: 0px;
    line-height: var(--rotor-height, 80px);
  }

  .flipdown .rotor-top {
    line-height: var(--rotor-height, 80px);
    border-radius: 4px 4px 0px 0px;
  }

  .flipdown .rotor-bottom {
    bottom: 0;
    line-height: 0px;
    border-radius: 0px 0px 4px 4px;
  }
`;
