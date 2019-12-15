$(document).ready(function () {
    getEmployees();
});

function getEmployees() {
    $.ajax({
        url: "/Home/GetEmployees",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';

            $.each(result, function (key, item) {
                html += '<tr id="row-' + item.Name + '">';
                html += '<td>' + item.Name + '</td>';
                html += '<td>' + item.DateOfHire + '</td>';
                html += '<td>' + item.Supervisor + '</td>';
                html += '<td><a href="#" onclick="getEmployeeAttributes(\'' + item.Id + '\')">Select</a> | <a href="#" onclick="return getbyID(\'' + item.Id + '\')">Edit</a> | <a href="#" onclick="DeleteEmployee(\'' + item.Id + '\')">Delete</a></td>';
                html += '</tr>';
            });
            $('.tbody1').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function getEmployeeAttributes(Id) {
    $.ajax({
        url: "/Home/GetEmployeeAttributes",
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ Id: Id }),
        success: function (result) {

            $('.EmployeeAttributesTable').html('');
            var html = '<table class="table"><caption>Employee Attributes</caption><thead><tr><th>Attribute Name</th><th>Attribute Value</th></tr></thead>';
            html += '<tbody><tr>';

            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.Name + '</td><td>' + item.Value + '</td>';
                html += '<td><a href="#" onclick="return getAttributeByID(\'' + item.Id + '\')">Edit</a> | <a href="#" onclick="DeleteAttribute(\'' + item.Id + '\')">Delete</a></td>';
                html += '</tr>';
            });

            html += '</tbody></table>';
            $('.EmployeeAttributesTable').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function clearEmployeeTextBox() {
    $('#Name').val("");
    $('#Supervisor').val("");
    $('#DateOfHire').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#Name').css('border-color', 'lightgrey');
    $('#Supervisor').css('border-color', 'lightgrey');
    $('#DateOfHire').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/GetEmployees",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $('#Employees_Dropdown').html('');
            var html = '';
            html += '<label for="Supervisor">Supervisor</label><select class="form-control" id="Supervisor">';
            html += '<option value="none">None</option>';

            $.each(result, function (key, item) {
                html += '<option value = "' + item.Id + '">' + item.Name + '</option>';
            });
            html += '</select>';
            $('#Employees_Dropdown').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function validateEmployee() {
    var isValid = true;

    if ($('#Name').val().trim() == "") {
        $('#Name').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Name').css('border-color', 'lightgrey');
    }

    if ($('#DateOfHire').val().trim() == "") {
        $('#DateOfHire').css('border-color', 'Red');

        isValid = false;
    }
    else {
        $('#DateOfHire').css('border-color', 'lightgrey');
    }

    if ($('#Supervisor').val().trim() == "") {
        $('#Supervisor').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Supervisor').css('border-color', 'lightgrey');
    }

    return isValid;
}

function addEmployee() {
    var res = validateEmployee();

    if (res == false) {
        return false;
    }

    let Name = $('#Name').val();
    let DateOfHire = $('#DateOfHire').val();
    let Supervisor = $('#Supervisor').val();

    $.ajax({
        url: "/Home/AddEmployee",
        data: JSON.stringify({ Name: Name, DateOfHire: DateOfHire, Supervisor: Supervisor }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            getEmployees();
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function getbyID(Id) {
    $('#Name').css('border-color', 'lightgrey');
    $('#DateOfHire').css('border-color', 'lightgrey');
    $('#Supervisor').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/getbyID/",
        data: JSON.stringify({ Id: Id }),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {

            $('#Name').val(result.Name);
            $('#DateOfHire').val(result.DateOfHire);
            var selectedSupervisor = result.Supervisor;

            $.ajax({
                url: "/Home/GetEmployees",
                type: "GET",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (result) {

                    $('#Employees_Dropdown').html('');
                    var html = '';
                    html += '<label for="Supervisor">Supervisor</label><select class="form-control" id="Supervisor">';
                    html += '<option value="none">None</option>';

                    $.each(result, function (key, item) {
                        if (item.Name == selectedSupervisor) {
                            html += '<option value = "' + item.Id + '" selected>' + item.Name + '</option>';
                        } else {
                            html += '<option value = "' + item.Id + '">' + item.Name + '</option>';
                        }

                    });
                    html += '</select>';
                    $('#Employees_Dropdown').html(html);
                },
                error: function (errormessage) {
                    alert(errormessage.responseText);
                }
            });
            $('#UpdateButton').append('<button type="button" class="btn btn-primary" id="btnUpdate" style="display:none;" onclick="UpdateEmployee(\'' + result.Id + '\');">Update</button>')
            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

function UpdateEmployee(Id) {
    var res = validateEmployee();

    if (res == false) {
        return false;
    }

    var Name = $('#Name').val();
    var DateOfHire = $('#DateOfHire').val();
    var Supervisor = $('#Supervisor').val();

    $.ajax({
        url: "/Home/UpdateEmployee",
        data: JSON.stringify({ Id: Id, Name: Name, DateOfHire: DateOfHire, Supervisor: Supervisor }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            getEmployees();
            $('#myModal').modal('hide');
            $('#Name').val("");
            $('#DateOfHire').val("");
            $('#Supervisor').val("");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function DeleteEmployee(Id) {
    var ans = confirm("Are you sure you want to delete this Record?");
    if (ans) {
        $.ajax({
            url: "/Home/DeleteEmployee/" + Id,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                getEmployees();
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

//////////////////////////////////////////
////////// ATTRIBUTES CRUD SECTOR ///////
/////////////////////////////////////////


function clearAttributeTextBox() {
    $('#AttributeName').val("");
    $('#AttributeValue').val("");
    $('#btnUpdate').hide();
    $('#btnAttributeAdd').show();
    $('#AttributeName').css('border-color', 'lightgrey');
    $('#AttributeValue').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/GetEmployees",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {

            $('#Employees_Checkboxes').html('');
            var html = '';


            $.each(result, function (key, item) {
                html += '<input type="checkbox" name="Employee-' + item.Name + '" value="' + item.Id + '">';
                html += '' + item.Name + '<br />'
            });
            $('#Employees_Checkboxes').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function validateAttribute() {
    var isValid = true;

    if ($('#AttributeName').val().trim() == "") {
        $('#AttributeName').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#AttributeName').css('border-color', 'lightgrey');
    }

    if ($('#AttributeValue').val().trim() == "") {
        $('#AttributeValue').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#AttributeValue').css('border-color', 'lightgrey');
    }

    if ($("input[type='checkbox']:checked").length == 0) {
        alert('You must select at least one employee for given attribute.');
        isValid = false;
    }
    else {
        $('#Employee_Checkboxes').css('border-color', 'lightgrey');
    }

    return isValid;
}

function addAttribute() {
    var res = validateAttribute();

    if (res == false) {
        return false;
    }

    let Name = $('#AttributeName').val();
    let Value = $('#AttributeValue').val();
    let AffectedEmployees = [];

    $.each($("input[type='checkbox']:checked"), function (key, item) {
        AffectedEmployees.push(item.value);
    });

    $.ajax({
        url: "/Home/AddAttribute",
        data: JSON.stringify({ Name: Name, Value: Value, AffectedEmployees: AffectedEmployees }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            getEmployees();
            $('#myAttributeModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function getAttributeByID(Id) {
    $('#AttributeName').css('border-color', 'lightgrey');
    $('#AttributeValue').css('border-color', 'lightgrey');
    $('#Employee_Checkboxes').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/getAttributeByID/",
        data: JSON.stringify({ Id: Id }),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (attribute) {

            $('#AttributeName').val(attribute.Name);
            $('#AttributeValue').val(attribute.Value);

            var templist = [];

            $.each(attribute.Employees, function (key, attremp) {
                templist.push(attremp.Id);
            });

            $.ajax({
                url: "/Home/GetEmployees",
                type: "GET",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (employees) {

                    $('#Employees_Checkboxes').html('');
                    var html = '';

                    $.each(employees, function (key, emp) {

                        if (templist.indexOf(emp.Id) >= 0) {
                            html += '<input type="checkbox" name="Employee-' + emp.Name + '" value="' + emp.Id + '" checked>';
                        } else {
                            html += '<input type="checkbox" name="Employee-' + emp.Name + '" value="' + emp.Id + '">';
                        }


                        html += '' + emp.Name + '<br />';
                    });
                    $('#Employees_Checkboxes').html(html);
                },
                error: function (errormessage) {
                    alert(errormessage.responseText);
                }
            });

            $('#UpdateAttributeButton').append('<button type="button" class="btn btn-primary" id="btnUpdate" style="display:none;" onclick="UpdateAttribute(\'' + attribute.Id + '\');">Update</button>')
            $('#myAttributeModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAddAttribute').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

function UpdateAttribute(Id) {
    var res = validateAttribute();

    if (res == false) {
        return false;
    }

    var Name = $('#AttributeName').val();
    var Value = $('#AttributeValue').val();

    let AffectedEmployees = [];

    $.each($("input[type='checkbox']:checked"), function (key, item) {
        AffectedEmployees.push(item.value);
    });

    $.ajax({
        url: "/Home/UpdateAttribute",
        data: JSON.stringify({ Id: Id, Name: Name, Value: Value, AffectedEmployees: AffectedEmployees }),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            $('.EmployeeAttributesTable').html('');
            getEmployees();
            $('#myAttributeModal').modal('hide');
            $('#AttributeName').val("");
            $('#AttributeValue').val("");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function DeleteAttribute(Id) {
    var ans = confirm("Are you sure? Selected Attribute will be deleted for all employees.");

    if (ans) {
        $.ajax({
            url: "/Home/DeleteAttribute/" + Id,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                $('.EmployeeAttributesTable').html('');
                getEmployees();
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}
