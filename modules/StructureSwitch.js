define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'../core/_Module'
], function(declare, array, _Module){

/*=====
=====*/

	return declare(_Module, {
		name: "structureSwitch",
		required: ['hiddenColumns'],
		'default': '',
		orientation: true,

		constructor: function(){
			var t = this,
				config = t.arg('config', {}),
				portrait = t.arg('portrait'),
				landscape = t.arg('landscape');
			if(portrait){
				config.portrait = portrait;
			}
			if(landscape){
				config.landscape = landscape;
			}
			t.connect(window, 'orientationchange', '_check');
		},

		preload: function(){
			var dft = this.config[this.arg('default')];
			if(dft){
				var toHide = array.filter(array.map(this.grid._columns, function(col){
					return col.id;
				}), function(id){
					return array.indexOf(dft, id) < 0;
				});
				[].push.apply(this.grid.hiddenColumns.arg('init', []), toHide);
			}
		},

		load: function(args, startup){
			var t = this;
			startup.then(function(){
				t._check();
				t.loaded.callback();
			});
		},

		//Public----------------------------------------------------------------------------
		to: function(name){
			var g = this.grid;
			var structure = this.config[name] || array.map(g.structure, function(col){
				return col.id;
			});
			if(structure){
				var hiddenColumns = g.hiddenColumns;
				var toHide = array.filter(array.map(g._columns, function(col){
					return col.id;
				}), function(id){
					return array.indexOf(structure, id) < 0;
				});
				var toShow = array.filter(structure, function(id){
					return !g._columnsById[id];
				});
				hiddenColumns.add.apply(hiddenColumns, toHide);
				hiddenColumns.remove.apply(hiddenColumns, toShow);
			}
		},

		//Private-----------------------------------------------------------------------------
		_check: function(){
			var t = this;
			if(t.arg('orientation')){
				if(Math.abs(window.orientation) == 90){
					t.to('landscape');
				}else if('orientation' in window){
					t.to('portrait');
				}
			}
		}
	});
});