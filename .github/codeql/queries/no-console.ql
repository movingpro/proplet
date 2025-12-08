/**
 * @name Console statement
 * @description Detects console method calls that should be removed before production
 * @kind problem
 * @problem.severity warning
 * @precision high
 * @id js/console-statement
 * @tags maintainability
 *       best-practice
 *       external/cwe/cwe-489
 */

import javascript

from MethodCallExpr call
where
  call.getReceiver().(VarAccess).getName() = "console" and
  call.getMethodName() in [
    "log",
    "warn",
    "error",
    "info",
    "debug",
    "trace",
    "dir",
    "dirxml",
    "table",
    "group",
    "groupCollapsed",
    "groupEnd",
    "clear",
    "count",
    "countReset",
    "assert",
    "profile",
    "profileEnd",
    "time",
    "timeLog",
    "timeEnd",
    "timeStamp"
  ]
select call, "Console." + call.getMethodName() + "() statement should be removed before production."
