/* global chrome */
(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    readLater(document.querySelector('#readlater a'));
    loadBookmarks();
  });

  var bookmarks = [];
  var loadBookmarks = function() {
    chrome.storage.sync.get(function(items) {
      bookmarks = items.bookmarks || {};
      for (var url in bookmarks) {
        if (bookmarks.hasOwnProperty(url)) {
          bookmarkItem(url, bookmarks[url]);
        }
      }
    });
  };

  var readLater = function(link) {
    link.addEventListener('click', function() {
      chrome.tabs.query({active: true}, function(tab) {
        bookmarks[tab[0].url] = tab[0].title;
        saveBookmarks();
      });
      window.close();
    });
  };

  var instapaper = 'https://www.instapaper.com/text?u=';
  var bookmarkList = document.querySelector('#bookmarks');
  var bookmarkItem = function(url, title) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#';
    a.innerText = title;
    a.addEventListener('click', function() {
      chrome.tabs.create({
        url: instapaper + encodeURIComponent(url)
      }, function() {
        delete bookmarks[url];
        saveBookmarks();
      });
    });
    li.appendChild(a);
    bookmarkList.appendChild(li);
  };

  var saveBookmarks = function() {
    chrome.storage.sync.set({
      bookmarks: bookmarks
    });
  };
}());
