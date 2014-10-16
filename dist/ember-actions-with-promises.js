// Generated by CoffeeScript 1.8.0
(function() {
  define('ember-actions-with-promises', ['ember'], function(ember) {
    var Ember, RSVP, Resolver, appendResolverToArguments, origDefer;
    Ember = ember['default'];
    RSVP = Ember.RSVP;
    origDefer = RSVP.defer;
    Resolver = (function() {
      function Resolver() {
        var k, plainObject, v;
        plainObject = origDefer();
        for (k in plainObject) {
          v = plainObject[k];
          this[k] = v;
        }
      }

      return Resolver;

    })();
    RSVP.Resolver = Resolver;
    RSVP.defer = function() {
      return new RSVP.Resolver;
    };
    appendResolverToArguments = function(args) {
      var lastArg, newArgs, resolver;
      newArgs = [].slice.call(args);
      lastArg = newArgs[newArgs.length - 1];
      if ((lastArg != null ? lastArg.promise : void 0) instanceof RSVP.Promise) {
        resolver = lastArg;
      }
      if (resolver == null) {
        resolver = (function(_this) {
          return function() {
            newArgs.push(resolver = new RSVP.Resolver);
            return resolver;
          };
        })(this)();
      }
      return [resolver, newArgs];
    };
    Ember.ActionHandler.reopen({
      send: function() {
        var args, resolver, _ref;
        _ref = appendResolverToArguments(arguments), resolver = _ref[0], args = _ref[1];
        Ember.ActionHandler.mixins[0].properties.send.apply(this, args);
        return resolver.promise;
      }
    });
    return Ember.Router.reopen({
      send: function() {
        var args, resolver, _ref;
        _ref = appendResolverToArguments(arguments), resolver = _ref[0], args = _ref[1];
        this.router.trigger.apply(this.router, args);
        return resolver.promise;
      }
    });
  });

}).call(this);
