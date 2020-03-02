export var prettifyTime = (value) => {
    value = Math.abs(value);
    if (value < 10) {
        return "0" + value
    } else {
        return value
    }
};