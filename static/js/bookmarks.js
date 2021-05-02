(function () {
  "use strict";
  var randHex = function (len) {
    var maxlen = 8,
      min = Math.pow(16, Math.min(len, maxlen) - 1),
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
      n = Math.floor(Math.random() * (max - min + 1)) + min,
      r = n.toString(16);
    while (r.length < len) {
      r = r + randHex(len - maxlen);
    }
    return r;
  };
  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  }
  $("#bookmark_url").on("keyup change paste input", function (e) {
    if (this.value != "") {
      var url_result = validURL(this.value);
      if (url_result) {
        $("#bookmark_title").attr({
          disabled: true,
          placeholder: "Gaunamas pavadinimas... Prašome luktelti.",
        });
        async function fetchContent() {
          let text = await $("#bookmark_url").val();
          getTitlefromURL(text);
          return text;
        }
        var promise = fetchContent();
      }
    }
  });
  function getTitlefromURL(url_result) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url_result, true);
    xhr.onreadystatechange = function () {
      $("#bookmark_title").attr({
        disabled: false,
        placeholder: "Įrašikite pavadinimą",
      });
      if (xhr.readyState == 4 && xhr.responseText) {
        if (xhr.responseText.indexOf("<title>") != -1) {
          var title = /<title>(.*?)<\/title>/m.exec(xhr.responseText)[1];
          addTitletoDom(title);
        }
      }
    };
    xhr.send(null);
  }
  function addTitletoDom(title) {
    if ($("#bookmark_title").val() === "" && $("#bookmark_url").val() !== "") {
      $("#bookmark_title").val(title);
    }
  }
  const newCardTemplate = ({ card_title, card_id, websites, starred }) => `
  <div
  class="js__bookmark_card relative bg-white shadow-md h-30 rounded-lg ${
    $("body").hasClass("dark") ? "dark5" : ""
  } ${
    starred ? "starred border-t-4 border-purple-500" : ""
  }" data-card="${card_id}" data-star="${starred}">
  <div class="overflow__block  p-5  h-30 overflow-y-auto scrollbar-w-2 scrollbar-track-gray-lighter scrollbar-thumb-rounded scrollbar-thumb-gray scrolling-touch">
  <div class="header flex relative grabbable items-center mb-3 ">
  <span class="draggable-svg absolute text-gray-400 z-10 grabbable"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="17" viewBox="0 0 6 17" fill="none">
  <circle cx="1" cy="1" r="1" fill="currentcolor"/>
  <circle cx="1" cy="6" r="1" fill="currentcolor"/>
  <circle cx="1" cy="11" r="1" fill="currentcolor"/>
  <circle cx="1" cy="16" r="1" fill="currentcolor"/>
  <circle cx="5" cy="1" r="1" fill="currentcolor"/>
  <circle cx="5" cy="6" r="1" fill="currentcolor"/>
  <circle cx="5" cy="11" r="1" fill="currentcolor"/>
  <circle cx="5" cy="16" r="1" fill="currentcolor"/>
  </svg></span>
  <input type="text" class="hidden js__card_title_input px-5 py-1 text-lg tracking-wide text-gray-700 placeholder-gray-400 text-gray-700 relative bg-white rounded text-sm shadow ${
    $("body").hasClass("dark") ? "dark2" : ""
  } outline-none focus:outline-none focus:shadow-outline w-60  mr-auto" placeholder="Įrašykite kortelės pavadinimą" name="card_title" value="${card_title}">
  <p class="px-5 py-1 cursor-pointer text-gray-500 js__card_title_text text-lg tracking-wide mr-auto truncate w-64" title="Redaguoti">${card_title}</p>
  <div class="card__actions flex">
  <a href="#!" class="modal-open js__add_bookmark my-1 block w-6 h-6 p-1 bg-purple-700 shadow-sm rounded-full overflow-hidden text-white" title="Pridėti naują puslapį">
  <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg> </span></a>
  <div class="relative">
  <a href="#!" class="js__card_settings ml-2 my-1 block w-6 h-6  shadow-sm rounded-full overflow-hidden text-gray-400 hover:text-purple-700" title="Kortelės nustatymai">
  <span><svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
  </span>
  </a>
  <div class="js__card_menu hidden absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl ${
    $("body").hasClass("dark") ? "dark2" : ""
  }">
      <a href="#" class="js__star_card block px-4 py-2 text-gray-400 hover:bg-purple-700 hover:text-white">
       <span class="hook_star ${
         starred ? "hidden" : ""
       }"><svg class="inline text-gray-400 fill-current w-4 h-4 -mt-1 mr-2" fill="currentColor" viewbox="0 0 19.61 18.85">
       <path
         d="M14.54 18.85a3.71 3.71 0 01-1.72-.48l-3-1.58-3 1.58a3.74 3.74 0 01-1.72.48 2 2 0 01-1.61-.71A3 3 0 013 15.6l.58-3.36-2.47-2.38C-.16 8.62-.07 7.57.1 7.05s.71-1.42 2.46-1.68l3.38-.49 1.5-3C8.23.24 9.26 0 9.8 0s1.58.24 2.36 1.83l1.51 3.05 3.33.49c1.76.26 2.3 1.16 2.47 1.68s.26 1.57-1 2.81l-2.44 2.38.58 3.36a3 3 0 01-.49 2.54 2.06 2.06 0 01-1.58.71zM9.8 15.18a.73.73 0 01.35.09L13.52 17a2.27 2.27 0 001 .3.56.56 0 00.46-.17 1.75 1.75 0 00.15-1.32l-.64-3.75a.76.76 0 01.21-.66l2.73-2.66c.48-.47.72-1 .63-1.26s-.56-.48-1.23-.61l-3.77-.55a.78.78 0 01-.57-.41l-1.68-3.42c-.3-.6-.69-1-1-1s-.7.38-1 1l-1.7 3.42a.76.76 0 01-.57.41l-3.76.55c-.67.09-1.15.34-1.25.65s.14.79.63 1.26l2.72 2.66a.74.74 0 01.22.66l-.64 3.75a1.7 1.7 0 00.15 1.32.56.56 0 00.46.17 2.21 2.21 0 001-.3l3.37-1.77a.73.73 0 01.36-.09z"
       ></path>
     </svg>
       Žymėti šią kortelę</span>
       <span class="hook_unstar ${!starred ? "hidden" : ""}">
       <svg class="inline text-gray-400 fill-current w-4 h-4 -mt-1 mr-2" fill="currentColor" viewbox="0 0 19.61 18.85">
                  <path
                    d="M14.54 18.85a3.71 3.71 0 01-1.72-.48l-3-1.58-3 1.58a3.74 3.74 0 01-1.72.48 2 2 0 01-1.61-.71A3 3 0 013 15.6l.58-3.36-2.47-2.38C-.16 8.62-.07 7.57.1 7.05s.71-1.42 2.46-1.68l3.38-.49 1.5-3C8.23.24 9.26 0 9.8 0s1.58.24 2.36 1.83l1.51 3.05 3.33.49c1.76.26 2.3 1.16 2.47 1.68s.26 1.57-1 2.81l-2.44 2.38.58 3.36a3 3 0 01-.49 2.54 2.06 2.06 0 01-1.58.71zM9.8 15.18a.73.73 0 01.35.09L13.52 17a2.27 2.27 0 001 .3.56.56 0 00.46-.17 1.75 1.75 0 00.15-1.32l-.64-3.75a.76.76 0 01.21-.66l2.73-2.66c.48-.47.72-1 .63-1.26s-.56-.48-1.23-.61l-3.77-.55a.78.78 0 01-.57-.41l-1.68-3.42c-.3-.6-.69-1-1-1s-.7.38-1 1l-1.7 3.42a.76.76 0 01-.57.41l-3.76.55c-.67.09-1.15.34-1.25.65s.14.79.63 1.26l2.72 2.66a.74.74 0 01.22.66l-.64 3.75a1.7 1.7 0 00.15 1.32.56.56 0 00.46.17 2.21 2.21 0 001-.3l3.37-1.77a.73.73 0 01.36-.09z"
                  ></path>
                </svg>
       Atžymėti šią kortelę</span> 
       </a>
      <a href="#" class="js__rename_card block px-4 py-2 text-gray-400 hover:bg-purple-700 hover:text-white"><span><svg class="inline text-gray-400 fill-current w-4 h-4 -mt-1 mr-2" fill="currentColor" viewbox="0 0 19.61 19.61">
      <path
      d="M15.08 19.61H4.53A4.53 4.53 0 010 15.08V4.53A4.53 4.53 0 014.53 0h6a.76.76 0 010 1.51h-6a3 3 0 00-3 3v10.57a3 3 0 003 3h10.55a3 3 0 003-3v-6a.76.76 0 011.51 0v6a4.53 4.53 0 01-4.51 4.53z"
      ></path>
      <path
      d="M17.24 7.39a.75.75 0 01-.54-.22l-4.26-4.26a.75.75 0 010-1.07.74.74 0 011.06 0l4.27 4.26a.77.77 0 010 1.07.74.74 0 01-.53.22z"
      ></path>
      <path
      d="M17.24 7.39a.75.75 0 01-.54-.22.77.77 0 010-1.07L17.77 5a1.13 1.13 0 000-1.6l-1.6-1.6a1.13 1.13 0 00-1.6 0L13.5 2.91a.75.75 0 11-1.06-1.07L13.5.77a2.65 2.65 0 013.74 0l1.6 1.6a2.66 2.66 0 010 3.73l-1.07 1.07a.74.74 0 01-.53.22zM10 14.59H5.77a.75.75 0 01-.77-.76V9.57A.75.75 0 015.24 9l5.06-5a.77.77 0 011.07 0 .75.75 0 010 1.07L6.53 9.88v3.2h3.2l4.84-4.84a.75.75 0 111.07 1.06l-5.07 5.07a.75.75 0 01-.57.22z"
      ></path>
    </svg> </span>Pervadinti kortelę</a>
      <a href="#" class="js__delete_card block px-4 py-2 text-gray-400 hover:bg-purple-700 hover:text-white"><span><svg class="inline text-gray-400 fill-current w-4 h-4 -mt-1 mr-2" fill="currentColor" viewbox="0 0 16.59 19.61">
      <path
      d="M5.28 15.84a.76.76 0 01-.76-.76V8.29a.76.76 0 01.76-.75.75.75 0 01.72.75v6.79a.75.75 0 01-.72.76zM8.3 15.84a.76.76 0 01-.76-.76V8.29a.76.76 0 011.51 0v6.79a.76.76 0 01-.75.76zM11.31 15.84a.75.75 0 01-.75-.76V8.29a.75.75 0 01.75-.75.76.76 0 01.76.75v6.79a.76.76 0 01-.76.76zM15.84 4.53H.75A.76.76 0 010 3.77.75.75 0 01.75 3h15.09a.75.75 0 01.75.75.76.76 0 01-.75.78z"
      ></path>
      <path
      d="M11.31 4.53h-6a.76.76 0 01-.76-.76v-3A.76.76 0 015.28 0h6a.76.76 0 01.76.75v3a.76.76 0 01-.73.78zM6 3h4.53V1.51H6zM12.44 19.61H4.15A2.64 2.64 0 011.51 17V6.79a.76.76 0 111.49 0V17a1.13 1.13 0 001.15 1.1h8.29a1.13 1.13 0 001.13-1.1V6.79a.76.76 0 111.51 0V17a2.64 2.64 0 01-2.64 2.61z"
      ></path>
    </svg><span style="padding-left: 3.3px;">Ištrinti kortelę</span></span></a>
    </div>
    </div>
    </div>
  </div>
  <div class="content js_content">
  ${websites}
  </div>
  </div>
</div>
`;
  const bookmarklist = ({
    bookmarks_id,
    bookmarks_title,
    bookmarks_url,
    bookmarks_desc,
  }) => `
<div class="item flex flex-row align-middle items-middle items-center ${
    $("body").hasClass("dark") ? "hover:bg-dark" : "hover:bg-gray-100"
  } py-1 -mx-5 px-5"
data-id="${bookmarks_id}">
<div
    class="w-5 h-5 pt-05 grabbable"> 
    <picture>
<!-- 
  <source srcset="chrome://favicon2/?page_url=${
    new URL(bookmarks_url).origin
  }" alt=""> -->
  <img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${
    new URL(bookmarks_url).origin
  }" alt="">  
  </picture>  
</div>
<a href="${bookmarks_url}" class="js--bookmarks__title flex-1 text-sm ml-3 h-5 leading-snug mr-auto truncate"
    title="${bookmarks_desc}"> <span class="title">${bookmarks_title} </span>  <span class="link text-sm ${
    $("body").hasClass("dark") ? "text-white" : "text-purple-700"
  } hidden">
    ${bookmarks_url} </span>  <span class="bookmark__desc hidden">${bookmarks_desc}</span> </a>
<div class="remove w-5 h-5-"><a href="#!">
        <svg class="text-gray-400" fill="none" stroke-linecap="round"
            stroke-linejoin="round" stroke-width="2" stroke="currentColor"
            viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </a></div> 
</div>
`;
  function setUnsavedChanges() {
    chrome.storage.local.get("settings", function (storage) {
      const settings = storage.settings;
      for (let key in settings) {
        if (settings.hasOwnProperty(key)) {
          settings[key].unsaved_changes = true;
        }
      }
      chrome.storage.local.set({ settings }, function () {});
    });
  }
  var carddb = "sites";
  var cardarray = new Array();
  chrome.storage.local.get(carddb, function (storage) {
    if (carddb in storage) {
      cardarray = storage[carddb];
    } else {
      storage = {};
      storage[carddb] = [];
      chrome.topSites.get((arr) => {
        var newCat = {
          label: "Dažniausiai lankomi",
          starred: false,
          id: 1,
          cid: randHex(24),
          date: new Date().getTime(),
          websites: {},
        };
        storage[carddb].push(newCat);
        var topbook = storage[carddb];
        var newwebsites = new Array();
        for (var i = 0; i < arr.length; i++) {
          var newItem = {
            title: arr[i].title,
            id: randHex(24),
            date: new Date().getTime(),
            url: arr[i].url,
            desc: "",
          };
          newwebsites.push(newItem);
        }
        for (let key in topbook) {
          if (topbook.hasOwnProperty(key)) {
            if (1 === topbook[key].id) {
              topbook[key].websites = newwebsites;
              break;
            }
          }
        }
        chrome.storage.local.set(
          storage,
          function () {
            for (var i = 0; i < topbook.length; i++) {
              addSiteCards(topbook[i]);
            }
            setUnsavedChanges();
          }.bind(this)
        );
      });
    }
    for (var i = 0; i < cardarray.length; i++) {
      addSiteCards(cardarray[i]);
    }
  });
  function addSiteCards(cardarray) {
    var websitelist = addSiteLists(cardarray.websites);
    $("#bookmark_cards").append(
      [
        {
          card_title: cardarray.label,
          card_id: cardarray.cid,
          starred: cardarray.starred,
          websites: websitelist,
        },
      ]
        .map(newCardTemplate)
        .join("")
    );
  }
  function addSiteLists(websites) {
    var websitelist = "";
    for (var i = 0; i < websites.length; i++) {
      websitelist =
        [
          {
            bookmarks_id: websites[i].id,
            bookmarks_title: websites[i].title,
            bookmarks_url: websites[i].url,
            bookmarks_desc: websites[i].desc,
          },
        ]
          .map(bookmarklist)
          .join("") + websitelist;
    }
    return websitelist;
  }
  $("#bookmark_cards").on("mouseenter", ".js--bookmarks__title", function (e) {
    $("span.title", this).addClass("hidden");
    $("span.link", this).removeClass("hidden");
  });
  $("#bookmark_cards").on("mouseleave", ".js--bookmarks__title", function (e) {
    $("span.link", this).addClass("hidden");
    $("span.title", this).removeClass("hidden");
  });
  $("#bookmark_cards").on("click", ".remove", function () {
    var chosenID = $(this).closest(".item").data("id");
    var catID = $(this).closest(".js__bookmark_card").data("card");
    removeItem(chosenID, catID);
    $(this).closest(".item").remove();
  });
  function removeItem(chosenID, catID) {
    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];
      for (let key in siteList) {
        if (siteList.hasOwnProperty(key)) {
          if (catID === siteList[key].cid) {
            if (siteList[key].websites) {
              var NewsiteList = $.grep(siteList[key].websites, function (e) {
                return e.id != chosenID;
              });
              siteList[key].websites = NewsiteList;
            }
            break;
          }
        }
      }
      chrome.storage.local.set({ [carddb]: siteList }, function () {
        setUnsavedChanges();
      });
    });
  }
  $("#addBookmarkform").on("submit", function (e) {
    e.preventDefault();
    var title = $("#bookmark_title").val();
    var getURL = $("#bookmark_url").val();
    var desc = $("#bookmark_desc").val();
    var catID = $("#category_id").val();
    if (getURL != "" && title != "") {
      e.preventDefault();
      var newItem = {
        date: new Date().getTime(),
        id: randHex(24),
        title: title.trim(),
        url: getURL,
        desc: desc,
      };
      chrome.storage.local.get([carddb], function (storage) {
        var siteList = storage[carddb];
        for (let key in siteList) {
          if (siteList.hasOwnProperty(key)) {
            if (catID === siteList[key].cid) {
              if (siteList[key].websites) {
                siteList[key].websites.push(newItem);
              }
              break;
            }
          }
        }
        $("#addBookmarkform")[0].reset();
        toggleModal();
        $('.js__bookmark_card[data-card="' + catID + '"] .content').prepend(
          [
            {
              bookmarks_id: newItem.id,
              bookmarks_title: newItem.title,
              bookmarks_url: newItem.url,
              bookmarks_desc: newItem.desc,
            },
          ]
            .map(bookmarklist)
            .join("")
        );
        chrome.storage.local.set({ [carddb]: siteList }, function () {
          setUnsavedChanges();
        });
      });
    } else {
      alert("Užpildykite visus privalomus laukus");
    }
  });
  $("#addNewBookmarkUI").click(function (e) {
    e.preventDefault();

    chrome.storage.local.get([carddb], function (storage) {
      var newCat = {
        label: "Kortelė be pavadinimo",
        starred: false,
        id: 1,
        cid: randHex(24),
        date: new Date().getTime(),
        websites: [],
      };
      storage[carddb].unshift(newCat);
      $("#addNewBookmarkUI").after(
        [
          {
            card_title: newCat.label,
            card_id: newCat.cid,
            websites: newCat.websites,
          },
        ]
          .map(newCardTemplate)
          .join("")
      );
      chrome.storage.local.set(
        storage,
        function () {
          setUnsavedChanges();
        }.bind(this)
      );
      var $recentcard = $("#bookmark_cards").find(
        '.js__bookmark_card[data-card="' + newCat.cid + '"]'
      );
      $recentcard.find(".js__card_title_text").addClass("hidden");
      $recentcard
        .find(".js__card_title_input")
        .removeClass("hidden")
        .focus()
        .select();
    });
  });
  async function getClipboardContents() {
    try {
      const clipboardData = await navigator.clipboard.readText();
      if (validURL(clipboardData)) {
        $("#bookmark_url").val(clipboardData);
        $("#bookmark_title").attr({
          disabled: true,
          placeholder: "Gaunamas pavadinimas... Prašome luktelti.",
        });
        getTitlefromURL(clipboardData);
        $("#bookmark_title").focus();
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }
  function toggleModal() {
    const body = document.querySelector("body");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("opacity-0");
    modal.classList.toggle("pointer-events-none");
    body.classList.toggle("modal-active");
    $("#addBookmarkform").toggleClass("hidden");
    $("#dynamicModalTitle").text("Pridėti naują puslapį");
    if (body.classList.contains("modal-active")) getClipboardContents();
  }
  $(document).on("click", ".js__add_bookmark", function (e) {
    e.preventDefault();
    var catID = $(this).closest(".js__bookmark_card").data("card");
    $("#addBookmarkform #category_id").val(catID);
    toggleModal();
  });
  $("#bookmark_cards").on("click", ".js__card_settings", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(".js__card_menu").not($(this).next(".js__card_menu")).addClass("hidden");
    $(this).next(".js__card_menu").toggleClass("hidden");
  });
  $(document).on("click", function (e) {
    $(".js__card_menu").addClass("hidden");
  });
  $("#bookmark_cards").on("click", ".js__delete_card", function (e) {
    var $this = $(this).closest(".js__bookmark_card");
    var cardid = $($this).data("card");
    var totalsites = $(".item", $this).length;
    if (
      confirm(
        "Ar jūs tikrai norite ištrinti šią kortelę?\nKortelėje yra " +
          totalsites +
          " puslapių.\nIštrynus kortelę, jos atkurti nebegalėsite."
      )
    ) {
      removeCards(cardid);
    }
  });
  function removeCards(cardid) {
    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];
      var siteList = $.grep(siteList, function (e) {
        if (e != null) return e.cid != cardid;
      });
      chrome.storage.local.set({ [carddb]: siteList }, function () {
        $('.js__bookmark_card[data-card="' + cardid + '"]').remove();
        setUnsavedChanges();
      });
    });
  }
  $("#bookmark_cards").on("click", ".js__rename_card", function (e) {
    var $closestcard = $(this).closest(".js__bookmark_card");
    $closestcard.find(".js__card_title_text").addClass("hidden");
    $closestcard.find(".js__card_title_input").removeClass("hidden").focus();
  });
  $("#bookmark_cards").on("click", ".js__card_title_text", function (e) {
    var $closestcard = $(this).closest(".js__bookmark_card");
    $closestcard.find(".js__card_title_text").addClass("hidden");
    $closestcard.find(".js__card_title_input").removeClass("hidden").focus();
  });
  $("#bookmark_cards").on("keypress", ".js__card_title_input", function (e) {
    var cardtitle = $(this).val();
    var curcardval = $(this).next(".js__card_title_text").text();
    var catid = $(this).closest(".js__bookmark_card").data("card");
    if (e.which == 13 && cardtitle !== "") {
      e.preventDefault();
      if (curcardval !== cardtitle) {
        changeCardTitle(cardtitle, catid);
      }
      $(this).addClass("hidden");
      $(this)
        .next(".js__card_title_text")
        .text(cardtitle)
        .removeClass("hidden");
    }
  });
  $("#bookmark_cards").on("blur", ".js__card_title_input", function (e) {
    var cardtitle = $(this).val();
    var curcardval = $(this).next(".js__card_title_text").text();
    var catid = $(this).closest(".js__bookmark_card").data("card");
    if (curcardval !== cardtitle) {
      changeCardTitle(cardtitle, catid);
    }
    $(this).addClass("hidden");
    $(this).next(".js__card_title_text").text(cardtitle).removeClass("hidden");
  });
  function changeCardTitle(cardtitle, catid) {
    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];
      for (let key in siteList) {
        if (siteList.hasOwnProperty(key)) {
          if (catid === siteList[key].cid) {
            if (cardtitle === siteList[key].label) {
            } else {
              siteList[key].label = cardtitle;
            }
            break;
          }
        }
      }
      chrome.storage.local.set({ [carddb]: siteList }, function () {
        setUnsavedChanges();
      });
    });
  }
  $("#bookmark_cards").on("click", ".js__star_card", function (e) {
    e.preventDefault();
    var $closestcard = $(this).closest(".js__bookmark_card");
    var starred = $closestcard.attr("data-star");
    var catid = $closestcard.data("card");
    starredCard(starred, catid);
    if (starred !== "false") {
      $(this).find("span").addClass("hidden");
      $(this).find(".hook_star").removeClass("hidden");
      $closestcard.removeClass("starred border-t-4 border-purple-500");
      $closestcard.attr("data-star", false);
    } else if (starred !== "true") {
      $(this).find("span").addClass("hidden");
      $(this).find(".hook_unstar").removeClass("hidden");
      $closestcard.addClass("starred border-t-4 border-purple-500");
      $closestcard.attr("data-star", true);
    }
  });
  function starredCard(starred, catid) {
    chrome.storage.local.get([carddb], function (storage) {
      var siteList = storage[carddb];
      for (let key in siteList) {
        if (siteList.hasOwnProperty(key)) {
          if (catid === siteList[key].cid) {
            if (siteList[key].starred === true) {
              siteList[key].starred = false;
            } else {
              siteList[key].starred = true;
            }
            break;
          }
        }
      }
      chrome.storage.local.set({ [carddb]: siteList }, function () {
        setUnsavedChanges();
      });
    });
  }
  function sortSiteCards(newindex, oldindex) {
    chrome.storage.local.get([carddb], function (storage) {
      const originalArray = storage[carddb];
      const event1 = { newIndex: newindex, oldIndex: oldindex };
      var newCardOrder = reorderArray(event1, originalArray);
      chrome.storage.local.set({ [carddb]: newCardOrder }, function () {
        setUnsavedChanges();
      });
    });
  }
  function sortSiteItems(newindex, oldindex, cid) {
    chrome.storage.local.get([carddb], function (storage) {
      const originalArray = storage[carddb];
      const originalCard = originalArray.find((e) => e.cid === cid);
      const originalCardIndex = originalArray.findIndex((e) => e.cid === cid);
      const event1 = { newIndex: newindex, oldIndex: oldindex };
      var newItemOrder = reorderItemArray(
        event1,
        originalCard.websites.reverse()
      );
      var newCardOrder = originalArray;
      newCardOrder[originalCardIndex].websites = newItemOrder.reverse();
      chrome.storage.local.set({ [carddb]: newCardOrder }, function () {
        setUnsavedChanges();
      });
    });
  }
  const reorderArray = (event, originalArray) => {
    const movedItem = originalArray.filter(
      (item, index) => index === event.oldIndex
    );
    const remainingItems = originalArray.filter(
      (item, index) => index !== event.oldIndex
    );
    const reorderedItems = [
      ...remainingItems.slice(0, event.newIndex),
      movedItem[0],
      ...remainingItems.slice(event.newIndex),
    ];
    return reorderedItems;
  };
  const reorderItemArray = (event, originalArray) => {
    const movedItem = originalArray.filter(
      (item, index) => index === event.oldIndex + 1
    );
    const remainingItems = originalArray.filter(
      (item, index) => index !== event.oldIndex + 1
    );
    const reorderedItems = [
      ...remainingItems.slice(0, event.newIndex + 1),
      movedItem[0],
      ...remainingItems.slice(event.newIndex + 1),
    ];
    return reorderedItems;
  };
  var el = document.getElementById("bookmark_cards");
  Sortable.create(el, {
    draggable: ".js__bookmark_card",
    filter: ".card__actions, .js__card_title_input",
    preventOnFilter: false,
    animation: 150,
    ghostClass: $("body").hasClass("dark")
      ? "card__is__dragging_dark"
      : "card__is__dragging",
    forceFallback: true,
    onEnd: function (evt) {
      var newIndex = evt.newIndex - 1;
      var oldIndex = evt.oldIndex - 1;
      sortSiteCards(newIndex, oldIndex);
    },
  });
  setTimeout(() => {
    var child = document.getElementsByClassName("js_content");
    for (var i = 0; i < child.length; i++) {
      new Sortable(child[i], {
        group: {
          name: "shared",
          pull: true,
        },
        ghostClass: $("body").hasClass("dark")
          ? "site__is__dragging_dark"
          : "site__is__dragging",
        animation: 150,
        forceFallback: true,
        fallbackClass: "clone_card",
        onStart: function (evt) {
          $(".js_content").addClass("disable__hover");
        },
        onEnd: function (evt) {
          $(".js_content").removeClass("disable__hover");
          var newIndex = evt.newIndex - 1;
          var oldIndex = evt.oldIndex - 1;
          sortSiteItems(
            newIndex,
            oldIndex,
            evt.srcElement.parentNode.parentNode.dataset.card
          );
        },
      });
    }
  }, 100);
  $("#filter__site_cards button").on("click", function () {
    if ($(this).is("#filter__by_starred")) {
      $(".js__bookmark_card:not(.starred)").addClass("hidden");
      if ($("body").hasClass("dark")) {
        $("#filter__site_cards button").removeClass("toggle__active_dark");
        $(this).addClass("toggle__active_dark");
      } else {
        $("#filter__site_cards button").removeClass("toggle__active");
        $(this).addClass("toggle__active");
      }
    } else {
      $(".js__bookmark_card").removeClass("hidden");
      if ($("body").hasClass("dark")) {
        $("#filter__site_cards button").removeClass("toggle__active_dark");
        $(this).addClass("toggle__active_dark");
      } else {
        $("#filter__site_cards button").removeClass("toggle__active");
        $(this).addClass("toggle__active");
      }
    }
  });
  $("#search").autocomplete({
    source: async function (request, response) {
      const suggest = async () =>
        $.getJSON(
          `http://suggestqueries.google.com/complete/search?output=firefox&hl=lt&q=${request.term}`
        );
      suggest().then((data) => {
        var suggestions = [];
        $.each(data[1], function (key, val) {
          suggestions.push({ value: val });
        });
        suggestions.length = 5;
        response(suggestions);
      });
    },
  });
})();
