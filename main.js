const fs = require('fs');
const path = require('path');

function processProgram(prog) {
    return prog.split(/(\r?\n)+/g).map(l=>(l+' ').slice(0,l.indexOf(';'))).filter(l=>l.trim().length).map(l=>l.toLowerCase());
}

function getProgram(path) {
    return processProgram(fs.readFileSync(path,'utf-8'));
}

function getLib(lib) {
    if (fs.existsSync('./libs/'+lib)) {
        return getProgram(path.join('.','libs',lib));
    } else if (fs.existsSync('./libs/'+lib+'.asm_16')) {
        return getProgram(path.join('.','libs',lib+'.asm_16'));
    } else if (fs.existsSync('./libs/'+lib+'.asm_')) {
        return getProgram(path.join('.','libs',lib+'.asm_'));
    } else if (fs.existsSync('./libs/'+lib+'.asm')) {
        return getProgram(path.join('.','libs',lib+'.asm'));
    } else if (fs.existsSync('./libs/'+lib+'.js')) {
        let l = require('./libs/'+lib+'.js');
        Object.assign(vars,l.vars??{});
        return l;
    } else {
        return getProgram(lib);
    }
}

const macros = {
    // RGB $XX, $YY, $RRGGBB
    // -> XXXXXXXXYYYYYYYY --------RRRRRRRR --------GGGGGGGG --------BBBBBBBB >> 6
    'RGB': {
        RGBPort: 0x0006,
        expand: function(args) {
            let port = this.RGBPort;
            return [
                `imd ${(args[0]<<16)|args[1]}, ${port}`, // XY
                `imd ${(args[2]&&0xFF0000)>>0x10}, ${port}`, // R
                `imd ${(args[2]&&0x00FF00)>>0x08}, ${port}`, // G
                `imd ${(args[2]&&0x0000FF)>>0x00}, ${port}`, // B
            ];
        },
        args: 'post'
    }
}

const vars = {};

function parseInstruction(inp) {

    // this was taken from another porject, so that's why some stuff isn't properly named in it

    let rargs = []; {
        let arg = '';
        let iq = false;
        let skip = 0;
        let cskip = 0;
        for (let c of inp+'  ') {
            if (skip>0)
                skip--;
            else if (cskip>0) {
                cskip--;
                arg += c
            }
            else if ( (c == ',' && !iq) || c == '"') {
                if (arg.length) rargs.push(arg);
                arg = '';
                if (c == '"') iq = true;
            } else if (c == '\\')
                cskip = 1
            else
                arg+=c;
        }
        if (arg) rargs.push(arg);
    }
    
    rargs = rargs.map(a=>a.trim());

    let cmd = rargs.splice(0,1)+' ';
    let a;
    [cmd,a] = cmd.split(' ');
    if (a) rargs = [a,...rargs];

    return {opcode:cmd,args:rargs};
}

function parseValue(obj) {
    if (typeof obj == 'string') {
        obj = obj.trim();
        if (obj.match(/^[\d]+|%[01]+|\$[\da-f]+$/gi)) {
            switch (obj[0]) {
                case '$': return Number.parseInt(obj.slice(1),16);
                case '%': return Number.parseInt(obj.slice(1),2);
                default: return Number.parseInt(obj,10);
            }
        } else {
            return vars[obj]??{ref:obj};
        }
    } else {
        if (obj.ref) {
            return vars[obj.ref]??obj;
        }
        return obj;
    }
}

/**
 * @param {instructions[0]} i 
 */
function processInstruction(i) {
    console.log();
    console.log(i.opcode, i.args, i.ignore?'IGNORE':'');
    if (i.ignore || i.opcode=='nop') {
        return Buffer.alloc(6);
    }
    let opcode;
    let args = i.args;
    switch (i.opcode) {
        case 'cpy': 
            opcode = 0x00; 
            break;
        case 'imd': 
            opcode = 0x01; 
            break;
        case 'cmp':
            opcode = 0x02;
            break;
        case 'jmp':
        case 'jeq':
        case 'jne':
        case 'jgt':
        case 'jlt':
        case 'jge':
        case 'jle':
            opcode = 0x03;
            break;
        case 'rpt':
            opcode = 0x04;
            break;
        case 'wpt':
            opcode = 0x05;
            break;
    }
    let ji = {
        'jmp': 0, 
        'jeq': 1, 'jne': 2,
        'jlt': 3, 'jle': 5, 
        'jgt': 4, 'jge': 6,
    }
    if (Object.keys(ji).includes(i.opcode)) {
        args = [args[0],ji[i.opcode]];
    }
    let mod = false;
    do {
        mod = false;
        args = args.map(
            function (a) {
                let n = parseValue(a)??a;
                if (a!=n) mod = true;
                return n;
            }
        );
    } while (mod);
    console.log(i.opcode,opcode,...args);
    let b = Buffer.allocUnsafe(6);
    b.writeUInt16BE(opcode,0);
    b.writeUInt16BE(args[0],2);
    b.writeUInt16BE(args[1],4);
    return b;
}

let lines = getProgram(process.argv[2]);

lines.map(parseInstruction).forEach(
    ( i,idx ) => {
        if (i.opcode == '#include') {
            let l = getLib(i.args[0]);
            if (Array.isArray(l)) {
                lines[idx] = l;
            } else if (Array.isArray(l.code) || typeof l.code == 'string') {
                if (typeof l.code == 'string') l = {code:processProgram(l.code)};
                lines[idx] = l.code;
            }
        }
    }
);

lines = lines.flat();

// console.log(lines);

// instructions process

let instructions = lines.map(parseInstruction);

instructions.forEach( 
    ( v,idx ) => { if (v.opcode=='var') {
        console.log('VAR',v.args);
        vars[v.args[0].ref??v.args[0]] = parseValue(v.args[1].ref??v.args[1]);
        instructions[idx] = undefined;
    }}
);

instructions = instructions.filter(i=>i);

instructions.forEach(
    ( i,idx ) => { if (i.opcode.endsWith(':')) {
        instructions[idx] = {
            ignore: true
        }
        console.log('LABEL',idx,i,instructions[idx]);
        vars[i.opcode.slice(0,-1)] = idx+1;
    }}
);

console.log(vars);
console.log(instructions);

let assembled = Buffer.concat([
    Buffer.alloc(6),
    ...instructions.map( processInstruction )
]);

console.log(assembled);

fs.writeFileSync(process.argv[3]||'src.bin',assembled);