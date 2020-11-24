function injectScript (content) {
    try {
        const container = document.head || document.documentElement
        const scriptTag = document.createElement('script')
        scriptTag.textContent = content
        container.insertBefore(scriptTag, container.children[0])
    } catch (e) {
        console.error('vsys script injection failed', e)
    }
}

let file = chrome.extension.getURL("inpage.main.js")
console.log(file)
let s = document.createElement('script')
s.type = 'text/javascript'
s.src = file
document.documentElement.appendChild(s)

function listenForProviderRequest () {
    window.addEventListener('message', ({ source, data }) => {
        if (source !== window || !data || !data.target || data.target !== 'vsys-inpage' || !data.type) { return }
        switch (data.type) {
            case 'vsys-request':
                chrome.runtime.sendMessage({
                    action: 'vsys-request',
                    force: data.data,
                    origin: source.location.hostname,
                    siteImage: getSiteIcon(source),
                    siteTitle: getSiteName(source),
                }, function(res) {
                    let eventName = "vsys-request-" + data.data.method
                    injectScript(`window.dispatchEvent(new CustomEvent('${eventName}', { detail: ${ JSON.stringify(res) } }))`)
                })
                break
            case 'vsys-approve':
                //TODO: add in next version
                break
        }
    })
}

listenForProviderRequest()

function getSiteName (window) {
    const document = window.document
    const siteName = document.querySelector('head > meta[property="og:site_name"]')
    if (siteName) {
        return siteName.content
    }
    return document.title
}

function getSiteIcon (window) {
    const document = window.document
    const shortcutIcon = document.querySelector('head > link[rel="shortcut icon"]')
    if (shortcutIcon) {
        return shortcutIcon.href
    }
    const icon = Array.from(document.querySelectorAll('head > link[rel="icon"]')).find((icon) => Boolean(icon.href))
    if (icon) {
        return icon.href
    }
    return null
}
