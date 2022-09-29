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
 
// $("#btnaddcell").on("click",function(e){
//     var a=Jupyter.notebook.get_cells().CodeCell;
//     //Jupyter.notebook.insert_cell_below();
//     console.log(a.CodeCell);
    
// })




    
 
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
//         alert
//         // Add a default cell if there are no cells
//         if (Jupyter.notebook.get_cells().length===1){
//             add_cell();
//         }
//        // defaultCellButton();
//     }
    
//          load_ipython_extension();
    
    
//  });



    //     load_ipython_extension();
    //     function load_ipython_extension() {
    //       if (Jupyter.notebook.get_cells().length===1){
    //    //do your thing
    //         Jupyter.notebook.insert_cell_above('code', 0).set_text("import numpy as np\n\nimport mypkg as pk");
    //       }
    //     }