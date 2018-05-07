var fs      = require("fs");
var ASTY    = require("asty");
var PEG     = require("pegjs");
var PEGUtil = require("pegjs-util");

// merge two arrays cpp code
var code =  `void Concatenate(char *s1,char *s2)
{
    char s[200];
    int len1=strlen(s1);
    int len2=strlen(s2);
    int j;
    //Define k to store the values on Kth address Kstart from 0 to len1+len2;
    int k=0;
        for(j=0;j<len1;j++)
        {
            s[k]=s1[j];
            k++;
        }
        for(j=0;j<len2;j++)
        {
            s[k]=s2[j];
            k++;
        }
    cout<<s;
}`;

var asty = new ASTY();
var parser = PEG.generate(fs.readFileSync("./ast-modified.pegjs", "utf8"));
var result = PEGUtil.parse(parser, code, {
    makeAST: function (line, column, offset, args) {
        return asty.create.apply(asty, args).pos(line, column, offset);
    }
});

console.log(result.ast);

// if (result.error !== null)
//     console.log("ERROR: Parsing Failure:\n" +
//         PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "));
// else
//     console.log(result.ast.dump().replace(/\n$/, ""));