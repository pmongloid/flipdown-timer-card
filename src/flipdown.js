/**
 * @name FlipDown
 * @description Flip styled countdown clock
 * @author Peter Butcher (PButcher) <pbutcher93[at]gmail[dot]com>
 * @param {number} uts - Time to count down to as unix timestamp
 * @param {string} el - DOM element to attach FlipDown to
 * @param {object} opt - Optional configuration settings
 **/


/**
 * @name pad
 * @description Prefix a number with zeroes
 * @author PButcher
 * @param {string} n - Number to pad
 * @param {number} len - Desired length of number
 **/
function pad(n, len) {
  n = n.toString();
  return n.length < len ? pad("0" + n, len) : n;
}

/**
 * @name appendChildren
 * @description Add multiple children to an element
 * @author PButcher
 * @param {object} parent - Parent
 **/
function appendChildren(parent, children) {
  children.forEach((el) => {
    parent.appendChild(el);
  });
}

export class FlipDown {
  constructor(uts, el, opt = {}) {
    // If uts is not specified
    if (typeof uts !== "number") {
      throw new Error(
        `FlipDown: Constructor expected unix timestamp, got ${typeof uts} instead.`
      );
    }

    this.rt = null;
    this.button1 = null;
    this.button2 = null;
    // FlipDown version
    this.version = "0.3.2";
    this._sign = true;

    // Initialised?
    this.initialised = false;
    this.active = false;
    this.state = "";
    this.headerShift = false;
    this.delimeterBlink = null;
    this.delimeterIsBlinking = false;
    // Time at instantiation in seconds
    this.now = this._getTime();

    // UTS to count down to
    this.epoch = uts;

    // UTS passed to FlipDown is in the past
    this.countdownEnded = false;

    // User defined callback for countdown end
    this.hasEndedCallback = null;

    // FlipDown DOM element
    this.element = el;

    // Rotor DOM elements
    this.rotorGroups = [];
    this.rotors = [];
    this.rotorLeafFront = [];
    this.rotorLeafRear = [];
    this.rotorTops = [];
    this.rotorBottoms = [];

    // Interval
    this.countdown = null;

    // Number of days remaining
    this.daysRemaining = 0;

    // Clock values as numbers
    this.clockValues = {};

    // Clock values as strings
    this.clockStrings = {};

    // Clock values as array
    this.clockValuesAsString = [];
    this.prevClockValuesAsString = [];

    // Parse options
    this.opts = this._parseOptions(opt);

    // Set options
    this._setOptions();

    // Print Version
    //console.log(`FlipDown ${this.version} (Theme: ${this.opts.theme})`);
  }

  /**
   * @name start
   * @description Start the countdown
   * @author PButcher
   **/
  start() {
    // Initialise the clock
    if (!this.initialised) this._init();
    this.rt = null;
    this.active = true;
    this._tick();
    // Set up the countdown interval
    // Chainable
    return this;
  }

  _startInterval() {
    clearInterval(this.countdown);
    if (this.active) this.countdown = window.setInterval(this._tick.bind(this), 1000);
  }

  stop() {
    clearInterval(this.countdown);
    this.countdown = null;
    this.active = false;
  }
  /**
   * @name ifEnded
   * @description Call a function once the countdown ends
   * @author PButcher
   * @param {function} cb - Callback
   **/
  ifEnded(cb) {
    this.hasEndedCallback = function () {
      cb();
      this.hasEndedCallback = null;
    };

    // Chainable
    return this;
  }

  /**
   * @name _getTime
   * @description Get the time in seconds (unix timestamp)
   * @author PButcher
   **/
  _getTime() {
    return new Date().getTime() / 1000;
  }

  /**
   * @name _hasCountdownEnded
   * @description Has the countdown ended?
   * @author PButcher
   **/
  _hasCountdownEnded() {
    // Countdown has ended
    if (this.epoch - this.now < 0) {
      this.countdownEnded = true;

      // Fire the ifEnded callback once if it was set
      if (this.hasEndedCallback != null) {
        // Call ifEnded callback
        this.hasEndedCallback();

        // Remove the callback
        this.hasEndedCallback = null;
      }

      return true;

      // Countdown has not ended
    } else {
      this.countdownEnded = false;
      return false;
    }
  }

