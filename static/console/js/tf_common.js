/**
 [Key]: public_subnet_ids
 [Value]: [\"subnet-036865a604afa2805\", \"subnet-02fc2e1cec5b346a8\"]
 **/
function convertToList(value) {
    let res = [];
    const arr = value.split(',');
    arr.forEach(function (item) {
        res.push('\\"' + item.trim() + '\\"');
    });
    return res;
}

/**
 [Key]: default_tags
 [Value]: {\"Project\":\"terraform-web\",\"System\":\"terraform-demo-system\",\"Environment\":\"dev\"}
 **/
function generateTags() {
    let res = {};
    $("#tags-container .tag-container").each(function () {
        // console.log("Key: " + $(this).find(".tag-key").val() + ", Value: " + $(this).find(".tag-val").val());
        if ($(this).find(".tag-key").val()) {
            res['\\"' + $(this).find(".tag-key").val().trim() + '\\"'] = '\\"' + $(this).find(".tag-val").val().trim() + '\\"';
        }
    });
    return res;
}

$(document)
    .ajaxStart(function () {
        $("#overlay").fadeIn(300);
    })
    .ajaxStop(function () {
        $("#resultMessage").focus();
        $("#resultMessage").scrollTop($("textarea")[0].scrollHeight);
        $("html, body").animate({scrollTop: $("body").height()}, 800);
        $("#overlay").fadeOut(300);
    });