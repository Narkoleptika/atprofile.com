const isScriptNode = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT'
const cloneScriptNode = (node: HTMLScriptElement) => {
    const script = document.createElement('script')

    script.text = node.innerHTML

    Array.from(node.attributes).forEach((attr) => {
        script.setAttribute(attr.name, attr.value)
    })

    return script
}
const replaceScriptNode = (node: Element) => {
    if (isScriptNode(node)) {
        node.innerHTML = node.innerHTML.replace(/<br>/g, '')
        node.parentNode?.replaceChild(cloneScriptNode(node), node)
    } else {
        Array.from(node.children).forEach((child) => {
            replaceScriptNode(child)
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

const getContextVal = (key: string) => {
    const keys = key.split('.')
    const isRecord = (obj: unknown): obj is Record<string, unknown> => typeof obj === 'object' && obj !== null

    return keys.reduce<unknown>((current, k) => (isRecord(current) ? current[k] : null), window.context)
}

const replaceTokens = (html: string) =>
    html
        .replace(/{{\s*if([^}]+)}}(.*?){{\s*\/if\s*}}/gms, (_substring, g1, g2) => (getContextVal(g1.trim()) ? g2 : ''))
        .replace(/{{\s*unless([^}]+)}}(.*?){{\s*\/unless\s*}}/gms, (_substring, g1, g2) =>
            !getContextVal(g1.trim()) ? g2 : '',
        )
        .replace(/{{([^}]+)}}/g, (_substring, g1) => String(getContextVal(g1.trim())))

const newlinesToLinebreaks = (html: string) => html.replace(/(?:\r\n|\r|\n)/g, '<br>')

window.addEventListener('message', (event) => {
    if (!event.data.action || event.data.action !== 'setContent') {
        return
    }

    if (event.data.payload?.context) {
        window.context = {
            ...window.context,
            ...event.data.payload.context,
        }
    }

    if (event.data.payload?.content) {
        const $content = document.querySelector('#content')

        if (!$content) {
            return
        }

        const transforms: Array<[boolean, (html: string) => string]> = [
            [Boolean(window.context.replaceTokens), replaceTokens],
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

        replaceScriptNode($content)
    }
})
