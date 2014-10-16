define 'ember-actions-with-promises', ['ember'], (ember) ->
  Ember = ember['default']
  RSVP = Ember.RSVP

  # Assign type to resolver to make it recognizable. By default, resolver 
  # is a plain object returned from Ember.RSVP#defer
  origDefer = RSVP.defer
  class Resolver
    constructor: ->
      plainObject = origDefer()
      this[k] = v for k, v of plainObject
  RSVP.Resolver = Resolver
  RSVP.defer = -> new RSVP.Resolver

  appendResolverToArguments = (args) ->
    newArgs = [].slice.call args
    lastArg = newArgs[newArgs.length - 1]
    if lastArg?.promise instanceof RSVP.Promise
      resolver = lastArg
    resolver ?= do =>
      newArgs.push resolver = new RSVP.Resolver
      resolver
    [resolver, newArgs]

  Ember.ActionHandler.reopen
    # @return {Ember.RSVP.Promise}
    send: ->
      [resolver, args] = appendResolverToArguments arguments
      # mixins are private
      Ember.ActionHandler.mixins[0].properties.send.apply this, args
      resolver.promise

  Ember.Router.reopen
    # @return {Ember.RSVP.Promise}
    send: ->
      [resolver, args] = appendResolverToArguments arguments
      @router.trigger.apply @router, args
      resolver.promise