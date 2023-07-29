require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/geometry/geometryEngineAsync",
    "esri/geometry/geometryEngine",
    "esri/Graphic",
    "esri/rest/route",
    "esri/rest/support/RouteParameters",
    "esri/rest/support/FeatureSet",
    "esri/widgets/Search",
    "esri/rest/serviceArea",
    "esri/rest/support/ServiceAreaParameters"
  ], function(esriConfig, Map, MapView, Point, geometryEngineAsync, geometryEngine, Graphic, route, RouteParameters, FeatureSet, Search, serviceArea, ServiceAreaParams) {

    esriConfig.apiKey = "AAPK820435f2f2c44734adb86048c24d7a461ZxGsDqRfXnapEWTXg2-4IVCqgz-ougtsHeUStNyAYnnWk8modZb_Xz2fh2dhbdV";

    const map = new Map({
      basemap: "arcgis-navigation" //Basemap layer service
    });

    const view = new MapView({
      container: "map",
      map: map,
      center: [-118.24532,34.05398], //Longitude, latitude
      zoom: 12
    });

    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
    const serviceAreaUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea";

    // view.on("click", function(event){
    //   console.log("Adding a point")
    //   console.log(event.mapPoint)
    //   if (view.graphics.length === 0) {
    //     // addGraphic("origin", event.mapPoint);
    //     var dumeBeachPoint = new Point(-118.24895493018086, 34.0423453366384);
    //     addGraphic("origin", dumeBeachPoint);
    //   } else if (view.graphics.length === 1) {
    //     // addGraphic("destination", event.mapPoint);
    //     var anotherPoint = new Point(-116.0596534542991, 37.730250934373174);
    //     addGraphic("destination", anotherPoint);
    //
    //     getRoute(); // Call the route service
    //   } else {
    //     view.graphics.removeAll();
    //     // addGraphic("origin",event.mapPoint);
    //     var dumeBeachPoint = new Point(-118.24895493018086, 34.0423453366384);
    //     addGraphic("origin", dumeBeachPoint);
    //   }
    //
    // });

    function createGraphic(type, point) {
      const graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          color: (type === "origin") ? "white" : "black",
          size: 8
        }
      });

      view.graphics.add(graphic);
      return graphic;
    }

    function addPointGraphic(type, point) {
      const graphic = createGraphic(type, point)
      view.graphics.add(graphic);
      return graphic;
    }

    function addServiceAreaGraphic(graphic) {
      const driveTimeCutoffs = [30]; // Minutes
      // const distanceCutoffs = [25,50,75]; // Miles
      const serviceAreaParams = createServiceAreaParams(graphic, driveTimeCutoffs, 4326);
      return solveServiceArea(serviceAreaUrl, serviceAreaParams);
    }

    // const searchWidget = new Search({
    //   view: view
    // });

    function solveServiceArea(url, serviceAreaParams) {
      return serviceArea.solve(url, serviceAreaParams)
              .then(function(result){
                if (result.serviceAreaPolygons.features.length) {
                  // Draw each service area polygon
                  result.serviceAreaPolygons.features.forEach(function(graphic){
                    graphic.symbol = {
                      type: "simple-fill",
                      color: "rgba(255,50,50,.25)"
                    }
                    view.graphics.add(graphic,0);
                  });
                  return result;
                }
              }, function(error){
                console.log(error);
              });
    }

    function createServiceAreaParams(locationGraphic, driveTimeCutoffs, outSpatialReference) {
      const featureSet = new FeatureSet({
        features: [locationGraphic]
      });

      // Set all of the input parameters for the service
      const taskParameters = new ServiceAreaParams({
        facilities: featureSet,
        defaultBreaks: driveTimeCutoffs,
        returnPolygons:true,
        travel_mode: "Custom",
        trimOuterPolygon: true,
        outSpatialReference: outSpatialReference
      });
      return taskParameters;
    }

    function getRoute() { // spatialReference
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: view.graphics.toArray()
        }),
        returnDirections: true
      });

      return route.solve(routeUrl, routeParams);
    }

    function getRoute2() {
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: view.graphics.toArray()
        }),
        returnDirections: true
      });

      const routePromise = route.solve(routeUrl, routeParams)
      routePromise.then(function(data) {
                data.routeResults.forEach(function(result) {
                  result.route.symbol = {
                    type: "simple-line",
                    color: [5, 150, 255],
                    width: 3
                  };
                  view.graphics.add(result.route);
                  view.extent = result.route.geometry.extent
                });
                // console.log(data.routeResults)

                // Display directions
                if (data.routeResults.length > 0) {
                    const directions = document.createElement("ol");
                    directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                    directions.style.marginTop = "0";
                    directions.style.padding = "15px 15px 15px 30px";
                    const features = data.routeResults[0].directions.features;

                    // Show each direction
                    features.forEach(function(result,i){
                      const direction = document.createElement("li");
                      direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                      directions.appendChild(direction);
                    });

                    view.ui.empty("top-right");
                    view.ui.add(directions, "top-right");
                    return features;    // returning the
                }
                return new Promise((resolve, reject) => {
                  try {
                    resolve(data.routeResults);
                  } catch (error) {
                    reject(error);
                  }
                });
              })
              .catch(function(error){
                console.log(error);
              })
    }

    
    function handleSubmit(event) {
      event.preventDefault();
      // Your form handling logic here
      const originValue = document.getElementById("origin").value;
      const destinationValue = document.getElementById("destination").value;

      var originPoint = new Point(-118.24895493018086, 34.0423453366384);
      var destinationPoint = new Point(-116.0596534542991, 37.730250934373174);

      // getNearbyPlaces(-118.24895493018086, 34.0423453366384);
      // getNearbyPlaces(-116.0596534542991, 37.730250934373174);

      const originGraphic = addPointGraphic("origin", originPoint);
      const originServiceAreaGraphic = addServiceAreaGraphic(originGraphic);
      const destinationGraphic = addPointGraphic("destination", destinationPoint);
      // const destinationServiceAreaGraphic = addServiceAreaGraphic(destinationGraphic);

      const getRouteResult = getRoute(); // Call the route service

      Promise.all([originServiceAreaGraphic, getRouteResult])
          .then((results) => {
              results[1].routeResults.forEach(function(result) {
                      result.route.symbol = {
                        type: "simple-line",
                        color: [5, 150, 255],
                        width: 3
                      };
                      view.graphics.add(result.route);
                      view.extent = result.route.geometry.extent.expand(1.5);
                  });

              // Display directions
              if (results[1].routeResults.length > 0) {
                  const directions = document.createElement("ol");
                  // const directions = document.getElementById("directions");
                  directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                  directions.style.marginTop = "0";
                  directions.style.padding = "15px 15px 15px 30px";
                  const features = results[1].routeResults[0].directions.features;

                  // Show each direction
                  features.forEach(function(result,i){
                    const direction = document.createElement("li");
                    direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                    directions.appendChild(direction);
                  });

                  const uiDiv = document.getElementById("directions")
                  uiDiv.appendChild(directions);
              }
              // const intersects = geometryEngineAsync.intersects(results[0].serviceAreaPolygons.features[0].geometry, results[1].routeResults[0].route.geometry)
              const intersection = geometryEngineAsync.intersect(results[0].serviceAreaPolygons.features[0].geometry, results[1].routeResults[0].route.geometry)
              console.log(results[0].serviceAreaPolygons.features[0])
              console.log(results[1].routeResults)
              intersection.then((result) => {
                  console.log(result)
                  const lineSymbol = {
                      type: "simple-line",
                      color: [150, 150, 25],
                      width: 5
                  };
                  const lineAtt = {
                      Name: "Keystone Pipeline", // The name of the pipeline
                      Owner: "TransCanada", // The owner of the pipeline
                      Length: "3,456 km" // The length of the pipeline
                  };
                  const polylineGraphic = new Graphic({
                      geometry: result, // Add the geometry created in step 3
                      symbol: lineSymbol, // Add the symbol created in step 4
                      attributes: lineAtt // Add the attributes created in step 5
                  });
                  view.graphics.add(polylineGraphic);
                  if (result != undefined && result.paths.length > 0) {
                    // addPointGraphic("origin", result.paths[result.paths.length-1][result.paths[result.paths.length-1].length-1])
                    const intersectionPoint = result.paths[result.paths.length-1][result.paths[result.paths.length-1].length-1]
                    addPointGraphic("origin", new Point(intersectionPoint[0], intersectionPoint[1]))
                  }
                  // result.p
                  // view.extent = result.route.geometry.extent.expand(1.5);
              })
          });
    }
    document.getElementById("getNearbyPlaces").addEventListener("click", function(){
        console.log("getNearbyPlaces called");
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        const category = document.getElementById('category').value;
        const search_radius = document.getElementById('search_radius').value;
        const max_locations = document.getElementById('max_locations').value;
        fetch(`http://127.0.0.1:8000/search/?latitude=${latitude}&longitude=${longitude}&category=${category}&search_radius=${search_radius}&max_locations=${max_locations}`)
          .then(response => response.json())
          .then(data => {
              // Handle the JSON data here
              // For demonstration, display the JSON string in the div with id 'jsonOutput'
              document.getElementById('jsonOutput').innerText = JSON.stringify(data);
              for (k in data) { 
                addPointGraphic("", new Point(data[k]['Coordinates']['x'], data[k]['Coordinates']['y']));
                }
              
          })
          .catch(error => console.error('Error fetching data:', error));
      });
      
    window.showNearbyPoint = showNearbyPoint;
    

    const form = document.getElementById("myForm");
    form.addEventListener("submit", handleSubmit);

  });

    
    
 