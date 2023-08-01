export function keys<K extends PropertyKey>(m: Map<K, any> | { [P in K]: any }): K[] {
    if (m instanceof Map) return Array.from(m.keys())
    return Object.keys(m) as K[]
}