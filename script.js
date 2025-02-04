require([
    "esri/Map", "esri/views/MapView",
    "esri/layers/GraphicsLayer", "esri/Graphic",
    "esri/widgets/Search"
], function(Map, MapView, GraphicsLayer, Graphic, Search) {
    
    const map = new Map({ basemap: "streets-navigation-vector" }); // Menggunakan basemap publik
    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [112.6326, -7.9839], // Koordinat Malang
        zoom: 14
    });
    
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const barbershops = [
        { name: "Barber A", lat: -7.982, lon: 112.634 },
        { name: "Barber B", lat: -7.984, lon: 112.630 }
    ];

    barbershops.forEach(shop => {
        const point = { type: "point", longitude: shop.lon, latitude: shop.lat };
        const marker = new Graphic({ geometry: point, symbol: { type: "simple-marker", color: "red" } });
        graphicsLayer.add(marker);
    });

    const searchWidget = new Search({ view: view });
    view.ui.add(searchWidget, "top-right");
});
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        view.center = [position.coords.longitude, position.coords.latitude];
        view.zoom = 15;
    });
}