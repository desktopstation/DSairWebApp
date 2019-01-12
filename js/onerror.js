// global error handler
window.onerror = function (msg, file, line, column, err) {
    alert(msg + file + ':' + line);
    return false;
};
