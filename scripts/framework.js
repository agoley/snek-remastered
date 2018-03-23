var framework = {}; // Isolate the framework scope within an object.

// Returns an integer representing an elements position, either top or left.
framework.getElementPos = function (el, edge) {
    if (edge === 'top') {
        return el.style.top ? parseInt(el.style.top.substring(0, el.style.top.length - 2)) : 0;
    }

    if (edge === 'left') {
        return el.style.left ? parseInt(el.style.left.substring(0, el.style.left.length - 2)) : 0;
    }
}