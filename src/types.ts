import { jsonToLex, ValidationResult } from '@atproto/lexicon'
import { z } from 'zod'

type ValidationFunction = (value: unknown) => ValidationResult

export const makeLexZType = <Type>(validateRecord: ValidationFunction) => {
    const validate = (value: unknown) => validateRecord(value).success

    return z.preprocess((value) => (validate(value) ? value : jsonToLex(value)), z.custom<Type>(validate))
}

export const makeLexZRecordType = <Type>($type: string, validateRecord: ValidationFunction) =>
    makeLexZType<Type>(validateRecord).transform((value) => ({ $type, ...value }))
