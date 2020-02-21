import {dirname, basename} from 'path'

export const name = basename(dirname(import.meta.url))
