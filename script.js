const app = {};

app.init = function () {

    $('form').on('submit', function (event) {
        event.preventDefault();
        const userInput = $('input').val();
        app.parseCC(userInput);
    })
}
// let input = '';

app.parseCC = function (input) {

    // strip input of all whitespace including newlines and tabs and store as string
    const ccString = input.replace(/\s/g, '');
    // .replace() using RegExp solution from https://www.techiedelight.com/remove-whitespaces-string-javascript/


    const cc = {
        string: ccString,
        number: Number(ccString),
        digits: ccString.length,
        first2digits: Number(ccString.substring(0, 2))
    }

    $.extend(cc, app.checkCC(cc))

    $('.cc-icon').html(`${cc.icon}`)
    $('.cc-type').html(`${cc.type}`)
}

// TODO Hello

app.checkCC = function (ccObject) {
    // Calculate the sum of every alternate digit starting from the last digit by adding the modulus and integer dividing by 100 to remove 2 digits from the end

    let checksum1 = 0;
    for (let check1 = ccObject.number; check1 > 0; check1 = Math.floor(check1 / 100)) {
        checksum1 += check1 % 10;
    }

    let checksum2 = 0;
    for (let check2 = Math.floor(ccObject.number / 10); check2 > 0; check2 = Math.floor(check2 / 100)) {
        if ((check2 % 10) >= 5) {
            checksum2 += Math.floor(2 * (check2 % 10) / 10) + (2 * (check2 % 10) % 10);
        }
        else {
            checksum2 += (check2 % 10) * 2;
        }
    }

    const luhn = (((checksum1 + checksum2) % 10) == 0) ? true : false;

    // console.log(ccObject.number, checksum1, checksum2, luhn);

    const length = ccObject.digits;
    const start = ccObject.first2digits;

    if (length === 15 && (start === 34 || start === 37) && luhn) {
        return {
            type: 'American Express',
            icon: '<i class="amex fab fa-cc-amex"></i>'
        };
    } else if (length === 16 && ((start >= 51 && start <= 55) || (start >= 22 && start <= 27)) && luhn) {
        return {
            type: 'MasterCard',
            icon: '<i class="mc fab fa-cc-mastercard"></i>'
        };
    }
    else if ((length === 13 || length === 16) && ccObject.string[0] == 4 && luhn) {
        return {
            type: 'Visa',
            icon: '<i class="visa fab fa-cc-visa"></i>'
        };
    } else {
        return {
            type: 'Invalid <br>Number',
            icon: '<i class="fas fa-times-circle"></i>'
        }
    }
}

$(document).ready(function () {
    app.init();
});