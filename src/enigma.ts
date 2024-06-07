import { ALPHABET, zip } from './utils'

export class Enigma {
    constructor(
        private plugboard: PlugBoard,
        private rotors: Rotor[],
        private reflector: Reflector
    ) { }

    encrypt(text: string): string {
        return [...text].map(v => this.__apply(v)).join('')
    }

    decrypt(text: string): string {
        this.rotors.forEach(rotor => rotor.reset())
        return [...text].map(v => this.__apply(v)).join('')
    }

    private __apply(c: string): string {
        // pre apply
        const fixed_c = c.toUpperCase()
        if (!ALPHABET.includes(fixed_c)) return fixed_c

        //apply
        let i = ALPHABET.indexOf(fixed_c)
        i = this.plugboard.forward(i)
        for (const rotor of this.rotors) {
            i = rotor.forward(i)
        }
        i = this.reflector.reflect(i)
        for (const rotor of this.rotors.toReversed()) {
            i = rotor.backward(i)
        }
        i = this.plugboard.backward(i)
        const result = ALPHABET[i]

        // post apply
        for (const rotor of this.rotors.toReversed()) {
            if (rotor.rotate() % ALPHABET.length != 0) break
        }

        return result
    }
}


export class PlugBoard {
    protected base_alphabet: string = ALPHABET
    protected forward_record: Record<string, string> = {}
    protected backward_record: Record<string, string> = {}

    constructor(pair_alphabet: string) {
        for (let i = 0; i < this.base_alphabet.length; i++) {
            const char = this.base_alphabet[i]
            const char_pair = pair_alphabet[i]

            this.forward_record[char] = char_pair
            this.backward_record[char_pair] = char
        }
    }

    forward(i: number): number {
        let char = this.base_alphabet[i]
        char = this.forward_record[char]
        return this.base_alphabet.indexOf(char)
    }

    backward(i: number): number {
        let char = this.base_alphabet[i]
        char = this.backward_record[char]
        return this.base_alphabet.indexOf(char)
    }
}

export class Rotor extends PlugBoard {
    private rotations = 0
    private offset: number

    constructor(pair_alphabet: string, offset = 1) {
        super(pair_alphabet)
        this.offset = offset % this.base_alphabet.length
    }

    rotate(): number {
        const body1 = this.base_alphabet.slice(this.offset)
        const body2 = this.base_alphabet.slice(0, this.offset)
        this.base_alphabet = body1.concat(body2)

        this.rotations += this.offset
        return this.rotations
    }

    reset() {
        this.base_alphabet = ALPHABET
        this.rotations = 0
    }
}

export class Reflector {
    private reflect_record: Record<string, string>

    constructor(reflect_alphabet: string) {
        this.reflect_record = Object.fromEntries(zip(ALPHABET, reflect_alphabet))
        for (const [k, v] of Object.entries(this.reflect_record)) {
            if (k != this.reflect_record[v]) {
                throw new Error(`${v} is not pairing.`)
            }
        }
    }

    reflect(i: number) {
        let char = ALPHABET[i]
        char = this.reflect_record[char]
        return ALPHABET.indexOf(char)
    }
}
