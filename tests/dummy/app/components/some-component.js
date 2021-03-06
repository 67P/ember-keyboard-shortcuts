import Component from '@ember/component';
import layout from '../templates/components/some-component';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';

export default Component.extend({
  layout,
  init() {
    this._super(...arguments);

    this.keyboardShortcuts = {
      f: {
        action: 'myAction', // action to trigger
        global: false, // whether to trigger inside input (default: true)
        preventDefault: true // (default: true)
      }
    };
  },

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  actions: {
    myAction() {
      alert('key `f` was pressed from component some-component');
    }
  }
});
