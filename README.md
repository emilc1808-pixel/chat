Bliq Programming Language – Overview

Purpose:
Bliq is a minimal, beginner-friendly interpreted programming language designed for simplicity. It focuses on easy syntax, variable substitution, basic control structures, and input/output.


Core Features

Variables

Declare and assign integers with set.

Modify values with add and sub.

Ask user input with ask.

Variables can be inserted into text using !name!.

Examples:

set x 5
add x 3
sub x 2
ask name
say Hello !name!


Output

say prints text to the console.

Variables inside text are replaced automatically.

Example:

say The value is !x!


Input

ask varname prompts the user for a value.

Stored as a variable.

Example:

ask age
say You are !age! years old


Conditions

if starts a block.

Supported comparisons: equals, bigger, smaller.

Block ends with end.

Example:

set score 10
if score bigger 5
    say High score!
end


Loops

while repeats a block until condition is false.

Ends with end.

Example:

set counter 1
while counter smaller 4
    say Counter is !counter!
    add counter 1
end

Keywords

say → Print text to console.

set → Create variable and assign integer.

add → Increase variable.

sub → Decrease variable.

ask → Get user input.

if ... end → Conditional block.

while ... end → Loop block.

Example Program
say Welcome to Bliq
ask name
say Hello !name!

set x 1
while x smaller 4
    say Counting: !x!
    add x 1
end

if x equals 4
    say Finished counting
end


Output example (user enters Alice):

Welcome to Bliq
Hello Alice
Counting: 1
Counting: 2
Counting: 3
Finished counting
