import {
    type Record,
    validateRecord,
    type ContextItem as ContextItemType,
    validateContextItem,
} from '@/lexicon/generated/types/com/atprofile/beta/profile'
import { makeLexZType } from '@/types'
import defaultContent from '@/assets/html/default-profile.html?raw'
import { z } from 'zod'

const ContextItem = makeLexZType<ContextItemType>(
    'com.atprofile.beta.profile#contextItem',
    validateContextItem,
).transform((item) => ({
    ...item,
    limit: item.limit || 50,
    rkey: item.rkey || '',
}))

const AtProfile = makeLexZType<Record>('com.atprofile.beta.profile', validateRecord).transform((value) => ({
    ...value,
    newlinesToLinebreaks: typeof value.newlinesToLinebreaks === 'boolean' ? value.newlinesToLinebreaks : false,
    context: (value.context || [])
        .map((item) => {
            try {
                return ContextItem.parse(item)
            } catch (error) {
                console.error(error)

                return null
            }
        })
        .filter((item) => item !== null),
    createdAt: value.createdAt || new Date().toISOString(),
}))

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
