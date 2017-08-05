/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const Arc = require('../arc.js');
const Suggestinator = require('../suggestinator.js');
const systemParticles = require('../system-particles.js');
const BrowserLoader = require('../browser-loader.js');
const SlotComposer = require('../slot-composer.js');
const DemoBase = require('./lib/demo-base.js');

const AutoTabs = require('./lib/auto-tabs.js');
const InterleavedList = require('./lib/interleaved-list.js');
const ModelSelect = require('./lib/model-select.js');
const SlotContainer = require('./lib/slot-container.js');
const SuggestionsElement = require('./lib/suggestions-element.js');
const XenElement = require('./lib/xen-element.js');
const XenState = require('./lib/xen-state.js');
const XenTemplate = require('./lib/xen-template.js');

const workerPecFactory = (base, id) => {
  const channel = new MessageChannel();
  const worker = new Worker('/lib/worker-entry.js');
  worker.postMessage({id: `${id}:inner`, base}, [channel.port1]);
  return channel.port2;
};

module.exports = window.Arcs = {
  Arc,
  DemoBase,
  Suggestinator,
  systemParticles,
  BrowserLoader,
  SlotComposer,
  AutoTabs,
  InterleavedList,
  ModelSelect,
  SlotContainer,
  SuggestionsElement,
  XenElement,
  XenState,
  XenTemplate,
  workerPecFactory
};

