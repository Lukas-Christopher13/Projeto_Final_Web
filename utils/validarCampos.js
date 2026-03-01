export function validarValor(novoValor, setError) {
    let error = ""
    
    if (novoValor === undefined || novoValor === null || novoValor === "") {
        error = error + " / * o campo não pode ser vazio"
    }

    if (isNaN(Number(novoValor))) {
        error = error + " / * o campo deve ser um número"
    }

    if (Number(novoValor) <= 0)
        error = error + " / * deve ser um valor positivo"

    setError(error)
}

export function validarString(novoValor, setError) {
    let error = ""

    if (novoValor === undefined || novoValor === null || novoValor === "") {
        error = error + " / * o campo não pode ser vazio"
    }

    if (typeof novoValor !== "string") {
        error = error + " / * o campo deve ser texto"
    }

    if (typeof novoValor === "string" && novoValor.trim().length === 0) {
        error = error + " / * o campo não pode conter apenas espaços"
    }

    setError(error)
}

export function validarData(novoValor, setError) {
    let error = ""

    if (novoValor === undefined || novoValor === null || novoValor === "") {
        error = error + " / * a data não pode ser vazia"
    }

    const data = new Date(novoValor)

    if (isNaN(data.getTime())) {
        error = error + " / * data inválida"
    }

    const hoje = new Date()

    if (!isNaN(data.getTime()) && data > hoje) {
        error = error + " / * a data não pode ser futura"
    }

    setError(error)
}