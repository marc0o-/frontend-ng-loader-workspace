"deps[] ./amd-dep-A.js";
"deps[] ./amd-dep-B.js";

define([], function() {
  return [A, B];
});