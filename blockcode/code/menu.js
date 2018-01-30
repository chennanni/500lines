(function(global){
	'use strict';

	var menu = document.querySelector('.menu');
	var script = document.querySelector('.script');
	var scriptRegistry = {}; // used as a registry for all instructions
	var scriptDirty = false;

	// mark the script has been changed
	function runSoon(){ scriptDirty = true; }

	// create some menu item, register its function, append to the menu
	// name: name of the instruction, e.g. "Left"
	// fn: function to be called to draw, e.g. left
	// value: value passed along with the function, e.g. 5
	// units: unit of the value, e.g. "degrees"
	function menuItem(name, fn, value, units){
		var item = Block.create(name, value, units);
		scriptRegistry[name] = fn;
		menu.appendChild(item);
		return item;
	}

	// run the 'script' and see results, it's keep looping all the time
	function run(){
		if (scriptDirty){ // if script is dirty, draw the script first
			scriptDirty = false;
			Block.trigger('beforeRun', script); // clear
			var blocks = [].slice.call(document.querySelectorAll('.script > .block')); // select all blocks under script
			Block.run(blocks); // run these blocks
			Block.trigger('afterRun', script); // drawTurtle
		}else{
            Block.trigger('everyFrame', script); // do nothing?
        }
		requestAnimationFrame(run); // tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.
	}
	requestAnimationFrame(run);

	// the ultimate run cmd, trigger the drawing function in turtle.js
	// the flow to run blocks is: Block.run(Blocks) -> Menu.runEach(evt)
	function runEach(evt){
		var elem = evt.target;
		if (!matches(elem, '.script .block')) return;
		if (elem.dataset.name === 'Define block') return;
		elem.classList.add('running');
		scriptRegistry[elem.dataset.name](elem);
		elem.classList.remove('running');
	}

	// define the 'Repeat' function
	function repeat(block){
		var count = Block.value(block);
		var children = Block.contents(block);
		for (var i = 0; i < count; i++){
			Block.run(children);
		}
	}
	// create a 'Repeat' menu item
	menuItem('Repeat', repeat, 10, []);

	global.Menu = {
		runSoon: runSoon,
		item: menuItem
	};

	document.addEventListener('drop', runSoon, false);
	script.addEventListener('run', runEach, false);
	script.addEventListener('change', runSoon, false);
	script.addEventListener('keyup', runSoon, false);
})(window);
