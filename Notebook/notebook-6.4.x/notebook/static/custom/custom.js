// leave at least 2 line with only a star on it below, or doc generation fails
/**
 *
 *
 * Placeholder for custom user javascript
 * mainly to be overridden in profile/static/custom/custom.js
 * This will always be an empty file in IPython
 *
 * User could add any javascript in the `profile/static/custom/custom.js` file.
 * It will be executed by the ipython notebook at load time.
 *
 * Same thing with `profile/static/custom/custom.css` to inject custom css into the notebook.
 *
 *
 * The object available at load time depend on the version of IPython in use.
 * there is no guaranties of API stability.
 *
 * The example below explain the principle, and might not be valid.
 *
 * Instances are created after the loading of this file and might need to be accessed using events:
 *     define([
 *        'base/js/namespace',
 *        'base/js/promises'
 *     ], function(IPython, promises) {
 *         promises.app_initialized.then(function (appName) {
 *             if (appName !== 'NotebookApp') return;
 *             IPython.keyboard_manager....
 *         });
 *     });
 *
 * __Example 1:__
 *
 * Create a custom button in toolbar that execute `%qtconsole` in kernel
 * and hence open a qtconsole attached to the same kernel as the current notebook
 *
 *    define([
 *        'base/js/namespace',
 *        'base/js/promises'
 *    ], function(IPython, promises) {
 *        promises.app_initialized.then(function (appName) {
 *            if (appName !== 'NotebookApp') return;
 *            IPython.toolbar.add_buttons_group([
 *                {
 *                    'label'   : 'run qtconsole',
 *                    'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
 *                    'callback': function () {
 *                        IPython.notebook.kernel.execute('%qtconsole')
 *                    }
 *                }
 *                // add more button here if needed.
 *                ]);
 *        });
 *    });
 *
 * __Example 2:__
 *
 * At the completion of the dashboard loading, load an unofficial javascript extension
 * that is installed in profile/static/custom/
 *
 *    define([
 *        'base/js/events'
 *    ], function(events) {
 *        events.on('app_initialized.DashboardApp', function(){
 *            requirejs(['custom/unofficial_extension.js'])
 *        });
 *    });
 *
 *
 *
 * @module IPython
 * @namespace IPython
 * @class customjs
 * @static
 */
 
//  $(".code_cell").on({
//     mouseenter: function () {
//        $(this).find('.cell_controls').show(); //stuff to do on mouse enter
//     },
//     mouseleave: function () {
//     if(!$(this).hasClass('selected')){
//       $(this).find('.cell_controls').hide();//stuff to do on mouse leave
//     }
         
//     }
// });
// var workspacebaseurl=null;



define([
  'base/js/events'
], function (events) {
  events.on("kernel_ready.Kernel", function (evt, data) {
    //Jupyter.notebook.kernel.execute("workspace_baseURL = '" + workspacebaseurl + "'");
    setWorkspaceBaseURL(null);
    //Jupyter.keyboard_manager.disable();    
  });
});




