(function () {
  "use strict";
  var darkMode = false;
  chrome.storage.local.get(["darkMode"], (result) => {
    darkMode = result.darkMode;
    if (darkMode) {
      setTimeout(() => {
        changeMode(true);
      }, 100);
    }
  });
  var timeSince = function (date) {
    if (typeof date !== "object") {
      date = new Date(date);
    }
    var seconds = Math.floor((new Date() - date) / 1000);
    var intervalType;
    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = "metus";
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = "mėnesius";
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = "dienas";
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = "valandas";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = "minutes";
            } else {
              interval = interval;
              if (interval < 5) {
                interval = "kelias";
                intervalType = "sekundes";
              } else {
                interval = interval;
                intervalType = "sekundes";
              }
            }
          }
        }
      }
    }
    return interval + " " + intervalType;
  };
  var dbName = "settings";
  var settings = new Array();
  chrome.storage.local.get(dbName, function (storage) {
    if (dbName in storage) {
      settings = storage[dbName];
      var preftab = settings[0].defaultTab;
      if (settings[0].git_token) $("#g__token").val(settings[0].git_token);
      if (settings[0].git_public)
        $("#g__public").prop("checked", settings[0].git_public);
      if (settings[0].last_sync)
        $("#last_sync_info").text(
          "Paskutinį kartą atnaujinta prieš " +
            timeSince(new Date(settings[0].last_sync))
        );
      if (settings[0].gist_id) {
        $("#g__id")
          .val(settings[0].gist_id)
          .closest(".hidden")
          .removeClass("hidden");
        $("#g__public").prop("disabled", true);
      }
    } else {
      storage = {};
      storage[dbName] = [
        {
          defaultTab: "bookmarks",
          git_public: true,
        },
      ];
      chrome.storage.local.set(storage, function () {}.bind(this));
      settings = storage[dbName];
      preftab = settings[0].defaultTab;
    }
    setDefaultView(preftab);
  });

  $("#g__token").on("keyup change paste input", function (e) {
    if (this.value != "") {
      const new_token = this.value;
      chrome.storage.local.get(dbName, function (storage) {
        if (dbName in storage) {
          settings = storage[dbName];
          for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
              settings[key].git_token = new_token;
            }
          }
          chrome.storage.local.set(storage, function () {}.bind(this));
        }
      });
    }
  });
  $("#g__public").on("change", function () {
    var ischecked = $(this).is(":checked");
    chrome.storage.local.get(dbName, function (storage) {
      if (dbName in storage) {
        settings = storage[dbName];
        for (let key in settings) {
          if (settings.hasOwnProperty(key)) {
            if (!ischecked) {
              settings[key].git_public = false;
            } else {
              settings[key].git_public = true;
            }
          }
        }
        chrome.storage.local.set(storage, function () {}.bind(this));
      }
    });
  });
  $("#g__syncData").on("click", function (e) {
    e.preventDefault();
    $("#last_sync_info").text("Naujinama informacija...");
    exportToGithub();
  });
  $("#delete__existing_gist").on("click", function (e) {
    e.preventDefault();
    if (
      confirm(
        "Ar tikrai norite pašalinti šį Gist ID?\nAtnaujinus informaciją jums bus sukurtas naujas Gist ID."
      )
    ) {
      chrome.storage.local.get(dbName, function (storage) {
        if (dbName in storage) {
          settings = storage[dbName];
          for (let key in settings) {
            if (settings.hasOwnProperty(key)) {
              settings[key].gist_id = "";
            }
          }
          chrome.storage.local.set(
            storage,
            function () {
              $("#g__id").val("");
              $("#g__public").prop("disabled", false);
            }.bind(this)
          );
        }
      });
    } else {
    }
  });
  function setDefaultView(preftab) {
    if (preftab == "tasks") {
      $("#tasks").addClass("active").removeClass("hidden");
      $("#bookmarks").addClass("hidden").removeClass("active");
    } else {
      $("#bookmarks").addClass("active").removeClass("hidden");
      $("#tasks").addClass("hidden").removeClass("active");
    }
    $('#defaultViewToggle span[data-pref="' + preftab + '"]').removeClass(
      "hidden"
    );
  }
  function changeDefaultView(preftab) {
    console.log("update");
    chrome.storage.local.get([dbName], function (storage) {
      var settings = storage[dbName];
      for (let key in settings) {
        if (settings.hasOwnProperty(key)) {
          if (preftab != settings[key].defaultTab) {
            settings[key].defaultTab = preftab;
            break;
          }
        }
      }
      chrome.storage.local.set({ [dbName]: settings }, function () {
        setDefaultView(preftab);
      });
    });
  }

  $("#defaultViewToggle").on("click", function (e) {
    e.preventDefault();
    $("span", this).toggleClass("hidden");
    var preftab = $("span:not(.hidden)", this).data("pref");
    changeDefaultView(preftab);
  });
  $("#download__as_json").on("click", function (e) {
    chrome.storage.local.get(null, function (storage) {
      let e = document.createElement("a");
      e.setAttribute(
        "href",
        `data:application/json;charset=utf-8,${escape(JSON.stringify(storage))}`
      );
      e.setAttribute("download", `atsargine_kopija_${Date.now()}.json`);
      e.click();
    });
  });
  function showSettings() {
    if ($(this).hasClass("settings__is_open")) {
      $("#tasks.active, #bookmarks.active").removeClass("hidden");
      $(this).removeClass("settings__is_open");
      $("#settings").addClass("hidden");
      $("#defaultViewToggle").show();
    } else {
      $("#tasks, #bookmarks").addClass("hidden");
      $(this).addClass("settings__is_open");
      $("#settings").removeClass("hidden");
      $("#defaultViewToggle").hide();
    }
  }
  $("#showSettings").on("click", showSettings);
  $("#importBackupTrigger").on("click", function (e) {
    e.preventDefault();
    $("#importbackupBlock").toggleClass("hidden");
    $("#gist_block").addClass("hidden");
  });
  $("#g__importData").on("click", doubleCheckImport);
  function doubleCheckImport() {
    if (
      confirm(
        "Ar tikrai norite importuoti duomenis?\nTai ištrins jau esamą informaciją."
      )
    ) {
      importToGithub();
    }
  }
  function changeMode(firstLoad) {
    if (!firstLoad) {
      if (darkMode) {
        chrome.storage.local.set({ darkMode: false });
        darkMode = false;
      } else {
        chrome.storage.local.set({ darkMode: true });
        darkMode = true;
      }
    }
    $("#showDarkMode").toggleClass("dark");
    $("body").toggleClass("dark");
    $(".darkMode__go").toggleClass("hidden");
    $(".darkMode__go-back").toggleClass("hidden");
    $("#search").toggleClass("dark3");
    $("#filter__site_cards").toggleClass("dark3");
    $("#addNewBookmarkUI").toggleClass("dark");
    $(".js__bookmark_card").toggleClass("dark5");
    $(".js__card_settings").toggleClass("dark4");
    $(".item").toggleClass("hover:bg-gray-100");
    $(".item").toggleClass("hover:bg-dark");
    $(".link").toggleClass("text-purple-700");
    $(".link").toggleClass("text-white");
    $(".remove").toggleClass("dark4");
    $(".modal-container").toggleClass("dark3");
    $(".modal-close").toggleClass("dark3");
    $("input").toggleClass("dark2");
    $("details input").toggleClass("dark3");
    $(".js__card_menu").toggleClass("dark2");
    $(".ui-menu").toggleClass("dark2");
    $("#settings .container .overflow__block").toggleClass("dark3");
    $(".header h3").toggleClass("dark3");
    $("details div").toggleClass("dark2");
    $("details div.bg-gray-200").toggleClass("dark3");
    $("#importBackupTrigger").toggleClass("dark2");
    $("strong a").toggleClass("dark3");
    $("#delete__existing_gist").toggleClass("dark2");
    if ($("body").hasClass("dark")) {
      $(".toggle__active").addClass("toggle__active_dark");
      $(".toggle__active").removeClass("toggle__active");
    } else {
      $(".toggle__active_dark").addClass("toggle__active");
      $(".toggle__active_dark").removeClass("toggle__active_dark");
    }
  }
  $("#showDarkMode").click(() => changeMode(false));
  function importToGithub() {
    chrome.storage.local.get(null, function (storage) {
      settings = storage[dbName];
      const gittoken = settings[0].git_token;
      const gist_id = $("#ex-g__id").val();
      if (gist_id && gittoken) {
        var ajaxsettings = {
          async: true,
          crossDomain: true,
          url: "https://api.github.com/gists/" + gist_id,
          method: "GET",
          headers: {
            Authorization: "Bearer " + gittoken,
            Accept: "application/vnd.github.v3+json",
          },
          processData: false,
        };
        $.ajax(ajaxsettings).done(function (response) {
          const backupdata = JSON.parse(
            response.files["atsargine_kopija_ext_bkp.json"].content
          );
          if (backupdata) {
            storage["sites"] = backupdata.sites;
            for (let key in settings) {
              if (settings.hasOwnProperty(key)) {
                settings[key].gist_id = gist_id;
              }
            }
            chrome.storage.local.set(
              storage,
              function () {
                alert("GitHub informacija sėkmingai importuota! ");
                location.reload();
              }.bind(this)
            );
          } else {
            alert("Neradome jūsų atsarginės kopijos!");
          }
        });
      } else {
        alert("Pirma įrašykite savo GitHub Token!");
      }
    });
  }
  setInterval(() => {
    chrome.storage.local.get(null, function (storage) {
      const settings = storage["settings"];
      const unsaved_changes = settings[0].unsaved_changes;
      if (unsaved_changes) {
        exportToGithub().then(() => {
          setTimeout(() => {
            chrome.storage.local.get(null, function (newstorage) {
              const newsettings = newstorage["settings"];
              for (let key in newsettings) {
                if (newsettings.hasOwnProperty(key)) {
                  newsettings[key].unsaved_changes = false;
                }
              }
              chrome.storage.local.set(
                { settings: newsettings },
                function () {}
              );
            });
          }, 5000);
        });
      }
    });
  }, 60000);
  function exportToGithub() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, function (storage) {
        if (dbName in storage) {
          settings = storage[dbName];
          const gittoken = settings[0].git_token;
          const gist_id = settings[0].gist_id;
          const git_public = settings[0].git_public;
          const sitesTasksArray = Object.keys(storage).reduce((object, key) => {
            if (key !== dbName) {
              object[key] = storage[key];
            }
            return object;
          }, {});
          if (!gittoken) {
            return;
          }
          const jsondata = JSON.stringify(sitesTasksArray, null, 4);
          const escapeJSON = function (str) {
            return str
              .replace(/\\/g, "\\\\")
              .replace(/"/g, '\\"')
              .replace(/\n/g, "\\n")
              .replace(/\r/g, "\\r")
              .replace(/\t/g, "\\t");
          };
          var ajsettings = {
            async: true,
            crossDomain: true,
            url: gist_id
              ? "https://api.github.com/gists/" + gist_id
              : "https://api.github.com/gists",
            method: "POST",
            headers: {
              Authorization: "Bearer " + gittoken,
              "content-type": "application/json;charset=utf-8",
            },
            processData: false,
            data: `{\r\n  "description": "Naujo skirtuko informacijos atsarginė kopija",\r\n  "public": "${git_public}",\r\n  "files": {\r\n    "atsargine_kopija_ext_bkp.json": {\r\n      "content": "${escapeJSON(
              jsondata
            )}"\r\n    }\r\n    }\r\n    }`,
          };
          $.ajax(ajsettings).done(function (response) {
            for (let key in settings) {
              if (settings.hasOwnProperty(key)) {
                settings[key].gist_id = response.id;
                settings[key].last_sync = response.updated_at;
              }
            }
            chrome.storage.local.set(
              storage,
              function () {
                $("#last_sync_info").text(
                  "Paskutinį kartą atnaujinta prieš " +
                    timeSince(new Date(storage.settings[0].last_sync))
                );
                resolve("resolved");
              }.bind(this)
            );
          });
        }
      });
    });
  }
})();
