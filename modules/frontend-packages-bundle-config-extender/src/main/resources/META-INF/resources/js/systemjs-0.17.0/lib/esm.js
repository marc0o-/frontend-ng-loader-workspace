/*
 * Extension to detect ES6 and auto-load Traceur or Babel for processing
 */
(function() {
  // good enough ES6 module detection regex - format detections not designed to be accurate, but to handle the 99% use case
  var esmRegEx = /(^\s*|[}\);\n]\s*)(import\s+(['"]|(\*\s+as\s+)?[^"'\(\)\n;]+\s+from\s+['"]|\{)|export\s+\*\s+from\s+["']|export\s+(\{|default|function|class|var|const|let|async\s+function))/;

  var traceurRuntimeRegEx = /\$traceurRuntime\s*\./;
  var babelHelpersRegEx = /babelHelpers\s*\./;

  hook('translate', function(translate) {
    return function(load) {
      var loader = this;
      return translate.call(loader, load)
      .then(function(source) {
        // detect & transpile ES6
        if (load.metadata.format == 'esm' || load.metadata.format == 'es6' || !load.metadata.format && source.match(esmRegEx)) {
          load.metadata.format = 'esm';

          // setting _loadedTranspiler = false tells the next block to
          // do checks for setting transpiler metadata
          this._loadedTranspiler = this._loadedTranspiler || false;

          // defined in es6-module-loader/src/transpile.js
          return transpile.call(loader, load);
        }

        // load the transpiler correctly
        if (this._loadedTranspiler === false && load.name == loader.normalizeSync(loader.transpiler)) {
          // always load transpiler as a global
          if (source.length > 100) {
            load.metadata.format = load.metadata.format || 'global';

            if (loader.transpiler === 'traceur')
              load.metadata.exports = 'traceur';
            if (loader.transpiler === 'typescript')
              load.metadata.exports = 'ts';
          }

          this._loadedTranspiler = true;
        }

        // load the transpiler runtime correctly
        if (this._loadedTranspilerRuntime === false) {
          if (load.name == loader.normalizeSync('traceur-runtime')
              || load.name == loader.normalizeSync('babel/external-helpers*')) {
            if (source.length > 100)
              load.metadata.format = load.metadata.format || 'global';

            this._loadedTranspilerRuntime = true;
          }
        }

        // detect transpiler runtime usage to load runtimes
        if (load.metadata.format == 'register' && this._loadedTranspilerRuntime !== true) {
          if (!__global.$traceurRuntime && load.source.match(traceurRuntimeRegEx)) {
            this._loadedTranspilerRuntime = this._loadedTranspilerRuntime || false;
            return loader['import']('traceur-runtime').then(function() {
              return source;
            });
          }
          if (!__global.babelHelpers && load.source.match(babelHelpersRegEx)) {
            this._loadedTranspilerRuntime = this._loadedTranspilerRuntime || false;
            return loader['import']('babel/external-helpers').then(function() {
              return source;
            });
          }
        }

        return source;
      });
    };
  });

})();
