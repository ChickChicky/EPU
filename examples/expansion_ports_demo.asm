; This program prompts you for your name,
; you can then type it and then press enter to leave the program

#incldude stdlib

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

; Creates variables to refer to addresses in a clearer way
VAR chr, RA    ; A temporary place to store the last read character
VAR tmp, $0101 ; a tempprary place to compare chr with the value 10 (or return key)

IMD $0A, tmp ; Stores the value to later check if the last keystroke was return

loop:
    CPY Keyboard, chr ; Reads one byte from keyboard and stores it into chr
    CPY chr, Screen   ; Sends the character to the screen
    CMP tmp, chr      ; Compares chr with 10
    JEQ end           ; If they are equal (the user pressed return), then jump to the end
JMP loop ; Jumps back to the start of the loop, for reading more chracters

end:    ; Label to jump to when quitting
JMP end ; Jumps forever to end, preventing the PC to eventually loop back