$(function () {
  console.log("options open!");
  var table = "options";

  const getOptions = async function(){
    chrome.runtime.sendMessage({method: "Get options"}, (response) => {
      return response.status;
    });
  }

  chrome.runtime.sendMessage({method: "Get options"}, (response) => {
    optionCB(response.status);
  });

  const optionCB = async function (options){
    $("input[name=zoom]").val(options.zoom);
    $("input[name=zoom] + .display").html(options.zoom);

    $("input[name=rotate]").val(options.rotate);
    $("input[name=rotate] + .display").html(options.rotate);

    $("input[name=minWidth]").val(options.minWidth);
    $("input[name=minHeight]").val(options.minHeight);

    if (options.fitWhenLarger) {
      document.querySelector("input[name=fitWhenLarger]").checked = true;
    }

    $("#fit-" + options.fit).attr("checked", true);

    $("input[name=fit]").on("change", function () {
      console.log("change fit...");
      const name = "fit";
      const val  = $(this).val();
      console.log(name, val);
      chrome.runtime.sendMessage({method: "AssignData", key: name, value: val, update: true, tableId: table});
    });

    $("input[type=number]").on("change", function () {
      console.log("change number...");
      const name = $(this).attr("name");
      const val  = parseInt($(this).val());
      console.log(name, val);
      chrome.runtime.sendMessage({method: "AssignData", key: name, value: val, update: true, tableId: table});
    });

    $("input[type=checkbox]").on("change", function () {
      console.log("change checkbox...");
      const name = $(this).attr("name");
      const val = this.checked;
      console.log(name, val);
      chrome.runtime.sendMessage({method: "AssignData", key: name, value: val, update: true, tableId: table});
    });

    $("input[type=range]").on("change", function () {
      console.log("change range...");
      const name = $(this).attr("name");
      const val = this.value;

      display = $("+ .display", this);
      display.html(val);

      console.log(name, val);
      chrome.runtime.sendMessage({method: "AssignData", key: name, value: val, update: true, tableId: table});
    });
  }

  // i18n
  function i18n(name) {
    return chrome.i18n.getMessage(name);
  }
  $.each($("[data-i18n]"), function () {
    if ((message = chrome.i18n.getMessage($(this).attr("data-i18n")))) {
      this.innerHTML = message;
      if (this.value != "") this.value = message;
    }
  });

  // // Bug msg
  // var insert_css_bug_in_24_to_25_msg = $("#insert_css_bug_in_24_to_25_msg");
  // if (
  //   !(
  //     navigator.userAgent.toLowerCase().indexOf("chrome/24.0") >= 0 ||
  //     navigator.userAgent.toLowerCase().indexOf("chrome/25.0") >= 0
  //   )
  // ) {
  //   insert_css_bug_in_24_to_25_msg.hide();
  // }
});
