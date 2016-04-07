Everdu: chrome extension
=======================

This chrome extension is intented to help you with the content you want to add to your evernote to not having it duplicated.

It has to work modes. Default is, **check on demand**, that means, the extensión will query your evernote only when you click on the extension's icon. But you can configure the extension to check every url. Obiously, this mode has a larger network overhead.

To **change the configuration**, just right click on the extension's icon and go to configuration and click on the checkbox that appears there. That's all.

### CHANGELOG

#### 1.0.6: 2013/04/22

* Fix API call to find notes by source url

#### 1.0.4: 2013/04/22
Changes mad by [alanfranz](https://github.com/alanfranz). General idea is to cache results already obtained from Evernote. This is mostly benefit when working with the 'all' mode.

* Fix: missing manifest field [37e5ac6](https://github.com/alanfranz/everdu-chrome-extension/commit/37e5ac696578d844c91b6502625f431d9b637969)
* Enh: basic URL caching [3934f5c](https://github.com/alanfranz/everdu-chrome-extension/commit/3934f5c123ac159ae0df9d74e370e7a5e89a2a83)
* Merge from upstream [3ddf2ee](https://github.com/alanfranz/everdu-chrome-extension/commit/3ddf2ee2731b54dc94e96fcbdf22fd15116082d5)

####1.0.3: 2013/03/05
Changes made by [bitio](https://github.com/bitIO). Logout when token is no longer valid.
