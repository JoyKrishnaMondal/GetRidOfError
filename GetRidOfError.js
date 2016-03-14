// Generated by LiveScript 1.4.0
(function(){
  var Main, _, Cc, ESP, path, delimit, ErrorC, SuccessC, FileNameC, WhichFSFunction, WhichFile, TakeCareOfErrorOb, RemoveErrorFromEachFunction, Normal, GetRidOfErrors;
  Main = {};
  _ = require("prelude-ls");
  Cc = require("cli-color");
  ESP = require("error-stack-parser");
  path = require("path");
  delimit = path.sep;
  ErrorC = Cc.redBright;
  SuccessC = Cc.greenBright;
  FileNameC = Cc.yellowBright;
  WhichFSFunction = function(TopOb){
    var FName;
    FName = TopOb.functionName;
    if (FName === undefined) {
      return null;
    }
    if (FName.slice(0, 7) === "Object.") {
      FName = TopOb.functionName.slice(
      7);
    }
    return FName;
  };
  WhichFile = function(SecondOb){
    var lineNumber, columnNumber, fileName, SecondFunction, DirName, FileName, File, LineNumber;
    lineNumber = SecondOb.lineNumber, columnNumber = SecondOb.columnNumber, fileName = SecondOb.fileName;
    SecondFunction = WhichFSFunction(SecondOb);
    DirName = path.dirname(
    fileName);
    FileName = path.basename(
    fileName);
    File = SuccessC(DirName + delimit + ErrorC(FileName));
    LineNumber = ErrorC(SecondOb.lineNumber + ErrorC(":" + SuccessC(SecondOb.columnNumber)));
    return {
      SecondFunction: SecondFunction,
      File: File,
      LineNumber: LineNumber
    };
  };
  TakeCareOfErrorOb = function(ErroObject, err){
    var EOb, First, Elem, Second, FnName;
    console.log(FileNameC("NodeJS:" + ErrorC(err.toString())));
    console.log(FileNameC("-----------------"));
    EOb = ESP.parse(ErroObject);
    if (!EOb.length > 1) {
      return;
    }
    First = ErrorC(
    WhichFSFunction(EOb[0]));
    Elem = EOb[1];
    Second = WhichFile(Elem);
    FnName = Second.SecondFunction;
    console.log(First + ErrorC(" -> ") + FileNameC(FnName));
    console.log(Second.File + SuccessC(" [" + Second.LineNumber + SuccessC("]")));
    First = ErrorC(
    FnName);
    return console.log(FileNameC("-----------------"));
  };
  RemoveErrorFromEachFunction = function(OldFn){
    return function(){
      var NumberOfArgs, CallBack, EO, PointerToUserArgument, WithoutCallBackbutWithError, i$, to$, I, WithError;
      NumberOfArgs = arguments.length;
      CallBack = arguments[NumberOfArgs - 1];
      EO = new Error();
      PointerToUserArgument = arguments;
      WithoutCallBackbutWithError = [];
      for (i$ = 0, to$ = NumberOfArgs - 2; i$ <= to$; ++i$) {
        I = i$;
        WithoutCallBackbutWithError.push(PointerToUserArgument[I]);
      }
      WithError = function(){
        var err, ListOfResult, i$, to$, I;
        err = arguments[0];
        if (err) {
          TakeCareOfErrorOb(EO, err);
        } else {
          ListOfResult = [];
          for (i$ = 1, to$ = arguments.length - 1; i$ <= to$; ++i$) {
            I = i$;
            ListOfResult.push(arguments[I]);
          }
          if (typeof CallBack === "function") {
            return CallBack.apply(OldFn, ListOfResult);
          }
        }
      };
      WithoutCallBackbutWithError.push(WithError);
      return OldFn.apply(OldFn, WithoutCallBackbutWithError);
    };
  };
  Normal = function(module){
    var NewModule, keys, i$, len$, I, retrieve;
    NewModule = {};
    keys = _.keys(module);
    for (i$ = 0, len$ = keys.length; i$ < len$; ++i$) {
      I = keys[i$];
      retrieve = I.toString();
      NewModule[retrieve] = RemoveErrorFromEachFunction(module[retrieve]);
    }
    return NewModule;
  };
  GetRidOfErrors = function(module){
    switch (typeof module) {
    case "function":
      return RemoveErrorFromEachFunction(module);
    case "object":
      return Normal(module);
    default:
      return console.err(ErrorC("Error - GetRidOfError.js :" + FileNameC(" argument type if not programmed for. ")));
    }
  };
  module.exports = GetRidOfErrors;
}).call(this);
