(function(global){
	'use strict';

	// returns a block as a DOM element populated with all internal elements
	// input is in the format of [name, value, contents/units]
	// two types of blocks: 
	// 1. a single numeric parameter (with a default value), e.g. ["forward"] [10] ["steps"]
	// 2. a container for other blocks, e.g. ["repeat"] [5] [actions-to-repeat]
	function createBlock(name, value, contents){
		var item = elem('div', {'class': 'block', draggable: true, 'data-name': name}, [name]);
		// assemble the value
		if (value !== undefined && value !== null){
			item.appendChild(elem('input', {type: 'number', value: value}));
		}
		// assemble the contents/units
		if (Array.isArray(contents)){
			item.appendChild(elem('div', {'class': 'container'}, contents.map(function(block){
				return createBlock.apply(null, block);
			})));
		}else if (typeof contents === 'string'){
			item.appendChild(document.createTextNode(' ' + contents));
		}
		return item;
	}

	// get block's contents, used in "repeat"
	function blockContents(block){
		var container = block.querySelector('.container');
		return container ? [].slice.call(container.children) : null;filter
	}

	// get block's integer value
	function blockValue(block){
		var input = block.querySelector('input');
		return input ? Number(input.value) : null;
	}

	// get block's units
	function blockUnits(block){
		if (block.children.length > 1 && block.lastChild.nodeType === Node.TEXT_NODE && block.lastChild.textContent){
			return block.lastChild.textContent.slice(1);
		}
	}

	// return a structure suitable for serializing with JSON, to save blocks in a form they can easily be restored from
	// return value is in the format of [name, value, contents/units]
	function blockScript(block){
		// 1. populate name
		var script = [block.dataset.name];
        // 2. populate value
		var value = blockValue(block);
        if (value !== null){
    		script.push(blockValue(block));
        }
		// 3. populate contents/units
		var contents = blockContents(block);
		var units = blockUnits(block);
		if (contents){script.push(contents.map(blockScript));}
		if (units){script.push(units);}
		return script.filter(function(notNull){ return notNull !== null; });
	}

	// run block one by one, will trigger menu.js -> runEach(blocks)
	function runBlocks(blocks){
		blocks.forEach(function(block){ trigger('run', block); });
	}

	global.Block = {
		create: createBlock,
		value: blockValue,
		contents: blockContents,
		script: blockScript,
		run: runBlocks,
		trigger: trigger
	};

	window.addEventListener('unload', file.saveLocal, false);
	window.addEventListener('load', file.restoreLocal, false);
})(window);
