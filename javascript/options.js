$(document).ready(function() {
    $('#check-every-url').change(function(){
        if ($(this).is(":checked")) {
            chrome.storage.sync.set({ 'everduworkmode': 'all' });
        } else {
            chrome.storage.sync.set({ 'everduworkmode': 'ondemand' });
        }
    });
});