  /**
   * @name _parseOptions
   * @description Parse any passed options
   * @param {object} opt - Optional configuration settings
   * @author PButcher
   **/
  _parseOptions(opt) {
    let headings = ["Days", "Hours", "Minutes", "Seconds"];
    if (opt.headings && opt.headings.length === 4) {
      headings = opt.headings;
    }
    return {
      // Theme
      theme: opt.hasOwnProperty("theme") && opt.theme ? opt.theme : "hass",
      showHeader: opt.hasOwnProperty("show_header") && opt.show_header ? opt.show_header : false,
      showHour: opt.hasOwnProperty("show_hour") && opt.show_hour ? opt.show_hour : false,
      btLocation: opt.bt_location,
      headings,
    };
  }

  /**
   * @name _setOptions
   * @description Set optional configuration settings
   * @author PButcher
   **/
  _setOptions() {
    // Apply theme
    this.element.classList.add(`flipdown__theme-${this.opts.theme}`);
  }

  /**
   * @name _init
   * @description Initialise the countdown
   * @author PButcher
   **/
  _init(state) {
    this.state = state;
    this.initialised = true;

    // Check whether countdown has ended and calculate how many digits the day counter needs
    if (this._hasCountdownEnded()) {
      this.daysremaining = 0;
    } else {
      this.daysremaining = Math.floor(
        (this.epoch - this.now) / 86400
      ).toString().length;
    }
    //var dayRotorCount = this.daysremaining <= 2 ? 2 : this.daysremaining;

    // Create and store rotors


    // Create day rotor group
    // var dayRotors = [];
    // for (var i = 0; i < dayRotorCount; i++) {
    //   dayRotors.push(this.rotors[i]);
    // }
    // this.element.appendChild(this._createRotorGroup(dayRotors, 0));

    // Create other rotor groups
    const dayRotorCount = 0;
    for (let i = 0; i < dayRotorCount + 6; i++) {
      this.rotors.push(this._createRotor(0));
    }
    let count = dayRotorCount;
    for (let i = 0; i < 3; i++) {
      const otherRotors = [];
      for (let j = 0; j < 2; j++) {
        this.rotors[count].setAttribute("id", "d" + (1 - j))
        otherRotors.push(this.rotors[count]);
        count++;
      }
      const rg = this._createRotorGroup(otherRotors, i + 1);
      this.rotorGroups.push(rg);
      this.element.appendChild(rg);
    }
    this.element.appendChild(this._createButton());

    // Store and convert rotor nodelists to arrays
    this.rotorLeafFront = Array.prototype.slice.call(
      this.element.getElementsByClassName("rotor-leaf-front")
    );
    this.rotorLeafRear = Array.prototype.slice.call(
      this.element.getElementsByClassName("rotor-leaf-rear")
    );
    this.rotorTop = Array.prototype.slice.call(
      this.element.getElementsByClassName("rotor-top")
    );
    this.rotorBottom = Array.prototype.slice.call(
      this.element.getElementsByClassName("rotor-bottom")
    );

    // Set initial values;
    this._tick();
    this._updateClockValues(true);

    return this;
  }

  /**
   * @name _createRotorGroup
   * @description Add rotors to the DOM
   * @author PButcher
   * @param {array} rotors - A set of rotors
   **/
  _createRotorGroup(rotors, rotorIndex) {
    const rotorGroup = document.createElement("div");
    rotorGroup.className = "rotor-group";
    if ((!this.opts.showHour || this.opts.showHour == 'auto') && rotorIndex == 1) rotorGroup.className += " hide";
    if (this.opts.showHour == 'auto' && this.state == 'idle') {
      rotorGroup.className += " autohour";
      this.headerShift = true;
    }
    rotorGroup.setAttribute("id", this.opts.headings[rotorIndex]);
    const dayRotorGroupHeading = document.createElement("div");
    dayRotorGroupHeading.className = "rotor-group-heading";

    if (this.opts.showHeader) {
      dayRotorGroupHeading.setAttribute(
        "data-before",
        this.opts.headings[rotorIndex]
      );
      dayRotorGroupHeading.setAttribute(
        "data-after",
        this.opts.headings[rotorIndex - 1]
      );
    } else { // insert blank text to avoid css fail
      dayRotorGroupHeading.setAttribute(
        "data-before",
        " "
      );
      dayRotorGroupHeading.setAttribute(
        "data-after",
        " "
      );
      dayRotorGroupHeading.className += " no-height";
    }

    rotorGroup.appendChild(dayRotorGroupHeading);
    appendChildren(rotorGroup, rotors);
    if (rotorIndex < 3) {
      const delimeter = document.createElement("div");
      delimeter.className = "delimeter"
      const delimeterSpanTop = document.createElement("span");
      delimeterSpanTop.className = "delimeter-span-top";
      const delimeterSpanBottom = document.createElement("span");
      delimeterSpanBottom.className = "delimeter-span-bottom";

      appendChildren(delimeter, [delimeterSpanTop, delimeterSpanBottom]);
      rotorGroup.appendChild(delimeter);
      if (rotorIndex == 2) this.delimeterBlink = delimeter;
    }
    return rotorGroup;
  }

