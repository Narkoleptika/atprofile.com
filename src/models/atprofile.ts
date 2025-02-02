import {
    Record,
    validateRecord,
    ContextItem as ContextItemType,
    validateContextItem,
} from '@/lexicon/generated/types/com/atprofile/beta/profile'
import { makeLexZRecordType, makeLexZType } from '@/types'
import defaultContent from '@/assets/html/default-profile.html?raw'
import { z } from 'zod'

const ContextItem = makeLexZType<ContextItemType>(validateContextItem)
const BaseAtProfile = makeLexZRecordType<Record>('com.atprofile.beta.profile', validateRecord).transform((value) => ({
    ...value,
    newlinesToLinebreaks: typeof value.newlinesToLinebreaks === 'boolean' ? value.newlinesToLinebreaks : false,
    context: (value.context || []).map((item) => ({
        ...item,
        limit: item.limit || 50,
    })),
    createdAt: value.createdAt || new Date().toISOString(),
}))

const AtProfile = z.preprocess((value) => {
    if (typeof value !== 'object') {
        return value
    }

    const hasContext = (obj: object | null): obj is { context: unknown } => Boolean(obj?.hasOwnProperty('context'))

    if (!hasContext(value) || !Array.isArray(value.context)) {
        return value
    }

    return {
        ...value,
        context: value.context
            .map((item) => {
                try {
                    return ContextItem.parse(item)
                } catch (error) {
                    console.error(error)
                }

                return null
            })
            .filter((item) => item !== null),
    }
}, BaseAtProfile)

type AtProfile = z.infer<typeof AtProfile>
type ContextItem = z.infer<typeof ContextItem>

export const defaultAtProfile = AtProfile.parse({
    content: defaultContent,
    context: [
        {
            collection: 'xyz.statusphere.status',
            name: 'status',
            limit: 1,
        },
    ],
})

export default AtProfile
export { ContextItem }
