$(function () {
  let target;
  $(".tab-a a").on("click", function () {
    $(".tab-a a").removeClass("on");
    $(this).addClass("on");

    $(".urlList li:not(.head)").remove();

    if ($(this).index() == 0) {
      target = markupPcList;
    }
    let pageCnt = 0;
    target.forEach((a, i) => {
      let depth1 = Object.keys(a);
      let obj = a[depth1];
      let str = "";
      str += `<li>`;
      str += `<ul class="sub${depth1[0] == "공통" ? " guide" : ""}">`;
      obj.forEach((a, i) => {
        if (depth1[0] !== "공통") {
          pageCnt++;
        }
        str += `<li class="${a.state ? a.state : ""}">`;
        str += `<div class="depth_1">${i == 0 ? depth1 : ""}</div>`;
        str += `<div class="depth_2">${a.depth2 ? a.depth2 : ""}</div>`;
        str += `<div class="depth_3">${a.depth3 ? a.depth3 : ""}</div>`;
        str += `<div class="info">${a.info ? a.info : ""}</div>`;
        // str += `<div class="fileName"><a href="../html/${a.src.split("?")[0]}.html${a.src.split("?")[1] ? `?` + a.src.split("?")[1] : ""}" target="_blank" >${a.src.split("?")[0]}</a></div>`;
        str += `<div class="fileName"><a href="${a.src === "main" ? "main.html" : `html/${a.src.split("?")[0]}.html${a.src.split("?")[1] ? `?` + a.src.split("?")[1] : ""}`}" target="_blank">${a.src.split("?")[0]}</a></div>`;
        str += `</li>`;
      });
      str += `</ul>`;
      str += `</li>`;
      $(".urlList").append(str);
    });
    $("#totalCnt").html(pageCnt);
    $("#endCnt").html($(".sub:not(.guide) .end").length);
    $("#endCntP").html((($(".sub:not(.guide) .end").length / pageCnt) * 100).toFixed(1));
    $("#depth1Cnt").text(markupPcList.length - 1); //공통 제외
    $(".sub").each(function (i) {
      if ($(this).find("li").length == $(this).find(".end").length) $(this).parent().addClass("allEnd");
    });
  });

  $(".tab-a a").eq(0).click();
});
