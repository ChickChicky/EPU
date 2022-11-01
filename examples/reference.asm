; This is a comment, on a line, everything following a ';' will be ignored

; A very important command is IMD, it allows to write arbitrary data into memory
; This, for instance copies the value 0x4 into the address 0x1
IMD $0004, $0001

; Another useful command is CPY, it copies a value from one place to another
; Copies the value in address 0x1 into address 0x2
CPY $0001, $0002

; We still need to be able to jump (un)conditionally.
; That's where a few different instructions become handy,
; introducing cmp, jmp, jeq, jne, jgt, jlt, jge and jle.

; CMP compares the values at the two provided memory locations,
; will compare the values in addresses 0x1 and 0x2
CMP $0001, $0002

; JMP jumps unconditionally to the provided location,
; for convenience purposes, labels can be creating allowing easier target specification
JMP my_label
my_label:
; The code above creates a label 'my_label' and the line right above it tells the EPU to jump to it no matter what

; But always jumping isn't ideal, and most programs won't be possibl to make with this
; that's why some variations exist like JEQ, JNE, JGT, ...
; They all have a very simple meaning:
;   Jump EQual
;   Jump Not Equal
;   Jump Greater Than
;   Jump Less Than
;   Jump Greater or Equal
;   Jump Less or Equal

; The last useful instruction is VAR,
; it allows to create variables, which are just UInt16, but that's enough for the uses of this computer
; This creates a variable nammed my_var, that stores the value 20
VAR my_var, 20
; It can be referenced later on, or even before and at compilation, they will be replaced by 20

; You can  also use #include to import code, which for now only reliably works for basic JS libs
; Imports stdlib from '/libs/stdlib.js'
; For now, JS libraries can only define variables
#incldue stdlib