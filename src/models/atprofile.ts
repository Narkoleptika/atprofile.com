import { Record, validateRecord } from '@/lexicon/generated/types/com/atprofile/beta/profile'
import { makeLexZType } from '@/types'
import { z } from 'zod'

const AtProfile = makeLexZType<Record>('com.atprofile.beta.profile', validateRecord).transform((value) => ({
    ...value,
    replaceTokens: typeof value.replaceTokens === 'boolean' ? value.replaceTokens : true,
    newlinesToLinebreaks: typeof value.newlinesToLinebreaks === 'boolean' ? value.newlinesToLinebreaks : false,
    createdAt: value.createdAt || new Date().toISOString(),
}))

type AtProfile = z.infer<typeof AtProfile>

export default AtProfile
