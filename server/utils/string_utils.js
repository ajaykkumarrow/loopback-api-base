/**
 * String Utility
 * @author Ajaykkumar Rajendran
 */
module.exports = class StringUtil {
  static template(strings, ...keys) {
    return (function applyTags(...values) {
      const dict = values[values.length - 1] || {};
      const result = [strings[0]];
      keys.forEach((key, i) => {
        const value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    });
  }
  /**
     * String Split to array
     * @param content
     * @param splitBy
     * @returns {(string|*)[]}
     */
  static split(content, splitBy) {
    return content.split(splitBy).map(datum => datum.trim());
  }

  /**
     * Check if string is not empty
     * @param content
     * @returns {boolean}
     */
  static isNotBlank(content) {
    return content !== undefined && content !== null && content.trim() !== '';
  }
};
