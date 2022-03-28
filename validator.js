


function Validator(options) {

    var selectorRules = {};

    // thong báo lỗi
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
           
        // lấy ra cacc rule của selector và kiểm tra
        // nếu có lloix thì dừng việc kiểm kiểm
        var rules = selectorRules[rule.selector]

        for (var i = 0; i < rules.length; i++) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
                
            }
            
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
        return !errorMessage;
                 

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

        // lặp qua môi rule và sử lý sự kiện 
        // bỏ đi hành động mặc đinh

        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;


            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }

            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValidation = Array.from(enableInputs).reduce(function (value, input) {
                        value[input.name] = input.value
                        return value;
                    }, {});
                    options.onSubmit({
                        // call API
                        formValidation
                    })
                    
                }
                else {
                    formElement.submit();
                }
            }
            
        }

        

        options.rules.forEach(function (rule) {
        
            // lưu lại các Rules trong object 
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);

            } else {
                selectorRules[rule.selector] = [rule.test];

            }
            
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
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined :  message || 'vui lòng nhập trường này!'
            
        }
    };

}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined :  message || 'vui lòng nhập email!';

        }
    };

}
Validator.isMinLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            
            return value.length >= min ? undefined :  message || `vui lòng nhập ${min} ký tự `;

        }
    };

}
Validator.isConfirm = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'giá trị nhập vào không chính xác';
        }
    }
}



