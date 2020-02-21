import {dirname, basename} from 'path'

export const packageName = basename(dirname(import.meta.url))
