#### Remove Error argument in modules like fs 

One weird trick to turn this: 

```
fs = require "fs"

error,data <-! fs.readFile "foo.txt"

if error 
	throw error

# .
# .
# . 

error <-! fs.writeFile "bar.txt","hello world"

if error
	throw error

# .
# . 
# .

error <-! fs.unlink "foo.txt"

if error
	throw error

# .
# .
# .

```

into this:



```


fs = require "fs" |> require "GetRidOfError.js"

data <-! fs.readFile "foo.txt"

# .
# .
# . 

<-! fs.writeFile "bar.txt","hello world"

# .
# . 
# .

<-! fs.unlink "foo.txt"

# .
# .
# .
# Javascript developers hate this !
```

With this module you can get rid of those pesky error throws


### Installation

```
npm install <github Link>

```

### How To use

```

```
### Why ?
Promises are cool but sometimes you do not want to use a chainsaw to cut your chicken. 

Callback hell is easily taken care of using backcalls in `livescript`. It's simple synatic sugar to prevent your code from marching to the right. I am not sure about how to do it in vanilla `javascript` or `coffeescript` but I am sure sometime exits to prevent callback hell.

This module get rid of one final annoyonace and that is the error argument.


#### What do you do with the errors ? 


Whenever a call is made to any function we keep a cache of the stack to trace the execution path to create somewhat descriptive error messages:

![Error Message](http://i.imgur.com/tkd6y0j.png "Nice Error Messages")


`NODEJS:` prints the error from nodejs itself and the rest of it is written by me based on the cached error object. 


I will not be maintaining this module unless people inform me they are using it. 

If you find any error or problems please raise it as an issue. 