  _createButton() {
    const buttondiv = document.createElement("div");
    buttondiv.className = 'button-group'
    if (this.opts.btLocation == 'bottom') {
      buttondiv.className += ' button-bottom'
    } else if (this.opts.btLocation == 'hide') {
      buttondiv.className += ' hide'
    } else {
      buttondiv.className += ' button-right'
    }

    const Heading = document.createElement("div");
    Heading.className = "button-group-heading";
    Heading.setAttribute("data-before", "");

    const button = document.createElement("div");
    button.className = "btn";
    this.button1 = document.createElement("button");
    this.button2 = document.createElement("button");
    this.button1.className = "btn-top";
    this.button2.className = "btn-bottom";

    if (this.opts.showHeader) {
      appendChildren(buttondiv, [Heading, button]);
    } else {
      appendChildren(buttondiv, [button]);
    }
    appendChildren(button, [this.button1, this.button2]);
    return buttondiv;
  }

  /**
   * @name _createRotor
   * @description Create a rotor DOM element
   * @author PButcher
   * @param {number} v - Initial rotor value
   **/
  _createRotor(v = 0) {
    const rotor = document.createElement("div");
    const rotorTransTop = document.createElement("div");
    const rotorTransBottom = document.createElement("div");
    const rotorLeaf = document.createElement("div");
    const rotorLeafRear = document.createElement("figure");
    const rotorLeafFront = document.createElement("figure");
    const rotorTop = document.createElement("div");
    const rotorBottom = document.createElement("div");
    rotor.className = "rotor";
    rotorLeaf.className = "rotor-leaf";
    rotorLeafRear.className = "rotor-leaf-rear";
    rotorLeafFront.className = "rotor-leaf-front";
    rotorTransTop.className = "rotor-trans-top";
    rotorTransBottom.className = "rotor-trans-bottom";
    rotorTop.className = "rotor-top";
    rotorBottom.className = "rotor-bottom";
    rotorLeafFront.textContent = v;
    rotorLeafRear.textContent = v;
    rotorTop.textContent = v;
    rotorBottom.textContent = v;
    appendChildren(rotor, [rotorTransTop, rotorTransBottom, rotorLeaf, rotorTop, rotorBottom]);
    appendChildren(rotorLeaf, [rotorLeafRear, rotorLeafFront]);
    return rotor;
  }

  _updator(epoch) {
    this.epoch = epoch;
  }

  /**
   * @name _tick
   * @description Calculate current tick
   * @author PButcher
   **/
  _tick(reset = false) {
    // Get time now

    this.now = this._getTime();

    // Between now and epoch
    //let diff = Math.floor(this.epoch - this.now <= 0 ? 0 : this.epoch - this.now);
    let diff;

    if (this.epoch - this.now >= 0) {
      diff = Math.floor(this.epoch - this.now);
      this._sign = true;
    } else {
      diff = 0;
      this._sign = true;
      /*
      diff = Math.floor(this.now - this.epoch);
      if (diff > 0) this._sign  = false;
      */
    }

    if (this.rt != null) diff = this.rt;

    // Days remaining
    //this.clockValues.d = Math.floor(diff / 86400);
    //diff -= this.clockValues.d * 86400;
    this.clockValues.d = 0;

    // Hours remaining
    this.clockValues.h = Math.floor(diff / 3600);
    diff -= this.clockValues.h * 3600;

    // Minutes remaining
    this.clockValues.m = Math.floor(diff / 60);
    diff -= this.clockValues.m * 60;

    // Seconds remaining
    this.clockValues.s = Math.floor(diff);

    // Update clock values

    this._updateClockValues(false, reset);

    // Has the countdown ended?
    //this._hasCountdownEnded();
  }

