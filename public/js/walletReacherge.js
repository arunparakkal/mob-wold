

document.getElementById('walletElement').addEventListener('click',(e)=>{
  e.preventDefault()

    Swal.fire({
      title: 'Recharge Wallet',
      html: '<input id="rechargeAmount" class="swal2-input" type="number" placeholder="Enter recharge amount">',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Recharge',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const inputValue = document.getElementById('rechargeAmount').value;
        if (inputValue <= 0) {
          Swal.showValidationMessage('Please enter a valid recharge amount.');
        }
        return inputValue;
      }
    }).then((result) => {
    
      if (result.isConfirmed) {
        if (result.value) {
        const amount = result.value
      
          fetch('/walletrecharge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amount }),
          })
          .then(response => response.json())
          .then(async(data) => {
            console.log(data);
            if(data.success){
              
             await Swal.fire(
                'Recharged!',
                `You have successfully recharged Rs${result.value} to your wallet.`,
                'success'
                
              );
              location.reload()
            }

            console.log('Success:', data);

            // Perform any necessary action after a successful POST request
          })
          .catch((error) => {
            console.error('Error:', error);
            // Handle any errors that occur during the POST request
          });

        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your wallet recharge has been cancelled.',
          'error'
        );
      }
    });







})