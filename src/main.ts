import { Enigma, PlugBoard, Rotor, Reflector } from './enigma'
import { ALPHABET, getIndexes, getRandomInt, shuffleStr } from './utils'

(() => {
    const plugboard = new PlugBoard(shuffleStr(ALPHABET))
    const rotor1 = new Rotor(shuffleStr(ALPHABET), 3)
    const rotor2 = new Rotor(shuffleStr(ALPHABET), 2)
    const rotor3 = new Rotor(shuffleStr(ALPHABET), 1)

    // XXX: ABCD : BADC のように、ペアを作りながらシャッフルする操作の名前を知りたい
    const r = [...ALPHABET]
    const indexes = getIndexes(r)
    for (let i = 0; i < r.length / 2; i++) {
        const x = indexes.splice(getRandomInt(indexes.length), 1).pop() as number
        const y = indexes.splice(getRandomInt(indexes.length), 1).pop() as number
        [r[x], r[y]] = [r[y], r[x]]
    }
    const reflector = new Reflector(r.join(''))

    const enigma = new Enigma(plugboard, [rotor1, rotor2, rotor3], reflector)
    const encrypted_text = enigma.encrypt('HELLO WORLD')
    const raw_text = enigma.decrypt(encrypted_text)

    console.log(encrypted_text)
    console.log(raw_text)
})()
