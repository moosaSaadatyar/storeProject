!function() {

  var CSP = {},
    FAILURE = 'FAILURE',
    stepCounter = 0;

  CSP.solve = function solve(csp) {
    csp.timeStep = csp.timeStep || 1;
    var result = backtrack({}, csp.variables, csp);
    if (result == FAILURE) { return result; }
    for (var key in result) {
      result[key] = result[key][0];
    }
    return result;
  }

  function backtrack(_assigned, unassigned, csp) {
    var assigned = {};
    for (var key in _assigned) { assigned[key] = _assigned[key]; }

    if (finished(unassigned)) { return assigned; }
    var nextKey = selectUnassignedVariable(unassigned),
      values = orderValues(nextKey, assigned, unassigned, csp);
    delete unassigned[nextKey];

    for (var i = 0; i < values.length; i++) {
      stepCounter++;
      assigned[nextKey] = [values[i]];
      var consistent = enforceConsistency(assigned, unassigned, csp);
      var newUnassigned = {}, newAssigned = {};
      for (var key in consistent) {
        if (assigned[key]) { newAssigned[key] = assigned[key].slice(); }
        else { newUnassigned[key] = consistent[key].slice(); }
      }
      if (csp.cb) {
        setTimeout(
          (function (newAssigned, newUnassigned) {
            return function () { csp.cb(newAssigned, newUnassigned, csp); };
          })(newAssigned, newUnassigned),
          stepCounter * csp.timeStep
        );
      }
      if (anyEmpty(consistent)) { continue; }
      var result = backtrack(newAssigned, newUnassigned, csp);
      if (result != FAILURE) { return result; }
    }

    return FAILURE;
  }

  function finished(unassigned) {
    return Object.keys(unassigned).length == 0;
  }

  function anyEmpty(consistent) {
    for (var key in consistent) {
      if (consistent[key].length == 0) { return true; }
    }
    return false;
  }

  function partialAssignment(assigned, unassigned) {
    var partial = {};
    for (var key in unassigned) { partial[key] = unassigned[key].slice(); }
    for (var key in assigned) { partial[key] = assigned[key].slice(); }
    return partial;
  }

  function enforceConsistency(assigned, unassigned, csp) {
    function removeInconsistentValues(constraint, variables) {
      const params = constraint.slice(0, -1); // Extract parameters
      const constraintFunction = constraint[constraint.length - 1]; // Extract function

      let valid = true;

      for (const combination of cartesianProduct(params.map(param => variables[param] || assigned[param]))) {
        valid = constraintFunction(...combination);
        if (!valid) break;
      }

      if (!valid) {
        for (const param of params) {
          if (variables[param]) {
            variables[param] = variables[param].filter(value => {
              return constraintFunction(...params.map(p => assigned[p] || variables[p][0]));
            });
          }
        }
      }
      return valid;
    }

    function incomingConstraints(node) {
      return csp.constraints.filter(function (c) {
        return c.includes(node);
      });
    }

    var queue = csp.constraints.slice(),
      variables = partialAssignment(assigned, unassigned);
    while (queue.length) {
      var c = queue.shift();
      if (!removeInconsistentValues(c, variables)) {
        queue = queue.concat(incomingConstraints(c[0]));
      }
    }
    return variables;
  }

  function cartesianProduct(arrays) {
    return arrays.reduce((acc, curr) => {
      return acc.flatMap(a => curr.map(b => a.concat(b)));
    }, [[]]);
  }

  function selectUnassignedVariable(unassigned) {
    var minKey = null, minLen = Number.POSITIVE_INFINITY;
    for (var key in unassigned) {
      var len = unassigned[key].length;
      if (len < minLen) { minKey = key, minLen = len; }
    }
    return minKey;
  }

  function orderValues(nextKey, assigned, unassigned, csp) {
    function countValues(vars) {
      var sum = 0;
      for (var key in vars) { sum += vars[key].length; }
      return sum;
    }

    function valuesEliminated(val) {
      assigned[nextKey] = [val];
      var newLength = countValues(enforceConsistency(assigned, unassigned, csp));
      delete assigned[nextKey];
      return newLength;
    }

    var cache = {}, values = unassigned[nextKey];
    values.forEach(function(val) {
      cache[val] = valuesEliminated(val);
    });
    values.sort(function (a, b) { return cache[b] - cache[a]; });
    return values;
  }

  if (typeof define === 'function' && define.amd) {
    define(CSP);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = CSP;
  } else {
    this.csp = CSP;
  }

}();
