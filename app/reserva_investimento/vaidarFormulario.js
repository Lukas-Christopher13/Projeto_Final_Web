
export function validar(valor, data, fonte) {
    return valorIsValid(valor) && dataIsValid(data) && fonteIsValid(fonte)
}

export function valorIsValid(novoValor) {
    if (novoValor === undefined || novoValor === null || novoValor === "") {
        return false
    }

    if (isNaN(Number(novoValor))) {
        return false
    }

    if (Number(novoValor) <= 0) {
        return false
    }

    return true
}

export function fonteIsValid(novoValor) {
    if (novoValor === undefined || novoValor === null || novoValor === "") {
        return false
    }

    if (typeof novoValor !== "string") {
        return false
    }

    if (novoValor.trim().length === 0) {
        return false
    }

    return true
}

export function dataIsValid(novoValor) {
    if (novoValor === undefined || novoValor === null || novoValor === "") {
        return false
    }

    const data = new Date(novoValor)

    if (isNaN(data.getTime())) {
        return false
    }

    const hoje = new Date()

    if (data > hoje) {
        return false
    }

    return true
}