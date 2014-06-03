var packageJson = require('json!streamhub-wall/../package.json');
var packageAttribute = 'data-lf-package';
var packageAttributeValue = packageName(packageJson);

/**
 * Decorate an HTMLElement with the proper package attribute
 * for streamhub-wall e.g.
 * data-lf-package="streamhub-wall#3.0.0"
 */
exports.decorate = function (el) {
    var currentVal = el.getAttribute(packageAttribute) || '';
    var currentPackageAttrs = currentVal.split(' ');
    var newVal;
    // Add this package attribute value if it's not already there
    if (currentPackageAttrs.indexOf(packageAttributeValue) === -1) {
        currentPackageAttrs.push(packageAttributeValue);
        newVal = currentPackageAttrs.join(' ');
        el.setAttribute(packageAttribute, newVal);
    }
};

exports.undecorate = function (el) {
    var currentVal = el.getAttribute(packageAttribute) || '';
    var newVal = currentVal.replace(packageAttributeValue, '');
    el.setAttribute(packageAttribute, newVal);
};

exports.decorateModal = function modalWithPackageSelector(modal) {
    modal.$el.on('showing', setHasPackageAttribute.bind({}, modal, true));
    modal.$el.on('hiding', setHasPackageAttribute.bind({}, modal, false));
    return modal;
};

function setHasPackageAttribute(modal, shouldHaveAttr) {
    exports[shouldHaveAttr ? 'decorate' : 'undecorate'](modal.parentNode);
}

function packageName(packageJson) {
    return packageJson.name + '#' + packageJson.version;
}
