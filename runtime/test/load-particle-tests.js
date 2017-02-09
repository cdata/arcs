/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

var loader = require("../load-particle.js");
let assert = require('chai').assert;

describe('particle loader', function() {
  it('can load a particle', function() {
    var particle = loader.loadParticle("TestParticle");
    assert.isNotNull(particle);
  });
});