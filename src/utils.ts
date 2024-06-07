export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' as const

// REF: https://stackoverflow.com/a/60963711
export const shuffleStr = (str: string) => [...str].sort(() => Math.random() - .5).join('')

// REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

/**
 * Returns an array of indexes corresponding to the number of array elements.
 * @params any array
 * @returns an array of indexes like `[0,1,2]`
 */
export const getIndexes = (array: any[]): number[] => [...new Array(array.length).keys()]

// REF: https://qiita.com/mist00/items/5ec31e3435cc10c46013#mapped-types-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E5%AE%9A%E7%BE%
export function* zip<T extends Iterable<unknown>[]>(...iterables: [...T]): Generator<{ [P in keyof T]: T[P] extends Iterable<infer U> ? U : never }, void, unknown> {
    const iterators = iterables.map(iterable => iterable[Symbol.iterator]())

    while (iterators.length) {
        const result = [] as { [P in keyof T]: T[P] extends Iterable<infer U> ? U : never };
        for (const iterator of iterators) {
            const element = iterator.next()
            if (element.done) return

            result.push(element.value)
        }
        yield result
    }
}
