$(document).ready(function() {
  $('#check-every-url').change(function(){
    if ($(this).is(":checked")) {
      console.log("everdu: changed to workmode ALL");
      chrome.storage.sync.set({ 'everduworkmode': 'all' });
    } else {
      console.log("everdu: changed to workmode ON DEMAND");
      chrome.storage.sync.set({ 'everduworkmode': 'ondemand' });
    }
  });
});