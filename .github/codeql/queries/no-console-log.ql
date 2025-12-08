/**
 * @name Console log statement
 * @description Detects console.log statements that should be removed before production
 * @kind problem
 * @problem.severity warning
 * @precision high
 * @id js/console-log
 * @tags maintainability
 *       best-practice
 *       external/cwe/cwe-489
 */

import javascript

from MethodCallExpr call
where
  call.getReceiver().(VarAccess).getName() = "console" and
  call.getMethodName() = "log"
select call, "Console.log statement should be removed before production."