function getInspectorData() {
  var $table = $('#inspectable');
  var arr = [];
  $(".Join-selDF1").empty();
  $(".Join-selDF2").empty();
  //Read Column Name
  var columnNames = $table.find('thead th').map(function () {
    return $(this).text();
  });
  //Read Table Data
  $table.find('tbody tr').each(function () {
    var rowValues = {};
    $(this).find('td').each(function (i) {
      console.log($(this).text());
      rowValues[columnNames[i]] = $(this).text();
    });
    arr.push(rowValues);
  });
  var ddl_Data = arr.filter(v => v.Type === "DataFrame");
  console.log("DataFrame" + ddl_Data);
  //Data Frame Binding
  $(ddl_Data).each(function (i) {
    var option = $('<option />');
    option.attr('value', this.Name).text(this.Name);
    $('.Join-selDF1').append(option);
  });

  $(ddl_Data).each(function () {
    var option = $('<option />');
    option.attr('value', this.Name).text(this.Name);
    $('.Join-selDF2').append(option);
  });


  var ddldefault = "<option value='0'></option>";
  $('.select').prepend(ddldefault);
  $('.select').val('0');
  //DataFrame Change
  $('.Join-selDF1').on('change', function () {
    var Table_Data = arr.filter(v => v.Name === this.value);
    //console.log(Table_Data);
    var result = Table_Data.map(a => a.Value);
    result = '"' + result + '"';
    result = result.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ',');
    $("#columnadd-Composite-Column-UlColumn").empty();
    //var ddldefault = "<option value='0'>Select</option>";
    //$('#columnadd-Composite-Column').prepend(ddldefault);
    //$('#columnadd-Composite-Column').val('0');
    $.each(result.split(','), function (i, e) {
      var option = $("<li><label><input type='checkbox' value=" + e + " 'onclick='CountValue('columnadd-Composite-Column','columnadd-Composite-Column-title')'/>" + e + "</label></li>");
      //var option = $('<option />');
      //option.attr('value', e).text(e);
      $('#columnadd-Composite-Column-UlColumn').append(option);
    });

    $('#columnadd-Composite-Column-UlColumn input[type="checkbox"]').change(function () {
      CountValue('columnadd-Composite-Column-UlColumn', 'columnadd-Composite-Column-title');
      var name = $(this).val();
      var check = $(this).prop('checked');
      console.log("Change: " + name + " to " + check);
    });

  });

  $('#GroupBy-ctlDF').on('change', function () {
    var Table_Data = arr.filter(v => v.Name === this.value);
    //console.log(Table_Data);
    var result = Table_Data.map(a => a.Value);
    result = '"' + result + '"';
    result = result.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ',');
    $("#GroupBy-GBColumn-UlColumn").empty();
    $("#GroupBy-AggregateColumn").empty();

    var ddldefault = "<option value='0'>Select</option>";
    $.each(result.split(','), function (i, e) {
      var option = $("<li><label><input type='checkbox' value=" + e + " 'onclick='CountValue('columnadd-Composite-Column','columnadd-Composite-Column-title')'/>" + e + "</label></li>");
      $('#GroupBy-GBColumn-UlColumn').append(option);
    });

    $.each(result.split(','), function (i, e) {      
      var option = $('<option />');
      option.attr('value', e).text(e);
    $('#GroupBy-AggregateColumn').append(option);
    });
    //Checkbox event
    $('#GroupBy-GBColumn-UlColumn input[type="checkbox"]').change(function () {
      CountValue('GroupBy-GBColumn-UlColumn', 'GroupBy-GBColumn-title');
    });
  });

  $('#Drop-selDropDF').on('change', function () {
    var Table_Data = arr.filter(v => v.Name === this.value);
    console.log(arr);
    console.log(Table_Data);
    var result = Table_Data.map(a => a.Value);
    result = '"' + result + '"';
    result = result.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ',');
    $("#Drop-Column-DropColumn").empty();
    var ddldefault = "<option value='0'>Select</option>";
    $.each(result.split(','), function (i, e) {
      var option = $("<li><label><input type='checkbox' value=" + e + " 'onclick='CountValue('columnadd-Composite-Column','columnadd-Composite-Column-title')'/>" + e + "</label></li>");
      $('#Drop-Column-DropColumn').append(option);
    });
    //Checkbox event
    $('#Drop-Column-DropColumn input[type="checkbox"]').change(function () {
      CountValue('Drop-Column-DropColumn', 'Drop-Column-title');
    });
  });

  $('.Join-selDF2').on('change', function () {
    var Table_Data = arr.filter(v => v.Name === this.value);
    //console.log(Table_Data);
    var result = Table_Data.map(a => a.Value);
    result = '"' + result + '"';
    result = result.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ',');
    $("#tables2").empty();
    $.each(result.split(','), function (i, e) {
      $('#tables2').append($('<option>', { value: e, text: e }));
    });
  });
  //Get Selected Columns Count
  function CountValue(docEle, titleEle) {
    var count = 0;
    $("#" + docEle).find(":checkbox").each(function () {
      var ele = $(this)[0];
      var IsChecked = ele.checked;
      if (IsChecked) {
        count += 1;
      }
    });
    $(".selectBoxOptn option[value='0']").each(function () {
      $(this).remove();
    });
    if (count == 0) {
      $("#" + titleEle).html("[Select]")
    } else {
      $("#" + titleEle).html(count + " Selected")
    }
  }
  //
};

