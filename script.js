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

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius bumi dalam km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function searchByDistance() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const searchRadius = document.getElementById("searchRadius").value;

                graphicsLayer.removeAll();
                
                barbershops.forEach(shop => {
                    const distance = calculateDistance(userLat, userLon, shop.lat, shop.lon);
                    if (distance <= searchRadius) {
                        const point = { type: "point", longitude: shop.lon, latitude: shop.lat };
                        const marker = new Graphic({ geometry: point, symbol: { type: "simple-marker", color: "blue" } });
                        graphicsLayer.add(marker);
                    }
                });
            });
        }
    }
});
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        view.center = [position.coords.longitude, position.coords.latitude];
        view.zoom = 15;
    });
}
