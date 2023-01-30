;;; Initial prompt ;;;

; "Hello, what's your name ?\n"
IMD $48, Screen
IMD $65, Screen
IMD $6C, Screen
IMD $6C, Screen
IMD $6F, Screen
IMD $2C, Screen
IMD $20, Screen
IMD $77, Screen
IMD $68, Screen
IMD $61, Screen
IMD $74, Screen
IMD $27, Screen
IMD $73, Screen
IMD $20, Screen
IMD $79, Screen
IMD $6F, Screen
IMD $75, Screen
IMD $72, Screen
IMD $20, Screen
IMD $6E, Screen
IMD $61, Screen
IMD $6D, Screen
IMD $65, Screen
IMD $20, Screen
IMD $3F, Screen
IMD $0A, Screen

; "> "
IMD $3E, Screen
IMD $20, Screen

;;; Main program ;;;

#include stdlib

VAR chr, RA
VAR kbd, P1
VAR tmp, $0101

IMD $0A, tmp

loop:
    CPY Keyboard, chr
    CPY chr, Screen
    CMP tmp, chr
    JEQ end
JMP loop

end:
JMP end