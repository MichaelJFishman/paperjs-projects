
// function dynamicallyLoadScript(url) {
//     var script = document.createElement("script");  // create a script DOM node
//     script.src = url;  // set its src to the provided URL

//     document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
// }

// dynamicallyLoadScript()

function reflect_and_rotate(item, center_of_rotation, num_clones){
    /**
    returns the a list of the original and cloned items, in clockwise order starting from the original
    */
    var item_list = [];
    var arc_angle = 360/num_clones;
    for(var i=1; i<num_clones; i++){
        var new_item = item.clone()
        item_list.push(new_item);
        new_item.rotate(arc_angle * i, center_of_rotation);
    }
    return item_list;
}

function simple_circle_flower_example(){
    var center_circle = new Path.Circle({
        center: view.center,
        radius: 30,
        strokeColor: 'red',
        strokeWidth: 5
    });

    var first_leaf = center_circle.clone();
    first_leaf.scale(0.5)
    first_leaf.position.y = center_circle.position.y/2
    var leaves = reflect_and_rotate(first_leaf, center_circle.position, 6)
}
function load_svg_file(file_path,layer=null, path_list = []){
    local_url = "http://localhost:8000/";
    url = local_url + file_path;
    activeLayer = project.activeLayer
    if(layer == null){
        layer = new Layer({visible : false})
    }
    layer.importSVG(url,
        {
            exppandShapes: true,
            onLoad: function(item){
                console.log("imported " + file_path);
                console.log(view.center);
                var paths = item.getItems({
                    class: Path
                });
                for (var i = 0; i < paths.length; i++){
                    var p = paths[i];
                    path_list.push(p)
                }
            }
        });
    if(activeLayer != layer){
        layer.remove()
        activeLayer.activate()
    }
}

function load_pieces(file_path, layer=null){
    var pieces = [];
    load_svg_file(file_path, null, pieces);

    if(layer != null){
        console.log("Adding pieces to layer");
        function add_to_layer(item, index){
            layer.addChild(item);
        }
        pieces.forEach(add_to_layer);
    }
    return pieces
}