  /**
   * @name _updateClockValues
   * @description Update the clock face values
   * @author PButcher
   * @param {boolean} init - True if calling for initialisation
   **/
  _updateClockValues(init = false, reset = false) {
    // Build clock value strings
    this.clockStrings.d = pad(this.clockValues.d, 2);
    this.clockStrings.h = pad(this.clockValues.h, 2);
    this.clockStrings.m = pad(this.clockValues.m, 2);
    this.clockStrings.s = pad(this.clockValues.s, 2);

    // Concat clock value strings
    if (this.opts.showHour == 'auto' && ((this.clockValues.h > 0) || this.state == 'idle')) {
      if (!this.headerShift) {
        this.rotorGroups.forEach((el) =>
          el.classList.add("autohour")
        );
        this.headerShift = true;
      }
      if (this.state == 'active' && !this.delimeterIsBlinking) {
        this.delimeterBlink.classList.add("blink");
        this.delimeterIsBlinking = true;
      } else if (this.state != 'active' && this.delimeterIsBlinking) {
        this.delimeterBlink.classList.remove("blink");
        this.delimeterIsBlinking = false;
      }
      this.clockValuesAsString = (
        "00" +
        this.clockStrings.h +
        this.clockStrings.m
      ).split("");
    } else {
      if (this.headerShift) {
        this.rotorGroups.forEach((el) =>
          el.classList.remove("autohour")
        );
        this.headerShift = false;
      }
      if (this.delimeterIsBlinking) {
        this.delimeterBlink.classList.remove("blink");
        this.delimeterIsBlinking = false;
      }
      this.clockValuesAsString = (
        this.clockStrings.h +
        this.clockStrings.m +
        this.clockStrings.s
      ).split("");
    }

    // Update rotor values
    // Note that the faces which are initially visible are:
    // - rotorLeafFront (top half of current rotor)
    // - rotorBottom (bottom half of current rotor)
    // Note that the faces which are initially hidden are:
    // - rotorTop (top half of next rotor)
    // - rotorLeafRear (bottom half of next rotor)

    function rotorLeafFrontSet() {
      this.rotorLeafFront.forEach((el, i) => {
        el.textContent = this.prevClockValuesAsString[i];
      });
    }

    function rotorBottomSet() {
      this.rotorBottom.forEach((el, i) => {
        el.textContent = this.clockValuesAsString[i];
      });
    }

    function rotorTopSet() {
      this.rotorTop.forEach((el, i) => {
        el.textContent = this.prevClockValuesAsString[i];
      });
    }

    function rotorTopFlip() {
      this.rotorTop.forEach((el, i) => {
        if (el.textContent != this.clockValuesAsString[i]) {
          el.textContent = this.clockValuesAsString[i];
        }
      });
    }

    function rotorLeafRearFlip() {
      this.rotorLeafRear.forEach((el, i) => {
        if (el.textContent != this.clockValuesAsString[i]) {
          el.textContent = this.clockValuesAsString[i];
          let animationType = (this._sign)? "flipped":"flippedr"
          el.parentElement.classList.add(animationType);
          const flip = setInterval(
            function () {
              el.parentElement.classList.remove(animationType);
              rotorRevPost.call(this);
              clearInterval(flip);
            }.bind(this),
            500
          );
        }
      });
    }

    function rotorRev() {
      this.rotorLeafFront.forEach((el, i) => {
        el.classList.add("front-bottom");
      });
      this.rotorLeafRear.forEach((el, i) => {
        el.classList.add("rear-bottom");
      });
      rotorBottomSet.call(this);
    }

    function rotorRevPost() {
      this.rotorLeafFront.forEach((el, i) => {
        el.classList.remove("front-bottom");
      });
      this.rotorLeafRear.forEach((el, i) => {
        el.classList.remove("rear-bottom");
      });
    }

    if (this._sign) {
      rotorTopFlip.call(this);
    } else {
      rotorRev.call(this);
    }
    rotorLeafRearFlip.call(this);


    // Init
    if (!init) {
      setTimeout(rotorLeafFrontSet.bind(this), 500);
      if (this._sign) {
        setTimeout(rotorBottomSet.bind(this), 500);
      } else {
        setTimeout(rotorTopSet.bind(this), 500);
      }
    } else {
      rotorTopFlip.call(this);
      rotorLeafRearFlip.call(this);
    }

    // Save a copy of clock values for next tick
    this.prevClockValuesAsString = this.clockValuesAsString;
  }
}