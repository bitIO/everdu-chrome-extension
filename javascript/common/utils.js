/**
 * Method removes all data from local storage.
 */
function clearStorage() {
  localStorage.clear();
  setIconBagdAuthIndicator(false);
}

function setIconBagdAuthIndicator(auth) {
  if (!auth) {
    setBadgeText('Disconnected');
  } else {
    setBadgeText();
  }
}

/**
 * Method sets icon that tells user is he logged in or not.
 */
function setIcon(grey) {
  var iconName = '/images/icon_19';
  if (grey) {
    iconName += '.png'
    // iconName += '_grey.png'
  } else {
    iconName += '.png'
  }
  var iconDef = { path: { '19': iconName } };
  chrome.browserAction.setIcon(iconDef, function() {
    if (chrome.runtime.lastError) {
      console.error('setIcon', chrome.runtime.lastError.message);
      console.error(chrome.runtime.lastError);
    }
  });
}

function setBadgeText (txt) {
  if (!txt) {
    txt = '';
  }
  chrome.browserAction.setBadgeText({ text: txt });
}

String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};
