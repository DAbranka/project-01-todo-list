/**
 * Liste blanche des attributs HTML sécurisés
 */
const SAFE_ATTRIBUTES = new Set([
    'id', 'class', 'for', 'type', 'name', 'value', 'placeholder', 
    'required', 'checked', 'disabled', 'readonly', 'data-filter',
    'aria-label', 'aria-labelledby', 'role', 'tabindex'
])

/**
 * Vérifie si un attribut est sécurisé
 * @param {string} attribute - Nom de l'attribut
 * @returns {boolean}
 */
function isSafeAttribute(attribute) {
    // Autoriser les attributs data-* et aria-*
    if (attribute.startsWith('data-') || attribute.startsWith('aria-')) {
        return true
    }
    return SAFE_ATTRIBUTES.has(attribute.toLowerCase())
}

/**
 * 
 * @param {string} tagName 
 * @param {Object} attributes 
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)
    for(const [attribute, value] of Object.entries(attributes)) {
        if (value !== null && isSafeAttribute(attribute)) {
            // setAttribute échappe automatiquement les valeurs
            element.setAttribute(attribute, String(value))
        }
    }
    return element
}