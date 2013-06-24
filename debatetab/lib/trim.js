if (typeof String.prototype.trim != 'function') {
  String.prototype.trim = function() {
    return this.replace(/^s+/, '').replace(/\s+$/, '');
  };
}
