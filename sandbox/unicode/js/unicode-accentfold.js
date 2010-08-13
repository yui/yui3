YUI.add('unicode-accentfold', function (Y) {

var YArray   = Y.Array,
    Unicode  = Y.Unicode,
    FoldData = Unicode.Data.AccentFold,

AccentFold = Unicode.AccentFold = {
    // -- Public Static Methods ------------------------------------------------

    /**
     * Returns <code>true</code> if the specified string contains one or more
     * characters that can be folded, <code>false</code> otherwise.
     *
     * @method canFold
     * @param {String} string String to test.
     * @return {Boolean}
     * @static
     */
    canFold: function (string) {
        var letter;

        for (letter in FoldData) {
            if (FoldData.hasOwnProperty(letter) &&
                    string.search(FoldData[letter]) !== -1) {
                return true;
            }
        }

        return false;
    },

    /**
     * <p>
     * Accent-folds the specified string and returns a copy in which common
     * accented letters have been converted to their closest non-accented,
     * lowercase forms.
     * </p>
     *
     * <p>
     * This is a destructive operation that can't be reversed, and may also
     * destroy the actual meaning of the text depending on the language. It
     * should not be used on strings that will later be displayed to a user,
     * unless this is done with the understanding that linguistic meaning may be
     * lost.
     * </p>
     *
     * @method fold
     * @param {String} string String to be folded.
     * @return {String} Folded string.
     * @static
     */
    fold: function (string) {
        string = string.toLowerCase();

        Y.Object.each(FoldData, function (regex, letter) {
            string = string.replace(regex, letter);
        });

        return string;
    }
};

}, '@VERSION@', {
    requires: ['unicode-data-accentfold']
});
