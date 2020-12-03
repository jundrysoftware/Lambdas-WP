String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));

};



module.exports.amountParser = (value) => {
    value = value.replace('=','').trim()
    // Check for decimal numbers
    if (value.includes(',') && value.substring(value.lastIndexOf(',') + 1).length === 2) {
        const decimal = value.substring(value.lastIndexOf(',') + 1)
        value = value.replace(/\D/g, "")
        const endLength = value.length
        value = value.splice(endLength - 2, endLength - 1, '.' + decimal)
    } else if (value.includes('.') && value.substring(value.lastIndexOf('.') + 1).length === 2) {
        const decimal = value.substring(value.lastIndexOf('.') + 1)
        value = value.replace(/\D/g, "")
        const endLength = value.length
        value = value.splice(endLength - 2, endLength - 1, '.' + decimal)
    } else {
        value = value.replace(/\D/g, "")
    }
    return parseFloat(value)
}