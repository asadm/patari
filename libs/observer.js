
/*
observe() uses MutationObserver checks if there are any changes in the DOM tree of given target. callback is called on change
Author: Asad Memon

MIT
*/
function observe(target,callback,dontInvokeFirstTime){
    
    if (!dontInvokeFirstTime) 
    	callback(target);

    // Create an observer instance
    var observer = new MutationObserver(function( mutations ) {
      mutations.forEach(function( mutation ) {
        //console.log("MUTATION",mutation);
        if (mutation.type === "childList" || mutation.attributeName === "class"){

            callback(target,mutation);
        }
        
      });    
    });

    // Configuration of the observer:
    var config = {
        attributes: true, 
        childList: true, 
        characterData: true,
        subtree: true 
    };
    // Pass in the target node, as well as the observer options
    observer.observe(target, config);

}

module.exports = observe;