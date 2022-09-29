function ExtensionEvents(_path,_fileName,_dbhost,_dbuser,_dbport,_database,_dbpassword,_dbschema) {
	filelocation = _path+'\\'+_fileName;
	filelocation = filelocation.replace(/\\/g, "/");
	var fileloc= 'r'+"'"+filelocation;
	var lib = "QuerybuilderScript.py";
	var libName = IPython.notebook.base_url + "nbextensions/Querybuilder/" + lib;
	
	onPopuLoad();
	//"use strict";
	class ScriptManager {

		JOIN(newframe, df1, df2, how) {
			this.Exec("JOIN('" + newframe + "', '" + df1 + "', '" + df2 + "', '" + how + "')");
		}

		ADDCOLUMN(NEWDF, SEP, COLLIST, CONSTANT, TYPE, NEWCOLNAME, DFNAME) {
			//alert("'" + _fileName + "','" + _path + "'");
			this.Exec("ADDCOLUMN('" + NEWDF + "','" + SEP + "',[" + COLLIST + "],'" + CONSTANT + "','" + TYPE + "','" + NEWCOLNAME + "','" + DFNAME + "'," + fileloc + "')");
		}

		GROUPBY(NEWDF, GBDF, GBCOL, AGG, AGGCOL, ALIAS) {
			this.Exec("GROUPBY('" + NEWDF + "','" + GBDF + "',[" + GBCOL + "],[" + AGG + "],[" + AGGCOL + "],[" + ALIAS + "]," + fileloc + "')");
		}

		DROP(resultDF, dropDF, dropCol) {
			this.Exec("DROP('" + resultDF + "','" + dropDF + "',[" + dropCol + "])")
		}

		CONCATENATE(resultDF, df1, df2,un) {
			this.Exec("CONCATENATE('" + resultDF + "','" + df1 + "','" + df2 + "','" + un + "')")
		}

		ADDTABLE(NEWDF) {
			this.ExecAddTable("ADDTABLE('" + NEWDF + "','"+_dbhost+"','"+_dbport+"','"+_dbuser+"','"+_database+"','"+_dbpassword+"','"+_dbschema+"')");
			//this.Exec("ADDTABLE()");
		}

		ADDSCHEMA(NEWDF) {
			this.ExecAddSCHEMA("ADDSCHEMA('" + NEWDF + "','"+_dbhost+"','"+_dbport+"','"+_dbuser+"','"+_database+"','"+_dbpassword+"','"+_dbschema+"')");
			//this.Exec("ADDTABLE()");
		}

		DBReadWrite(_NewDB,_NewDF,_NewTB,mode,type,schema){
			this.Execmode("DBReadWrite('"+_NewDB+"',"+fileloc+"','"+_NewDF+"','"+_NewTB+"','"+mode+"','"+type+"','"+schema+"','"+_dbhost+"','"+_dbport+"','"+_dbuser+"','"+_database+"','"+_dbpassword+"','"+_dbschema+"')")
		}

		WriteSql(url, port, _NewDB, username, pwd, _NewDF, _NewTB, mode) {  //scriptManager.WriteSql('','',_NewDB,'','',_NewDF,_NewTB,mode);
			this.Execmode("WriteSql('" + url + "','" + port + "','" + _NewDB + "','" + username + "','" + pwd + "','" + _NewDF + "','" + _NewTB + "','" + mode + "')");
		}

		ReadSql(_NewDF, _NewDB, url, port, user, pwd, _NewTB) { //scriptManager.ReadSql(_NewDF,_NewDB,'','','','', _NewTB );
			this.Execmode("ReadSql('" + _NewDF + "','" + _NewDB + "','" + url + "','" + port + "','" + user + "','" + pwd + "','" + _NewTB + "'," + fileloc + "')");
		}

		Exec(command) {
			console.log(command);
			$.get(libName).done(function (data) {
				IPython.notebook.kernel.execute(data, { iopub: { output: function () { } } }, { silent: false });
				IPython.notebook.kernel.execute("print(" + command + ")", {
					iopub: {
						output: function (msg) {
							console.log(msg);
							console.log(msg.header['msg_type']);
							//.content['text']);
							if (msg.header['msg_type'] != 'error') {
								var a = msg.content['text'];
								var objectStringArray = (new Function("return [" + a + "];")());
								//var response = msg.content['text'].split("\n#");
								//alert(response[0]);
								document.getElementById("ctlResult").value = objectStringArray[0].output;//response[0];
								document.getElementById("ctlSample").value = objectStringArray[0].sample;//response[1];
							}
							else{
								errorPopup(msg.content['evalue'] + '\nin command :' + command,'Error');
							}
						}
					}
				}, { silent: false });

			}).fail(function () {
				console.log('failed to load ' + lib + ' library')
			});
		}

		Execmode(command) {
			console.log(command);
			$.get(libName).done(function (data) {
				IPython.notebook.kernel.execute(data, { iopub: { output: function () { } } }, { silent: false });
				IPython.notebook.kernel.execute("print(" + command + ")", {
					iopub: {
						output: function (msg) {
							console.log(msg);
							if (msg.header['msg_type'] != 'error') {
								var a = msg.content['text'];
								var objectStringArray = (new Function("return [" + a + "];")());
								//var response = msg.content['text'].split("\n#");
								//console.log(response);
								document.getElementById("ctlResult").value = objectStringArray[0].output;//response[0];
								//document.getElementById("ctlSample").value = response[1];
								$('#QsloadingModal').modal('hide');
							}
							else{
								errorPopup(msg.content['evalue'] + '\nin command :' + command,'Error');
							}
						}
					}
				}, { silent: false });

			}).fail(function () {
				console.log('failed to load ' + lib + ' library')
			});
		}

		ExecAddTable(command) {
			console.log(command);
			$.get(libName).done(function (data) {
				IPython.notebook.kernel.execute(data, { iopub: { output: function () { } } }, { silent: false });
				IPython.notebook.kernel.execute("print(" + command + ")", {
					iopub: {
						output: function (msg) {
							console.log(msg);
							if (msg.header['msg_type'] != 'error') {
							var response = msg.content['text'];//.split("\n");
							var arr = msg.content['text'].toString();
							arr = arr.replace(/[\[\]']+/g, '').split(",");
							console.log(arr.length);
							$('._selTB').empty();
							for (var i = 0; i < arr.length; i++) {
								var option = $('<option />');
								option.attr('value', arr[i].trim()).text(arr[i]);
								$('._selTB').append(option);
							}
							var ddldefault = "<option value='0'>Select</option>";
							$('._selTB').prepend(ddldefault);
							$('._selTB').val('0');
							console.log(response);
						}
							//document.getElementById("ctlResult").value = response[0];
							//document.getElementById("ctlSample").value = response[1];
						}
					}
				}, { silent: false });

			}).fail(function () {
				console.log('failed to load ' + lib + ' library')
			});
		}

		ExecAddSCHEMA(command) {
			console.log(command);
			$.get(libName).done(function (data) {
				IPython.notebook.kernel.execute(data, { iopub: { output: function () { } } }, { silent: false });
				IPython.notebook.kernel.execute("print(" + command + ")", {
					iopub: {
						output: function (msg) {
							console.log(msg);
							if (msg.header['msg_type'] != 'error') {
								try {
									var response = msg.content['text'];//.split("\n");
									var arr = msg.content['text'].toString();
									//alert(arr);
									var chek = arr.replace(/[\[\]']+/g, '')
									if (chek.trim() == "None") {
										$('.schema').css('display', 'none');
									}
									else {
										arr = arr.replace(/[\[\]']+/g, '').split(",");
										console.log(arr.length);
										if (arr.length > 0) {
											$('.schema').css('display', '');
											$('#selSchema').empty();
											for (var i = 0; i < arr.length; i++) {
												var option = $('<option />');
												option.attr('value', arr[i].trim()).text(arr[i]);
												$('#selSchema').append(option);
											}
											var ddldefault = "<option value='0'>Select</option>";
											$('#selSchema').prepend(ddldefault);
											$('#selSchema').val('0');
											console.log(response);
										}
										else {
											$('.schema').css('display', 'none');
										}
									}
								}
								catch (err) {
									$('.schema').css('display', 'none');
								}
							}
							else {
								$('.schema').css('display', 'none');
							}
							//document.getElementById("ctlResult").value = response[0];
							//document.getElementById("ctlSample").value = response[1];
						}
					}
				}, { silent: false });

			}).fail(function () {
				console.log('failed to load ' + lib + ' library')
			});
		}
	}


	function errorPopup(dialogText,  dialogTitle) {
		$('<div style="padding: 10px; max-width: 500px; word-wrap: break-word;">' + dialogText + '</div>').dialog({
		  draggable: false,
		  modal: true,
		  resizable: false,
		  width: 'auto',
		  title: dialogTitle || 'Error',
		  minHeight: 75,
		  buttons: {
			OK: function () {			  
			  $(this).dialog('destroy');
			}
		  }
		});
	  }

	
  
	//NEWDF,SEP,COLLIST,CONSTANT,TYPE,NEWCOLNAME,DFNAME
	function fnAddColumnConditional() {
	  var _NewDF = $("#columnadd-Conditional-ctlNewDF").val();
	  var _NewColumn = $("#columnadd-Conditional-ctlNewColumn").val();
	  var _DF = $("#columnadd-Conditional-selDF").val();
	  let scriptManager = new ScriptManager();
	  scriptManager.ADDCOLUMN(_NewDF, '', '', '', "CONDITION", _NewColumn, _DF);
	}
  
	//NEWDF,SEP,COLLIST,CONSTANT,TYPE,NEWCOLNAME,DFNAME
	function fnAddColumnExpression() {
	  var _NewDF = $("#columnadd-Expression-ctlNewDF").val();
	  var _NewColumn = $("#columnadd-Expression-ctlNewColumn").val();
	  var _DF = $("#columnadd-Expression-selDF").val();
	  //var _Constant = $("#columnadd-Expression-ctlConstant").val();
	  let scriptManager = new ScriptManager();
	  scriptManager.ADDCOLUMN(_NewDF, '', '', '', "EXPRESSION", _NewColumn, _DF);
	}
  
	//NEWDF,SEP,COLLIST,CONSTANT,TYPE,NEWCOLNAME,DFNAME
	function fnAddColumnConstant() {
	  var _NewDF = $("#columnadd-Constant-ctlNewDF").val();
	  var _NewColumn = $("#columnadd-Constant-ctlNewColumn").val();
	  var _DF = $("#columnadd-Constant-selDF").val();
	  var _Constant = $("#columnadd-Constant-ctlConstant").val();
	  let scriptManager = new ScriptManager();
	  scriptManager.ADDCOLUMN(_NewDF, '', '', _Constant, "CONSTANT", _NewColumn, _DF);
	}
  
	//NEWDF,SEP,COLLIST,CONSTANT,TYPE,NEWCOLNAME,DFNAME
	function fnAddColumnComposite() {
	  var _NewDF = $("#columnadd-Composite-ctlNewDF").val();
	  var _NewColumn = $("#columnadd-Composite-ctlNewColumn").val();
	  var _DF = $("#columnadd-Composite-selDF").val();
	  var _Sep = $("#columnadd-Composite-selSeperator").val();
	  var _Cols = [];
	  $("#columnadd-Composite-Column-UlColumn").find('input[type=checkbox]').each(function () {
		if ($(this)[0].checked == true) {
		  _Cols.push("'" + $(this)[0].value + "'");
		}
	  });
	  let scriptManager = new ScriptManager();
	  scriptManager.ADDCOLUMN(_NewDF, _Sep, _Cols, null, "CONCAT", _NewColumn, _DF);
	}
  
	function fnJoin() {
	  var _NewDF = $("#Join-ctlNewDF").val();
	  var _DF1 = $("#Join-selDF1").val();
	  var _DF2 = $("#Join-selDF2").val();
	  var _How = $("#Join-selHow").val();
	  let scriptManager = new ScriptManager();
	  scriptManager.JOIN(_NewDF, _DF1, _DF2, _How);
	}
  
	function fnDrop() {
	  var _NewDF = $("#Drop-ctlNewDF").val();
	  var _DropDF = $("#Drop-selDropDF").val();
	  var _DropCols = [];
	  $("#Drop-Column-DropColumn").find('input[type=checkbox]').each(function () {
		if ($(this)[0].checked == true) {
		  _DropCols.push("'" + $(this)[0].value + "'");
		}
	  });
	  let scriptManager = new ScriptManager();
	  scriptManager.DROP(_NewDF, _DropDF, _DropCols);
	}

	function fnGroupBy() {
  
	  var _GroupBy_ctlNewDF = $("#GroupBy-ctlNewDF").val();
	  var _GroupBy_ctlDF = $("#GroupBy-ctlDF").val();
	  var _GroupBy_Columns = [];
	  var _AggregateColumns = [];
	  var _AggregateTypes = [];
	  var _NewColumns = [];
	  $("#GroupBy-GBColumn-UlColumn").find('input[type=checkbox]').each(function () {
		if ($(this)[0].checked == true) {
		  _GroupBy_Columns.push("'" + $(this)[0].value + "'");
		}
	  });
  
	  $("#GroupBy-tblAggregate tbody tr").each(function () {
		var tableRow = $(this);
		var agCol = $("TD", tableRow).eq(0).html().trim();
		var agTyp = $("TD", tableRow).eq(1).html().trim();
		var agNCol = $("TD", tableRow).eq(2).html().trim();
  
		_AggregateColumns.push("'" + agCol + "'");
		_AggregateTypes.push("'" + agTyp + "'");
		_NewColumns.push("'" + agNCol + "'");
	  });
  
	  console.log(_AggregateColumns);
	  //NEWDF,GBDF,GBCOL,AGG,AGGCOL,ALIAS
	  let scriptManager = new ScriptManager();
	  scriptManager.GROUPBY(_GroupBy_ctlNewDF, _GroupBy_ctlDF, _GroupBy_Columns, _AggregateColumns, _AggregateTypes, _NewColumns);
	}
  
	function fnConcatenate() {
	  var _RDF = $("#Concatenate-ctlRDF").val();
	  var _DF1 = $("#Concatenate-selDF1").val();
	  var _DF2 = $("#Concatenate-selDF2").val();
	  var _UN = $("#Concatenate-selUnion").val();
	  let scriptManager = new ScriptManager();
	  scriptManager.CONCATENATE(_RDF, _DF1, _DF2,_UN);
	}
  
	function onPopuLoad() {
	  $('label.tree-toggler').click(function () {
		$(this).parent().children('ul.tree').toggle(300);
	  });

	  //Search MultiSelect
	  $(function () {
		$('.colSearch').keyup(function () {
		  var matches = $('ul').find('li:contains(' + $(this).val() + ') ');
		  $('li', 'ul').not(matches).slideUp();
		  matches.slideDown();
		});
		$('#Menu-Search').keyup(function () {
		  var matches = $('ul#Menu').find('li:contains(' + $(this).val() + ') ');
		  $('li', 'ul#Menu').not(matches).slideUp();
		  matches.slideDown();
		});
	  });
  
	  $("#GroupBy-tblAggregate-Add").click(function () {
  
		var _AggregateColumn = $("#GroupBy-AggregateColumn").val().trim();
		var _AggregateType = $("#GroupBy-AggregateType").val().trim();
		var _NewColumnName = $("#GroupBy-NewColumnName").val().trim();
		if (_AggregateColumn == "") {
		  alert('Please mention aggregate column');
		  return;
		}
		else if (_AggregateType == "") {
		  alert('Please mention aggregate type');
		  return;
		}
		else if (_NewColumnName == "") {
		  alert('Please mention new column');
		  return;
		} else {
		  //code to check already exists in temp table
		  var alreadyexists = false;
		  $("#GroupBy-tblAggregate tbody tr").each(function () {
			var tableRow = $(this);
			var agCol = $("TD", tableRow).eq(0).html().trim();
			var agTyp = $("TD", tableRow).eq(1).html().trim();
			var agNCol = $("TD", tableRow).eq(2).html().trim();
  
			if (agCol == _AggregateColumn && agTyp == _AggregateType && agNCol == _NewColumnName) {
			  alreadyexists = true;
			}
		  });
  
		  if (alreadyexists) {
			alert('Duplicate aggregation');
			return;
		  } else {
			var _html = "<tr>";
			_html += "<td>" + _AggregateType + "</td>";
			_html += "<td>" + _AggregateColumn + "</td>";			
			_html += "<td>" + _NewColumnName + "</td>";
			_html += "<td><button  class='btn btn-xs btn-danger'><i class='fa fa-trash'></i></button></td>";
			_html += "</tr>";
			$("#GroupBy-tblAggregate-tbody").append(_html);
			$("#GroupBy-AggregateColumn").val("");
			$("#GroupBy-AggregateType").val("");
			$("#GroupBy-NewColumnName").val("");
			fnGroupBy();
		  }
		}

		$("#GroupBy-tblAggregate-tbody tr td button").click(function () {
			if (confirm("Are you sure want to remove this aggregate function?")) 
			{
			var row = $(this).closest("TR");
			var table = $("#GroupBy-tblAggregate")[0];
			table.deleteRow(row[0].rowIndex);
			fnGroupBy();
			}
			//console.log($(this).val());
		});

	  });
  
  
	  $(".multiselect").on({
		mouseenter: function () {
			//stuff to do on mouse enter
		},
		mouseleave: function () {
			//stuff to do on mouse leave
			$(this).find('.dropdown-content').css('display','none');
    		expanded = false;
		}
	});

	//   $("#Drop-Column").on("mouseover", function () {
	// 	//stuff to do on mouseover
	// 	alert('hello');
	//  });


	  //ADD COLUMN - CONDITIONAL
	  $('#columnadd-Conditional-ctlNewDF').on('input', function () {
		fnAddColumnConditional();
	  });
	  $('#columnadd-Conditional-ctlNewColumn').on('input', function () {
		fnAddColumnConditional();
	  });
	  $("#columnadd-Conditional-selDF").change(function () {
		fnAddColumnConditional();
	  });
  
	  //ADD COLUMN - EXPRESSION
	  $("#columnadd-Expression-ctlNewDF").on('input', function () {
		fnAddColumnExpression();
	  });
	  $("#columnadd-Expression-ctlNewColumn").on('input', function () {
		fnAddColumnExpression();
	  });
	  $("#columnadd-Expression-selDF").change(function () {
		fnAddColumnExpression();
	  });
  
  
	  //ADD COLUMN - CONSTANT
	  $("#columnadd-Constant-ctlNewDF").on('input', function () {
		fnAddColumnConstant();
	  });
	  $("#columnadd-Constant-ctlNewColumn").on('input', function () {
		fnAddColumnConstant();
	  });
	  $("#columnadd-Constant-selDF").change(function () {
		fnAddColumnConstant();
	  });
	  $("#columnadd-Constant-ctlConstant").on('input', function () {
		fnAddColumnConstant();
	  });
  
	  //ADD COLUMN - CONCAT
	  $("#columnadd-Composite-ctlNewDF").on('input', function () {
		fnAddColumnComposite();
	  });
	  $("#columnadd-Composite-ctlNewColumn").on('input', function () {
		fnAddColumnComposite();
	  });
	  $("#columnadd-Composite-selDF").change(function () {
		fnAddColumnComposite();
	  });
	  $("#columnadd-Composite-Column-UlColumn").click(function () {
		fnAddColumnComposite();
	  });
	  $("#columnadd-Composite-selSeperator").change(function () {
		fnAddColumnComposite();
	  });
  
  
	  //JOIN
	  $(".Join-ctlNewDF").on('input', function () {
		fnJoin();
	  });
	  $("#Join-selDF1").change(function () {
		fnJoin();
	  });
	  $("#Join-selDF2").change(function () {
		fnJoin();
	  });
	  $("#Join-selHow").change(function () {
		fnJoin();
	  });
  
	  //DROP
	  $("#Drop-ctlNewDF").on('input', function () {
		fnDrop();
	  });
	  $("#Drop-selDropDF").change(function () {
		fnDrop();
	  });
	  $("#Drop-Column-DropColumn").click(function () {
		fnDrop();
	  });
  
  
	  //GROUPBY
	  $("#GroupBy-ctlNewDF").on('input', function () {
		fnGroupBy();
	  });
	  $("#GroupBy-ctlDF").change(function () {
		fnGroupBy();
	  });
	  $("#GroupBy-GBColumn-UlColumn").click(function () {
		fnGroupBy();
	  });
	  //GroupBy-NewColumnName
  
  
	  //CONCATENATE
	  $("#Concatenate-ctlRDF").on('input', function () {
		fnConcatenate();
	  });
	  $("#Concatenate-selDF1").change(function () {
		fnConcatenate();
	  });
	  $("#Concatenate-selDF2").change(function () {
		fnConcatenate();
	  });

	  $("#Concatenate-selUnion").change(function () {
		fnConcatenate();
	  });
  
	  reinitControls();
	}


  
	function reinitControls() {
		
	  document.getElementById("ctlResult").value = "";
	  document.getElementById("ctlSample").value = "";
	  document.getElementById("GroupBy-tblAggregate-tbody").innerHTML = "";
	  var inputs, selects, textareas, index;
	  var maincontentdiv = document.getElementById("main-content");
	  inputs = maincontentdiv.getElementsByTagName('input');
	  selects = maincontentdiv.getElementsByTagName('select');
	  textareas = maincontentdiv.getElementsByTagName('textarea');
	  for (index = 0; index < inputs.length; ++index) {
		if (inputs[index].type == "text")
		  inputs[index].value = '';
		else if (inputs[index].type == "checkbox")
		  inputs[index].checked = false;
	  }
	  for (index = 0; index < selects.length; ++index) {
		//selects[index].selectedIndex = "0";
		//selects[index].options[0].innerHTML = "[Select]";
	  }
	  for (index = 0; index < textareas.length; ++index) {
		textareas[index].innerHTML = "";
	  }
	}



	$("#selDB").change(function () {		
		//fnAddTable();
		$('#QsloadingModal').modal('show');
		fnAddSchema();
		fnReadWrite();
	});

	$("#selSchema").change(function () {
		fnReadWrite();
	});

	

	$("#selTB").on('input',function(){
		fnReadWrite();
	});
	
	
	
	$("#_readselDB").change(function(){	
		$('#QsloadingModal').modal('show');	
		fnAddTable();
		fnReadWrite();
	});



	$("#_readselTB").change(function(){
		fnReadWrite();
	});



	$("#_readctlNewDF").on('input',function(){
		fnReadWrite();
	});



	$('input[name="drone"]').click(function () {
		if ($(this).is(':checked')) {
			$("#ctlResult").val("");
			$("#selDB").val(0);	
			$("#selTB").val("");
			$("#ctlNewDF").val(0);	
			$('#selmode').val(0);	
			$('#_readselDB').val(0);
			$('#_readselTB').val(0);
			$('#_readctlNewDF').val("");
			var _NewDB = $("#selDB option:selected").text().trim();
			var _NewDBtext = $("#selDB").val();
			console.log(_NewDBtext);
			var _NewTB = $("#selTB").val();
			var _NewDF = $("#ctlNewDF").val();
			var type = $(this).val();
			var mode = $('#selmode').val();
			let scriptManager = new ScriptManager();
			
			if (type == "write") {
				//$('#_mode').css('display', 'block');
				$('._dvsqlread').css('display', 'none');
				$('._dvsqlwrite').css('display', '');
				$('.schema').css('display', 'none');
				var mode = $('#selmode').val();
				var schema=$('#selschema').val();
				if (_NewDB != 0 && _NewDB!="Select") {
					scriptManager.DBReadWrite(_NewDB,_NewDF,_NewTB,mode,type,schema);
				}
			}
			else {
				//$('#_mode').css('display', 'none');
				$('._dvsqlread').css('display', '');
				$('._dvsqlwrite').css('display', 'none');
				
				if (_NewDB != 0 && _NewDB!="Select") {
					scriptManager.DBReadWrite(_NewDB,_NewDF,_NewTB,mode,type,'');
				}
			}

		}
	});



	$('#ctlNewDF').change(function () {
		fnReadWrite();
	});




	$("#selmode").change(function(){
		fnReadWrite();
	});	



	// $('#btnaddcell').click(function(){
	// 	var data = document.getElementById("ctlResult").value;
    //     pasteCode(data);
	// });

	function fnAddTable() {
		var _NewDB = $("#_readselDB option:selected").text().trim();//$('#selDB option:selected');
		//var display = _NewDB.clone();
		//_NewDB=$.trim(display.text());
		let scriptManager = new ScriptManager();
		scriptManager.ADDTABLE(_NewDB);
	}

	function fnAddSchema() {
		var _NewDB = $("#selDB").val();//$('#selDB option:selected');
		//var display = _NewDB.clone();
		//_NewDB=$.trim(display.text());
		let scriptManager = new ScriptManager();
		scriptManager.ADDSCHEMA(_NewDB);
	}

	

	function fnReadWrite() {
		var type=$("input[name='drone']:checked").val();
		var _NewDB = $("#selDB option:selected").text().trim();
		var _NewTB = $("#selTB").val();
		var _NewDF = $("#ctlNewDF").val();
		var mode=$('#selmode').val();
		let scriptManager = new ScriptManager();
		
		if(type=="write"){
			var _NewDB = $("#selDB").val();
			var _NewTB = $("#selTB").val();
			var _NewDF = $("#ctlNewDF").val();
			var mode=$('#selmode').val();
			var schema=$("#selSchema").val();
			scriptManager.DBReadWrite(_NewDB,_NewDF,_NewTB,mode,type,schema);
			}
			else{
				var _NewDB = $("#_readselDB option:selected").text().trim();
				var _NewTB = $("#_readselTB").val();
				var _NewDF = $("#_readctlNewDF").val();
				scriptManager.DBReadWrite(_NewDB,_NewDF,_NewTB,mode,type,'');
			}
	}
};