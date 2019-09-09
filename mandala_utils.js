
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
function load_svg_file(file_path,layer=project.activeLayer){
    local_url = "http://127.0.0.1:8080/";
    url = local_url + file_path;
        // pieces_url = "./resources/pieces.svg";
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
                    // p.strokeColor = 'red';
                    // p.strokeWidth = 3;
                    // p.scale(1);
                    // p.position = new Point(200,200);
                    // p.position.x = 100;
                    // p.position.y = 100;
                    // p.position.x = 250;
                    // p.position.y = 250;
                }
                // item.scale(5);
            }
        });

}

function load_pieces(layer=project.activeLayer){
    load_svg_file("pieces.svg", layer)
    // console.log(layer.children);
    // console.log(pieces);
}