# EPU (Egg Processing Unit)

I don't know how to name proprly my projects anymore.

Anyways, this is a CPU I made in Logisim-Evolution for fun. It uses 48-bit wide instructions, and 16-bit addressing.

The Instructions look like this:<br>
`IIIIIIIIIIIIIIIIAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBB`<br>
The first part is a 16-bit opcode, and the two other ones are 16-bit arguments that are interpreted differently from one instruction to another, but usually `A` represents an input/source address and `B` and output/destination address.

The memory is split in two, the first 8 bytes are dedicated to registers and expansion ports and the rest is RAM (making the 8 first bytes of RAM unusable)<br>
* `00`: REG A
* `01`: REG B (ALU Mode)
* `02`: REG C (ALU A)
* `03`: REG D (ALU B)
* `04`: REG E (ALU Q)
* `05`: REG F (Port 1)
* `06`: REG G (Port 2)
* `07`: REG H (Port 3)

The ALU modes are described in [`ALU Modes`](#alu-modes).

Writing machine code is a bit borring so I made a small compiler to turn some assembly into machine code that can then be ran on the EPU itself.

In order to do that, I have provided a few examples in [`examples/`](examples) as well as a [`reference program`](examples/reference.asm).

To compile them, simply run `main.js YOUR_PROGRAM`. This will generate a `src.bin` file, which can then be imported in the ROM component on the rightmost side.<br>
You might see a lot of random stuff in the console, but don't worry about that.<br>
I am also working on errors, as well as macros, functions, a call stack and more, but this is not the project I'm currently working on the most, so when I come back to it I'll make sure to do that.



# ALU

The communication with the ALU can be done though 4 ports, 3 inputs and 1 output, 

## ALU Modes
The ALU can do 16 different operations:
| ALU Mode |  Variable  |           Description          |
| -------- | ---------- | ------------------------------ |
|   `00`   | `alu_sum`  | `A` +  `B`                     |
|   `01`   | `alu_div`  | `A` / `B`                      |
|   `02`   | `alu_mod`  | `A` % `B`                      |
|   `03`   | `alu_div`  | `A` - `B`                      |
|   `04`   | `alu_mod`  | `A` * `B`                      |
|   `05`   | `alu_and`  | `A` & `B`                      |
|   `06`   | `alu_or`   | `A` \| `B`                     |
|   `07`   | `alu_xor`  | `A` ^ `B`                      |
|   `08`   | `alu_nand` | ~( `A` & `B` )                 |
|   `09`   | `alu_nor`  | ~( `A` \| `B` )                |
|   `0A`   | `alu_nxor` | ~( `A` ^ `B` )                 |
|   `0B`   | `alu_shl`  | `A` << `B`                     |
|   `0C`   | `alu_shr`  | `A` >> `B`                     |
|   `0D`   | `alu_rol`  | `A` << `B` (rotation)          |
|   `0E`   | `alu_ror`  | `A` >> `B` (rotation)          |
|   `0F`   | `alu_rng`  | returns a pseudo-random number |

For convenience, there are a few variables related to the ALU, like `alu_mode`, which is the register for the ALU mode, `alu_a` and `alu_b` for the two arguments, `alu_q` for the ALU output, and all the modes as described above.

# Expansion ports
Special components can be linked to addresses 7, 6 and 5.<br>
On this build, they are all occupied by the TTY Screen, the RGB Screen and the Keyboard.

The components can be directly connected to the cata lines rather than relying on a register, which is way more practical for the keyboard for example.