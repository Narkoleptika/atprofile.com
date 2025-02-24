import { type $Typed, asPredicate } from '@atproto/api'
import { jsonToLex, ValidationResult } from '@atproto/lexicon'
import { z } from 'zod'

type ValidationFunction = (value: unknown) => ValidationResult

export const makeLexZType = <Type>($type: string, validateRecord: ValidationFunction) => {
    const validate = asPredicate(validateRecord)

    return z.preprocess((value) => {
        if (typeof value !== 'object') {
            return
        }

        const withType = { ...value, $type }

        return validate(withType) ? withType : jsonToLex(withType)
    }, z.custom<$Typed<Type>>(validate))
}
