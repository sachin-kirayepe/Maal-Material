const fs = require("fs");

function logLine(file, lineNo) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  console.log(`\n--- ${file}:${lineNo} ---`);
  console.log(lines[lineNo - 1]);
}

logLine("src/common/engines/adaptive-experience.engine.ts", 43);
logLine("src/common/engines/adaptive-process.engine.ts", 35);
logLine("src/common/engines/ai-playbook.engine.ts", 33);
logLine("src/common/engines/digital-twin.engine.ts", 70);
logLine("src/common/engines/execution-consciousness.engine.ts", 65);
logLine("src/common/engines/federation-analytics.engine.ts", 68);
logLine("src/common/engines/federation-analytics.engine.ts", 69);
logLine("src/common/engines/planetary-routing.engine.ts", 33);
logLine("src/common/engines/planetary-routing.engine.ts", 35);
logLine("src/common/engines/universal-interoperability.engine.ts", 72);
logLine("src/common/engines/workflow-decision.engine.ts", 56);
logLine("src/common/queues/base.processor.ts", 39);
logLine("src/modules/jobs/processors/notification.processor.ts", 48);
logLine("src/modules/simplified-workflows/simplified-workflows.service.ts", 62);
logLine("src/modules/users/users.controller.spec.ts", 70);
