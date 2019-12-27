
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

function make_flower(layer = project.activeLayer){
    // All the children of later have a bunch of undefined properties. Why?
    _make_flower = function(pieces){
        center_circle = new Path.Circle({
            center : view.center,
            radius : 30,
            strokeColor: 'black',
            strokeWidth: 1,
            name: "center_circle"
        });
        // var petal_0 = pieces[0].clone({insert: false});
        var petal_prototype = pieces[0];
        // var petal_0_base = center_circle.bounds.topCenter;
        // set_base_point_position(petal_0, petal_0_base);
        // petal_0.pivot = petal_0_base;
        // console.log(petal_0);
        // layer.addChild(petal_0);
        var num_petals = 3;
        var angle = 360 / num_petals;
        console.log("Angle: " + angle)
        var i = 0;
        for(i = 0; i < num_petals; i++){
            var petal = petal_prototype.clone({insert : false});
            petal.applyMatrix = true;
            petal.name = "petal_" + i;
            set_base_point_position(petal,center_circle.bounds.topCenter);
            console.log(i);
            petal.pivot = center_circle.position;
            // set_pivot(petal, center_circle.position);
            // set_pivot_to_base(petal);
            console.log(petal);
            petal.rotate(angle * (i));
            // petal.position.x += 20 * i;
            layer.addChild(petal);
        }

    }
    var pieces = load_paths("resources/pieces.svg", null, _make_flower);




}

function get_base_point(path){
    // The point of the first segment is usually not the base point we want.
    // Assume for now that the item is vertical, and the bottom point is the base point
    return path.bounds.bottomCenter;
}

// function set_base

function set_base_point_position(path, point){
    // Assume for now that the item is vertical, and the center of bottom bottom point is the base point
    var base_point = get_base_point(path);
    var adjustment_vector = new Point(path.position.x - base_point.x, path.position.y - base_point.y);
    var adjusted_point = new Point(point.x + adjustment_vector.x, point.y + adjustment_vector.y);
    path.position = adjusted_point;
}

function set_pivot(path, global_point){
    path.pivot = global_point.subtract(path.position);
}


function load_paths(file_path, targetLayer=null, _callback = null){
    var path_list = [];
    local_url = "http://localhost:8000/";
    url = local_url + file_path;
    activeLayer = project.activeLayer
    tempLayer = new Layer({visible : false})

    tempLayer.importSVG(url,
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
                    path_list.push(p);
                    if (targetLayer != null){
                        targetLayer.addChild(p);
                    }
                }
                if(_callback != null){
                    _callback(path_list);
                }
            }
        });

    tempLayer.remove();
    activeLayer.activate();
    // if(_callback != null){
    //     _callback(path_list);
    // }
    return path_list;
    
}

function load_paths_test(){
    layer = project.activeLayer;
    _callback = function(path_list){
        console.log(path_list);
        layer.addChild(path_list[0].clone());
    };
    var pieces = load_paths("resources/pieces.svg", null, _callback);
    // console.log(pieces);
    // project.activeLayer.addChild(pieces[0]);
}