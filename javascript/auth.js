/**
 * Copyright (c) 2012 KandaSoftware. All rights reserved.  Use of this
 * source code is governed by a MIT license that can be found in the
 * LICENSE file.
 */

jQuery(function ($) {
  Eventnote = {};
  Eventnote.Auth = {
    logout_time_param    : 'edam_expires',
    note_store_url_param : 'edam_noteStoreUrl',
    shard_param          : 'edam_shard',
    api_url_prefix       : 'edam_webApiUrlPrefix'
  };
  Eventnote.Auth.oauth = ChromeExOAuth.initBackgroundPage({
    'request_url'     : 'https://www.evernote.com/oauth',
    'authorize_url'   : 'https://www.evernote.com/OAuth.action',
    'access_url'      : 'https://www.evernote.com/oauth',
    'consumer_key'    : 'bit_jammer-9517',
    'consumer_secret' : '802513e24e7928b4',
    'scope'           : '',
    'app_name'        : 'Everdu Chrome Extension',
    'callback_page'   : 'views/chrome_ex_oauth.html'
  });

  Eventnote.Data   = {};
  Eventnote.Logger = {};

  Eventnote.Logger.castor = new loggly({
    url:'http://logs.loggly.com/inputs/198b2723-7111-4ec1-9bd8-9651759b3517',
    level:'log'
  });

  Eventnote.Logger.info = function (message) {
    Eventnote.Logger.castor.info(message);
  };

  Eventnote.Logger.error = function (err, errMessage) {
    var message;
    var errorType;
    var error;
    if (err instanceof EDAMUserException) {
      errorType = err.errorCode;
      for (error in EDAMErrorCode) {
        if (EDAMErrorCode[error] == errorType) {
          errorType = error;
          break;
        }

      }
      message = "Error type: {" + errorType + "}\n Parameter: {" + err.parameter + "}"
    } else if (err instanceof EDAMSystemException) {
      errorType = err.errorCode;
      for (error in EDAMErrorCode) {
        if (EDAMErrorCode[error] == errorType) {
          errorType = error;
          break;
        }

      }
      message = "Error type: {" + errorType + "}\n Message: {" + err.message + "}"
    } else if (err instanceof EDAMNotFoundException) {
      message = "Error id: {" + err.identifier + "}\n Message: {" + err.key + "}"
    } else {
      if (err.description) {
        message = err.description;
      }
      else {
        message = err;
      }
    }
    if (errMessage) {
      message = message + "\n" + errMessage;
    }
    Eventnote.Logger.castor.error(message);
  };

  Eventnote.Auth.authenticate = function (callback) {
    try {
      Eventnote.Auth.oauth.authorize(function() {
        var authenticated = Eventnote.Auth.oauth.hasToken();
        localStorage.setItem("authenticated", authenticated);
        localStorage.setItem("logout_time",
          Eventnote.Auth.oauth.getParameter(Eventnote.Auth.logout_time_param));
        if (callback !== undefined) {
          callback();
        }
      });
    } catch(e) {
      Eventnote.Logger.error(e);
      if (callback !== undefined) {
        callback();
      }
    }
  };

  Eventnote.Auth.get_auth_token = function () {
    return Eventnote.Auth.oauth.getToken();
  };

  Eventnote.Auth.logout = function () {
    Eventnote.Auth.oauth.clearTokens();
  }
});
