; This is a comment, on a line, everything following a ';' will be ignored
; Also, the language is entirely case-insensitive

; A very important command is IMD, it allows to write arbitrary data into memory

; This, for instance weires the value 0x4 into the address 0x1
IMD $0004, $0001

; Another useful command is CPY, it copies a value from one place to another

; The line below copies the value in address 0x1 into address 0x2
CPY $0001, $0002

; CMP compares the values at the two provided memory locations

; This compares the values in addresses 0x1 and 0x2
CMP $0001, $0002

; JMP jumps unconditionally to the provided location (an absolute location can also be provided but it's much better just to use labels)

JMP my_label
my_label:
; The code above creates a label 'my_label' and the line right above it tells the EPU to jump to it no matter what

; But always jumping isn't ideal, and most programs won't be possible to make with this
; that's why some variations exist:
;   JEQ Jump if EQual
;   JNE Jump if Not Equal
;   JGE Jump if Greater Than
;   JLT Jump if Less Than
;   JGE Jump if Greater or Equal
;   JLE Jump if Less or Equal
; They allow jumping only if the last comparaison resulted in the some way, depending on the instruction

; This creates a variable named 'my_var', that holds the value 20
VAR my_var, 20
; It can be referenced later on, or even before and at compilation, they will be replaced by 20

; Being able of writing data to arbirary places in memory is also a very important thing,
; the PTR instruction is made for this.
; It takes a first argument, the address of the pointer, and an adress where to store the retreived value

; This takes the address stored in memory location 1 (4), reads the value at that location (0 if the RAM was cleared before) and writes it at the memory location specified in 'my_var' (20)
; Effectively copying the value at adress 4 to memory location 20
PTR $0001, my_var

; You can  also use #include to import code, which for now only reliably works for basic JS libs
; For now, JS libraries can only define variables

; Includes some constants defined in '/libs/stdlib.js' like all the names for the ALU modes and registers
#incldue stdlib