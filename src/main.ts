import "./style.css";
import axios from "axios";

const form = document.querySelector("form");
const button = form?.querySelector('button');
const onSaleInput = document.querySelector('input[name="onSale"]') as HTMLInputElement;
const discountInput = document.querySelector('input[name="discount"]') as HTMLInputElement;

onSaleInput?.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    onSaleInput.checked = !onSaleInput.checked;
  }
})

button?.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(form as HTMLFormElement);

    // Handle onSale
    if(onSaleInput.checked){
      formData.set("onSale", String(onSaleInput.checked)); // set boolean value as string to formData
    };

    // Handle discount
    if (discountInput.value === "") formData.delete("discount");

    // Check if any field in filterData is empty
    // this checks could be avoided if I were using submit event but i don't accidental form submission.
    const formDataArray = Array.from(formData.entries());

    for (let i = 0; i < formDataArray.length; i++) {
      if (formDataArray[i][1] instanceof File) {
        if ((formDataArray[i][1] as File).size === 0) {
          throw new Error(
            "Error: A file must be selected for " + formDataArray[i][0]
            );
          }
        } else if (formDataArray[i][1] === "") {
        throw new Error(
          "Error: " + formDataArray[i][0] + " field must be filled"
        );
      }
    }
    button.textContent = 'SUBMITTING...'
    button.disabled = true;
    const {data} = await axios.post('https://e-commerce-serverside.vercel.app', formData)
    alert(data.message)
    console.log(data)
    form?.reset()
  } catch (err: any) {
    alert(err.message || err.response.data.error)
    console.log(err.response || err);
  } finally {
    button.textContent = 'SUBMIT'
    button.disabled = false;
  }
});
