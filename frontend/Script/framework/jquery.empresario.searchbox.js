function SearchContent(content) {
    if (content != null && content.length >= 3) {
        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "api/searchbox/search?text=" + content + "&grouped=false",
            type: "get",
            async: false,
            crossDomain: true,
            success: function (response) {
                GetSearchResult(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });

    }
}

function SearchGroupedContent(content) {
    if (content != null && content.length >= 3) {
        $.ajax({
            url: getGlobalParameters("urlPlataforma") + "api/searchbox/search?text=" + content + "&grouped=true",
            type: "get",
            async: false,
            crossDomain: true,
            success: function (response) {
                GetSearchResult(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        });

    }
}

function GetSearchResult(result) {
    alert(result);
}