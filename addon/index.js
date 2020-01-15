/* global Mousetrap */
import { typeOf } from '@ember/utils';

export function bindKeyboardShortcuts(context, element) {
  const shortcuts = context.keyboardShortcuts;
  if (typeOf(shortcuts) !== 'object') {
    return;
  }

  context._mousetraps = [];

  Object.keys(shortcuts).forEach(function(shortcut) {
    const actionObject = shortcuts[shortcut];
    let mousetrap;
    let preventDefault = true;

    function invokeAction(action, eventType) {
      let type = typeOf(action);
      let callback;
      if (type === 'string') {
        callback = function() {
          context[action]();
          return preventDefault !== true;
        };
      } else if (type === 'function') {
        callback = action.bind(context);
      } else {
        throw new Error('Invalid value for keyboard shortcut: ' + action);
      }
      mousetrap.bind(shortcut, callback, eventType);
    }

    if (typeOf(actionObject) === 'object') {
      if (actionObject.global === false) {
        mousetrap = new Mousetrap(document);
      } else if (actionObject.scoped) {
        if (typeOf(actionObject.scoped) === 'boolean') {
          mousetrap = new Mousetrap(element);
        } else if (typeOf(actionObject.scoped) === 'string') {
          mousetrap = new Mousetrap(
            document.querySelector(actionObject.scoped)
          );
        }
      } else if (actionObject.targetElement) {
        mousetrap = new Mousetrap(actionObject.targetElement);
      } else {
        mousetrap = new Mousetrap(document.body);
      }

      if (actionObject.preventDefault === false) {
        preventDefault = false;
      }

      invokeAction(actionObject.action, actionObject.eventType);
    } else {
      mousetrap = new Mousetrap(document.body);
      invokeAction(actionObject);
    }

    context._mousetraps.push(mousetrap);
  });
}

export function unbindKeyboardShortcuts(context) {
  const _removeEvent = (object, type, callback) => {
    if (object.removeEventListener) {
      object.removeEventListener(type, callback, false);
      return;
    }
    object.detachEvent('on' + type, callback);
  };
  Array.isArray(context._mousetraps) && context._mousetraps.forEach(mousetrap => {
    // manually unbind JS event
    _removeEvent(mousetrap.target, 'keypress', mousetrap._handleKeyEvent);
    _removeEvent(mousetrap.target, 'keydown', mousetrap._handleKeyEvent);
    _removeEvent(mousetrap.target, 'keyup', mousetrap._handleKeyEvent);
    mousetrap.reset();
  });
  context._mousetraps = [];
}
