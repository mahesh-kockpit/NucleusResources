

function showCheckboxes(docEle) {
    var expanded = $("#" + docEle + "-title").attr("data-expand") == "1" 
    ? true
    : false;
    var checkboxes = document.getElementById(docEle);
    // if (!expanded) {
    //     checkboxes.style.display = "block";
    //     expanded = true;
    // } else {
    //     checkboxes.style.display = "none";
    //     expanded = false;
    // }
    checkboxes.style.display = "block";
    $("#" + docEle + "-title").attr("data-expand", expanded ? "1" : "0");   
}

function closecheckboxes(docEle){
    var checkboxes = document.getElementById(docEle);
    checkboxes.style.display = "none";
    expanded = false;
}




function CountValue(docEle, titleEle){
    var count = 0;
    $("#" + docEle).find(":checkbox").each(function(){
        var ele = $(this)[0];
        var IsChecked = ele.checked;
        if(IsChecked){
            count += 1;
        }
    });

    if(count == 0){
        $("#"+ titleEle).html("[Select]")
    }else{
        $("#"+ titleEle).html(count +" Selected")
    }
}

function openTab(evt, tabName) {
    document.getElementById("ctlResult").value = "";
    document.getElementById("ctlSample").value = "";
    document.getElementById("GroupBy-tblAggregate-tbody").innerHTML = "";
    if(tabName=="SqlReadWrite"){
        
        $("#txtsample").hide();
    }
    else{
        $("#txtsample").show();
    }
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabdata");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    var inputs, selects, textareas, index;
    var maincontentdiv = document.getElementById("main-content"); 
    inputs = maincontentdiv.getElementsByTagName('input');
    selects = maincontentdiv.getElementsByTagName('select');
    textareas = maincontentdiv.getElementsByTagName('textarea');
    for (index = 0; index < inputs.length; ++index) {
        if(inputs[index].type =="text")
            inputs[index].value = '';
        else if(inputs[index].type =="checkbox")
			inputs[index].checked = false;
    }
    for (index = 0; index < selects.length; ++index) {
        selects[index].selectedIndex = "0";
        //selects[index].options[0].innerHTML = "[Select]";
    }
    for (index = 0; index < textareas.length; ++index) {
        textareas[index].innerHTML = "";
    }

    //Fill_Extn_MetaData();
}


