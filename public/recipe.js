"use strict";

$(function () {
  $("#post").click((e) => {
    console.log("post running");
    e.preventDefault();
    let data = $(".note-area").val();
    //getting star rating value
    let rating;
    let starValue = $("input[type = 'radio']");
    for (let i = 0; i < starValue.length; i++) {
      if (starValue[i].checked) {
        rating = starValue[i].value;
      }
    }
    //getting :id from /recipe/:id
    let recipeid = window.location.pathname.slice(8);

    $.ajax({
      type: "POST",
      url: `/recipe/${recipeid}`,
      dataType: "text",
      data: { note: data, rating: rating },
      // data: { note: data, title: title, rating: rating },
      success: function () {
        console.log("post success");
      },
    })();
    //   .done
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 200)
  });
  $(".edit-btn").click((e) => {
    e.preventDefault();
    $(".edit-myreview").removeClass("hidden");
    $(".my-review").addClass("hidden");
    console.log("edit running");
  });

  $(".cancel-btn").click((e) => {
    e.preventDefault();
    $(".edit-myreview").addClass("hidden");
    $(".my-review").removeClass("hidden");
  });

  $(".save-btn").click((e) => {
    e.preventDefault();
    console.log(rating);
    let rating = $(".edit-rating").val();
    let data = $(".edit-area").val();
    let recipeid = window.location.pathname.slice(8);

    $.ajax({
      type: "PUT",
      url: `/recipe/${recipeid}`,
      dataType: "text",
      data: { note: data, rating: rating },
      success: function () {
        console.log("put success");
      },
    }).done(
      setTimeout(() => {
        window.location.reload();
      }, 200)
    );
  });
  // Delete Review
  $(".del-btn").click((e) => {
    e.preventDefault();
    console.log("delete button");
    let recipeid = window.location.pathname.slice(8);

    $.ajax({
      type: "DELETE",
      url: `/recipe/${recipeid}`,
      success: function () {
        console.log("delete success");
      },
    }).done(
      setTimeout(() => {
        window.location.reload();
      }, 200)
    );
  });
});
