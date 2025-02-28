importScripts("./scripts/storage.js");

var table = "options";
var tmptable = "tmp";
var requiredOptions = [
  "fitWhenLarger",
  "fit",
  "zoom",
  "rotate",
  "minWidth",
  "minHeight",
  // "closeButton",
];

const resetOptions = async function () {
  storage.insert(table, "fitWhenLarger", true);
  storage.insert(table, "fit", "both");
  storage.insert(table, "zoom", 1.5);
  storage.insert(table, "rotate", 15);
  storage.insert(table, "minWidth", 100);
  storage.insert(table, "minHeight", 100);
  // storage.insert(table, "closeButton", true);
  await storage.store(table);
  return storage.restore(table, options);
};

const openNewTab = async function (pageURL) {
  chrome.tabs.create({
    url: pageURL,
  });
};

const resetLocalStorage = async function () {
  await storage.restore(table, options);

  if (!storage.isEmpty(options)) {
    await resetOptions();
    await chrome.runtime.openOptionsPage();
  } else {
    let isOptionPageOpened = false;
    for (let option_key of Object.values(requiredOptions)) {
      if (options[option_key] === undefined) {
        await resetOptions();
        await chrome.runtime.openOptionsPage();
        isOptionPageOpened = true;
        break;
      }
    }
    // I'm not sure, but I guess this sentences are fix to Chrome24 to Chrome25 have bugs about css.
    if (
      !isOptionPageOpened &&
      (navigator.userAgent.toLowerCase().indexOf("chrome/24.0") >= 0 ||
        navigator.userAgent.toLowerCase().indexOf("chrome/25.0") >= 0)
    ) {
      if (!options.insert_css_bug_in_24_to_25_msg_shown) {
        // await chrome.runtime.openOptionsPage();
      }
      storage.insert(table, "insert_css_bug_in_24_to_25_msg_shown", true);
      await storage.store(table);
    }
  }
  let tbl = storage.getTable(tmptable);
  console.log("table is ...");
  console.log(tbl);
  if (storage.isEmpty(tbl)) {
    console.log("tmptable is null!");
    storage.insert(tmptable, "image", "");
    storage.store(tmptable);
  }
};

// on Installed, Updated or Chrome Updated
chrome.runtime.onInstalled.addListener(() => {
  resetLocalStorage();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // resetLocalStorage();
  if (message.method == "Get options")
    sendResponse({ status: storage.getTable(table) });
  else if (message.method == "Get tmp")
    sendResponse({ status: storage.getTable(tmptable) });
  else if (message.method == "AssignData") {
    options[message.key] = message.value;
    if (message.update) storage.store(message.tableId);
    console.log(options);
    sendResponse({ status: true });
  } else sendResponse({});
});

chrome.action.onClicked.addListener((tab) => {
  const injection = {
    files: ["css/viewer.css"],
    target: { tabId: tab.id },
  };
  chrome.scripting.insertCSS(injection, () => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/prototypes.js"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/jquery.js"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/jquery.mousewheel.js"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/storage.js"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/css-transform.js"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["image-viewer.js"],
    });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["activate-page.js"],
    });
  });
});

function i18n(name) {
  return chrome.i18n.getMessage(name);
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info);
  const injection = {
    files: ["css/viewer.css"],
    target: { tabId: tab.id },
  };
  if ("mediaType" in info) {
    // Store the image for content script use
    storage.insert(tmptable, "image", info.srcUrl);
    chrome.scripting.insertCSS(injection, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/prototypes.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/jquery.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/jquery.mousewheel.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/storage.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/css-transform.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["image-viewer.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["activate-image.js"],
      });
    });
  } else {
    chrome.scripting.insertCSS(injection, () => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/prototypes.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/jquery.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/jquery.mousewheel.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/storage.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/css-transform.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["image-viewer.js"],
      });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["activate-page.js"],
      });
    });
  }
});

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
  id: "imageviewer1234_dev_img",
  title: i18n("open_in_image_viewer"),
  contexts: ["image"],
});
chrome.contextMenus.create({
  id: "imageviewer1234_dev_page",
  title: i18n("view_images_in_image_viewer"),
  contexts: ["page"],
});