function FillColumnDropDown(value,docEle, titleEle){
    var count = 0;    
    $("#" + docEle).find(":checkbox").each(function(){
        var val = $(this).val();
        console.log(value);
        if (value.toString().replace(/['"]/g,'').includes(val)) {
          $(this).prop('checked', true);
          count += 1;
        }
    });
    $(".selectBoxOptn option[value='0']").each(function () {
        $(this).remove();
      });
    if(count == 0){
        $("#"+ titleEle).html("[Select]")
    }else{
        $("#"+ titleEle).html(count +" Selected")
    }
}

function Fill_Extn_MetaData() {
    var cell = IPython.notebook.get_selected_cell();
    if (_.has(cell.metadata, 'custom_data')) {
        var data = cell.metadata['custom_data'].toString();
        if (data.length > 0) {
            //Result
            $("#ctlResult").val(cell.metadata['custom_data'].ctlResult);
            $("#ctlSample").val(cell.metadata['custom_data'].ctlSample);
            //console.log(cell.metadata['custom_data'].JoinctlNewDF);
            //join
            if (!cell.metadata['custom_data'].JoinData.JoinctlNewDF == '') {
                $("#Join-ctlNewDF").val(cell.metadata['custom_data'].JoinData.JoinctlNewDF);
                $("#Join-selDF1").val(cell.metadata['custom_data'].JoinData.JoinselDF1);
                $("#Join-selDF2").val(cell.metadata['custom_data'].JoinData.JoinselDF2);
                $("#Join-selHow").val(cell.metadata['custom_data'].JoinData.JoinselHow);
            }
            //Conditional
            if (!cell.metadata['custom_data'].ConditionData.columnaddConditionalctlNewDF == '') {
                $('#columnadd-Conditional-ctlNewDF').val(cell.metadata['custom_data'].ConditionData.columnaddConditionalctlNewDF);
                $('#columnadd-Conditional-ctlNewColumn').val(cell.metadata['custom_data'].ConditionData.columnaddConditionalctlNewColumn);
                $('#columnadd-Conditional-selDF').val(cell.metadata['custom_data'].ConditionData.columnaddConditionalselDF);
            }
            //Expression
            if (!cell.metadata['custom_data'].ExpressionData.columnaddExpressionctlNewDF == '') {
                $('#columnadd-Expression-ctlNewDF').val(cell.metadata['custom_data'].ExpressionData.columnaddExpressionctlNewDF);
                $('#columnadd-Expression-ctlNewColumn').val(cell.metadata['custom_data'].ExpressionData.columnaddExpressionctlNewColumn);
                $('#columnadd-Expression-selDF').val(cell.metadata['custom_data'].ExpressionData.columnaddExpressionselDF);
            }
            //constant
            if (!cell.metadata['custom_data'].ConstantData.columnaddConstantctlNewDF == '') {
                $('#columnadd-Constant-ctlNewDF').val(cell.metadata['custom_data'].ConstantData.columnaddConstantctlNewDF);
                $('#columnadd-Constant-ctlNewColumn').val(cell.metadata['custom_data'].ConstantData.columnaddConstantctlNewColumn);
                $('#columnadd-Constant-selDF').val(cell.metadata['custom_data'].ConstantData.columnaddConstantselDF);
                $('#columnadd-Constant-ctlConstant').val(cell.metadata['custom_data'].ConstantData.columnaddConstantctlConstant);
            }
            //Composite
            if (!cell.metadata['custom_data'].CompositeData.columnaddCompositectlNewDF == '') {
                $('#columnadd-Composite-ctlNewDF').val(cell.metadata['custom_data'].CompositeData.columnaddCompositectlNewDF);
                $('#columnadd-Composite-ctlNewColumn').val(cell.metadata['custom_data'].CompositeData.columnaddCompositectlNewColumn);
                $('#columnadd-Composite-selDF').val(cell.metadata['custom_data'].CompositeData.columnaddCompositeselDF);
                if (cell.metadata['custom_data'].CompositeData.columnaddCompositeselDF != undefined) {
                    $('#columnadd-Composite-selDF').trigger("change");
                    var Composite_Cols = cell.metadata['custom_data'].Composite_Cols;
                    //console.log(Composite_Cols);
                    //var count=0;
                    FillColumnDropDown(Composite_Cols, 'columnadd-Composite-Column-UlColumn', 'columnadd-Composite-Column-title');
                }
            }
            //GroupBy
            if (!cell.metadata['custom_data'].GroupData.GroupByctlNewDF == '') {
                $('#GroupBy-ctlNewDF').val(cell.metadata['custom_data'].GroupData.GroupByctlNewDF);
                $('#GroupBy-ctlDF').val(cell.metadata['custom_data'].GroupData.GroupByctlDF);
                if (cell.metadata['custom_data'].GroupData.GroupByctlDF != undefined) {
                    $('#GroupBy-ctlDF').trigger("change");
                    var GroupBy_Cols = cell.metadata['custom_data'].GroupData.GroupBy_Cols;
                    FillColumnDropDown(GroupBy_Cols, 'GroupBy-GBColumn-UlColumn', 'GroupBy-GBColumn-title');
                }
                var GroupTable = cell.metadata['custom_data'].GroupData.GroupTable;
                var tr;
                for (var i = 0; i < GroupTable.length; i++) {
                    tr = $('<tr/>');
                    tr.append("<td>" + GroupTable[i].AggType + "</td>");
                    tr.append("<td>" + GroupTable[i].AggColumn + "</td>");                    
                    tr.append("<td>" + GroupTable[i].AggNewColumn + "</td>");
                    tr.append("<td><button  id='GroupBy-tblAggregate-tbody' class='btn btn-xs btn-danger'><i class='fa fa-trash'></i></button></td>");
                    $('#GroupBy-tblAggregate-tbody').append(tr);
                }
            }
            //Drop
            if (!cell.metadata['custom_data'].DropData.DropctlNewDF == '') {
                $('#Drop-ctlNewDF').val(cell.metadata['custom_data'].DropData.DropctlNewDF);
                $('#Drop-selDropDF').val(cell.metadata['custom_data'].DropData.DropselDropDF);
                if (cell.metadata['custom_data'].DropData.DropselDropDF != undefined) {
                    $('#Drop-selDropDF').trigger("change");
                    var Drop_Cols = cell.metadata['custom_data'].DropData.Drop_Cols;
                    FillColumnDropDown(Drop_Cols, 'Drop-Column-DropColumn', 'Drop-Column-title');
                }
            }
            //Concatenate
            if (!cell.metadata['custom_data'].ConcatenateData.ConcatenatectlRDF == '') {
                $('#Concatenate-ctlRDF').val(cell.metadata['custom_data'].ConcatenateData.ConcatenatectlRDF);
                $('#Concatenate-selDF1').val(cell.metadata['custom_data'].ConcatenateData.ConcatenateselDF1);
                $('#Concatenate-selDF2').val(cell.metadata['custom_data'].ConcatenateData.ConcatenateselDF2);
            }


        }
    }
}

function fnDeleteRow(button){
    if (confirm("Are you sure want to remove this aggregate function?")) 
    {
    var row = $(button).closest("TR");
    var table = $("#GroupBy-tblAggregate")[0];
    table.deleteRow(row[0].rowIndex);
    fnGroupBy();
    }
}




