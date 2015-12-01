Main = {}

_ = require "prelude-ls"

Cc = require "cli-color"

ESP = require "error-stack-parser"

path = require "path"

delimit = path.sep

ErrorC = Cc.redBright
SuccessC = Cc.greenBright
FileNameC = Cc.yellowBright


WhichFSFunction = (TopOb) -> 
	
	# Finds the correct name of the function the reason why
	# you need this is because of <Object>.name since the 
	# <Object> is anonymous.

	FName = TopOb.functionName

	if (FName.slice 0,7) is "Object."
		FName =  7 |> TopOb.functionName.slice 


	FName

WhichFile = (SecondOb) ->

	{lineNumber,columnNumber,fileName} = SecondOb

	SecondFunction = WhichFSFunction SecondOb

	DirName = fileName |> path.dirname

	FileName = fileName |> path.basename 

	File = SuccessC DirName + delimit + ErrorC FileName

	LineNumber = ErrorC SecondOb.lineNumber + ErrorC ":" + SuccessC SecondOb.columnNumber

	(SecondFunction:SecondFunction,File:File,LineNumber:LineNumber)


TakeCareOfErrorOb = (ErroObject,err) ->

	console.log FileNameC "NodeJS:" + ErrorC err.toString!
	console.log FileNameC "-----------------"
	EOb = ESP.parse ErroObject     # (string -> JSON) "errror-stack-parser"

	if not EOb.length > 1
		return

	First = WhichFSFunction EOb[0] |> ErrorC # Find the main entry of error

	

	Elem = EOb[1]

	Second = WhichFile Elem     # Find the File of main entry of error

	FnName = Second.SecondFunction

	console.log First +  (ErrorC " -> ") + FileNameC FnName

	console.log Second.File + SuccessC " [" + Second.LineNumber + SuccessC "]"

	First = FnName |> ErrorC 

	console.log FileNameC "-----------------"




RemoveErrorFromEachFunction = (OldFn) -> ->

		NumberOfArgs = arguments.length

		# User Callback with no error Check

		CallBack = arguments[NumberOfArgs - 1] # Get the last argument which is the callback

		EO = new Error! # Get Error Object JUST in case something goes wrong.

		PointerToUserArgument = arguments # Keep a copy of the arguments provided by the user

		WithoutCallBackbutWithError = [] # Time to create an array of arguments with error 

		for I from 0 to NumberOfArgs - 2

			WithoutCallBackbutWithError.push PointerToUserArgument[I] # Push the user arguments in

		# Add the error check

		WithError = -> # Creating a new callback with error check

			err = arguments[0]  # First argument will be the error code

			if err

				TakeCareOfErrorOb EO,err

				return
			else

				ListOfResult = [] # Time to collect what the function returns

				for I from 1 to (arguments.length - 1) # Avoid the first value in argument array since its error code

					ListOfResult.push arguments[I] 

				if typeof CallBack is "function"

					CallBack.apply OldFn, ListOfResult # Run the real Function


		WithoutCallBackbutWithError.push WithError # Put the Function with Error check in the argument list

		OldFn.apply OldFn,WithoutCallBackbutWithError # Activate the old function with the new list of arugments without User Callback

Normal = (module) -> 
	NewModule = {}

	keys = _.keys module

	for I in keys
		retrieve = I.toString!
		NewModule[retrieve] = RemoveErrorFromEachFunction module[retrieve]

	NewModule

GetRidOfErrors = (module) ->

	switch typeof module 
	| "function" => RemoveErrorFromEachFunction module
	| "object" => Normal module
	| otherwise =>
		console.err ErrorC "Error - GetRidOfError.js :" +  FileNameC " argument type if not programmed for. "


module.exports = GetRidOfErrors