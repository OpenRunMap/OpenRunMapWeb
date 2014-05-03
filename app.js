OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';

function init() {
    var bg = new OpenLayers.Layer.XYZ(
        "Natural Earth",
        [
            "http://a.tiles.mapbox.com/v3/petersongis.map-ogsoty39/${z}/${x}/${y}.png",
            "http://b.tiles.mapbox.com/v3/petersongis.map-ogsoty39/${z}/${x}/${y}.png",
            "http://c.tiles.mapbox.com/v3/petersongis.map-ogsoty39/${z}/${x}/${y}.png",
            "http://d.tiles.mapbox.com/v3/petersongis.map-ogsoty39/${z}/${x}/${y}.png"
        ], {
            sphericalMercator: true
        }
    );
    
    map = new OpenLayers.Map({
        projection: 'EPSG:3857',
        div: "map",
        layers: [bg],
        center: new OpenLayers.LonLat(1348592, 7905377),
        zoom: 12
    });

    map.addControl(new OpenLayers.Control.MousePosition());

    routes = new OpenLayers.Layer.XYZ( "Routes",
        [ "https://www.mapbox.com/v3/urechandro.runtracks/${z}/${x}/${y}.png" ], {
            sphericalMercator: true,
            isBaseLayer: false,
            visibility: false
        }
    );
    map.addLayer(routes);

    runtracks = new OpenLayers.Layer.XYZ( "Routes",
        [ "https://www.mapbox.com/v3/igorti.routes/${z}/${x}/${y}.png" ], {
            sphericalMercator: true,
            isBaseLayer: false,
            visibility: false
        }
    );
    map.addLayer(runtracks);


    var roadsStyle = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({
            strokeColor: "#000000",
            strokeOpacity: 0,
            strokeWidth: 2
        })
    });

    var parser = new OpenLayers.Format.GeoJSON();
    var features = parser.read(roads);
    var trails = new OpenLayers.Layer.Vector("GeoJSON", { styleMap: roadsStyle, projection: "EPSG:4326"});
    trails.addFeatures(features)
    map.addLayer(trails);    


    var routeStyle = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style({
        strokeColor: "green",
        strokeOpacity: 1,
        strokeWidth: 6
    }), 
    "temporary": new OpenLayers.Style({
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 4
    })
    });

    routeLayer = new OpenLayers.Layer.Vector("Route", {styleMap: routeStyle});
    routeLayer.events.on({"featureadded": featureadded});
    routeLayer.events.on({"sketchmodified": featuremodified});
    map.addLayer(routeLayer);

    var snap = new OpenLayers.Control.Snapping({
        layer: routeLayer, targets: [trails]
    });
    map.addControl(snap);
    snap.activate();

    drawControl = new OpenLayers.Control.DrawFeature(
        routeLayer, OpenLayers.Handler.Path
    );
    map.addControl(drawControl);
    

    $("#toggle-draw input").click(function(){
        var checked = $("#toggle-draw input").is(":checked");
        if (checked) {
            drawControl.activate();
        } else {
            drawControl.deactivate();
        }

    });

    $("#comunity-runs input").click(function(){
        var checked = $("#comunity-runs input").is(":checked");
        routes.setVisibility(checked);
    });

    $("#trails input").click(function(){
        var checked = $("#trails input").is(":checked");
        runtracks.setVisibility(checked);
    });
}

function featureadded(event) {
    $("#route-length").html(Math.floor(event.feature.geometry.getLength()) + " m");
     var format = new OpenLayers.Format.GPX({
         internalProjection:new OpenLayers.Projection("EPSG:900913"),
         externalProjection: new OpenLayers.Projection("EPSG:4326")
    });
    
    var gpx = format.write([event.feature]);       
    
    var gjson = new OpenLayers.Format.GeoJSON({
         internalProjection:new OpenLayers.Projection("EPSG:900913"),
         externalProjection: new OpenLayers.Projection("EPSG:4326")
    });

    var gjosn1 = gjson.write([event.feature])
    
}

function featuremodified(event) {
    $("#route-length").html(Math.floor(event.feature.geometry.getLength()) + " m");
}






