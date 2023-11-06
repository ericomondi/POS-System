var productPrices = {};

$(function () {
  // Json data by API call for order table
  $.get(productListApiUrl, function (response) {
    productPrices = {};
    if (response && Array.isArray(response)) {
      var options = '<option value="">--Select--</option>';
      response.forEach(function (product) {
        options +=
          '<option value="' +
          product.product_id +
          '">' +
          product.name +
          "</option>";
        productPrices[product.product_id] = parseFloat(product.price_per_unit); // Parse the price as a float
      });
      $(".product-box").find("select").empty().html(options);
    }
  });
});

$("#addMoreButton").click(function () {
  var row = $(".product-box").html();
  $(".product-box-extra").append(row);
  $(".product-box-extra .remove-row").last().removeClass("hideit");
  $(".product-box-extra .product-price").last().text("0.0");
  $(".product-box-extra .product-qty").last().val("1");
  $(".product-box-extra .product-total").last().text("0.0");
});

$(document).on("click", ".remove-row", function () {
  $(this).closest(".row").remove();
  calculateValue();
});

$(document).on("change", ".cart-product", function () {
  var product_id = $(this).val();
  var price = productPrices[product_id];

  $(this).closest(".row").find("#product_price").val(price);
  calculateValue();
});

$(document).on("change", ".product-qty", function (e) {
  calculateValue();
});

$("#saveOrder").on("click", function () {
  var formData = $("form").serializeArray();
  var requestPayload = {
    customer_name: null,
    total: null,
    order_details: [],
  };
  var orderDetails = [];
  for (var i = 0; i < formData.length; ++i) {
    var element = formData[i];
    var lastElement = null;

    switch (element.name) {
      case "customerName":
        requestPayload.customer_name = element.value;
        break;
      case "product_grand_total":
        requestPayload.grand_total = element.value;
        break;
      case "product":
        requestPayload.order_details.push({
          product_id: element.value,
          quantity: null,
          total_price: null,
        });
        break;
      case "qty":
        lastElement =
          requestPayload.order_details[requestPayload.order_details.length - 1];
        lastElement.quantity = element.value;
        break;
      case "item_total":
        lastElement =
          requestPayload.order_details[requestPayload.order_details.length - 1];
        lastElement.total_price = element.value;
        break;
    }
  }
  console.log(JSON.stringify(requestPayload));
  $.ajax({
    method: "POST",
    url: 'http://127.0.0.1:5000/insertOrder', // Update the URL as needed
    data: JSON.stringify(requestPayload), // Ensure requestPayload is a JavaScript object
    contentType: "application/json", // Set the content type to JSON
    success: function (data) {
      // Handle the response data from the server
    },
    error: function (error) {
      // Handle any errors
    },
  });
});
