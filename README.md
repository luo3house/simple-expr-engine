# Simple (Expression and Rule) Engine

This is a simple engine for parsing and interpreting expressions and rules.

## Expression Grammar

It is described as a JavaScript-like language. But not all features as JavaScript.

### Space Splitted
~~~ javascript
( 1 != 0 )
( "hello world" == "hello world" )
~~~

### Nested Expression and Auto Merge

~~~ javascript
( ( true == true ) and ( 0 == 1 ) )
( ( true == true ) and ( 0 == 1 ) or ( "hello" != "world" ) )
~~~

### Weak Typing
~~~ javascript
( true == true )
( 1 == true )
( "strings that length > 1" == true )
( 0 == false )
( 50 < "100" )
~~~

### Variable Injection

~~~ javascript
( order_status == OrderStatus_CREATED )
( pm25 > 80 )
( pm25 <= 80.80 )
( level > 60 )
~~~


## Rule Grammar

Rule is described as A Group Of Expressions With Results.

The first matched expression will be returned from it's result, which interpreted to value `true`.

Here is an example:

~~~ javascript
( false == true ) => 0
( 0 == 1 ) => 1
( "hello" == "world" ) => 2
( true == true ) => 3
( true != true ) => 4
~~~

The rule above will result in `3` if interpreted.

Also, you can use variable instead.

~~~ javascript
( exp < 7 ) => 1
( exp < 16 ) => 2
( exp < 27 ) => 3
( exp < 40 ) => 4
( exp < 55 ) => 5
( exp < 72 ) => 6
( exp < 91 ) => 7
( exp < 112 ) => 8
( exp < 135 ) => 9
( exp < 160 ) => 10
~~~

interpret the rule above with variable `exp` = 150, you can get the level `9`.


## Use library

### Interpret Expression

~~~ typescript
// configure variable pool
const context = {
  variableStore: new VariableStore([]),
};
// source code of expression
const source = `( true == true )`;
// parse
const expr = Facade.buildExpr(context, source);
// interpret
Interpreter.interpretExpr(expr); // true
~~~
