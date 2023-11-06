 // Get references to the necessary elements
 const quantityInput = document.getElementById("quantity");
 const productSelect = document.getElementById("product_id");
 const totalAmountInput = document.getElementById("amount");

 // Add an event listener to the quantity input
 quantityInput.addEventListener("input", updateTotalAmount);

 // Function to update the total amount
 function updateTotalAmount() {
   const selectedOption =
     productSelect.options[productSelect.selectedIndex];
   const productPrice = parseFloat(
     selectedOption.getAttribute("data-price")
   );
   const quantity = parseFloat(quantityInput.value);
   const totalAmount = productPrice * quantity;

   // Update the total amount input field
   totalAmountInput.value = totalAmount.toFixed(2);
 }
