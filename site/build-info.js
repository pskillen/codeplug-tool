(function () {
  var env = "__BUILD_ENV__";
  var version = "__BUILD_VERSION__";

  function resolved(value) {
    return value.indexOf("__") === 0 ? "local" : value;
  }

  window.BUILD_INFO = {
    env: resolved(env),
    version: resolved(version),
    label: function () {
      return this.env + " · " + this.version;
    }
  };
})();
