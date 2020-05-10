
// function dynamicallyLoadScript(url) {
//     var script = document.createElement("script");  // create a script DOM node
//     script.src = url;  // set its src to the provided URL

//     document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
// }

// dynamicallyLoadScript()
var art_folder = "C:/Users/Brolly/Pictures/Art/"

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
function generate_piece(handle_limit = 50){
    //The handles are changing the endpoints. How can I prevent this?
    // var path = new Path({
    //     strokeColor: 'black'
    // });
    // var points = [new Point(30, 50), new Point(170, 50)];
    // path.addSegments(points);
    // return path;
    var left_half = new Path({
        strokeColor : 'black'
    });
    anchors = [new Point(100,200), new Point(50,150), new Point(100,100)];
    segments = [];
    var i;
    for(i = 0; i < 3; i++){
        // handle_0 = new Point(Math.random() * handle_limit - handle_limit/2, Math.random() * handle_limit - handle_limit/2);
        // handle_1 = new Point(Math.random() * handle_limit - handle_limit/2, Math.random() * handle_limit - handle_limit/2);
        handle_0 = new Point(Math.random() * handle_limit, Math.random() * handle_limit);
        handle_1 = new Point(Math.random() * handle_limit, Math.random() * handle_limit);
        segments.push(new Segment(anchors[i], handle_0, handle_1))
    }
    left_half.addSegments(segments);
    left_half.applyMatrix = true;
    left_half.pivot = left_half.bounds.rightCenter;
    console.log("In generate")
    // reflection_matrix = new Matrix([-1,0,0,1,0,0]); //This does NOT work. Sends the x position to -100

    var right_half = left_half.clone({insert : true});
    right_half.scale(-1,1);
    // left_half.join(right_half);
    return left_half;
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
function put_circle(center){
    var circle = new Path.Circle({
        center : center,
        radius : 5,
        strokeColor: 'black',
        strokeWidth: 1,
        name: "center_circle"
    });
}
function sample_from_array(arr){
    return arr[Math.floor(Math.random()*arr.length)];
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
        distribute_radially_symmetric(pieces[0], center_circle.position, 30, 3, 0, layer);
        distribute_radially_symmetric(pieces[1], center_circle.position, 30, 3, 60, layer);
    }
    var pieces = load_paths("resources/pieces.svg", null, _make_flower);
}
function deg2rad(deg){
    return deg * (Math.PI / 180);
}

function rad2deg(rad){
    return rad * (180 / Math.PI);
}

function distribute_radially_symmetric(path, center, offset, num_copies, start_angle=0, layer=project.activeLayer, axis=null){
    if(axis === null){
        axis = get_axes_of_symmetry(path)[0];
    }
    path = set_path_angle(path, 0, axis, true);

    path.strokeWidth = 1;
    path.applyMatrix = true;
    var angle_inc = 360 / num_copies;
    new_paths = [];
    var i;
    for(i = 0; i < num_copies; i++){
        new_path = path.clone({insert : false});
        start_point = new Point(center.x, center.y - offset);
        set_base_point_position(new_path, start_point);
        new_path.pivot = center;
        // console.log(new_path.pivot);
        new_path.rotate(start_angle + i*angle_inc);
        new_paths.push(new_path);
        layer.addChild(new_path);
    }
    return new_paths;
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
    return path;
}


// TODO change to return output of callback. Make callback mandatory second arg.
function load_paths(file_path, targetLayer=null, _callback = null){
    console.log("loading paths")
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
                // var paths = item.getItems();
                var paths = item.getItems({
                    class: Path
                });
                // var circles = item.getItems({
                //     class: Circle
                // });
                // paths = paths.concat(circles);
                // vars
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


function points2angle(p0, p1, unit = "Degrees"){
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y; 
    let theta =  Math.atan(dy / dx);
    if(unit == "Radians"){
        theta == theta;
    }
    else if(unit == "Degrees"){
        theta *= 180/Math.PI;
    }
    else{
        throw "Invalid angle unit: " + unit;
    }
    return theta;
}

function get_reflection(path, axis, clone = true){
    if(clone){
        path = path.clone();
    }
    // MAtrix should be {{cos p, -sin p},{sin p, cos p}} * {{1,0},{0,-1}} * {{cos -p, -sin -p},{sin -p, cos -p}}, where p is the angle of the axis. 
    // Condensed version of this matrix was taken from wolfram alpha
    /*
    (cos^2(p) - sin^2(p) | 2 cos(p) sin(p)
    2 cos(p) sin(p) | sin^2(p) - cos^2(p))
    */
    // Translate path to align with axis
    // http://paperjs.org/reference/matrix/
    // TODO move path or axis so that they align correctly?
    // Get angle of axis
    // let [p0, p1] = axis;
    // const dx = p1.x - p0.x;
    // const dy = p1.y - p0.y; 
    // let theta = Math.atan(dy / dx);
    let theta = points2angle(axis[0], axis[1], unit = "Radians");
    // This is one ugly line
    let matrix = new Matrix(Math.pow(Math.cos(theta),2) - Math.pow(Math.sin(theta),2), 2 * Math.cos(theta) * Math.sin(theta), 2*Math.cos(theta) * Math.sin(theta), Math.pow(Math.sin(theta),2) - Math.pow(Math.cos(theta),2), 0, 0);
    let position = [path.position.x, path.position.y];
    path.transform(matrix);
    path.setPosition(position[0], position[1]);
    return path;

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
    return pieces;
}

//
function get_axes_of_symmetry(path, _callback = null){
    // Get list of all nodes, and points halfway between nodes by arclength
    let draw_axis = false;
    base_area = path.area;

    var points = [];
    path.curves.forEach(function(c){
        point1 = c.point1;
        points.push(point1);
        mid_point = c.getLocationAtTime(0.5).point;

        points.push(mid_point);
    });
    // For each pair of opposite points, check whether reflecting the path across their connecting segment preserves the path.
    let colors = ["red", "blue", "green", "purple", "orange", "black"];
    let color_id = 0;
    let axes_of_symmetry = [];
    points.forEach(function(p){
        let offset = path.getOffsetOf(p);
        let offset2 = offset + path.length / 2;
        if(offset2 > path.length){
            offset2 = offset2 - path.length;
        }
        let p2 = path.getPointAt(offset2);
        let c = colors[color_id];
        let test_axis = [p,p2];
        let mirror_path = get_reflection(path, test_axis, true);
        mirror_path.strokeColor = c;
        let intersection = path.intersect(mirror_path, {insert:false});
        intersection_relative_area = Math.abs(intersection.area / base_area);
        // console.log(c + ": " + intersection_relative_area);
        mirror_path.remove(); 
        if(intersection_relative_area > 0.9){
            axes_of_symmetry.push(test_axis)
        }
        color_id += 1;

    });
    if(axes_of_symmetry.length > 0){
        console.log("Found axis");
        if(draw_axis){
            axes_of_symmetry.forEach(function(axis){
                axis_line = new Path.Line(axis[0], axis[1]);
                axis_line.strokeColor = "black";
            });
        }
    }
    return axes_of_symmetry;   

}

// Note that this may end up setting the path to be upside down. Maybe I should just train a nn. Creating the training data should be easy.
function set_path_angle(path, angle = 0, axis = null, clone = true){
    // When angle is 0, path's axis of symmetry is straight up.
    if(axis === null){
        axis = get_axes_of_symmetry(path)[0];
    }
    angle -= 90;
    const current_angle = points2angle(axis[0], axis[1], "Degrees");
    let dangle = angle - current_angle;
    if(clone){
        path = path.clone();
    }
    path.rotate(dangle);
    return path;
}