# ember-actions-with-promises

This experimental monkey patch lets you respond to a result of an Ember action via promises. Each call to `ActionHandler#send` or `Router#send` will return a promise that can be resolved or rejected in an action handler.

## Notice

[BREAKING] This patch may break your app by changing the method signature of action handlers. Every action handler receives an additional `resolver` argument, which you can either ignore or use to resolve / reject the promise. If you process arguments in some of your action handlers by checking for `arguments` length, you have to account for the added resolver.

## Usage

```coffeescript
askForConfirmation = @send 'openModal', text: "Are you sure you want to delete the item?"
# `askForConfirmation` is a promise that resolves upon the modal is closed with some 'OK' button
destroyRecord = askForConfirmation.then => (@get 'model').destroyRecord()
# We can chain promises as usual
destroyRecord.then => @transitionToRoute 'items.index'
```

In the action handler:

```coffeescript
actions:  
  # @param resolver RSVP.Resolver {resolve: Function, reject: Function}
  openModal: (args..., resolver) ->
    @resolver = resolver

  closeModal: (args..., resolver) ->
    [response] = args
    if response then @resolver.resolve response else @resolver.reject()
```

## Installation

Fetch `mbixby/ember-actions-with-promises` with Bower, import `ember-actions-with-promises/dist/ember-actions-with-promises.js` in Brocfile.js (if you're using ember-cli) and require the `ember-actions-with-promises` module in `app.js` or some app initializer.

## Notes

* While the original intent behind actions may have been one way communication up the MVC stack, the ability to return some result and respond to it is often quite handy
* Only `ActionHandler#send` and `Router#send` return promises, not e.g. `Transition#trigger`
* `RSVP#defer` now returns an instance of `RSVP.Resolver` instead of `Object`