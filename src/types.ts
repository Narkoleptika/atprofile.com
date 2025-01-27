import { jsonToLex, ValidationResult } from '@atproto/lexicon'
import { z } from 'zod'

export const makeLexZType = <Type>($type: string, validateRecord: (value: unknown) => ValidationResult) => {
    const validate = (value: unknown) => validateRecord(value).success

    return z
        .preprocess((value) => (validate(value) ? value : jsonToLex(value)), z.custom<Type>(validate))
        .transform((value) => ({ $type, ...value }))
}
