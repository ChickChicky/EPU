module.exports = {
    vars: {
        // REGISTERS
        'ra': 0x00,
        'rb': 0x01,
        'rc': 0x02,
        'rd': 0x03,
        're': 0x04,
        'rf': 0x05,
        'rg': 0x06,
        'rh': 0x07,

        // EXPANSION PORTS
        'p1': 0x05,
        'p2': 0x06,
        'p3': 0x07,

        // ALU PORTS
        'alu_mode': 0x01,
        'alu_a':    0x02,
        'alu_b':    0x03,
        'alu_q':    0x04,

        // ALU MODES
        'alu_sum':  0x00,
        'alu_div':  0x01,
        'alu_mod':  0x02,
        'alu_sub':  0x03,
        'alu_mul':  0x04,
        'alu_and':  0x05,
        'alu_or':   0x06,
        'alu_xor':  0x07,
        'alu_nand': 0x08,
        'alu_nor':  0x09,
        'alu_nxor': 0x0A,
        'alu_shl':  0x0B,
        'alu_shr':  0x0C,
        'alu_rol':  0x0D,
        'alu_ror':  0x0E,
        'alu_rng':  0x0F,

        // DEVICES PORTS
        'screen':   0x07,
        'display':  0x06,
        'keyboard': 0x05
    }
}