var JSCPP = require("JSCPP")
var code =    "#include <iostream>"
            + "using namespace std;"
            + "int main() {"
            + "    int a;"
            + "    cin >> a;"
            + "    cout << a << endl;"
            + "    return 0;"
            + "}"
;

var config = {
		debug: true
	};
var input = "4321";
var mydebugger = JSCPP.run(code, input, config);

// continue to the next interpreting operation
var done = mydebugger.next();
// if you have an active breakpoint condition, you can just continue
var done = mydebugger.continue();
// by default, debugger pauses at every new line, but you can change it
mydebugger.stopConditions = {
    isStatement: true,
    positionChanged: true,
    lineChanged: false
};
// so that debugger only stops at a statement of a new position
// or you can add your own condition, i.e. stops at line 10
mydebugger.conditions["line10"] = function (prevNode, nextNode) {
	if (nextNode.sLine=== 10) {
		// disable itself so that it only triggers once on line 10
		mydebugger.stopConditions["line10"] = false
		return true;
	} else {
		return false;
	}
};
// then enable it
mydebugger.stopConditions["line10"] = true
// we need to explicitly use "false" because exit code can be 0
if (done !== false) {
	console.log("program exited with code " + done);
}
// the AST node to be executed next
var s = mydebugger.nextNode();
// sometimes a breakpoint can be set without a statement to be executed next,
// i.e. entering a function call.
while ((s = mydebugger.nextNode()) == null) {
	mydebugger.next();
}
// the content of the statement to be executed next
var nextLine = mydebugger.nextLine();
// it is essentially same as
nextLine = mydebugger.src.slice(s.sOffset, s.eOffset).trim()

console.log("from " + s.sLine + ":" + s.sColumn + "(" + s.sOffset + ")");
console.log("to " + s.eLine + ":" + s.eColumn + "(" + s.eOffset + ")");
console.log("==> " + nextLine);

console.log(mydebugger)

// examine the internal registry for a type
// mydebugger.types("int");
// examine the value of variable "a"
// mydebugger.variable("a");
// or list all local variables
console.log(mydebugger.variable())