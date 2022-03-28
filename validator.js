


function Validator(options) {

    // thong báo lỗi
    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
                 

    }

    // xoá lõi khi nhập
    function deleteError(inputElement) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        errorElement.innerText = ''
        inputElement.parentElement.classList.remove('invalid')
    }
    // lay form
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);
           
           
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                    
                }
                inputElement.oninput = function () {
                    deleteError(inputElement)
                }
            }
        });
        
    }

}
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'vui lòng nhập trường này!'
            
        }
    };

}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'vui lòng nhập email!';

        }
    };

}
Validator.isMinLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            
            return value.length >= min ? undefined : ` vui lòng nhập ${min} ký tự `;

        }
    };

}


