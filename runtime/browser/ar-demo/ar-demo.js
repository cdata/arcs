/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const Suggestinator = require("../../suggestinator.js");
const BrowserLoader = require("../../browser-loader.js");
const SlotComposer = require('../../slot-composer.js');

const recipes = require('./recipes.js');
const DemoBase = require('../lib/demo-base.js');

let template = Object.assign(document.createElement('template'), { innerHTML: `

<camera-obscura>
  <a-scene surface></a-scene>
</camera-obscura>

`.trim() });

class DemoFlow extends DemoBase {
  get template() {
    return template;
  }

  mount() {
    this._root = this;
    this._root.appendChild(document.importNode(this.template.content, true));
    this.didMount();
  }

  didMount() {
    this.slotComposer = new SlotComposer(this._root.querySelector('[particle-container]'));
    //const { arc } = ContextFactory({
      //loader: new BrowserLoader('../../'),
      //// particle execution context = pec
      //pecFactory: require('../worker-pec-factory.js').bind(null, '../../'),
      //slotComposer: this.slotComposer
    //});

    const arc = new Arc({
      id: 'demo',
      loader: new BrowserLoader('../../'),
      pecFactory: require('../worker-pec-factory.js').bind(null, '../../'),
      slotComposer
    });

    this._root.addEventListener('anchor-added', event => this.onAnchorAdded(event));

    this.arc = arc;
    this.stages = [{
      recipes: [
        recipes[0]
      ]
    }];
    this.suggestions = this._root.querySelector('suggestions-element');
    this.suggestions.arc = arc;
    this.suggestions.callback = this.nextStage.bind(this);
  }

  onAnchorAdded(event) {
    const { slotContext, anchor } = event.detail;
    const slot = this.slotComposer._getOrCreateSlot(anchor.id);

    slot.initialize(slotContext, null);
  }
}
