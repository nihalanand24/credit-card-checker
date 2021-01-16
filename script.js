const app = {};

app.init = function () {

    // when user submits number, store the value and run a function to parse all the required information from the input
    $('form').on('submit', function (event) {
        event.preventDefault();
        const userInput = $('input').val();
        app.parseCC(userInput);
    })
}

app.parseCC = function (input) {

    // strip input of all whitespace including newlines and tabs and store as string
    const ccString = input.replace(/\s/g, '');
    // .replace() using RegExp solution from https://www.techiedelight.com/remove-whitespaces-string-javascript/

    // store all information that can immediately be parsed in an object
    const cc = {
        string: ccString,
        number: Number(ccString),
        length: ccString.length,
        firstOne: Number(ccString[0]),
        firstTwo: Number(ccString.substring(0, 2))
    }

    // call a function that takes the cc object and calculates the remaining required information and merge the returned data into the cc object
    $.extend(cc, app.checkCC(cc))

    // send the calculated data to the html document
    $('.cc-icon').html(`${cc.icon}`)
    $('.cc-type').html(`${cc.type}`)
}

app.checkCC = function (ccObject) {
    
    // Calculate the sum of every alternate digit starting from the last digit by adding the modulus and integer dividing by 100 to remove 2 digits from the end
    let checksum1 = 0;
    for (let check1 = ccObject.number; check1 > 0; check1 = Math.floor(check1 / 100)) {
        checksum1 += check1 % 10;
    }

    // Multiply every alternate digit starting from the second last digit by 2 and find the sum of these digits.
    // Integer divide by 10 to start at the 2nd last digit and follow a similar loop to check1 and multiply by 2 before adding to checksum
    // If a digit is greater than 5, add the digits of the product instead of the product itself
    let checksum2 = 0;
    for (let check2 = Math.floor(ccObject.number / 10); check2 > 0; check2 = Math.floor(check2 / 100)) {
        if ((check2 % 10) >= 5) {
            checksum2 += Math.floor(2 * (check2 % 10) / 10) + (2 * (check2 % 10) % 10);
        }
        else {
            checksum2 += (check2 % 10) * 2;
        }
    }

    // Using the calculated checksums determine if the number passes the luhn check
    const luhn = (((checksum1 + checksum2) % 10) === 0) ? true : false;

    
    // use conditional statements to check type of credit card number entered
    const length = ccObject.length;
    const first1 = ccObject.firstOne;
    const first2 = ccObject.firstTwo;

    if (length === 15 && (first2 === 34 || first2 === 37) && luhn) {
        return {
            type: 'American Express',
            icon: '<i class="amex fab fa-cc-amex"></i>'
        };
    } else if (length === 16 && ((first2 >= 51 && first2 <= 55) || (first2 >= 22 && first2 <= 27)) && luhn) {
        return {
            type: 'MasterCard',
            icon: '<i class="mc fab fa-cc-mastercard"></i>'
        };
    }
    else if ((length === 13 || length === 16) && first1 === 4 && luhn) {
        return {
            type: 'Visa',
            icon: '<i class="visa fab fa-cc-visa"></i>'
        };
    } else {
        return {
            type: 'Invalid Number',
            icon: '<i class="fas fa-times-circle"></i>'
        }
    }
}

// Initiate function call on document ready
$(document).ready(function () {
    app.init();
});