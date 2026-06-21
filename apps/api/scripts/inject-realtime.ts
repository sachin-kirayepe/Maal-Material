import { Project, SyntaxKind, Scope } from "ts-morph";
import * as path from "path";

async function run() {
  console.log("Starting AST Transformation...");
  const project = new Project({
    tsConfigFilePath: path.join(__dirname, "../tsconfig.json"),
  });

  const sourceFiles = project.getSourceFiles("src/modules/**/*.service.ts");
  console.log(`Found ${sourceFiles.length} service files to process.`);

  const mutatingKeywords = ["create", "update", "delete", "approve", "cancel", "record", "process", "mark"];

  let modifiedCount = 0;

  for (const sf of sourceFiles) {
    if (sf.getFilePath().includes("realtime.service.ts") || sf.getFilePath().includes("realtime.gateway.ts")) {
      continue;
    }

    const classes = sf.getClasses();
    let fileModified = false;

    for (const cls of classes) {
      if (!cls.getDecorator("Injectable")) continue;

      const methods = cls.getMethods();
      const methodsToUpdate = methods.filter((m) => {
        const name = m.getName();
        return mutatingKeywords.some((k) => name.toLowerCase().includes(k));
      });

      if (methodsToUpdate.length === 0) continue;

      // 1. Add Import
      const imports = sf.getImportDeclarations();
      const hasImport = imports.some((i) => i.getNamedImports().some((n) => n.getName() === "RealtimeGateway"));
      if (!hasImport) {
        sf.addImportDeclaration({
          namedImports: ["RealtimeGateway"],
          moduleSpecifier: "@modules/realtime/realtime.gateway",
        });
        fileModified = true;
      }

      // 2. Add Constructor Injection
      let constructors = cls.getConstructors();
      if (constructors.length === 0) {
        cls.addConstructor();
        constructors = cls.getConstructors();
      }
      
      const constructor = constructors[0];
      if (constructor) {
        const hasParam = constructor.getParameters().some((p) => p.getName() === "realtimeGateway");
        if (!hasParam) {
          constructor.addParameter({
            name: "realtimeGateway",
            isReadonly: true,
            scope: Scope.Private,
            type: "RealtimeGateway",
          });
          fileModified = true;
        }
      }

      // 3. Inject Event Broadcasting into Mutating Methods
      for (const method of methodsToUpdate) {
        const bodyText = method.getBodyText();
        if (!bodyText || bodyText.includes("this.realtimeGateway.broadcastToTenant")) {
          continue;
        }

        // We will do a generic wrapping using setTimeout to fire asynchronously 
        // right before the method finishes, or just inject at the end of the block.
        // Since we can't easily intercept "return" dynamically without complex AST, 
        // we append an async fire-and-forget broadcast at the start of the method that triggers later.
        // Better yet, we can prepend a cleanup/finally block if there's no transaction.
        // Actually, the simplest non-destructive way is to prepend an event trigger inside the method 
        // wrapped in setTimeout (hacky) OR we wrap the entire method body.
        
        // Let's replace the method body with a try/finally wrap:
        method.setBodyText(`
          try {
            ${bodyText}
          } finally {
            try {
               if (this.realtimeGateway) {
                 this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                   entity: '${cls.getName()}', 
                   action: '${method.getName()}',
                   timestamp: new Date().toISOString()
                 });
               }
            } catch(e) {}
          }
        `);
        fileModified = true;
      }
    }

    if (fileModified) {
      await sf.save();
      modifiedCount++;
      console.log(`[UPDATED] ${sf.getBaseName()}`);
    }
  }

  console.log(`Successfully upgraded ${modifiedCount} services with Realtime capabilities!`);
}

run().catch(console.error);
