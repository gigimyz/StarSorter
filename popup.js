var ROOT_TABS;

$().ready(function() {
    'use strict';

    showSearchIcon();
    showToolsBar();

    printBookmarks([sortableList]);

    $("#sort").click(function(e) {
        previewFunction(sort);
    });


    $("#search_header").hover(function(e) {
        $("#search_header").fadeTo("fast", 0.5);
    }, function(e) {
    $("#search_header").fadeTo("fast", 1);

    $("#crop").click(function(e) {
        previewFunction(crop);
    });

    $("#learn").click(function(e) {
        window.open("https://github.com/koolzz/bookmark-beautifier", "_blank");
    });

    $("#search").click(function(e) {
        $("#search").select();
    });

    $('#new_folder').click(function(e) {
        showNewFolderBar();
    });

    $("#reject_folder").click(function() {
        $("#create_new_folder").val('');
        showToolsBar();
    });

    $('#trash').click(function(e) {
        var list = $(".selectedLink"),
            link_count = 0,
            group_count = 0;
        list.each(function(index, value) {
            if ($(value).hasClass("bFolder")) {
                link_count += $(value).parent('li').first().find('.bLink').length;
                group_count += $(value).parent('li').first().find('.bFolder').length;;
            } else
                link_count++;
        });
        var r = confirm("Delete " + link_count + " bookmarks and " + group_count + " folders ?");

        if (r === true) {
            $(list).each(function(key, bookmark) {
                var obj;
                if ($(bookmark).hasClass("bFolder")) {
                    deleteFolder(bookmark.text, null, false);
                    obj = $(bookmark).parent('li').first();
                } else {
                    deleteFolder(bookmark.children[0].text, bookmark.children[0].href, false);
                    obj = $(bookmark);
                }

                $(obj).slideUp(300, function() {
                    $(obj).remove();
                });
            });
        }
        hideTrashIcon();
    });

    $("#create_new_folder").keyup(function(e) {
        if (e.which == 13) {
            if ($(this).val().trim().length != 0) {
                addNewFolder($(this).val().trim());
                $("#create_new_folder").val('');
            }
            showToolsBar();
        }

        $("#apply_folder").click(function() {
            if ($("#create_new_folder").val().trim().length != 0) {
                addNewFolder($("#create_new_folder").val().trim());
                $("#create_new_folder").val('');
            }
            showToolsBar();
        });

    });

    $("#search").keyup(function() {
        if ($("#sort").hasClass("disabled"))
            return;
        $('#resetSearch').click(function(event) {
            if ($(event.target).closest("#search, #tools, #desision").length) return;
            printBookmarks([sortableList]);
            showSearchIcon();
            $('#resetSearch').unbind("click");
            $("#search").val('');
            event.stopPropagation();
        });
        if ($(this).val().trim().length === 0) {
            $("#search").val('');
            showSearchIcon();
            printBookmarks([sortableList]);
        } else {
            showResetSearch();
            searchBookmark($(this).val().trim());
        }
    });
    var timeout = null,
        openLink = null,
        clicks = 0,
        openLinkDelay = 300,
        editLinkdelay = 200;
    $("#bookmarks").on('click', '.bLink, .bFolder', function selectFunction(e) {
        e.preventDefault();
        var li = $(e.currentTarget);

        if (li.find(".editSelectedVal").length > 0 || li.hasClass("root_folder")) {
            $(".selectedLink").removeClass("selectedLink");
            return;
        }

        clicks++;
        if (clicks === 1) {
            showTrashIcon();
            if (li.hasClass("selectedLink")) {
                /* Click on already selected target
                 *
                 * If pressing ctrl
                 *   Check for ctrl press, deselect on repeated click when in ctrl mode
                 *
                 * Else
                 *   open link after delay
                 *   delay is used to distingwish between doubleclick for editing title
                 */
                if (window.event.ctrlKey) {
                    li.removeClass("selectedLink");
                    if ($(".selectedLink").length == 0) {
                        hideTrashIcon();
                    }
                    clicks = 0;
                } else {
                    if ($(".selectedLink").length > 1) {
                        $(".selectedLink").removeClass("selectedLink");
                        li.addClass("selectedLink");
                        timeout = setTimeout(function() {
                            clicks = 0;
                        }, editLinkdelay);
                        return;
                    } else {
                        if (li.hasClass("bFolder"))
                            return;
                        openLink = setTimeout(function() {
                            window.open($(li)[0].children[0].href, "_blank");
                        }, openLinkDelay);
                    }
                }
            } else {
                /* Click on non selected link
                 *
                 * If pressing ctrl
                 *   select link
                 *
                 * Else
                 *   deselect all selected links, select clicked one
                 */
                clearTimeout(openLink);
                if (window.event.ctrlKey) {
                    clicks = 0;
                } else {
                    timeout = setTimeout(function() {
                        clicks = 0;
                    }, editLinkdelay);
                    $(".selectedLink").removeClass("selectedLink");
                }
                li.addClass("selectedLink");
            }
        } else {
            /* Double click detected
             *
             * Clear timeouts to avoid openning links
             *
             * If link is not selected or in ctrl mode don't enter edit mode
             */
            clearTimeout(openLink);
            clearTimeout(timeout);
            if (!li.hasClass("selectedLink")) {
                if (!window.event.ctrlKey) {
                    timeout = setTimeout(function() {
                        clicks = 0;
                    }, editLinkdelay);
                    $(".selectedLink").removeClass("selectedLink");
                }
                li.addClass("selectedLink");
                return;
            } else {
                clicks = 0;
            }
            if (window.event.ctrlKey)
                return;

            if ($('#bookmarks').find('.editSelectedVal').length != 0)
                return;

            if (li.hasClass("bFolder")) {
                li.removeClass("selectedLink");
                var target = li;
                var oldVal = li[0].text;
                updateVal(li[0], oldVal, null);
            } else {
                li.removeClass("selectedLink");
                var target = li;
                var oldVal = li.children()[0].text;
                var url = li.children()[0].href;
                updateVal(li[0], oldVal, url);
            }
        }
    });

    $("#bookmarks").on('dblclick', '.bLink', function(e) {
        e.preventDefault();
    });
});


            onEnd: function( /**Event*/ evt) {
                setTimeout(function() {
                $(".showspace").removeClass("showspace");
                    $(".unusedPlaceHolder").animate({
                        height: '-=35px'
                    }, 250, function() {
                        $(".unusedPlaceHolder").remove();
                    });
                }, 25);
                
            },
            onUpdate: function(evt) {
                var item = evt.item;
                var href = $(item).children('a').href;
                var title = $(item).children('a').text();
                var index = evt.newIndex < evt.oldIndex ? evt.newIndex : evt.newIndex + 1;
                var parentTitle = $(item).parent('ul').siblings('a').text().trim();
                $(".showspace").removeClass("showspace");
                $(".unusedPlaceHolder").animate({
                    height: '-=35px'
                }, 250, function() {
                    $(".unusedPlaceHolder").remove();
                    chrome.bookmarks.search({
                        'title': title
                    }, function(result) {
                        var folder = result[0];
                        chrome.bookmarks.move(folder.id, {
                            'parentId': folder.parentId,
                            'index': index
                        }, function() {
                            /*
                             printBookmarks([sortableList, function() {
                                 showFolder(parentTitle);
                             }]);
                            */
                            var depth = $(item).parents("ul").length - 1,
                                    padding = 20;
                            $(item).children('a').css('padding-left', depth * padding + 13);
                        });
                    });
                });
            },
            onAdd: function(evt) {
                var item = evt.item;
                var old = evt.from;
                var oldParentTitle = $(evt.from).siblings('a').text().trim();
                var parentTitle = $(item).parent('ul').siblings('a').text().trim();
                var href = $(item).children('a').href;
                var title = $(item).children('a').text();
                var index = evt.newIndex;
                $(".showspace").removeClass("showspace");
                $(".unusedPlaceHolder").animate({
                    height: '-=35px'
                }, 250, function() {
                    $(".unusedPlaceHolder").remove();
                    chrome.bookmarks.search({
                        'title': parentTitle
                    }, function(PARENT) {
                        var id = parentTitle === "Bookmarks bar" ? '1' : parentTitle === "Other bookmarks" ? '2' : parentTitle === "Mobile bookmarks" ? '3' : PARENT[0].id;
                        chrome.bookmarks.search({
                            'url': href,
                            'title': title
                        }, function(result) {
                            var folder = result[0];
                            chrome.bookmarks.move(folder.id, {
                                'parentId': id,
                                'index': index
                            }, function() {
                                /*
                                printBookmarks([sortableList, function() {
                                    showFolder(parentTitle);
                                    showFolder(oldParentTitle);
                                }]);*/
                                var depth = $(item).parents("ul").length - 1,
                                    padding = 20;
                                $(item).children('a').css('padding-left', depth * padding + 13);
                            });
                        });
                    });
                });
            }
        });
    });
}

function deleteEmptyFolder(folder) {
    if (folder) {
        folder.children.forEach(function(bookmark) {
            if (typeof bookmark.url === 'undefined') {
                if (bookmark.children.length != 0) {
                    deleteEmptyFolder(bookmark);
                } else if (bookmark.id > ROOT_TABS) {
                    deleteFolder(bookmark);
                }
            }
        });
    } else {
        chrome.bookmarks.getTree(function(root) {
            root.forEach(function(folder) {
                folder.children.forEach(function(bookmark) {