function FillDbExtn_DropDown(_dbhost,_dbport,_dbuser,_database,_dbpassword,_dbschema) {
  //_dbschema="bso.in";
  //_dbhost="localhost";
  //_dbuser="postgres";
  //_dbpassword="ks2022";
  //_database="postgres";
  //_dbport="5433";
  alert(_dbhost);
  var lib = "QuerybuilderScript.py";
  console.log(IPython.notebook.base_url);
  var libName = IPython.notebook.base_url + "nbextensions/Querybuilder/" + lib;
  console.log(libName);
  $.get(libName).done(function (data) {
    console.log(data);
    //console.log('loaded ' + lib + ' library')
    IPython.notebook.kernel.execute(data, { iopub: { output: function () { } } }, { silent: false });
    IPython.notebook.kernel.execute("print(FillDb('"+_dbhost+"','"+_dbport+"','"+_dbuser+"','"+_database+"','"+_dbpassword+"','"+_dbschema+"'))", {
      iopub: {
        output: function (msg) {
          
          console.log(msg);
          var arr = msg.content['text'].toString();
          arr=arr.replace(/[\[\]']+/g,'').split(",");
          console.log(arr); 
          $('._selDB').empty();
          $('._selDB').empty();
          for (var i=0;i<arr.length;i++){
            var option = $('<option />');
            option.attr('value',$.trim(arr[i])).text($.trim(arr[i]));
            $('._selDB').append(option); 
          }
          // for (var i=0;i<arr.length;i++){
          //   var option = $('<option />');
          //   option.attr('value',$.trim(arr[i])).text($.trim(arr[i]));
          //   $('#_readselDB').append(option);       
          // }
          
          var ddldefault = "<option value='0'>Select</option>";
          $('._selDB').prepend(ddldefault);
          $('._selDB').val('0');          
        }
      }
    }, { silent: false });
    // IPython.notebook.kernel.execute("print(connect())", { iopub: { output: function (msg) { console.log(msg.content['text']) } } }
    // , { silent: false });
  }).fail(function () {


    console.log('failed to load ' + lib + ' library')
  });

  console.log('dialog creating');
}

function pasteCode(code) {
  var cell = IPython.notebook.get_selected_cell();
  var celltext = cell.get_text();
  if (cell.get_text() == "") {
    var do_render = !((cell.cell_type === "raw") || (cell.cell_type === "code"));
    if (do_render) cell.unrender();
    cell.code_mirror.focus();
    cell.code_mirror.doc.replaceSelection(code.toString());
    if (do_render) cell.edit_mode();
  }
  else {
    Jupyter.notebook.
      insert_cell_below('code').
      //         // Define default cell here
      set_text(code.toString());
  }
  // var cell = IPython.notebook.get_selected_cell();
  // var do_render = !((cell.cell_type === "raw") || (cell.cell_type === "code"));
  // if (do_render) cell.unrender();
  // cell.code_mirror.focus();
  // cell.code_mirror.doc.replaceSelection(code.toString());
  // if (do_render) cell.edit_mode();
}



if(Jupyter.notebook.get_cells().length===1){
  $("#remove_cell").attr('disabled' , true);
}  


$("body").on('DOMSubtreeModified', ".output", function() {
  console.log('Test');
  $(this).parents('.output_wrapper').find('.output_cell_controls').css('display', 'none');
  $(this).find('.output_area').parents('.output_wrapper').find('.output_cell_controls').css('display', 'block');
});

$('.addcell_controls').click(function () {
  Jupyter.notebook.insert_cell_at_index('code', 0);
});
 
window.addEventListener('unload', function() {
  // For Firefox
  IPython.notebook.session.delete();
});

window.onbeforeunload = function () {
  // For Chrome
  Jupyter.notebook.close_and_halt()
  //IPython.notebook.session.delete();
};
    
 
//     define([
//          'base/js/namespace',
//          'base/js/promises'
//      ], function(IPython, promises) {
//         var add_cell = function() {
//             Jupyter.notebook.
//             insert_cell_above('code').
//             // Define default cell here
           
//                 set_text(`# @hidden
//             # Standard data science libraries    
    
//     from IPython.display import display
//     import ipywidgets as widgets
        
//     slider = widgets.Text()
//     display(slider)
    
//     from IPython.display import HTML
//     HTML('''<script>
// code_show=true; 
// function code_toggle() {
//  if (code_show){
//  $('.cm-comment:contains(@hidden)').closest('div.input').hide();
//  } else {
//  $('.cm-comment:contains(@hidden)').closest('div.input').show();
//  }
//  code_show = !code_show
// } 
// $(document ).ready(code_toggle);
// </script>
//    ''')

    
//     `);
//     Jupyter.notebook.select_prev();
//     Jupyter.notebook.execute_cell_and_select_below();
//     };
//          promises.app_initialized.then(function (appName) {
            
//              if (appName !== 'NotebookApp') return;
             

//                  IPython.toolbar.add_buttons_group([
//                     {
//                         'label'   : 'Add Params',
//                         'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
//                         'callback': function () {
//                             IPython.notebook.kernel.execute('%qtconsole')
//                         }
//                     }
//                     // add more button here if needed.
                    
//                     ]);
//                     Jupyter.toolbar.add_buttons_group([
//                         Jupyter.keyboard_manager.actions.register ({
//                             'help': 'Add default cell',
//                             'icon' : 'fa-play-circle',
//                             'handler': add_cell
//                         }, 'add-default-cell', 'Default cell')
//                     ])
//          });
         
//      });




//  define([
//     'base/js/namespace',
//     'base/js/events'
//     ], function(Jupyter, events) {
//         debugger;
//         // Adds a cell above current cell (will be top if no cells)
//         var add_cell = function() {
//         Jupyter.notebook.
//         insert_cell_above('code').
//         // Define default cell here
//         set_text(`# Standard data science libraries

// import numpy as np
// import mypkg as pk
// import sys
// from Dev import Test1 as t1
// `);
// Jupyter.notebook.select_prev();
// Jupyter.notebook.execute_cell_and_select_below();
//       };
//       //console.log(add_cell);
//       // Button to add default cell
//       var defaultCellButton = function () {
//           Jupyter.toolbar.add_buttons_group([
//               Jupyter.keyboard_manager.actions.register ({
//                   'help': 'Add default cell',
//                   'icon' : 'fa-play-circle',
//                   'handler': add_cell
//               }, 'add-default-cell', 'Default cell')
//           ])
//       }
//       //console.log(defaultCellButton);
//     // Run on start
//     function load_ipython_extension() {
        
//         // Add a default cell if there are no cells
//         if (Jupyter.notebook.get_cells().length===1){
//             add_cell();
//         }
//        // defaultCellButton();
//     }
    
//          load_ipython_extension();
    
    
//  });



 //load_multi_css();
 load_main_css();
 //load_multi_js();
 //load_multiboot_js();
 load_main_js();
 load_custom_js();
 
 
function load_main_css() {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = (IPython.notebook.base_url + "nbextensions/Querybuilder/main.css");
  document.getElementsByTagName("head")[0].appendChild(link);
};
function load_main_js() {
  var link = document.createElement("script");
  link.src = (IPython.notebook.base_url + "nbextensions/Querybuilder/main.js");
  document.getElementsByTagName("body")[0].appendChild(link);
};
function load_custom_js() {
  var link = document.createElement("script");
  link.src = (IPython.notebook.base_url + "nbextensions/Querybuilder/custom.js");//requirejs.toUrl("./custom.js");
  document.getElementsByTagName("body")[0].appendChild(link);
};

function load_multi_js() {
  var link = document.createElement("script");
  link.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js";
  document.getElementsByTagName("body")[0].appendChild(link);
};

function load_multiboot_js() {
  var link = document.createElement("script");
  link.src = "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min.js";
  document.getElementsByTagName("body")[0].appendChild(link);
};

function load_multi_css() {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css";
  document.getElementsByTagName("head")[0].appendChild(link);
};



      //   load_ipython_extension();
      //   function load_ipython_extension() {
      //     if (Jupyter.notebook.get_cells().length===1){
      //  //do your thing
      //       Jupyter.notebook.insert_cell_above('code', 0).set_text("import numpy as np\n\nimport mypkg as pk");
      //     }
      //   }