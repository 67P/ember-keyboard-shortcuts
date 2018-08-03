import Mixin from '@ember/object/mixin';
import { on } from '@ember/object/evented';
import { initializeKeyboardShortcuts, destroyKeyboardShortcuts } from './index';
import { deprecate } from '@ember/application/deprecations';

export default function(bindEvent, unbindEvent) {
  return Mixin.create({
    init() {
      this._super(...arguments);

      deprecate(
        'Using ember-keyboard-shortcuts Mixin is deprecated. ' +
          'Please use initializeKeyboardShortcuts and destroyKeyboardShortcuts methods instead. ' +
          'Usage of mixins will be removed in the next major release. ' +
          'Learn more about migrating at https://github.com/Skalar/ember-keyboard-shortcuts#migrating-from-mixins',
        false,
        {
          id: 'ember-keyboard-shortcuts.mixins',
          until: '2.0.0'
        }
      );
    },

    bindShortcuts: on(bindEvent, function() {
      initializeKeyboardShortcuts(this);
    }),

    unbindShortcuts: on(unbindEvent, function() {
      destroyKeyboardShortcuts(this);
    })
  });
}
