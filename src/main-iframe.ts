import { jsonToLex } from '@atproto/lexicon'

const isScriptNode = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT'
const isStyleNode = (node: Element): node is HTMLStyleElement => node.tagName === 'STYLE'
const cloneScriptNode = (node: HTMLScriptElement) => {
    const script = document.createElement('script')

    script.text = node.innerHTML

    Array.from(node.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value)
    })

    return script
}
const parseNodes = (node: Element) => {
    if (isScriptNode(node)) {
        node.innerHTML = node.innerHTML.replace(/<br>/g, '\n')
        node.parentNode?.replaceChild(cloneScriptNode(node), node)
    } else if (isStyleNode(node)) {
        node.innerHTML = node.innerHTML.replace(/<br>/g, '\n')
    } else {
        Array.from(node.children).forEach((child) => {
            parseNodes(child)
        })
    }

    return node
}

declare global {
    interface Window {
        context: Record<string, unknown>
    }
}

window.context ||= {}

const newlinesToLinebreaks = (html: string) => html.replace(/(?:\r\n|\r|\n)/g, '<br>')

window.addEventListener('message', (event) => {
    if (!event.data.action || event.data.action !== 'setContent') {
        return
    }

    if (event.data.payload?.context) {
        const context = event.data.payload?.context

        for (const prop in context) {
            if (context.hasOwnProperty(prop)) {
                window.context[prop] = jsonToLex(context[prop])
            }
        }
    }

    if (event.data.payload?.content) {
        const $content = document.querySelector('#content')

        if (!$content) {
            return
        }

        const transforms: Array<[boolean, (html: string) => string]> = [
            [Boolean(window.context.newlinesToLinebreaks), newlinesToLinebreaks],
        ]

        $content.innerHTML = transforms.reduce(
            (html, [condition, func]) => (condition ? func(html) : html),
            event.data.payload.content,
        )

        Array.from($content.querySelectorAll('a')).forEach((a) => {
            if (/^#/.test(a.getAttribute('href') || '')) {
                return
            }
            a.setAttribute('target', '_blank')
        })

        parseNodes($content)
    }
})
