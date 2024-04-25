"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var path = require("path");
// Specify the folder path where the TypeScript files are located
var folderPath = path.join(__dirname, "src/shared/types/api-responses");
// Create a program from the folder path
var program = ts.createProgram([folderPath], {});
// Get the source files from the program
var sourceFiles = program.getSourceFiles();
// Create a Set to store the exported interface and type names
var exportedTypes = new Set();
// Traverse the source files and extract exported interface and type names
for (var _i = 0, sourceFiles_1 = sourceFiles; _i < sourceFiles_1.length; _i++) {
    var sourceFile = sourceFiles_1[_i];
    ts.forEachChild(sourceFile, visitNode);
}
// Helper function to visit each node in the TypeScript AST
function visitNode(node) {
    var _a;
    if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        var modifiers = node.modifiers;
        if (modifiers &&
            modifiers.some(function (modifier) { return modifier.kind === ts.SyntaxKind.ExportKeyword; })) {
            var name_1 = ((_a = node.name) === null || _a === void 0 ? void 0 : _a.getText()) || "";
            exportedTypes.add(name_1);
        }
    }
    ts.forEachChild(node, visitNode);
}
// Print the exported interface and type names
console.log("Exported interfaces and types:");
for (var _a = 0, exportedTypes_1 = exportedTypes; _a < exportedTypes_1.length; _a++) {
    var exportedType = exportedTypes_1[_a];
    console.log(exportedType);
}
