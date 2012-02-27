define([
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/connect",
	"dojo/_base/html",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/keys",
	"../../core/_Module",
	"../AutoScroll"
], function(declare, query, connect, html, Deferred, sniff, win, keys, _Module){

	return declare(_Module, {
		required: ['autoScroll'],

		getAPIPath: function(){
			var path = {
				select: {}
			};
			path.select[this._type] = this;
			return path;
		},
		
		load: function(){
			var g = this.grid;
			this._refSelectedIds = [];
			this.subscribe('gridClearSelection_' + g.id, function(type){
				if(type != this._type){
					this.clear();
				}
			});
			this.batchConnect(
				[g.body, 'onRender', '_onRender'],
				[win.doc, 'onmouseup', '_end'],
				[win.doc, 'onkeydown', function(e){
					if(e.keyCode === keys.SHIFT){
						html.setSelectable(g.domNode, false);
					}
				}],
				[win.doc, 'onkeyup', function(e){
					if(e.keyCode === keys.SHIFT){
						html.setSelectable(g.domNode, true);
					}
				}]
			);
			this._init();
			this.loaded.callback();
		},

		//Public ------------------------------------------------------------------
		enabled: true,

		holdingCtrl: false,

		holdingShift: false,

        selectById: function(/* id */){
			return this._subMark('_markById', arguments, true);
        },

		deselectById: function(/* id */){
			return this._subMark('_markById', arguments, false);
		},

		selectByIndex: function(/* start, end */){
			return this._subMark('_markByIndex', arguments, true);
		},

		deselectByIndex: function(/* start, end */){
			return this._subMark('_markByIndex', arguments, false);
		},

		onSelectionChange: function(newSelectedIds, oldSelectedIds){
			//summary:
			//	Event: fired when the selection is changed.
		},

		//Private -----------------------------------------------------------------
		_subMark: function(func, args, toSelect){
			if(this.arg('enabled')){
				if(toSelect){
					connect.publish('gridClearSelection_' + this.grid.id, [this._type]);
				}
				this._lastSelectedIds = this.getSelected();
				this._refSelectedIds = [];
				var _this = this;
				return Deferred.when(this[func](args, toSelect), function(){
					_this._onSelectionChange();
				});
			}
		},

		_start: function(item, extending, isRange){
			if(!this._selecting && !this._marking && this.arg('enabled')){
				html.setSelectable(this.grid.domNode, false);
				this._fixFF(1);
				var isSelected = this._isSelected(item);
				isRange = isRange || this.arg('holdingShift');
				if(isRange && this._lastStartItem){
					this._isRange = true;
					this._toSelect = this._lastToSelect;
					this._startItem = this._lastStartItem;
					this._currentItem = this._lastEndItem;
				}else{
					this._startItem = item;
					this._currentItem = null;
					if(extending || this.arg('holdingCtrl')){
						this._toSelect = !isSelected;
					}else{
						this._toSelect = true;
						this.clear(1);
					}
				}
				connect.publish('gridClearSelection_' + this.grid.id, [this._type]);
				this._beginAutoScroll();
				this.grid.autoScroll.enabled = true;
				this._lastSelectedIds = this.getSelected();
				this._selecting = true;
				this._highlight(item);
			}
		},

		_highlight: function(target){
			if(this._selecting){
				var start = this._startItem,
					current = this._currentItem,
					_this = this,
					highlight = function(from, to, toHL){
						from = from[_this._type];
						to = to[_this._type];
						var dir = from < to ? 1 : -1;
						for(; from != to; from += dir){
							var item = {};
							item[_this._type] = from;
							_this._highlightSingle(item, toHL);
						}
					};
				if(current === null){
					//First time select.
					this._highlightSingle(target, true);
				}else{
					if(this._inRange(target[this._type], start[this._type], current[this._type])){
						//target is between start and current, some selected should be deselected.
						highlight(current, target, false);
					}else{
						if(this._inRange(start[this._type], target[this._type], current[this._type])){
							//selection has jumped to different direction, all should be deselected.
							highlight(current, start, false);
							current = start;
						}
						highlight(target, current, true);
					}
				}
				this._currentItem = target;
				this._focus(target);
			}
		},

		_end: function(){
			if(this._selecting){
				this._fixFF();
				this._endAutoScroll();
				this._selecting = false;
				this._marking = true;
				var g = this.grid,
					_this = this;
				g.autoScroll.enabled = false;
				var d = this._addToSelected(this._startItem, this._currentItem, this._toSelect);
				this._lastToSelect = this._toSelect;
				this._lastStartItem = this._startItem;
				this._lastEndItem = this._currentItem;
				this._startItem = this._currentItem = this._isRange = null;
				Deferred.when(d, function(){
					html.setSelectable(g.domNode, true);
					_this._marking = false;
					_this._onSelectionChange();
				});
			}
		},

		_highlightSingle: function(target, toHighlight){
			toHighlight = toHighlight ? this._toSelect : this._isSelected(target);
			this._doHighlight(target, toHighlight);
		},

		_onSelectionChange: function(){
			var selectedIds = this.getSelected();
			this.onSelectionChange(selectedIds, this._lastSelectedIds);
			this._lastSelectedIds = selectedIds;
		},

		_inRange: function(value, start, end, isClose){
			return ((value >= start && value <= end) || (value >= end && value <= start)) && (isClose || value != end);
		},

		_fixFF: function(isStart){
			if(sniff('ff')){
				query('.dojoxGridxSortNode', this.grid.headerNode).forEach(function(n){
					n.style.overflow = isStart ? 'visible' : '';
				});
			}
		}
	});
});