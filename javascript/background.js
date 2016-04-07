// CHROME TABS EVENTS
// -----------------------------------------------------------------------------
function onUpdated(workmode, changeInfo, tab) {
  if (workmode && workmode !== undefined && workmode === 'all') {
    if (changeInfo !== undefined && changeInfo.status === "complete") {
      verify(tab.url);
    }
  } else {
    setBadgeText();
  }
}

function onActivated(workmode, activeInfo) {
  if (workmode && workmode !== undefined && workmode === 'all') {
    chrome.tabs.query({active: true}, function(tab){
      if (tab !== undefined ) {
        // do this to get the correct tab (the user may have detached tabs)
        for (var i = tab.length - 1; i >= 0; i--) {
          if (tab[i].id === activeInfo.tabId) {
            verify(tab[i].url, true);
          }
        }
      }
    });
  } else {
    setBadgeText();
  }
}

function onClicked(workmode, tab) {
  // if clicked, load Evernote status, or reload it from remote
  // server without resorting to the cache.
  if (workmode && workmode !== undefined) {
    if (tab.status && tab.status !== undefined) {
      if (tab.status === "complete") {
        verify(tab);
      }
    }
  }

}

var url_cache = {};

// URL VERIFICATION
// -----------------------------------------------------------------------------
function verify(tab, use_cached) {
  var url = tab.url;
  if (typeof(use_cached) === 'undefined') use_cached=false;

  if (Eventnote.Auth.get_auth_token() === undefined) {
    setIconBagdAuthIndicator(false);
    Eventnote.Auth.authenticate();
    return;
  } else {
    setIconBagdAuthIndicator(true);
  }

  if (url !== '') {
    if ((use_cached) && typeof(url_cache[url]) !== 'undefined') {
      setBadgeText(url_cache[url]);
      return;
     }
    // Eventnote.Logger.info('[EVERDU] Verify url:' + url);
    var notesTransport = new Thrift.Transport(
        Eventnote.Auth.oauth.getParameter(Eventnote.Auth.note_store_url_param));
    var notesProtocol = new Thrift.Protocol(notesTransport);
    var noteStore = new NoteStoreClient(notesProtocol, notesProtocol);
    if (!noteStore) {
      Eventnote.Logger.error("[EVERDU] Connection failure during getting note store");
      return;
    }

    var filter = new NoteFilter();
    filter.words = "sourceURL:\"" + url + "*\"";    
    try {
      var results = noteStore.findNotes(Eventnote.Auth.get_auth_token(), filter,
        0, 100);

      var badgeText;
      if (results.notes.length === 0) {
        badgeText = 'no';
      } else {
        badgeText = 'yes:' + results.notes.length;
      }
      setBadgeText(badgeText);
      if (use_cached) {
        url_cache[url] = badgeText;
      }
    } catch(e) {
      setBadgeText('ERR!');
      if (e.errorCode === 9 ){
        Eventnote.Auth.logout();
        setIconBagdAuthIndicator(false);
        if (e.parameter === "password" ) {
          window.alert("[EVERDU] Please authenticate with evernote again");
        }
        else {
          Eventnote.Logger.error("[EVERDU] Authentication error");
          Eventnote.Logger.error(e);
          window.alert("[EVERDU] " + e.errorCode + ":" + e.parameter
              + ". Everdu not working. Please report the error.");
        }
      }
      else {
        Eventnote.Logger.error(e);
        console.log('something is not working:');
        console.log(e);
      }
    }
  }
}


$(function() {
  //listen for current tab to be changed
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.sync.get('everduworkmode', function (items) {
      onUpdated(items.everduworkmode, changeInfo, tab);
    });
  });

  //listen for new tab to be activated (when clicked but not refreshed)
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.storage.sync.get('everduworkmode', function (items) {
      onActivated(items.everduworkmode, activeInfo);
    });
  });

  // when clicked, perform a url verify
  chrome.browserAction.onClicked.addListener(function(tab){
    chrome.storage.sync.get('everduworkmode', function (items){
      onClicked(items.everduworkmode, tab);
    });
  });

  // work mode, by default, is to check urls on-demand (can be changed on the popup.html)
  chrome.storage.sync.set({ 'everduworkmode': 'ondemand' });

  // login to evernote using oatuh
  Eventnote.Auth.authenticate( function() {
    setBadgeText(); // removes any badge text
  });
});
