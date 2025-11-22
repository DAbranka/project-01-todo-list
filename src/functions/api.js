export async function fetchJSON (url, options = {}) {
    const headers = {Accept: 'application/json', ...options}
    const r = await fetch(url, {...options, headers})

    if(r.ok === true) {
        const data = await r.json()
        return data
    }

    throw new Error(`Fetch error: ${r.status} ${r.statusText}`)
}